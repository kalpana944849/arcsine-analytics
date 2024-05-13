import React, {createContext, useContext, useState} from 'react';

// Create context & export
const StudyDesignContext = createContext();
export const useData = () => useContext(StudyDesignContext);

export const DataProvider = ({children}) => {
    const [isStudyDesignProjectsModalOpen, setIsStudyDesignProjectsModalOpen] = useState(false);

    return (
        <StudyDesignContext.Provider value={{isStudyDesignProjectsModalOpen, setIsStudyDesignProjectsModalOpen}}>
            {children}
        </StudyDesignContext.Provider> 
    );
}