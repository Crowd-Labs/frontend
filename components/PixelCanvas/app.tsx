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
import { useRouter,useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import { Tool } from "@/util/tool";
import { CanvasMinWidth } from "@/util/tool/tool";
import { getCollectionInfoByCollectionAddress } from "@/api/thegraphApi";
import { CollectionInfo } from "@/lib/type";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface PixelCanvasProps {
    collectionAddress: string;
    nftId?: number;
    sourceImage?: string;
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
    const searchParams = useSearchParams()
    const width = searchParams.get('w')
    const [gridCountH, setCanvasGridCountH] = useState<number|undefined>(width?parseInt(width):undefined)
    const [gridCountV, setCanvasGridCountV] = useState<number|undefined>(gridCountH)
    const [gridWidth, setGridWidth] = useState<number>()

    
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
              canvas.width = img.width ;
              canvas.height = img.height;
              let countH = img.width
              let countV = img.height
              let gw = Math.ceil(CanvasMinWidth / countH)
              if (ctx){
                ctx.drawImage(img, 0, 0);
                var imageData = ctx.getImageData(0, 0, img.width, img.height);
                const tempImageData = ctx.createImageData(countH*gw, countV*gw);
                for (let y = 0; y < countH*gw; y++) {
                  for (let x = 0; x < countV*gw; x++) {
                    const srcX = Math.floor(x / gw);
                    const srcY = Math.floor(y / gw);
                    const srcOffset = (srcY * imageData.width + srcX) * 4;
                    const destOffset = (y * countH*gw + x) * 4;
                    tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
                  }
                }
                setSourceImageData(tempImageData)
                setCanvasGridCountH(img.width)
                setCanvasGridCountV(img.height)
              }
          };
          img.onerror = (err) => {
            console.log("error", err)
          }
          img.src = sourceImage;
        }
        
      }
    }, [sourceImage])

    useEffect(()=>{
      if (gridCountH && gridCountH > 0){
        let w = Math.ceil(CanvasMinWidth / gridCountH)
        setGridWidth(w)
        Tool.GridWidth = w;
      }
    },[gridCountH])

    const [collectionItem, setCollectionItem] = useState<CollectionInfo>();
    useEffect(() => {
      getCollectionInfoByCollectionAddress(collectionAddress).then((res) => setCollectionItem(res));
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

        const data = JSON.stringify({
          pinataContent: {
            external_link: `${BeCrowd_WEBSITE}`,
          image: imageSource,
          attributes,
          },
          pinataMetadata: {
            name: "metadata",
          },
        });
        const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
          'maxBodyLength': Infinity,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT_KEY}`
          }
        });
        const metadataUri = "ipfs://" + res.data.IpfsHash;
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
      if (gridCountH && gridWidth  && gridCountV ){
        setStatus({
          buttonText: `Uploading Image to IPFS`,
          loading: true,
        });
        const imageData = Tool.ctx.getImageData(0, 0, gridCountH*gridWidth, gridCountV*gridWidth);
        resizeImageData(imageData);
      }
    };

    const resizeImageData = (imageData: ImageData )=> {
      if (gridCountH && gridCountV && gridWidth){
        const newWidth = gridCountH;
        const newHeight = gridCountV;
        const canvas = document.createElement('canvas');
        const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
        canvas.width = newWidth;
        canvas.height = newHeight;
        if (ctx){
            const tempImageData = ctx.createImageData(newWidth, newHeight);
            for (let y = 0; y < newHeight; y++) {
              for (let x = 0; x < newWidth; x++) {
                const srcX = x * gridWidth;
                const srcY = y * gridWidth;
                const srcOffset = (srcY * imageData.width + srcX) * 4;
                const destOffset = (y * newWidth + x) * 4;
                tempImageData.data.set(imageData.data.slice(srcOffset, srcOffset + 4), destOffset);
              }
            }
            ctx.putImageData(tempImageData, 0, 0);
            return canvas.toBlob(async (res)=>{
                if (res){
                  const formData = new FormData();
                  formData.append('file', res)
                  const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                    'maxBodyLength': Infinity,
                    headers: {
                      'Content-Type': `multipart/form-data;`,
                      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT_KEY}`
                    }
                  });
                  const url = "ipfs://" + response.data.IpfsHash;
                  setImageSource(url);
                  return await createNFT(url);
                } 
            });
        }
      }
        
    }
       
    const drawGrid = ()=>{
      if (gridCountH && gridCountV && gridWidth && gridWidth >= 5){
        let divs: Array<React.JSX.Element> = []
        for (let i = 1; i < gridCountH; i++){
          divs.push(<div key={'h-'+ i} className="absolute w-px bg-gray-300" style={{left: `${i* gridWidth}px`, top: 0, bottom: 0}}></div>)
        }
        for (let i = 1; i < gridCountV; i++){
          divs.push(<div key={'v-'+i} className="absolute h-px bg-gray-300" style={{top: `${i* gridWidth}px`, left: 0, right: 0}}></div>)
        }
        return divs;
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
                                {gridCountH && gridCountV && gridWidth ? <div className="flex justify-center">
                                    <div className="flex-col w-fit">
                                        <div className="flex justify-center gap-x-8" style={{height: `${gridCountV * gridWidth}px`}}> 
                                            <Toolbar />
                                            <div className="relative" style={{width: `${gridCountH * gridWidth}px`}} >
                                              <div className="absolute left-0 top-0 w-fit h-fit">
                                                  <Canvas
                                                      toolType={toolType}
                                                      shapeType={shapeType}
                                                      mainColor={mainColor}
                                                      setColor={setColor}
                                                      sourceImageData={sourceImageData}
                                                      canvasWidth={gridCountH * gridWidth}
                                                      canvasHeight={gridCountV * gridWidth}
                                                  />
                                              </div>
                                              <div className="pointer-events-none absolute left-0 top-0"
                                                  style={{width: `${gridCountH * gridWidth}px`,height: `${gridCountV* gridWidth}px`}}
                                               >
                                                  { drawGrid() }
                                              </div>
                                            </div>
                                            
                                        </div>
                                        <Button className="mt-8" variant="green" onClick={uploadImageToIpfs} loading={status.loading}>{status.buttonText}</Button>
                                    </div>
                                </div> : <Loader2 className='animate-spin mr-2 h-5 w-5' />
                                }
                                
                            </ColorContext.Provider>
                        </DispatcherContext.Provider>
            </ShapeTypeContext.Provider>
        </ToolTypeContext.Provider>
    );
}

export default PixelCanvas;
