"use client"
import React, { FC, useEffect, useState } from "react";
import { ToolTypeContext, ShapeTypeContext, ColorContext, DispatcherContext } from "@/context";
import { ColorType, ShapeToolType, ToolType } from "@/util/toolType";
import Dispatcher from "@/util/dispatcher";
import Toolbar from "./toolBar";
import Canvas from "./canvas";
import { Button } from '@/components/ui/button';
import { Address, useAccount, useContractWrite } from "wagmi";
import { BECROWD_PROXY_ADDRESS } from "@/constants";
import { BeCrowd_ABI } from "@/abis/BeCrowdProxy";
import { postReq } from "@/api/server/abstract";
import { useRouter, useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { Tool } from "@/util/tool";
import { CanvasMinWidth, EnlargeFactor } from "@/util/tool/tool";
import { getCollectionInfoByCollectionAddress } from "@/api/thegraphApi";
import { CollectionInfo } from "@/lib/type";
import axios from "axios";
import { Loader2 } from "lucide-react";
import DialogConfirm from "./dialog";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface PixelCanvasProps {
  collectionAddress: string;
  nftId?: number;
  sourceImage?: string;
}

const PixelCanvas: FC<PixelCanvasProps> = ({ collectionAddress, nftId = 0, sourceImage }) => {
  const [open, onOpenChange] = useState(false)

  const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
  const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
  const [activeColorType, setActiveColorType] = useState<ColorType>(ColorType.MAIN);
  const [mainColor, setMainColor] = useState<string>("black");
  const [sourceImageData, setSourceImageData] = useState<ImageData | undefined>()
  const [imageSource, setImageSource] = useState<string | undefined>();
  const [dispatcher] = useState(new Dispatcher());
  const abiCoder = new ethers.AbiCoder();
  const router = useRouter();
  // const searchParams = useSearchParams()
  // const width = searchParams.get('w')
  const [gridCountH, setCanvasGridCountH] = useState<number | undefined>(32)
  // const [gridCountH, setCanvasGridCountH] = useState<number | undefined>(width ? parseInt(width) : undefined)
  const [gridCountV, setCanvasGridCountV] = useState<number | undefined>(gridCountH)
  const [gridWidth, setGridWidth] = useState<number>()

  const { openConnectModal } = useConnectModal();
  const [autoCreate, setAutoCreate] = useState(false);

  const account = useAccount({
    onConnect: (data) => { if (autoCreate) { uploadImageToIpfs() } },
    onDisconnect: () => setAutoCreate(false),
  });

  const [status, setStatus] = useState({
    buttonText: "Save & CreateNFT",
    loading: false,
  });
  const setColor = (value: string) => {
    setMainColor(value);
  };

  const zoomInImageData = (ctx:CanvasRenderingContext2D, imageData:ImageData, factor: number)=>{
    const newWidth = imageData.width / factor
    const newHeight = imageData.height / factor
    const tempImageData = ctx.createImageData(newWidth, newHeight);
    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const srcX = x * factor;
        const srcY = y * factor;
        const srcOffset = (srcY * imageData.width + srcX) * 4;
        const destOffset = (y * newWidth + x) * 4;
        tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
      }
    }
    return tempImageData
  }

  const zoomOutImageData = (ctx:CanvasRenderingContext2D, imageData:ImageData, factor: number)=>{
    const width  = imageData.width
    const height = imageData.height
    const tempImageData = ctx.createImageData(width * factor, height * factor);
    for (let y = 0; y < height * factor; y++) {
      for (let x = 0; x < width * factor; x++) {
        const srcX = Math.floor(x / factor);
        const srcY = Math.floor(y / factor);
        const srcOffset = (srcY * imageData.width + srcX) * 4;
        const destOffset = (y * height * factor + x) * 4;
        tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
      }
    }
    return tempImageData
  }

  useEffect(() => {
    if (sourceImage) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      if (ctx) {
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          canvas.width = img.width;
          canvas.height = img.height;
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            var imageData = ctx.getImageData(0, 0, img.width, img.height);
            let countX = img.width
            let countY = img.height
            if (img.width > 128){
              countX = Math.floor(countX / EnlargeFactor)
              countY = Math.floor(countY / EnlargeFactor)
            }
            let gw = Math.ceil(CanvasMinWidth / countX)
            let tempImageData
            if (img.width > 128){
              tempImageData = zoomInImageData(ctx, imageData, EnlargeFactor/gw )
            }else{
              tempImageData = zoomOutImageData(ctx,imageData,gw)
            }
            setSourceImageData(tempImageData)
            setCanvasGridCountH(countX)
            setCanvasGridCountV(countY)
          }
        };
        img.onerror = (err) => {
          console.log("error", err)
        }
        img.src = sourceImage;
      }

    }
  }, [sourceImage])

  useEffect(() => {
    if (gridCountH && gridCountH > 0) {
      let w = Math.ceil(CanvasMinWidth / gridCountH)
      setGridWidth(w)
      Tool.GridWidth = w;
    }
  }, [gridCountH])

  const [collectionItem, setCollectionItem] = useState<CollectionInfo>();
  useEffect(() => {
    getCollectionInfoByCollectionAddress(collectionAddress).then((res) => setCollectionItem(res));
  }, [collectionAddress]);

  const { write: writePostContract } = useContractWrite({
    address: BECROWD_PROXY_ADDRESS as Address,
    abi: BeCrowd_ABI,
    value: collectionItem
      ? BigInt(collectionItem?.mintPrice?? 0)
      : BigInt(0),
    functionName: "commitNewNFTIntoCollection",
    onSuccess: async (data) => {
      await postReq({
        url: "/api/nft/fork",
        data: {
          nftName: "",
          belongToCollectionId: collectionItem?.collectionId,
          collectionAddress: collectionAddress,
          nftCreator: account?.address,
          forkFrom: nftId || 0,
          imageUrl: imageSource,
        },
      });
      setStatus({
        buttonText: `Save & CreateNFT`,
        loading: false,
      });
      router.push(`/collection/${collectionAddress}`);
    },
    onError: (error) => {
      setStatus({
        buttonText: `Save & CreateNFT`,
        loading: false,
      });
    },
  });

  const createNFT = async (imageSource: string) => {
    try {
      setStatus({
        buttonText: `Storing metadata`,
        loading: true,
      });
      const attributes = [];

      const data = JSON.stringify({
        pinataContent: {
          name: `${collectionItem?.name}`,
          image: imageSource,
          attributes,
        },
        pinataMetadata: {
          name: "metadata",
        },
      });
      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        'maxBodyLength': Infinity,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT_KEY}`
        }
      });
      const metadataUri = "ipfs://" + res.data.IpfsHash;
      setStatus({
        buttonText: `Posting image`,
        loading: true,
      });


      const ETH_ADDRESS = '0x0000000000000000000000000000000000000001';
      let derivedRuleModuleInitData = collectionItem?.mintPrice == 0
        ? abiCoder.encode(["bool"], [false])
        : abiCoder.encode(
          ["address", "uint256"],
          [
            ETH_ADDRESS,
            collectionItem?.mintPrice,
          ]
        );

      const args = [
        BigInt(collectionItem?.collectionId!),
        metadataUri,
        BigInt(nftId),
        derivedRuleModuleInitData,
        [],
      ];
      return writePostContract?.({ args: [args] });
    } catch (e) {
      console.error("e", e);
      setStatus({
        buttonText: `Post image`,
        loading: false,
      });
    }
  };


  const uploadImageToIpfs = () => {
    if (gridCountH && gridWidth && gridCountV) {
      setStatus({
        buttonText: `Uploading Image to IPFS`,
        loading: true,
      });
      const imageData = Tool.ctx.getImageData(0, 0, gridCountH * gridWidth, gridCountV * gridWidth);
      resizeImageData(imageData);
    }
  };

  const resizeImageData = (imageData: ImageData) => {
    if (gridCountH && gridCountV && gridWidth) {
      const newWidth = gridCountH;
      const newHeight = gridCountV;
      const canvas = document.createElement('canvas');
      const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
      canvas.width = newWidth * EnlargeFactor;
      canvas.height = newHeight * EnlargeFactor;
      if (ctx) {
        // const tempImageData = ctx.createImageData(newWidth, newHeight);
        // for (let y = 0; y < newHeight; y++) {
        //   for (let x = 0; x < newWidth; x++) {
        //     const srcX = x * gridWidth;
        //     const srcY = y * gridWidth;
        //     const srcOffset = (srcY * imageData.width + srcX) * 4;
        //     const destOffset = (y * newWidth + x) * 4;
        //     tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
        //   }
        // }
        const tempImageData = zoomOutImageData(ctx, imageData, EnlargeFactor/gridWidth)
        ctx.putImageData(tempImageData, 0, 0);
        return canvas.toBlob(async (res) => {
          if (res) {
            const formData = new FormData();
            formData.append('file', res)
            const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
              'maxBodyLength': Infinity,
              headers: {
                'Content-Type': `multipart/form-data;`,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT_KEY}`
              }
            });
            const url = "ipfs://" + response.data.IpfsHash;
            setImageSource(url);
            return await createNFT(url);
          }
        });
      }
    }

  }

  const drawGrid = () => {
    if (gridCountH && gridCountV && gridWidth && gridWidth >= 5) {
      let divs: Array<React.JSX.Element> = []
      for (let i = 1; i < gridCountH; i++) {
        divs.push(<div key={'h-' + i} className="absolute w-px bg-gray-300" style={{ left: `${i * gridWidth}px`, top: 0, bottom: 0 }}></div>)
      }
      for (let i = 1; i < gridCountV; i++) {
        divs.push(<div key={'v-' + i} className="absolute h-px bg-gray-300" style={{ top: `${i * gridWidth}px`, left: 0, right: 0 }}></div>)
      }
      return divs;
    }

  }

  const onConfirm = () => {
    if (account.isConnected) {
      uploadImageToIpfs()
      onOpenChange(false)
    } else {
      openConnectModal?.();
      setAutoCreate(true)
    }

  }

  return (
    <>
      <ToolTypeContext.Provider value={{ type: toolType, setType: setToolType }}>
        <ShapeTypeContext.Provider value={{ type: shapeType, setType: (type: ShapeToolType) => { setToolType(ToolType.SHAPE); setShapeType(type); } }}>
          <DispatcherContext.Provider value={{ dispatcher }}>
            <ColorContext.Provider value={{
              mainColor,
              activeColor: activeColorType,
              setColor,
              setActiveColor: setActiveColorType
            }}>
              {gridCountH && gridCountV && gridWidth ? <div className="flex justify-center">
                <div className="flex-col w-fit">
                  <div className="flex justify-center gap-x-8" style={{ height: `${gridCountV * gridWidth}px` }}>
                    <Toolbar />
                    <div className="relative" style={{ width: `${gridCountH * gridWidth}px` }} >
                      <div className="absolute left-0 top-0 w-fit h-fit">
                        <Canvas
                          toolType={toolType}
                          shapeType={shapeType}
                          mainColor={mainColor}
                          setColor={setColor}
                          sourceImageData={sourceImageData}
                          canvasWidth={gridCountH * gridWidth}
                          canvasHeight={gridCountV * gridWidth}
                        />
                      </div>
                      <div className="pointer-events-none absolute left-0 top-0"
                        style={{ width: `${gridCountH * gridWidth}px`, height: `${gridCountV * gridWidth}px` }}
                      >
                        {drawGrid()}
                      </div>
                    </div>

                  </div>
                  <Button className="mt-8" variant="green" onClick={() => onOpenChange(true)} loading={status.loading}>{status.buttonText}</Button>
                </div>
              </div> : <Loader2 className='animate-spin mr-2 h-5 w-5' />
              }

            </ColorContext.Provider>
          </DispatcherContext.Provider>
        </ShapeTypeContext.Provider>
      </ToolTypeContext.Provider>
      <DialogConfirm open={open} mintPrice={collectionItem?.mintPrice!} onOpenChange={onOpenChange} onConfirm={onConfirm} />
    </>

  );
}

export default PixelCanvas;
