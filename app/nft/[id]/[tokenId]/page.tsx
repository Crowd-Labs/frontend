'use client'
import { Share2 } from "lucide-react";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NFTInfoProps, NewCollectionCreateds } from "@/lib/type";
import { getMongoNFTById } from "@/api/mongodbApi";
import { sanitizeDStorageUrl } from "@/lib/utils";
import { ELEMENT_MARKET } from "@/constants";

const Nft = ({ params }: { params: { id: string, tokenId: string } }) => {

  const [collectionItem, setCollectionItem] = useState<NewCollectionCreateds|undefined>()
  const [nftInfo, setNFTInfo] = useState<NFTInfoProps|undefined>()

  useEffect(()=>{
    getMongoNFTById(params.id, params.tokenId).then((res)=>setNFTInfo(res as NFTInfoProps))
  },[])

  return (
    <div className="container mx-auto">
      <div className="border-b-2 border-[#D9D9D9] mt-2"></div>
      <div className="grid grid-cols-2 gap-14 text-lg text-white mt-14">
        <div>
          <img
            className="w-full h-[37.68rem]"
            src={sanitizeDStorageUrl(nftInfo?.imageUrl || '')}
            alt="card"
          /> 
          <div className="flex gap-4 mt-4">
            <div className="text-white-rgba">Collection initialed by:</div>
            <div className="text-green-700">{`0x${collectionItem?.collectionOwner?.slice(-4)}`}</div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-[#4DA4B0]">{collectionItem?.detailJson.name}</div>
            <Share2 />
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-2xl font-medium">{`#${params.tokenId}`}</div>
            <div className="flex justify-between gap-2">
              <div>created by</div>
              <div className="text-green-700">{`0x${nftInfo?.nftCreator?.slice(-4).toLocaleLowerCase()}`}</div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex justify-between gap-2">
              <div className="text-white-rgba">Owned by</div>
              <div className="text-green-700">{`0x${nftInfo?.nftCreator?.slice(-4).toLocaleLowerCase()}`}</div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="text-white-rgba">Fork from</div>
              <div className="text-green-700">{nftInfo?.forkFrom}</div>
            </div>
          </div>
          <div className="mt-8 text-2xl font-medium">Prompt:</div>
          <div className="mt-4 break-all">
            {nftInfo?.prompt}
          </div>
          <div className="mt-8 text-2xl font-medium">Negative prompt:</div>
          <div className="mt-4 break-all">
            {nftInfo?.nagativePrompt}
          </div>
          <div className="flex gap-8 mt-24">
            <a href={`${ELEMENT_MARKET}/assets/blast_testnet/${collectionItem?.derivedCollectionAddr}/${params.tokenId}`} target="_blank" rel="noopener noreferrer">
              <Button className="bg-yellow-rgba text-black">
                View on OpenSea
              </Button>
            </a>
            
            <Link href={`/nft/fork/${params.id}/${params.tokenId}/${nftInfo?.imageUrl?.replace('ipfs://','')}`}>
              <Button>Fork</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nft;
