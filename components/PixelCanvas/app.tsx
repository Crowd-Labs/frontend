"use client"
import React, {FC, useEffect, useState}  from "react";
import {ToolTypeContext, ShapeTypeContext, ColorContext, DispatcherContext} from "@/context";
import {ColorType, ShapeToolType, ToolType} from "@/util/toolType";
import Dispatcher from "@/util/dispatcher";
import Toolbar from "./toolBar";
import Canvas from "./canvas";
import { Button } from '@/components/ui/button';
import { useAccount, useContractWrite } from "wagmi";
import { BECROWD_PROXY_ADDRESS, BeCrowd_WEBSITE } from "@/constants";
import { BeCrowd_ABI } from "@/abis/BeCrowdProxy";
import { postReq } from "@/api/server/abstract";
import { useRouter } from "next/navigation";
import { storeBlob, storeCar } from "@/lib/uploadToNFTStorage";
import { ethers } from "ethers";
import { Tool } from "@/util/tool";
import { CanvasGridCount, GridWidth } from "@/util/tool/tool";
import { getCollectionInfoById } from "@/api/thegraphApi";
import { CollectionInfo } from "@/lib/type";

interface PixelCanvasProps {
    collectionAddress: string;
    nftId?: number;
    sourceImage?: string
}

const PixelCanvas: FC<PixelCanvasProps> = ({collectionAddress, nftId=0, sourceImage}) => {
    const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
    const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
    const [activeColorType, setActiveColorType] = useState<ColorType>(ColorType.MAIN);
    const [mainColor, setMainColor] = useState<string>("black");
    const [sourceImageData, setSourceImageData] = useState<ImageData|undefined>()
    const [imageSource, setImageSource] = useState<string | undefined>();
    const [dispatcher] = useState(new Dispatcher());
    const abiCoder = new ethers.AbiCoder();
    const router = useRouter();
    const account = useAccount({
      onConnect: (data) => console.log("connected", data),
      onDisconnect: () => console.log("disconnected"),
    });
    const [status, setStatus] = useState({
        buttonText: "Save & CreateNFT",
        loading: false,
      });
    const setColor = (value: string) => {
        setMainColor(value);
    };
    useEffect(()=>{
      if (sourceImage){
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        console.log('sourceimageimage', sourceImage)
        if (ctx){
          let img = new Image();
          img.crossOrigin = 'Anonymous'; 
          img.onload = function() {
              console.log('onload img',img)
              canvas.width = CanvasGridCount ;
              canvas.height = CanvasGridCount ;
              let sx = img.width > CanvasGridCount ? Math.floor((img.width - CanvasGridCount) / 2) : 0
              let sy = img.height > CanvasGridCount ? Math.floor((img.height - CanvasGridCount) / 2) : 0
              let dx = CanvasGridCount > img.width ? Math.floor((CanvasGridCount -img.width) / 2)  : 0
              let dy = CanvasGridCount > img.height ? Math.floor((CanvasGridCount -img.height) / 2) : 0
              let sWidth = Math.min(img.width, CanvasGridCount) 
              let sHeight = Math.min(img.height, CanvasGridCount) 
              let dWidth = sWidth 
              let dHeight = sHeight 
              if (ctx){
                ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                var imageData = ctx.getImageData(0, 0, CanvasGridCount, CanvasGridCount);
                const tempImageData = ctx.createImageData(CanvasGridCount*GridWidth, CanvasGridCount*GridWidth);
                for (let y = 0; y < CanvasGridCount*GridWidth; y++) {
                  for (let x = 0; x < CanvasGridCount*GridWidth; x++) {
                    const srcX = Math.floor(x / GridWidth);
                    const srcY = Math.floor(y / GridWidth);
                    const srcOffset = (srcY * imageData.width + srcX) * 4;
                    const destOffset = (y * CanvasGridCount*GridWidth + x) * 4;
                    tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
                  }
                }
                setSourceImageData(tempImageData)
              }
          };
          img.onerror = (err) => {
            console.log("error", err)
          }
          img.src = sourceImage;
        }
        
      }
    }, [sourceImage])

    const [collectionItem, setCollectionItem] = useState<CollectionInfo>();
    useEffect(() => {
      getCollectionInfoById(collectionAddress).then((res) => setCollectionItem(res));
    }, [collectionAddress]);

    const { write: writePostContract } = useContractWrite({
        address: BECROWD_PROXY_ADDRESS,
        abi: BeCrowd_ABI,
        functionName: "commitNewNFTIntoCollection",
        onSuccess: async (data) => {
          console.log("onSuccess data", data);
          await postReq({
            url: "/api/nft/fork",
            data: {
              nftName: "",
              belongToCollectionId: collectionItem?.collectionId,
              collectionAddress: collectionAddress,
              nftCreator: account?.address,
              forkFrom: nftId || 0,
              imageUrl: imageSource,
            },
          });
          setStatus({
            buttonText: `Save & CreateNFT`,
            loading: false,
          });
          router.push(`/collection/${collectionAddress}`);
        },
        onError: (error) => {
          console.log("onError error", error);
          setStatus({
            buttonText: `Save & CreateNFT`,
            loading: false,
          });
        },
      });
    
    const createNFT = async (imageSource: string) => {
      try {
      setStatus({
          buttonText: `Storing metadata`,
          loading: true,
        });
        const attributes = [];
        const metadata = {
          external_link: `${BeCrowd_WEBSITE}`,
          image: imageSource,
          attributes,
        };
        console.log("metadata", metadata);
        let metadataUri = await storeBlob(JSON.stringify(metadata));
        metadataUri = "ipfs://" + metadataUri;
        console.log("metadataUri", metadataUri);
        setStatus({
          buttonText: `Posting image`,
          loading: true,
        });
  
        const args = [
          collectionItem?.collectionId,
          metadataUri,
          nftId ,
          abiCoder.encode(["bool"], [false]),
          [],
        ];
        console.log("writePostContract args", args);
        return writePostContract?.({ args: [args] });
      } catch (e) {
        console.error("e", e);
        setStatus({
          buttonText: `Post image`,
          loading: false,
        });
      }
    };
    
    
    const uploadImageToIpfs =  () => {
        setStatus({
            buttonText: `Uploading Image to IPFS`,
            loading: true,
        });
        const imageData = Tool.ctx.getImageData(0, 0, CanvasGridCount*GridWidth, CanvasGridCount*GridWidth);
        resizeImageData(imageData);
       
    };

    const resizeImageData = (imageData: ImageData )=> {
        const newWidth = CanvasGridCount;
        const newHeight = CanvasGridCount;
        const canvas = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = newHeight;
        if (ctx){
            const tempImageData = ctx.createImageData(newWidth, newHeight);
            for (let y = 0; y < newHeight; y++) {
              for (let x = 0; x < newWidth; x++) {
                const srcX = x * GridWidth;
                const srcY = y * GridWidth;
                const srcOffset = (srcY * imageData.width + srcX) * 4;
                const destOffset = (y * newWidth + x) * 4;
                tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
              }
            }
            ctx.putImageData(tempImageData, 0, 0);
            return canvas.toBlob(async (res)=>{
                if (res){
                    const result = await storeCar(res);
                    const url = "ipfs://" + result;
                    setImageSource(url);
                    return await createNFT(url);
                } 
            });
        }
    }
       
    return (
        <ToolTypeContext.Provider value={{type: toolType, setType: setToolType}}>
            <ShapeTypeContext.Provider value={{type: shapeType, setType: (type: ShapeToolType) => {setToolType(ToolType.SHAPE); setShapeType(type);}}}>
            <DispatcherContext.Provider value={{dispatcher}}>
                            <ColorContext.Provider value={{
                                mainColor,
                                activeColor: activeColorType,
                                setColor,
                                setActiveColor: setActiveColorType
                            }}>
                                <div className="flex justify-center">
                                    <div className="flex-col w-fit">
                                        <div className="flex justify-center gap-x-8"> 
                                            <Toolbar />
                                            <div className="border-black border border-solid w-fit h-fit">
                                                <Canvas
                                                    toolType={toolType}
                                                    shapeType={shapeType}
                                                    mainColor={mainColor}
                                                    setColor={setColor}
                                                    sourceImageData={sourceImageData}
                                                />
                                            </div>
                                        </div>
                                        <Button className="mt-8" variant="green" onClick={uploadImageToIpfs}>{status.buttonText}</Button>
                                    </div>
                                </div>
                                
                            </ColorContext.Provider>
                        </DispatcherContext.Provider>
            </ShapeTypeContext.Provider>
        </ToolTypeContext.Provider>
    );
}

export default PixelCanvas;
