import Pen from "./pen";
import { CanvasBgColor } from "./tool";

class Eraser extends Pen {
    protected penColor = CanvasBgColor;
}

export default Eraser;
