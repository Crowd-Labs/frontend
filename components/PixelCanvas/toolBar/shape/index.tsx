import React from "react";
import {useContext} from "react";
import {ShapeTypeContext, ToolTypeContext} from "@/context";
import {ShapeToolType, ToolType} from "@/util/toolType";
import { Tool } from "@/util/tool";
import { SVGToolColor } from "@/util/tool/tool";


const selectedShapeClass = "selected-shape";

const shapes = [
    {
        type: ShapeToolType.LINE,
        img: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.27783 23.3333L23.7223 3.88889" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>,
        title: "line"
    },
    {
        type: ShapeToolType.RECT,
        img: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2.5" y="5" width="23" height="17" rx="2" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect></svg>,
        title: "rect"
    },
    {
        type: ShapeToolType.CIRCLE,
        img: <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="24" height="24" rx="12" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></rect></svg>,
        title: "ellipse"
    }
];

interface ShapePanelProps {
    className?: string;
}

const ShapePanel: React.FC<ShapePanelProps> = (props) => {
    const {className} = props;
    const toolTypeContex = useContext(ToolTypeContext);
    return (
        <div className="">
            <div className="shape-container">
                <div className="shape-content">
                    <ShapeTypeContext.Consumer>
                        {
                            ({type, setType}) => shapes.map((shape) => (
                                <div key={type} 
                                    className={type === shape.type && toolTypeContex.type === ToolType.SHAPE ? `mt-4 bg-gray-400 w-8 h-8` : "mt-4"} 
                                    onClick={() => setType(shape.type)}>
                                    {shape.img}
                                </div>
                            ))
                        }
                    </ShapeTypeContext.Consumer>
                </div>
            </div>
        </div>
    );
};

export default ShapePanel;
