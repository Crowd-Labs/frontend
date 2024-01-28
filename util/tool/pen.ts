import Tool, {GridWidth, Point, getMousePos, getTouchPos, hexToRgb, updateImageData} from "./tool";
class Pen extends Tool {
    protected lineWidthBase = 1;
    private mouseDown = false;
    private saveImageData?: ImageData;
    private previousPos: Point = {
        x: 0,
        y: 0
    };

    protected getDrawColor(){
        return Tool.mainColor
    }
    private operateStart(pos: Point) {
        if (!Tool.ctx) return;

        this.saveImageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);

        this.mouseDown = true;
        Tool.ctx.lineWidth = Tool.lineWidthFactor * this.lineWidthBase;
        // Tool.ctx.strokeStyle = Tool.mainColor;
        // Tool.ctx.lineJoin = "round";
        // Tool.ctx.lineCap = "round";
        Tool.ctx.fillStyle = this.getDrawColor();
        // Tool.ctx.beginPath();
        this.previousPos = pos;
    }
    private operateMove(pos: Point) {
        if (this.mouseDown) {
            // this.previousPos = pos;
            // Tool.ctx.moveTo(this.previousPos.x, this.previousPos.y);
            // const c = 0.5 * (this.previousPos.x + pos.x);
            // const d = 0.5 * (this.previousPos.y + pos.y);
            // Tool.ctx.quadraticCurveTo(this.previousPos.x, this.previousPos.y, pos.x - this.previousPos.x, pos.y - this.previousPos.y);
            // Tool.ctx.stroke();
            Tool.ctx.fillRect(pos.x, pos.y, GridWidth, GridWidth)
            this.previousPos = pos;
        }
    }
    private operateEnd() {
        if (this.mouseDown) {
            Tool.ctx.closePath();
            this.mouseDown = false;

            let imageData = Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height);
            const colorRgb = hexToRgb(this.getDrawColor());
            if (colorRgb && this.saveImageData) {
                imageData = updateImageData(this.saveImageData, imageData, [colorRgb.r, colorRgb.g, colorRgb.b, colorRgb.a]);
                Tool.ctx.putImageData(imageData, 0, 0);
            }
        }
    }
    public onMouseDown(event: MouseEvent): void {
        event.preventDefault();

        const mousePos = getMousePos(Tool.ctx.canvas, event);

        this.operateStart(mousePos);
    }

    public onMouseUp(event: MouseEvent): void {
        event.preventDefault();
        this.operateEnd();
    }

    public onMouseMove(event: MouseEvent): void {
        event.preventDefault();
        const mousePos = getMousePos(Tool.ctx.canvas, event);
        this.operateMove(mousePos);
    }

    public onTouchStart(event: TouchEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }
        const touchPos = getTouchPos(event.target as HTMLCanvasElement, event);
        this.operateStart(touchPos);
    }

    public onTouchMove(event: TouchEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }
        const touchPos = getTouchPos(event.target as HTMLCanvasElement, event);
        this.operateMove(touchPos);
    }

    public onTouchEnd(event: TouchEvent): void {
        if (event.cancelable) {
            event.preventDefault();
        }
        this.operateEnd();
    }
}

export default Pen;
