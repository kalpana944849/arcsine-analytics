import React, { useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";

const TocDisplayView = () => {
    const [selected, setSelected] = useState(0);

    const handleSelect = (e) => {
		setSelected(e.selected);
	};

    return (
        <TabStrip selected={selected} onSelect={handleSelect} >
            <TabStripTab title="Output">
                <h3>Output</h3>
            </TabStripTab>
            <TabStripTab title="Log">
                <h3>Log</h3>
            </TabStripTab>
            <TabStripTab title="STATDOC">
                <h3>STATDOC</h3>
            </TabStripTab>
            <TabStripTab title="SPECDOC">
                <h3>SPECDOC</h3>
            </TabStripTab>
        </TabStrip>
    );
};

export default TocDisplayView;
