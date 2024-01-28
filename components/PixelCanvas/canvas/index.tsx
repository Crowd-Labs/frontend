import React from "react";

import {useEffect} from "react";
import {useRef} from "react";
import { ShapeToolType, ToolType} from "@/util/toolType";
import {FC} from "react";
import {useState} from "react";
import {Pen, Tool, Eraser, ColorExtract, ColorFill} from "@/util/tool";
import Shape from "@/util/tool/shape";
import {useContext} from "react";
import {DispatcherContext} from "@/context";
import {CLEAR_EVENT, REDO_EVENT, UNDO_EVENT} from "@/util/dispatcher/event";
import SnapShot from "@/util/snapshot";
import Snapshot from "@/util/snapshot";
import { CanvasBgColor, CanvasGridCount, GridWidth } from "@/util/tool/tool";

interface CanvasProps {
    sourceImageData?: ImageData;
    toolType: ToolType;
    shapeType: ShapeToolType;
    mainColor: string;
    setColor: (value: string) => void;
}

const Canvas: FC<CanvasProps> = (props) => {
    const {sourceImageData, toolType, mainColor, setColor, shapeType} = props;
    const [tool, setTool] = useState<Tool>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dispatcherContext = useContext(DispatcherContext);
    const [snapshot] = useState<SnapShot>(new Snapshot());

    useEffect(() => {
        switch (toolType) {
            case ToolType.PEN:
                setTool(new Pen());
                break;
            case ToolType.ERASER:
                setTool(new Eraser());
                break;
            case ToolType.COLOR_EXTRACT:
                setTool(new ColorExtract(setColor));
                break;
            case ToolType.COLOR_FILL:
                setTool(new ColorFill());
                break;
            case ToolType.SHAPE:
                setTool(new Shape(shapeType));
                break;
            default:
                break;
        }
    }, [toolType, shapeType]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas){
            canvas.height = canvas.clientHeight;
            canvas.width = canvas.clientWidth;
            Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            if (sourceImageData ){
                canvas.height = canvas.clientHeight;
                canvas.width = canvas.clientWidth;
                let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
                ctx.putImageData(sourceImageData, 0, 0);
                snapshot.clear();
                snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
                
            }else  {
                // initial
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = CanvasBgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // drawGrid(ctx, "#000000", GridWidth, GridWidth);
                    snapshot.clear();
                    snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
                }
            }
            // clear
            const dispatcher = dispatcherContext.dispatcher;
            const callback = () => {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    if (sourceImageData){
                        ctx.putImageData(sourceImageData, 0, 0)
                    } else{
                        ctx.fillStyle = CanvasBgColor;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }                    
                    // drawGrid(ctx, "#000000", GridWidth, GridWidth);
                }
            };
            dispatcher.on(CLEAR_EVENT, callback);

            // undo
            const forward = () => {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const imageData = snapshot.forward();
                    if (imageData) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.putImageData(imageData, 0, 0);
                    }
                }
            };
            dispatcher.on(REDO_EVENT, forward);

            // redo
            const back = () => {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    const imageData = snapshot.back();
                    if (imageData) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.putImageData(imageData, 0, 0);
                    }
                }
            };
            dispatcher.on(UNDO_EVENT, back);

            window.addEventListener("resize", () => {
                const canvasData = Tool.ctx.getImageData(0, 0, canvas.width, canvas.height);
                canvas.height = canvas.clientHeight;
                canvas.width = canvas.clientWidth;
                Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
                Tool.ctx.fillStyle = CanvasBgColor;
                Tool.ctx.fillRect(0, 0, canvas.width, canvas.height);
                Tool.ctx.putImageData(canvasData, 0, 0);
            });

            return () => {
                dispatcher.off(CLEAR_EVENT, callback);
            };
        }
    },[sourceImageData, canvasRef]);

    useEffect(() => {
        Tool.mainColor = mainColor;
    }, [mainColor]);
    
    useEffect(() => {
        const canvas = canvasRef.current;
       
    }, [canvasRef]);

    const onMouseDown = (event: MouseEvent) => {
        if (tool) {
            tool.onMouseDown(event);
        }
    };

    const onMouseMove = (event: MouseEvent) => {
        if (tool) {
            tool.onMouseMove(event);
        }
    };

    const onMouseUp = (event: MouseEvent) => {
        if (tool) {
            tool.onMouseUp(event);
            // save
            snapshot.add(Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height));
        }
    };

    const onTouchStart = (event: TouchEvent) => {
        if (tool) {
            tool.onTouchStart(event);
        }
    };

    const onTouchMove = (event: TouchEvent) => {
        if (tool) {
            tool.onTouchMove(event);
        }
    };

    const onTouchEnd = (event: TouchEvent) => {
        if (tool) {
            tool.onTouchEnd(event);
        }

        // save
        snapshot.add(Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.addEventListener("mousedown", onMouseDown);
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseup", onMouseUp);

            canvas.addEventListener("touchstart", onTouchStart);
            canvas.addEventListener("touchmove", onTouchMove);
            canvas.addEventListener("touchend", onTouchEnd);

            return () => {
                canvas.removeEventListener("mousedown", onMouseDown);
                canvas.removeEventListener("mousemove", onMouseMove);
                canvas.removeEventListener("mouseup", onMouseUp);

                canvas.removeEventListener("touchstart", onTouchStart);
                canvas.removeEventListener("touchmove", onTouchMove);
                canvas.removeEventListener("touchend", onTouchEnd);
            };
        }
    }, [canvasRef, onMouseDown, onMouseMove, onMouseUp]);


    return (
        <canvas width={CanvasGridCount* GridWidth} height={CanvasGridCount* GridWidth} ref={canvasRef} />
    )
};

export default Canvas;
