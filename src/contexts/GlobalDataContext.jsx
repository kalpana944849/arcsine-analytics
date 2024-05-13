import React, {createContext, useContext, useState} from 'react';

// Create context & export
const GlobalDataContext = createContext();
export const useData = () => useContext(GlobalDataContext);

export const DataProvider = ({children}) => {
    const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);

    return (
        <GlobalDataContext.Provider value={{isGlobalModalOpen, setIsGlobalModalOpen}}>
            {children}
        </GlobalDataContext.Provider> 
    );
}