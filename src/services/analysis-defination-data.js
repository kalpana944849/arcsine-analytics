import API from "./api";

export const getSapDataVariableRelationship = async (sapId, sapVersionId) => {
    return await API.get(`SapDataVariableRelationship/GetBySapId/${sapId}/${sapVersionId}`).catch((error) => error);
};

export const getLibraryControlledTerminologyCategoryByID = async (categoryId) => {
    return await API.get(`LibraryControlledTerminologyCategory/GetById/${categoryId}`).catch((error) => error);
};

export const getSapDataVariableRelationshipView = async (relationshipId) => {
    return await API.get(`SapDataVariableRelationship/GetByRelationshipId/${relationshipId}`).catch((error) => error);
};

export const addVariableRelationship = async (reqBody) => {
    return await API.post('SapDataVariableRelationship/AddSapDataRelationship', reqBody).catch((error) => error);
};
