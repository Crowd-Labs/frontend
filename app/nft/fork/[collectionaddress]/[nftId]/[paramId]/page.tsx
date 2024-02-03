'use client'
import PixelCanvas from "@/components/PixelCanvas/app";
import { Separator } from "@/components/ui/separator";
import { sanitizeDStorageUrl } from "@/lib/utils";

export default function ForkNFT({ params }: { params: { collectionaddress: string, nftId: string, paramId: string } }) {
  const { collectionaddress, nftId, paramId } = params
  return (
    <div className="var-dark">
      <Separator className="my-6" />
      <PixelCanvas collectionAddress={collectionaddress} nftId={parseInt(nftId)} sourceImage={sanitizeDStorageUrl('ipfs://'+paramId)} />
    </div>
  );
}
