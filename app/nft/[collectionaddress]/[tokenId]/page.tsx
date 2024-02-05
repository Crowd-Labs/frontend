'use client'
import { Share2 } from "lucide-react";
import Button from "@/components/Button/Button";
import { Button as Button2 } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NewNFTCreateds, CollectionInfo } from "@/lib/type";
import { sanitizeDStorageUrl } from "@/lib/utils";
import { ELEMENT_MARKET, IPFS_GATEWAY_URL } from "@/constants";
import { getCollectionInfoByCollectionAddress, getNFTInfoByCollectionAddressAndTokenId } from "@/api/thegraphApi";

const Nft = ({ params }: { params: { collectionaddress: string, tokenId: string } }) => {

  const [collectionItem, setCollectionItem] = useState<CollectionInfo>();
  const [nftInfo, setNFTInfo] = useState<NewNFTCreateds | undefined>()

  useEffect(() => {
    getCollectionInfoByCollectionAddress(params.collectionaddress).then((res) => setCollectionItem(res));

    getNFTInfoByCollectionAddressAndTokenId(params.collectionaddress, params.tokenId).then((res) => setNFTInfo(res as NewNFTCreateds))
  }, [])

  return (
    <div className="container mx-auto">
      <div className="border-b-2 border-[#D9D9D9] mt-2"></div>
      <div className="grid grid-cols-2 gap-14 text-lg text-white mt-14">
        <div>
          <img
            className="w-full h-[37.68rem] image-rendering-pixelated"
            src={sanitizeDStorageUrl(nftInfo?.detailJson.image || '')}
            alt="card"
          />
          <div className="flex gap-4 mt-4">
            <div className="text-white-rgba">Collection initialed by:</div>
            <div className="text-green-700">{`0x${collectionItem?.collectionOwner?.slice(-4)}`}</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-[#4DA4B0]">{collectionItem?.name}</div>
            <Share2 />
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-2xl font-medium">{`${collectionItem?.name} #${params.tokenId}`}</div>
            <div className="flex justify-between gap-2">
              <div>created by</div>
              <div className="text-green-700">{`0x${nftInfo?.creator?.slice(-4).toLocaleLowerCase()}`}</div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            {/* <div className="flex justify-between gap-2">
              <div className="text-white-rgba">Owned by</div>
              <div className="text-green-700">{`0x${nftInfo?.nftCreator?.slice(-4).toLocaleLowerCase()}`}</div>
            </div> */}
            <div className="flex justify-between gap-2">
              <div className="text-white-rgba">Fork from</div>
              <div className="text-green-700">{nftInfo?.derivedFrom}</div>
            </div>
          </div>
          <div className="flex gap-8 mt-24">
            <a href={`${ELEMENT_MARKET}/assets/blast_testnet/${collectionItem?.derivedCollectionAddr}/${params.tokenId}`} target="_blank" rel="noopener noreferrer">
              <Button2 variant="yellow" className="w-60 p-4 h-full items-center">
                <div className="w-7 overflow-x-hidden bg-element bg-no-repeat bg-[length:100px_auto] bg-left -indent-32">element</div>
                View on Element
              </Button2>
            </a>
            
            <Link href={`/nft/fork/${params.collectionaddress}/${params.tokenId}/${nftInfo?.detailJson.image?.replace(`${IPFS_GATEWAY_URL}/`,'')}`}>
              <Button>Fork</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nft;
