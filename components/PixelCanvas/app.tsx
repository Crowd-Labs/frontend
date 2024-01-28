"use client"
import React, {FC, useState}  from "react";
import {ToolTypeContext, ShapeTypeContext, ColorContext, DispatcherContext} from "@/context";
import {ColorType, ShapeToolType, ToolType} from "@/util/toolType";
import Dispatcher from "@/util/dispatcher";
import Toolbar from "./toolBar";
import Canvas from "./canvas";
import { Button } from '@/components/ui/button';
import { useContractWrite } from "wagmi";
import { BECROWD_PROXY_ADDRESS, BeCrowd_WEBSITE } from "@/constants";
import { BeCrowd_ABI } from "@/abis/BeCrowdProxy";
import { postReq } from "@/api/server/abstract";
import { useRouter } from "next/navigation";
import { storeBlob, storeCar } from "@/lib/uploadToNFTStorage";
import { ethers } from "ethers";
import { Tool } from "@/util/tool";
import { CanvasGridCount, GridWidth } from "@/util/tool/tool";

interface PixelCanvasProps {
    collectionId: number;
    nftId?: number;
}


const PixelCanvas: FC<PixelCanvasProps> = ({collectionId, nftId=0}) => {
    const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
    const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
     const [activeColorType, setActiveColorType] = useState<ColorType>(ColorType.MAIN);
    const [mainColor, setMainColor] = useState<string>("black");
    const [dispatcher] = useState(new Dispatcher());
    const abiCoder = new ethers.AbiCoder();
    const router = useRouter();
    const [status, setStatus] = useState({
        buttonText: "Save & CreateNFT",
        loading: false,
      });
    const setColor = (value: string) => {
        setMainColor(value);
    };

    const { write: writePostContract } = useContractWrite({
        address: BECROWD_PROXY_ADDRESS,
        abi: BeCrowd_ABI,
        functionName: "commitNewNFTIntoCollection",
        onSuccess: async (data) => {
          console.log("onSuccess data", data);
        //   await postReq({
        //     url: "/api/nft/fork",
        //     data: {
        //       nftName: "",
        //       belongToCollectionId: collectionId,
        //       nftCreator: account?.address,
        //       nftOwner: account?.address,
        //       forkFrom: nftId || 0,
        //       prompt: prompt,
        //       nagativePrompt: nprompt,
        //       imageUrl: imageSource,
        //     },
        //   });
          setStatus({
            buttonText: `Save & CreateNFT`,
            loading: false,
          });
          router.push(`/collection/${collectionId}`);
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
            collectionId,
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
        const imageData = Tool.ctx.getImageData(0, 0, CanvasGridCount*GridWidth, CanvasGridCount*GridWidth); // 假设已经有了一个context并获取了原始ImageData
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
