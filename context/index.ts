/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {createContext} from "react";
import Dispatcher from "../util/dispatcher";
import {ColorType, ShapeToolType, ToolType} from "../util/toolType";

export const ToolTypeContext = createContext({
    type: ToolType.PEN,
    setType: (type: ToolType) => {}
});

export const ShapeTypeContext = createContext({
    type: ShapeToolType.LINE,
    setType: (type: ShapeToolType) => {}
});

export const ColorContext = createContext({
    mainColor: "black",
    activeColor: ColorType.MAIN,
    setColor: (value: string) => {},
    setActiveColor: (type: ColorType) => {}
});

export const DispatcherContext = createContext({
    dispatcher: new Dispatcher()
});
