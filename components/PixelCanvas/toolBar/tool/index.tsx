import React from "react";
import {ToolType} from "@/util/toolType";
import {ToolTypeContext} from "@/context";
import { SVGToolColor } from "@/util/tool/tool";


const selectedToolClass = "selected-tool";
export interface ToolPanelProps {
    className?: string;
}

const ToolPanel: React.FC<ToolPanelProps> = (props) => {
    const {className} = props;
    return (
        <div className={className ? `toolpanel ${className}` : "toolpanel"}>
            <span className="span-title text-white">Tool</span>
            <ToolTypeContext.Consumer>
                {
                    ({type, setType}) => (
                        <>
                            <div >
                                <div className={type === ToolType.PEN? "mt-4 bg-gray-400 w-8 h-8" :"mt-4"} onClick={() => {setType(ToolType.PEN)}}>
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.6667 4.85538C18.9731 4.54897 19.3369 4.3059 19.7372 4.14007C20.1376 3.97424 20.5667 3.88889 21 3.88889C21.4333 3.88889 21.8624 3.97424 22.2628 4.14007C22.6631 4.3059 23.0269 4.54897 23.3333 4.85538C23.6397 5.1618 23.8828 5.52557 24.0486 5.92593C24.2145 6.32628 24.2998 6.75538 24.2998 7.18872C24.2998 7.62206 24.2145 8.05115 24.0486 8.45151C23.8828 8.85186 23.6397 9.21563 23.3333 9.52205L9.13889 23.7165L3.5 24.6887L4.47222 19.0498L18.6667 4.85538Z" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </div>
                                <div className={type === ToolType.ERASER? "mt-4 bg-gray-400 w-8 h-8" :"mt-4"} onClick={() => {setType(ToolType.ERASER)}}>
                                    <svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4449" width="28" height="28" ><path d="M556.416 893.098667l402.986667 0.042666a42.666667 42.666667 0 0 1 4.096 85.12l-4.096 0.213334H364.458667a42.666667 42.666667 0 0 1-42.112-35.712L12.501333 632.789333a42.666667 42.666667 0 0 1 0-60.330666l185.941334-186.026667 0.341333-0.298667 293.504-293.461333a170.666667 170.666667 0 0 1 241.365333 0l190.933334 190.933333a170.666667 170.666667 0 0 1 0 241.322667l-368.170667 368.170667z m-327.466667-416.426667l-125.952 125.952 290.56 290.517333h42.112l104.874667-104.874666-311.594667-311.594667z m444.373334-323.669333a85.333333 85.333333 0 0 0-120.704 0L294.4 411.136l311.637333 311.637333 258.218667-258.176a85.333333 85.333333 0 0 0 8.448-110.805333l-4.608-5.76-3.84-4.096z" fill={SVGToolColor}></path></svg>
                                </div>
                                
                                <div className={type === ToolType.COLOR_FILL? "mt-4 bg-gray-400 w-8 h-8" :"mt-4"} onClick={() => {setType(ToolType.COLOR_FILL)}}>
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 26L5.5 15.2241H26.5L16 26Z" fill={SVGToolColor}></path><path d="M19.36 1L16 4.44828M5.5 15.2241L16 26L26.5 15.2241M5.5 15.2241L16 4.44828M5.5 15.2241H26.5M26.5 15.2241L16 4.44828" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2 21.1818C2 21.8661 2.62566 22.5 3.5 22.5C4.37434 22.5 5 21.8661 5 21.1818C5 21.0152 4.94622 20.7541 4.82908 20.4319C4.71505 20.1183 4.55343 19.7806 4.36824 19.4711C4.18157 19.1592 3.98158 18.8937 3.79724 18.7133C3.61723 18.5372 3.51798 18.506 3.50176 18.5009C3.50098 18.5007 3.5004 18.5005 3.5 18.5004C3.4996 18.5005 3.49902 18.5007 3.49824 18.5009C3.48202 18.506 3.38277 18.5372 3.20276 18.7133C3.01842 18.8937 2.81843 19.1592 2.63176 19.4711C2.44657 19.7806 2.28495 20.1183 2.17092 20.4319C2.05378 20.7541 2 21.0152 2 21.1818Z" fill={SVGToolColor} stroke={SVGToolColor}></path></svg>
                                </div>
                                <div className={type === ToolType.COLOR_EXTRACT? "mt-4 bg-gray-400 w-8 h-8" :"mt-4"} onClick={() => {setType(ToolType.COLOR_EXTRACT)}}>
                                    <svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5678" width="28" height="28"><path d="M628.394667 244.906667L195.626667 675.541333a96.384 96.384 0 0 0-28.032 62.72l-15.189334 15.189334a83.498667 83.498667 0 0 0 117.973334 118.016l15.274666-15.189334a95.402667 95.402667 0 0 0 62.72-28.032L781.098667 397.653333l-152.704-152.746666z" fill={SVGToolColor} p-id="5679"></path><path d="M803.328 104.618667c17.578667 0 34.432 6.997333 46.848 19.456l40.661333 40.618666c25.898667 25.898667 25.941333 67.882667 0.085334 93.824L796.501333 352.853333l15.445334 15.445334 3.584 4.010666a42.624 42.624 0 0 1-3.584 56.32l-29.909334 29.866667a42.666667 42.666667 0 0 1-60.288 0.085333l-0.981333-0.981333-372.394667 370.688c-14.848 14.933333-34.133333 24.490667-54.912 27.306667l-7.808 0.725333-15.274666 15.189333A82.688 82.688 0 0 1 211.413333 896a83.498667 83.498667 0 0 1-63.872-137.216l4.864-5.290667 15.189334-15.146666c1.152-21.034667 9.173333-41.002667 22.698666-56.96l5.333334-5.802667 372.48-370.773333-4.224-4.181334-7.381334-7.381333-3.584-4.053333a42.666667 42.666667 0 0 1 3.541334-56.32l29.866666-29.866667a42.666667 42.666667 0 0 1 60.330667 0l15.402667 15.445333 94.378666-94.378666a66.176 66.176 0 0 1 46.890667-19.456z m-205.098667 230.4L225.792 705.706667c-7.978667 8.021333-13.226667 18.304-15.018667 29.354666l-0.597333 5.589334-0.896 16.298666-26.666667 26.666667a40.832 40.832 0 0 0 53.589334 61.269333l4.053333-3.584 26.837333-26.794666 16.341334-0.853334c11.221333-0.597333 21.888-4.693333 30.634666-11.861333l4.224-3.797333 372.266667-370.602667-92.330667-92.458667z" fill={SVGToolColor}></path></svg>
                                </div>
                            </div>
                            
                        </>
                    )
                }
            </ToolTypeContext.Consumer>
        </div>
    );
};

export default ToolPanel;
