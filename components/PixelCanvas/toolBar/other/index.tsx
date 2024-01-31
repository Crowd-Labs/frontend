import React from "react";

import {useContext} from "react";
import {DispatcherContext} from "@/context";
import {CLEAR_EVENT, REDO_EVENT, UNDO_EVENT} from "@/util/dispatcher/event";
import { SVGToolColor } from "@/util/tool/tool";

const OtherOperator = () => {
    const dispatcherContext = useContext(DispatcherContext);

    const clearCanvas = () => {
        dispatcherContext.dispatcher.dispatch(CLEAR_EVENT);
    };
    const undo = () => {
        dispatcherContext.dispatcher.dispatch(UNDO_EVENT);
    };
    const redo = () => {
        dispatcherContext.dispatcher.dispatch(REDO_EVENT);
    };

    return (
        <div >
            <div className="mt-4">
                <div title="undo" className="title mt-4">
                    <div className="mt-2" onClick={undo}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5001 16.3333L4.66675 10.5L10.5001 4.66667" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M23.3334 23.3333V15.1667C23.3334 13.929 22.8417 12.742 21.9666 11.8668C21.0914 10.9917 19.9044 10.5 18.6667 10.5H4.66675" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                </div>
                <div title="redo" className="title mt-4">
                    <div className="mt-2" onClick={redo}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.4999 16.3333L23.3333 10.5L17.4999 4.66666" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4.66659 23.3333V15.1667C4.66659 13.929 5.15825 12.742 6.03342 11.8668C6.90859 10.9917 8.09558 10.5 9.33325 10.5H23.3333" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                </div>
                <div className="title mt-4" title="clear" >
                    <div className="mt-2" onClick={clearCanvas}>
                        <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H6.33333H25" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9.83325 7.00001V4.66668C9.83325 4.04784 10.0791 3.45435 10.5167 3.01676C10.9543 2.57918 11.5477 2.33334 12.1666 2.33334H16.8333C17.4521 2.33334 18.0456 2.57918 18.4832 3.01676C18.9208 3.45435 19.1666 4.04784 19.1666 4.66668V7.00001M22.6666 7.00001V23.3333C22.6666 23.9522 22.4208 24.5457 21.9832 24.9833C21.5456 25.4208 20.9521 25.6667 20.3333 25.6667H8.66659C8.04775 25.6667 7.45425 25.4208 7.01667 24.9833C6.57908 24.5457 6.33325 23.9522 6.33325 23.3333V7.00001H22.6666Z" stroke={SVGToolColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherOperator;
