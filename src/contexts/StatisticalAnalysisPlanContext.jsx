import React, {createContext, useContext, useState} from 'react';

// Create context & export
const StatisticalAnalysisPlanContext = createContext();
export const useData = () => useContext(StatisticalAnalysisPlanContext);

export const DataProvider = ({children}) => {
    const [isStatisticalAnalysisPlanModalOpen, setIsStatisticalAnalysisPlanModalOpen] = useState(false);

    return (
        <StatisticalAnalysisPlanContext.Provider value={{isStatisticalAnalysisPlanModalOpen, setIsStatisticalAnalysisPlanModalOpen}}>
            {children}
        </StatisticalAnalysisPlanContext.Provider> 
    );
}