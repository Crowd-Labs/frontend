"use client"
import React from "react";
import {ToolTypeContext, ShapeTypeContext, ColorContext, DispatcherContext} from "@/context";
import {useState} from "react";
import {ColorType, ShapeToolType, ToolType} from "@/util/toolType";
import Dispatcher from "@/util/dispatcher";
import Toolbar from "./toolBar";
import Canvas from "./canvas";

function PixelCanvas(): JSX.Element {
    const [toolType, setToolType] = useState<ToolType>(ToolType.PEN);
    const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE);
     const [activeColorType, setActiveColorType] = useState<ColorType>(ColorType.MAIN);
    const [mainColor, setMainColor] = useState<string>("black");
    const [dispatcher] = useState(new Dispatcher());

    const setColor = (value: string) => {
        setMainColor(value);
    };

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
                                <div className="flex"> 
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
                            </ColorContext.Provider>
                        </DispatcherContext.Provider>
            </ShapeTypeContext.Provider>
        </ToolTypeContext.Provider>
    );
}

export default PixelCanvas;
