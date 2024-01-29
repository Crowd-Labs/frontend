'use client'
import PixelCanvas from "@/components/PixelCanvas/app";


export default function CreatNFT({ params }: { params: { collectionAddress: string } }) {

  return (
    <div className="var-dark text-white">
       <PixelCanvas collectionAddress={params.collectionAddress}/>
    </div>)

}
