import React, {createContext, useContext, useState} from 'react';

// Create context & export
const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({children}) => {
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

    return (
        <DataContext.Provider value={{isProjectsModalOpen, setIsProjectsModalOpen}}>
            {children}
        </DataContext.Provider> 
    );
}