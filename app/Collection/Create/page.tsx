"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormInfo from "./components/FormInfo";
import FormSocial from "./components/FormSocial";
import FormSetting from "./components/FormSetting";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  BeCrowd_PROXY_ADDRESS,
  BeCrowd_WEBSITE,
  FEE_DERIVIED_MODULE_ADDRESS,
  FREE_DERIVIED_MODULE_ADDRESS,
} from "@/constants";
import { BeCrowd_ABI } from "@/abis/BeCrowdProxy";
import { useAccount, useContractWrite } from "wagmi";
import { storeBlob, storeCar } from "@/lib/uploadToNFTStorage";
import { trimify } from "@/lib/utils";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { postReq } from "@/api/server/abstract";
import { getStakeEthAmountForInitialCollection } from "@/api/thegraphApi";
import { StakeEthAmountForInitialCollection } from "@/lib/type";

const CreateCollection = () => {
  const abiCoder = new ethers.AbiCoder();
  const router = useRouter();
  const [tabValue, setTabValue] = useState("Collections");
  const [status, setStatus] = useState({
    buttonText: "Create Collection",
    loading: false,
  });

  const [stakeEthAmountInfo, setStakeEthAmount] =
    useState<StakeEthAmountForInitialCollection>();
  useEffect(() => {
    getStakeEthAmountForInitialCollection().then((res) => {
      setStakeEthAmount(res as StakeEthAmountForInitialCollection);
    });
  }, []);

  const account = useAccount({
    onConnect: (data) => console.log("connected", data),
    onDisconnect: () => console.log("disconnected"),
  });
  const [imageSource, setImageSource] = useState<string | undefined>();
  const [collectionInfo, setCollectionInfo] = useState<{
    name: string | undefined;
    description?: string | undefined;
    category?: string | undefined;
    file?: File | undefined;
  }>({ name: "" });
  const [socialInfo, setSocialInfo] = useState<{
    website?: string | undefined;
    twitter?: string | undefined;
    telegram?: string | undefined;
    medium?: string | undefined;
    discord?: string | undefined;
  }>({});
  const [settingInfo, setSettingInfo] = useState<{
    limit: string | undefined;
    royalty: string | undefined;
    endTime: Date | undefined;
    isCharge: boolean | undefined;
    currency: string | undefined;
    price: number | undefined;
    receiptAddress: string | undefined;
    isSupportWhiteList: boolean | undefined;
    whiteList: File | undefined;
  } | null>(null);

  const { write: writeContract } = useContractWrite({
    address: BeCrowd_PROXY_ADDRESS,
    abi: BeCrowd_ABI,
    value: stakeEthAmountInfo
      ? BigInt(stakeEthAmountInfo.newStakeEthAmount)
      : BigInt(0),
    functionName: "createNewCollection",
    // mode: 'recklesslyUnprepared',
    onSuccess: async (data) => {
      console.log("onSuccess data", data);
      await postReq({
        url: "/api/collection/create",
        data: {
          collectionName: collectionInfo.name,
          collectionDesc: collectionInfo.description,
          creator: account.address,
          category: collectionInfo.category,
          logoImage: imageSource,
          website: socialInfo.website,
          twitter: socialInfo.twitter,
          telegram: socialInfo.telegram,
          medium: socialInfo.medium,
          discord: socialInfo.discord,
          mintLimit: settingInfo?.limit,
          royalty: parseFloat(settingInfo?.royalty || "0") * 100,
          endTime:(settingInfo?.endTime?.getTime() || (Date.now()+ 7 * 24 * 3600 * 1000))/ 1000 , 
          bCharge: !!settingInfo?.isCharge,
          mintPrice: settingInfo?.price,
          currency: settingInfo?.currency,
          receiptAddress: settingInfo?.receiptAddress,
          bWhitelist: false,
          whitelistRootHash: "",
        },
      });
      setStatus({
        buttonText: "Create collection",
        loading: false,
      });
      router.push("/AIWork");
    },
    onError: (error) => {
      console.log("onError error", error);
      setStatus({
        buttonText: "Create collection",
        loading: false,
      });
    },
  });

  const uploadImageToIpfs = async (settingInfo: any) => {
    if (collectionInfo.file) {
      setStatus({
        buttonText: `Uploading to IPFS`,
        loading: true,
      });
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        if (reader.result) {
          const result = await storeCar(new Blob([reader.result]));
          const url = "ipfs://" + result;
          setImageSource(url);
          return await createPublication(url, settingInfo);
        }
      });
      reader.readAsArrayBuffer(collectionInfo.file);
    }
  };

  const createPublication = async (imageSource: string, settingInfo: { isCharge: any; limit: any; endTime: { getTime: () => any; }; price: any; currency: any; receiptAddress: any; royalty: any; }) => {
    try {
      setStatus({
        buttonText: `Storing metadata`,
        loading: true,
      });
      const metadata = {
        description: trimify(collectionInfo.description || ""),
        external_link: `${BeCrowd_WEBSITE}`,
        image: imageSource,
        name: trimify(collectionInfo.name || ""),
      };

      console.log("metadata", metadata);
      let metadataUri = await storeBlob(JSON.stringify(metadata));
      metadataUri = "ipfs://" + metadataUri;
      console.log("metadataUri", metadataUri);
      setStatus({
        buttonText: `Posting image`,
        loading: true,
      });

      let isFee = settingInfo?.isCharge;
      let derivedRuleModule = isFee
        ? FEE_DERIVIED_MODULE_ADDRESS
        : FREE_DERIVIED_MODULE_ADDRESS;
      let derivedRuleModuleInitData = isFee
        ? abiCoder.encode(
            ["uint256", "uint256", "uint256", "address", "address"],
            [
              settingInfo?.limit,
              (settingInfo?.endTime?.getTime() ||
                Date.now() + 7 * 24 * 3600 * 1000) / 1000,
              settingInfo?.price,
              settingInfo?.currency,
              settingInfo?.receiptAddress,
            ]
          )
        : abiCoder.encode(
            ["uint256", "uint256"],
            [
              settingInfo?.limit,
              (settingInfo?.endTime?.getTime() ||
                Date.now() + 7 * 24 * 3600 * 1000) / 1000,
            ]
          );
      const args = [
        parseFloat(settingInfo?.royalty || "0") * 100,
        parseInt(collectionInfo.category || "0"),
        metadataUri,
        collectionInfo.name,
        collectionInfo.name,
        derivedRuleModule,
        derivedRuleModuleInitData,
      ];
      return writeContract?.({ args: [args] });
    } catch (e) {
      console.error("e", e);
      setStatus({
        buttonText: `Create collection`,
        loading: false,
      });
    }
  };

  const next = (info: any) => {
    if (tabValue === "Collections") {
      setCollectionInfo(info);
      setTabValue("Social");
    } else if (tabValue === "Social") {
      setSocialInfo(info);
      setTabValue("Setting");
    } else if (tabValue === "Setting") {
      setSettingInfo(info);
      uploadImageToIpfs(info);
    }
  };

  return (
    <div>
      <Separator className="my-6" />
      <Tabs
        className="flex gap-4 mt-8"
        value={tabValue}
        onValueChange={setTabValue}
      >
        <TabsList className="flex-col justify-start bg-transparent text-xl text-white">
          <TabsTrigger value="Collections">Collection Info</TabsTrigger>
          <TabsTrigger
            value="Social"
            disabled={tabValue == "Collections" ? true : false}
          >
            Social Link
          </TabsTrigger>
          <TabsTrigger
            value="Setting"
            disabled={
              tabValue == "Collections" || tabValue == "Social" ? true : false
            }
          >
            Config Setting
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 text-white text-2xl p-3 rounded-2xl ">
          <TabsContent value="Collections">
            <FormInfo next={next} defaultValue={collectionInfo} />
          </TabsContent>
          <TabsContent value="Social">
            <FormSocial next={next} defaultValue={socialInfo} />
          </TabsContent>
          <TabsContent value="Setting">
            <FormSetting
              next={next}
              defaultValue={settingInfo}
              status={status}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default CreateCollection;
