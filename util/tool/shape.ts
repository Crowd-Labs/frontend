import {ShapeToolType} from "../toolType";
import { ellipse, line, rect } from "./calshapes";
import Tool, {GridWidth, Point, getMousePos, getTouchPos, hexToRgb, updateImageData} from "./tool";

/**
 * @param type shape type
 * @param sx x coord of start
 * @param sy y coord of start
 * @param ex x coord of end
 * @param ey y coord of end
 */
const getVertexs = (type: ShapeToolType, sx: number, sy: number, ex: number, ey: number): Point[] => {
    const points: Point[] = [];
    const mx = 0.5 * (sx + ex), my = 0.5 * (sy + ey);

    switch (type) {
        case ShapeToolType.LINE:
            points.push({x: sx, y: sy});
            points.push({x: ex, y: ey});
            break;
        case ShapeToolType.RECT:
            points.push({x: sx, y: sy});
            points.push({x: ex, y: sy});
            points.push({x: ex, y: ey});
            points.push({x: sx, y: ey});
            break;
        case ShapeToolType.CIRCLE:
            points.push({x: 0.5 * (sx + ex), y: 0.5 * (sy + ey)});
            break;
        default:
            break;
    }
    return points;
};

class Shape extends Tool {
    private type: ShapeToolType;
    private saveImageData?: ImageData;
    private isMouseDown = false;
    private mouseDownPos = {x: 0, y: 0};
    private lineWidthBase = 1;
    public constructor(type: ShapeToolType) {
        super();
        this.type = type;
    }

    public setType(type: ShapeToolType) {
        this.type = type;
    }

    private operateStart(pos: {x: number; y: number}) {
        this.saveImageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
        this.isMouseDown = true;
        this.mouseDownPos = pos;

        // Tool.ctx.strokeStyle = Tool.mainColor;
        // Tool.ctx.lineWidth = Tool.lineWidthFactor * this.lineWidthBase;
        Tool.ctx.fillStyle = Tool.mainColor;
    }

    private operateMove(pos: {x: number; y: number}) {
        if (this.isMouseDown && this.saveImageData) {
            const ctx = Tool.ctx;
            ctx.clearRect(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);

            ctx.putImageData(this.saveImageData, 0, 0);
            if (this.type === ShapeToolType.LINE){
                var lp = line(new Point(this.mouseDownPos.x/ GridWidth, this.mouseDownPos.y / GridWidth), new Point(pos.x/ GridWidth, pos.y / GridWidth));
                for (let p of lp) ctx.fillRect(p.x * GridWidth, p.y * GridWidth, GridWidth, GridWidth);
            } else if (this.type === ShapeToolType.RECT){
                var lp = rect(new Point(this.mouseDownPos.x/ GridWidth, this.mouseDownPos.y / GridWidth), new Point(pos.x/ GridWidth, pos.y / GridWidth));
                for (let p of lp) ctx.fillRect(p.x * GridWidth, p.y * GridWidth, GridWidth, GridWidth);
            } else if (this.type === ShapeToolType.CIRCLE){
                var lp = ellipse(new Point(this.mouseDownPos.x/ GridWidth, this.mouseDownPos.y / GridWidth), new Point(pos.x/ GridWidth, pos.y / GridWidth));
                for (let p of lp) ctx.fillRect(p.x * GridWidth, p.y * GridWidth, GridWidth, GridWidth);
            }
            // const vertexs: Point[] = getVertexs(this.type, this.mouseDownPos.x, this.mouseDownPos.y, pos.x, pos.y);
            // if (this.type === ShapeToolType.CIRCLE) {
            //     ctx.beginPath();
            //     ctx.ellipse(vertexs[0].x, vertexs[0].y, Math.abs(0.5 * (pos.x - this.mouseDownPos.x)), Math.abs(0.5 * (pos.y - this.mouseDownPos.y)), 0, 0, Math.PI * 2);
            //     ctx.stroke();
            // } else {
            //     ctx.beginPath();
            //     ctx.moveTo(vertexs[0].x, vertexs[0].y);
            //     for (let i = 1; i < vertexs.length; i++) {
            //         ctx.lineTo(vertexs[i].x, vertexs[i].y);
            //     }
            //     ctx.closePath();
            //     ctx.stroke();
            // }
        }
    }
    private operateEnd() {
        Tool.ctx.setLineDash([]);

        let imageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);

        const colorRgb = hexToRgb(Tool.mainColor);
        if (colorRgb && this.saveImageData) {
            imageData = updateImageData(this.saveImageData, imageData, [colorRgb.r, colorRgb.g, colorRgb.b, colorRgb.a]);

            Tool.ctx.putImageData(imageData, 0, 0);
        }
        
        this.isMouseDown = false;
        this.saveImageData = undefined;
    }

    public onMouseDown(event: MouseEvent): void {
        event.preventDefault();
        const mousePos = getMousePos(Tool.ctx.canvas, event);
        this.operateStart(mousePos);
    }

    public onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        const mousePos = getMousePos(Tool.ctx.canvas, event);
        this.operateMove(mousePos);
    }

    public onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        this.operateEnd();
    }

    public onTouchStart(event: TouchEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }
        const canvas = event.target as HTMLCanvasElement;
        const touchPos = getTouchPos(canvas, event);

        this.operateStart(touchPos);
    }

    public onTouchMove(event: TouchEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }
        const canvas = event.target as HTMLCanvasElement;
        const touchPos = getTouchPos(canvas, event);

        this.operateMove(touchPos);
    }

    public onTouchEnd(event: TouchEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }
        this.operateEnd();
    }
}

export default Shape;
