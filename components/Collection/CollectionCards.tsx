import React from "react"
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import {
  CollectionInfo,
} from "@/lib/type";
import { useRouter } from "next/navigation";
import Image from '@/components/Image';

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


// finshed collection
export const CollectionDone = (props: CollectionCardProps) => {
  const { sampleData } = props;
  const router = useRouter()

  return (
    <div
      className={cn("w-[16.625rem] h-80 relative cursor-pointer rounded-sm", props.className)}
      onClick={() => {
        router.push(`/collection/${sampleData?.derivedCollectionAddr}`)
      }}
    >
      <Image src={sampleData.detailJson.image} alt="card" className="w-full h-full image-rendering-pixelated" />
      {props.children}
    </div>
  );
};

