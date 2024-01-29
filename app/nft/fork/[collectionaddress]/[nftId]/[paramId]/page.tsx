'use client'
import PixelCanvas from "@/components/PixelCanvas/app";
import { Separator } from "@/components/ui/separator";
import { sanitizeDStorageUrl } from "@/lib/utils";

export default function ForkNFT({ params }: { params: { collectionAddress: string, nftId: string, paramId: string } }) {
  const { collectionAddress, nftId, paramId } = params
  return (
    <div className="var-dark">
      <Separator className="my-6" />
      <PixelCanvas collectionAddress={collectionAddress} nftId={parseInt(nftId)} sourceImage={sanitizeDStorageUrl('ipfs://'+paramId)} />
    </div>
  );
}
