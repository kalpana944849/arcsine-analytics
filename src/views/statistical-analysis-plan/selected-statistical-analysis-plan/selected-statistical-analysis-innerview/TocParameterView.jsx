import React, { useState } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";

import TocGeneral from "./TocGeneral";
import TocParameterAnalysis from "./TocParameterAnalysis";
import TocLayout from "./TocLayout";

const TocParameterView = () => {
    const [selected, setSelected] = useState(0);

    const handleSelect = (e) => {
		setSelected(e.selected);
	};

    return (
        <TabStrip selected={selected} onSelect={handleSelect} >
            <TabStripTab title="General">
                <TocGeneral />
            </TabStripTab>
            <TabStripTab title="Analysis">
                <TocParameterAnalysis />
            </TabStripTab>
            <TabStripTab title="Layout">
                <TocLayout />
            </TabStripTab>
        </TabStrip>
    );
};

export default TocParameterView;
