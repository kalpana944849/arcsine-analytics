import React, { useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";

const TocCodeView = () => {
    const [selected, setSelected] = useState(0);

    const handleSelect = (e) => {
		setSelected(e.selected);
	};

    return (
        <TabStrip selected={selected} onSelect={handleSelect} >
            <TabStripTab title="Analysis">
                <h3>Analysis</h3>
            </TabStripTab>
        </TabStrip>
    );
};

export default TocCodeView;
