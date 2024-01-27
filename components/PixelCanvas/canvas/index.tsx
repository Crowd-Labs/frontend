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
import { CanvasBgColor, GridWidth } from "@/util/tool/tool";

interface CanvasProps {
    toolType: ToolType;
    shapeType: ShapeToolType;
    mainColor: string;
    setColor: (value: string) => void;
}

const Canvas: FC<CanvasProps> = (props) => {
    const {toolType, mainColor, setColor, shapeType} = props;
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
        Tool.mainColor = mainColor;
    }, [mainColor]);
    
       

const drawGrid = (context: CanvasRenderingContext2D, color: string, stepX: number, stepY: number)=> {
    
    context.save();
    context.strokeStyle = color;
    context.lineWidth = 0.5;
    for (var i = stepX + 0.5;
         i < context.canvas.width; i += stepX) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (var i = stepY + 0.5;
         i < context.canvas.height; i += stepY) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }

    context.restore();
}

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.height = canvas.clientHeight;
            canvas.width = canvas.clientWidth;

            Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            // initial
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = CanvasBgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // drawGrid(ctx, "#000000", GridWidth, GridWidth);
                snapshot.add(ctx.getImageData(0, 0, canvas.width, canvas.height));
            }

            // clear
            const dispatcher = dispatcherContext.dispatcher;
            const callback = () => {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = CanvasBgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        <canvas width={640} height={640} ref={canvasRef} />
    )
};

export default Canvas;
