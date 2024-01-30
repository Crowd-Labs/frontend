'use client'
import PixelCanvas from "@/components/PixelCanvas/app";


export default function CreatNFT({ params }: { params: { collectionaddress: string } }) {

  return (
    <div className="var-dark text-white">
       <PixelCanvas collectionAddress={params.collectionaddress}/>
    </div>)

}
