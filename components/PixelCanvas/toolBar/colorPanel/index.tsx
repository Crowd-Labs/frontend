import React from "react";
import {useContext} from "react";
import {ColorContext} from "@/context";
import Picker from 'react-color';

import {useState} from "react";
import {useEffect} from "react";
import { Tool } from "@/util/tool";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPanelProps {
    className?: string;
}


const ColorPanel: React.FC<ColorPanelProps> = (props) => {
    const {className} = props;
    const [pickerColor, setPickerColor] = useState({hex: Tool.mainColor});
    const colorContext = useContext(ColorContext);

    useEffect(() => {
        colorContext.setColor(pickerColor.hex);
    }, [pickerColor]);

    return (
        <div className={className ? `colorpanel ${className}` : "colorpanel"}>
            <div className="content">
                <span className="span-title text-white">Color</span>
                <div className="color-picker">
                    <Popover>
                        <PopoverTrigger>
                            <div className='w-6 h-6 mt-4 mb-4'style={{background: colorContext.mainColor}}>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Picker
                                color={pickerColor}
                                onChangeComplete={setPickerColor}
                                type="sketch"
                            />
                        </PopoverContent>
                    </Popover>
                 </div>
            </div>
        </div>
    );
};

export default ColorPanel;
