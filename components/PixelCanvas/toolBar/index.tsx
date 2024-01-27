import React from "react";

import ToolPanel from "./tool";
import ShapePanel from "./shape";
import ColorPanel from "./colorPanel";
import OtherOperator from "./other";

const Toolbar = (): JSX.Element => {
    return (
        <div>
            <ColorPanel className="toolbar-item" />
            <ToolPanel className="toolbar-item" />
            <ShapePanel className="toolbar-item" />
            <OtherOperator />
        </div>
    );
};

export default Toolbar;
