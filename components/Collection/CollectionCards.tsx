import Image from "next/image";
import type { StaticImageData } from "next/image";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { cn, sanitizeDStorageUrl } from "@/lib/utils";
import {
  NFTInfoProps,
  CollectionInfo,
  NewNFTCreateds,
} from "@/lib/type";

export interface CollectionProps {
  name: string;
  id: string;
  creator: string;
  title: string;
  desc: string;
  logo: string | StaticImageData;
}

interface CollectionCardProps {
  data?: CollectionInfo;
  sampleData: CollectionInfo;
  children?: React.ReactNode;
  className?: string;
}

interface NFTCardProps {
  data?: NFTInfoProps;
  sampleData: NFTInfoProps;
  children?: React.ReactNode;
  className?: string;
}

interface NFTCardPropsGraph {
  data?: NewNFTCreateds;
  sampleData: NewNFTCreateds;
  children?: React.ReactNode;
  className?: string;
}

// banner random select collectionCard
export const CollectionRandom = (props: NFTCardProps) => {
  const { sampleData } = props;
  return (
    <Link href={`/NFT/${sampleData.belongToCollectionId}/${sampleData.tokenId}`}>
      <>
        <Image
          className="w-full h-full rounded-2xl overflow-hidden object-cover"
          src={sanitizeDStorageUrl(sampleData.imageUrl)}
          alt="card"
        />
      </>
    </Link>
  );
};

// live Collection
export const CollectionIng = (props: CollectionCardProps) => {
  const { sampleData } = props;
  const { detailJson } = sampleData;
  return (
    <Link href={`/Collection/${sampleData.collectionId}`}>
      <div className={`text-white w-64`}>
        <div className="w-64 h-[28.9375rem] relative rounded-[30px] overflow-hidden">
          <Image src={detailJson.image} alt={detailJson.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-4 mt-5">
          <Image
            className="rounded-2xl h-20 w-20"
            src={detailJson.image}
            width={75}
            height={75}
            alt="card"
          />
          <div className="text-xl">
            <div className="mb-2">{detailJson.name}</div>
            <UserAvatar created={sampleData} />
          </div>
        </div>
      </div>
    </Link>
  );
};

// finshed collection
export const CollectionDone = (props: CollectionCardProps) => {
  const { sampleData } = props;
  return (
    <div
      className={cn("w-[15.18125rem] h-[18.75rem] relative", props.className)}
    >
      <Image src={sampleData.detailJson.image} alt="card" className="w-full h-full" />
      {props.children}
    </div>
  );
};

// finshed collection
export const CollectionNFTDone = (props: NFTCardProps) => {
  const { sampleData } = props;
  return sampleData ? (
    <div
      className={cn("w-[15.18125rem] h-[18.75rem] relative", props.className)}
    >
      <Image src={sampleData.imageUrl} alt="card" className="w-full h-full" />
      {props.children}
    </div>
  ) : (
    <></>
  );
};
