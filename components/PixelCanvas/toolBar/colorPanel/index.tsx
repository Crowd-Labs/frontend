import React from "react";
import {useContext} from "react";
import {ColorContext} from "@/context";
import Picker from 'react-color';

import {useState} from "react";
import {useEffect} from "react";
import { Tool } from "@/util/tool";

interface ColorPanelProps {
    className?: string;
}


const ColorPanel: React.FC<ColorPanelProps> = (props) => {
    const {className} = props;
    const [pickerColor, setPickerColor] = useState({hex: Tool.mainColor});
    const colorContext = useContext(ColorContext);
    const [colorPickerShow, setPickerColorShow] = useState(false)

    useEffect(() => {
        colorContext.setColor(pickerColor.hex);
    }, [pickerColor]);

    return (
        <div className={className ? `colorpanel ${className}` : "colorpanel"}>
            <div className="content">
                <span>Color</span>
                <div className='w-6 h-6 mt-4 mb-4'style={{background: colorContext.mainColor}}onClick={() => setPickerColorShow(!colorPickerShow)} >
                    </div>
                <div className="color-picker">
                    {colorPickerShow && 
                    <Picker
                        color={pickerColor}
                        onChangeComplete={setPickerColor}
                        onClose={()=>setPickerColorShow(false)}
                        type="sketch"
                    />}
                 </div>
            </div>
        </div>
    );
};

export default ColorPanel;
