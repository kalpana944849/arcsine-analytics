import API from './api';

//This API is used for Global Standard / Standard Component



// ------------------    Standard Category --------------------------- //

export const getAllStandardCategories = async (id,sapVersionId) => {
    return await API.get(`StandardComponentsCategory/GetAllStandardComponentsCategory`).catch((error) => {
        return error;
    });
};


export const addStandardComponent = async (reqBody) => {
    return await API.post(`StandardComponentsCategory/AddStandardComponentCategory`, reqBody).catch((error) => {
        return error;
    });
};


export const updateStandardComponents = async (reqBody) => {
    return await API.put(`StandardComponentsCategory/UpdateStandardComponentCategory`, reqBody).catch((error) => {
        return error;
    });
};

export const deleteStandardCategory = async (standardComponentCategoryId
    , deleteBy="test") => {
    return await API.delete(`StandardComponentsCategory/DeleteStandardComponentsCategory?standardComponentCategoryId=${standardComponentCategoryId}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};


//-------------------------- Standard Parameter -------------------------------- //

export const getStandardCategoryParamter = async (id,sapVersionId) => {
    return await API.get(`StandardComponentParameter/GetAll`).catch((error) => {
        return error;
    });
};


export const getTerminologyCategory = async () => {
    return await API.get(`ControlledTerminology/GetAll`).catch((error) => {
        return error;
    });
};

export const terminologyCodeGetById = async (Guid) => {
    return await API.get(`ControlledTerminology/GetById/${Guid}`).catch((error) => {
        return error;
    });
};
