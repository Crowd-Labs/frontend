import Image from "next/image";
import React from "react"
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import {
  NFTInfoProps,
  CollectionInfo,
} from "@/lib/type";

export interface CollectionProps {
  name: string;
  id: string;
  creator: string;
  title: string;
  desc: string;
  logo: string | StaticImageData;
}

export interface CollectionCardProps {
  data?: CollectionInfo;
  sampleData: CollectionInfo;
  children?: React.ReactNode;
  className?: string;
}

export interface NFTCardProps {
  data?: NFTInfoProps;
  sampleData: NFTInfoProps;
  children?: React.ReactNode;
  className?: string;
}


// finshed collection
export const CollectionDone = (props: CollectionCardProps) => {
  const { sampleData } = props;
  return (
    <div
      className={cn("w-[15.18125rem] h-[18.75rem] relative", props.className)}
    >
      <Image src={sampleData.detailJson.image} alt="card" className="w-full h-full" width={242} height={300}/>
      {props.children}
    </div>
  );
};

