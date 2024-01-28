'use client'
import PixelCanvas from "@/components/PixelCanvas/app";


export default function CreatNFT({ params }: { params: { id: string } }) {

  return (
    <div className="var-dark text-white">
       <PixelCanvas collectionId={parseInt(params.id)}/>
    </div>)

}
