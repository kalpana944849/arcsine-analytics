import React, {createContext, useContext, useState} from 'react';

// Create context & export
const StudyDesignSAPContext = createContext();
export const useData = () => useContext(StudyDesignSAPContext);

export const DataProvider = ({children}) => {
    const [isStudyDesignSAPModalOpen, setIsStudyDesignSAPModalOpen] = useState(false);

    return (
        <StudyDesignSAPContext.Provider value={{isStudyDesignSAPModalOpen, setIsStudyDesignSAPModalOpen}}>
            {children}
        </StudyDesignSAPContext.Provider> 
    );
}