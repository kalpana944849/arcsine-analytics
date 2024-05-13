import API from './api';

export const addVisitPeriod = async (reqBody) => {
    return await API.post("SapVisit/AddSapVisitPeriodInput", reqBody).catch((error) => {
        return error;
    });
};

export const getVisitPeriodByGUID = async (sapVisitGUID) => {
    return await API.get(`SapVisit/GetSapVisitPeriodInput/${sapVisitGUID}`).catch((error) => {
        return error;
    });
};

export const updateVisitPeriod = async (reqBody) => {
    return await API.put("SapVisit/UpdateSapVisitPeriodInput", reqBody).catch((error) => {
        return error;
    });
};

export const deleteVisitPeriod = async (sapVisitPeriodGUID, deleteBy="test") => {
    return await API.delete(`SapVisit/DeleteSapVisitPeriodInput?sapVisitPeriodGuid=${sapVisitPeriodGUID}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};

export const getVisitUnits = async () => {
    return await API.get("ControlledTerminology/GetByCategoryId/1036").catch((error) => {
        return error;
    });
};

export const addVisit = async (reqBody) => {
    return await API.post("SapVisitInput/AddSapVisitInput", reqBody).catch((error) => {
        return error;
    });
};

export const getVisitByGUID = async (sapVisitGUID) => {
    return await API.get(`SapVisitInput/GetSapVisitInput/${sapVisitGUID}`).catch((error) => {
        return error;
    });
};

export const updateVisit = async (reqBody) => {
    return await API.put("SapVisitInput/UpdateSapVisitInput", reqBody).catch((error) => {
        return error;
    });
};

export const deleteVisit = async (sapVisitGuid, deleteBy="test") => {
    return await API.delete(`SapVisitInput/DeleteSapVisitInput?sapVisitGuid=${sapVisitGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};

export const addVisitTime = async (reqBody) => {
    return await API.post("SapVisitTimeInput/AddSapVisitTimeInput", reqBody).catch((error) => {
        return error;
    });
};

export const updateVisitTime = async (reqBody) => {
    return await API.put("SapVisitTimeInput/UpdateSapVisitTimeInput", reqBody).catch((error) => {
        return error;
    });
};

export const getVisitTimeByGUID = async (sapVisitTimeGUID) => {
    return await API.get(`SapVisitTimeInput/GetSapVisitTimeInput/${sapVisitTimeGUID}`).catch((error) => {
        return error;
    });
};

export const deleteVisitTime = async (sapVisitTimeGuid, deleteBy="test") => {
    return await API.delete(`SapVisitTimeInput/DeleteSapVisitTimeInput?sapVisitTimeGuid=${sapVisitTimeGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};

export const getVisitStructureTreeData = async (sapID, sapVersionID) => {
    return await API.get(`SapVisit/GetBySapIdAndSapVersionId/${sapID}/${sapVersionID}`).catch((error) => {
        return error;
    });
};

export const getVisitFlagTreeData = async (sapID, sapVersionID) => {
    return await API.get(`SapVisitFlagInput/GetAllBySapIdAndSapVersionId/${sapID}/${sapVersionID}`).catch((error) => {
        return error;
    });
};

export const addVisitFlagFolder = async (reqBody) => {
    return await API.post("SapVisitFlagInput/AddSapVisitFlagInput", reqBody).catch((error) => {
        return error;
    });
};

export const updateVisitFlagFolder = async (reqBody) => {
    return await API.put("SapVisitFlagInput/UpdateSapVisitFlagInput", reqBody).catch((error) => {
        return error;
    });
};

export const deleteVisitFlagFolder = async (sapVisitFlagGuid, deleteBy="test") => {
    return await API.delete(`SapVisitFlagInput/DeleteSapVisitFlagInput?sapVisitFlagGuid=${sapVisitFlagGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};