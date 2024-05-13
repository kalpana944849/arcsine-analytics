import API from './api';

export const getSapAnalysisInput = async (sapID, sapVersionID) => {
    return await API.get(`SapAnalysisInput/GetBySapID/${sapID}/${sapVersionID}`).catch((error) => {
        return error;
    });
};

export const getSapTocBySapID = async (sapID, sapVersionID) => {
    return await API.get(`SapToc/GetBySapId/${sapID}/${sapVersionID}`).catch((error) => {
        return error;
    });
};

export const getAutomaticCustomTitles = async (categoryID) => {
    return await API.get(`ControlledTerminology/GetByCategoryId/${categoryID}`).catch((error) => {
        return error;
    });
};

export const addSapToc = async (reqBody) => {
    return await API.post("SapToc/AddSapToc", reqBody).catch((error) => {
        return error;
    });
};

export const deleteSapTocByGUID = async (sapTocGuid, deleteBy="test") => {
    return await API.delete(`SapToc/DeleteSapToc?sapTocGuid=${sapTocGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};
