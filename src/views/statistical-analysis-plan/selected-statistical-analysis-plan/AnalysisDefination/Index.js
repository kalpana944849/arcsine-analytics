import React, { useState } from "react";
import Data from "./Data/Index";
import AnalysisSet from "./AnalysisSet/Index";
import EndpointAnalysisFlag from "./EndpointAnalysisFlag/Index";
import Visits from "./Visits/Index";
import SubGroups from "./SubGroups/Index";

const AnalysisDefination = ({showData, showAnSet, showEndpointAnalysisFlag, showVisit, showSubGroups}) => {
  return (
    <section className="main_content">
      <div className={`${showVisit ? '' : 'icon-treelist'}`}>
        {showData &&
         <Data
         showData={showData}
         />
        }
        {showAnSet &&
         <AnalysisSet/>
        }
        {showEndpointAnalysisFlag &&
         <EndpointAnalysisFlag/>
        }
        {showVisit &&
         <Visits/>
        }
        {showSubGroups &&
         <SubGroups/>
        }
      </div>
    </section>
  );
};

export default AnalysisDefination;
