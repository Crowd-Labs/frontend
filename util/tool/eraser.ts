import Pen from "./pen";
import { CanvasBgColor } from "./tool";

class Eraser extends Pen {
    
    protected getDrawColor(){
        return CanvasBgColor
    } 
}

export default Eraser;
