import API from './api';

export const addTerminologyCategory = async (reqBody) => {
    return await API.post(`LibraryControlledTerminologyCategory/Add`, reqBody).catch((error) => {
        return error;
    });
};
export const getTerminologyCategory = async () => {
    return await API.get(`ControlledTerminology/GetAll`).catch((error) => {
        return error;
    });
};
export const addTerminologyCode = async (reqBody) => {
    return await API.post(`ControlledTerminology/Add`, reqBody).catch((error) => {
        return error;
    });
};
export const ControlledTerminologyCodeDelete = async (dataItem) => {
    return await API.delete(`ControlledTerminology/DeleteCode?LibraryControlledTerminologyGuid=${dataItem.libraryControlledTerminologyGuid}`).catch((error) => {
        return error;
    });
};
export const terminologyCategoryUpdate = async (reqBody) => {
    return await API.put(`LibraryControlledTerminologyCategory/Update`, reqBody).catch((error) => {
        return error;
    });
};
export const terminologyCategoryDelete = async (dataItem) => {
    return await API.delete(`LibraryControlledTerminologyCategory/Delete?LibraryControlledTerminologyCategoryId=${dataItem.libraryControlledTerminologyCategoryId}`).catch((error) => {
        return error;
    });
};
export const terminologyCodeUpdate = async (reqBody) => {
    return await API.put(`ControlledTerminology/Update`, reqBody).catch((error) => {
        return error;
    });
};
export const terminologyCodeGetById = async (Guid) => {
    return await API.get(`ControlledTerminology/GetById/${Guid}`).catch((error) => {
        return error;
    });
};
