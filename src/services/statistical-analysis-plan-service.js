import API from './api';

export const getSap = async () => {
    return await API.get(`Sap`).catch((error) => {
        return error;
    });
};


export const getSapId = (Guid, userId) => {
    return API.get(`Sap/GetSapBySapGuidAndUserid/${Guid}/${userId}`).catch((error) => {
        return error;
    });
};
export const getSapType = (catId) => {
    return API.get(`ControlledTerminology/GetByCategoryId/1054`).catch((error) => {
        return error;
    });
};
export const addVersion = async (reqBody) => {
    return await API.post(`SapVersion/Add`, reqBody).catch((error) => {
        return error;
    });
};
export const updateVersion = async (reqBody) => {
    return await API.put('SapVersion/Update', reqBody).catch((error) => {
        return error;
    });
};
export const updateSap = async (reqBody) => {
    return await API.put(`Sap/UpdateSap`, reqBody).catch((error) => {
        return error;
    });
};
export const addSap = async (reqBody) => {
    return await API.post(`Sap/AddSap`, reqBody).catch((error) => {
        return error;
    });
};
export const addVariable = async (reqBody) => {
    return await API.post(`SapDataVariableInput/AddSapDataVariableInput`, reqBody).catch((error) => {
        return error;
    });
};
export const getSapData = async () => {
    return await API.get(`SapDataCollectionInput/GetBySapId/43/24`).catch((error) => {
        return error;
    });
};
export const deleteSapData = async (sapDataDatasetGuid
    , deleteBy="test") => {
    return await API.delete(`SapDataDatasetInput/DeleteSapDataDatasetInput?sapDataDatasetGuid=${sapDataDatasetGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};
export const getVariableInput = async (id) => {
    return await API.get(`SapDataVariableInput/GetSapDataVariableInputBySapDataDatasetId/${id}/24`).catch((error) => {
        return error;
    });
};

export const updateVariable = async (reqBody) => {
    return await API.put(`SapDataVariableInput/UpdateSapDataVariableInput`, reqBody).catch((error) => {
        return error;
    });
};

export const deleteVariableInput = async (guid) => {
    return await API.delete(`SapDataVariableInput/DeleteSapDataVariableInput?sapDataVariableGuid=${guid}&deleteBy=test`).catch((error) => {
        return error;
    });
};

//This APi is used for Data/endpoint

export const getSapDataEndpointInput = async (id) => {
   return await API.get(`SapEndpointInput/GetBySapDataDatasetId/${id}`).catch((error) => {
       return error;
   });
};
export const getSapDataEndpoints = async (sapID, sapVersionID, sapDataDatasetID) => {
    return await API.get(`SapEndpointInput/GetBySapDataDatasetId/${sapID}/${sapVersionID}/${sapDataDatasetID}`).catch((error) => {
        return error;
    });
 };
export const getSapEndpointInput = async (id,sapVersionId) => {
    return await API.get(`SapEndpointInput/GetSapEndpointInputBySapID/${id}/${sapVersionId}`).catch((error) => {
        return error;
    });
};
export const addEndpoint = async (reqBody) => {
    return await API.post(`SapEndpointInput/AddSapEndpointInput`, reqBody).catch((error) => {
        return error;
    });
};
export const deleteEndpoint = async (SapEndpointGuid, deleteBy="test") => {
    return await API.delete(`SapEndpointInput/DeleteSapEndpointInput?SapEndpointGuid=${SapEndpointGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};
export const getSapAnalysisFlag = async (id,sapVersionId) => {
    return await API.get(`SapAnalysisFlagInput/GetBySapId/${id}/${sapVersionId}`).catch((error) => {
        return error;
    });
};

export const addAnalysisFlag = async (reqBody) => {
    return await API.post(`SapAnalysisFlagInput/AddSapAnalysisFlag`, reqBody).catch((error) => {
        return error;
    });
};

export const updateAnalysisFlag = async (reqBody) => {
    return await API.put(`SapAnalysisFlagInput/UpdateSapAnalysisFlag`, reqBody).catch((error) => {
        return error;
    });
};
export const deleteAnalysisFlag = async (sapAnalysisFlagGuid, deleteBy="test") => {
    return await API.delete(`SapAnalysisFlagInput/DeleteSapAnalysisFlag?sapAnalysisFlagGuid=${sapAnalysisFlagGuid}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};

export const getSapDataCollection = async (id) => {
    return await API.get(`SapDataCollectionInput/GetSapDataCollectionBySapDataCollectionId/${id}`).catch((error) => {
        return error;
    });
};
export const getSapDataSet = async (id, vId) => {
    return await API.get(`SapDataDatasetInput/GetBySapDataDatasetId/${id}/${vId}`).catch((error) => {
        return error;
    });
};
export const updateSapDataSet = async (reqBody) => {
    return await API.put(`SapDataDatasetInput/UpdateSapDataDatasetInput`, reqBody).catch((error) => {
        return error;
    });
};
export const getControlledTerminology = async (id) => {
    return await API.get(`ControlledTerminology/GetByCategoryId/${id}`).catch((error) => {
        return error;
    });
};
export const updateCollection = async (reqBody) => {
    return await API.put(`SapDataCollectionInput/UpdateSapDataCollection`, reqBody).catch((error) => {
        return error;
    });
};
export const getAnalysisFlagInput = async (id) => {
    return await API.get(`SapAnalysisFlagInput/GetAll`).catch((error) => {
        return error;
    });
};
export const getAnalysisSetInput = async (sapId = 43, sapVersionId = 24) => {
    return await API.get(`SapAnalysisSetInput/GetBySapId/43/24`).catch((error) => {
        return error;
    });
};
// export const getTreatment = async () => {
//     return await API.get(`Treatment/GetAll`).catch((error) => {
//         return error;
//     });
// };
export const getTreatment = async (sapId = 43, sapVersionId = 24, sapGuid = '718FEA6B-25AF-4B89-9678-94981B17047B') => {
    return await API.get(`Treatment/GetBySapId/${sapId}/${sapVersionId}`).catch((error) => {
        return error;
    });
};
export const getTreatmentCode = async () => {
    return await API.get(`Treatment/GetSapDatasetVariableView/210/429/43/24`).catch((error) => {
        return error;
    });
};
export const getTreatmentDeCode = async () => {
    return await API.get(`Treatment/GetSapDatasetVariableView/210/430/43/24`).catch((error) => {
        return error;
    });
};
export const addAnalysisSet = async (reqBody) => {
    return await API.post(`SapAnalysisSetInput/AddSapAnalysisSet`, reqBody).catch((error) => {
        return error;
    });
};
export const updateAnalysisSet = async (reqBody) => {
    return await API.put(`SapAnalysisSetInput/UpdateSapAnalysisSet`, reqBody).catch((error) => {
        return error;
    });
};

export const analysisSetVariable = async (SapVersion) => {
    return await API.get(`SapDataVariableInput/GetSapDataVariableInputBySapDataDatasetId/216/${SapVersion}`).catch((error) => {
        return error;
    });
};
// export const analysisSetVariable = async (SapVersion) => {
//     return await API.get(`SapDataVariableInput/GetSapDataVariableInputBySapDataVariableTypeId/216/${SapVersion}`).catch((error) => {
//         return error;
//     });
// };
export const addEndPoint = async (reqBody) => {
    return await API.post(`SapEndpointInput/AddSapEndpointInput`, reqBody).catch((error) => {
        return error;
    });
};
export const updateEndPoint = async (reqBody) => {
    return await API.put(`SapEndpointInput/UpdateSapEndpointInput`, reqBody).catch((error) => {
        return error;
    });
};

export const getDataSetVariableView = async (sapDataDatasetTypeId, sapDataVariableTypeId) => {
    return await API.get(`Treatment/GetSapDatasetVariableView/${sapDataDatasetTypeId}/${sapDataVariableTypeId}/43/24`).catch((error) => {
        return error;
    });
};

export const GetSapDatasetVariableViewByDSTypeIdAndVTypeId = async (sapDataDatasetTypeId, sapDataVariableTypeId) => {
    return await API.get(`Treatment/GetSapDatasetVariableViewByDSTypeId_and_VTypeId/${sapDataDatasetTypeId}/${sapDataVariableTypeId}`).catch((error) => {
        return error;
    });
};

export const addTreatmentType = async (reqBody) => {
    return await API.post(`Treatment/AddTreatmentTypeInput`, reqBody).catch((error) => {
        return error;
    });
};

export const addTreatmentInput = async (reqBody) => {
    return await API.post(`SapTreatmentInput/AddSapTreatmentInput`, reqBody).catch((error) => {
        return error;
    });
};
export const AddSapTreatmentPooling = async (reqBody) => {
    return await API.post(`SapTreatmentPoolingInput/AddSapTreatmentPooling`, reqBody).catch((error) => {
        return error;
    });
};

export const treatmentTableData = async (sapTreatmentTypeId) => {
    return await API.get(`Treatment/GetSapTreatmentTableData/${sapTreatmentTypeId}`).catch((error) => {
        return error;
    });
};

export const GetSapTreatmentPoolingDataBySapTreatmentTypeId = async (sapTreatmentTypeId) => {
    return await API.get(`SapTreatmentPoolingInput/GetSapTreatmentPoolingDataBySapTreatmentTypeId/${sapTreatmentTypeId}`).catch((error) => {
        return error;
    });
};
export const getSapTreatmentInput = async () => {
    return await API.get(`SapTreatmentPoolingInput/GetSapTreatmentInputBySapTreatmentTypeId/1/24/43`).catch((error) => {
        return error;
    });
};
// export const getSapTreatmentInput = async () => {
//     return await API.get(`SapTreatmentInput/GetBySapId/43/24`).catch((error) => {
//         return error;
//     });
// };

export const deleteTreatmentType = async (sapTreatmentTypeId, deleteBy="test") => {
    return await API.delete(`Treatment/DeleteTreatmentTypeInput?sapTreatmentTypeId=${sapTreatmentTypeId}&deleteBy=${deleteBy}`).catch((error) => {
        return error;
    });
};


//Subgroups

export const subGroupVariableView = async (id) => {
    return await API.get(`SapSubgroup/GetSapDatasetVariableView/210/43/25`).catch((error) => {
        return error;
    });
};
export const getSubGroups = async (id) => {
    return await API.get(`SapSubgroup/GetAllSapSubgroup/43/25`).catch((error) => {
        return error;
    });
};

export const addSubGroup = async (reqBody) => {
    return await API.post(`SapSubgroup/AddSapSubgroup`, reqBody).catch((error) => {
        return error;
    });
};
export const deleteSubGroup = async (guid) => {
    return await API.delete(`SapSubgroup/DeleteSapSubgroupGuid?sapSubgroupGuid=${guid}&deleteBy=TEST`).catch((error) => {
        return error;
    });
};

export const updateSubGroup = async (reqBody) => {
    return await API.put(`SapSubgroup/UpdateSapSubgroup`, reqBody).catch((error) => {
        return error;
    });
};

// Data
export const getLibraryCodingDictionary = async () => {
    return await API.get('LibraryCodingDictionary/Get').catch((error) => error);
};
