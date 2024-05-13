import API from './api';
export const systemIcon = async () => {
    return await API.get(`SystemIcon`).catch((error) => {
        return error;
    });
};
export const systemIconById = async (Guid) => {
    return await API.get(`SystemIcon/GetById/${Guid}`).catch((error) => {
        return error;
    });
};
export const deleteSystemIcon = async (selectedRow) => {
    return await API.delete(`SystemIcon/Delete/${selectedRow.iconId}`).catch((error) => {
        return error;
    });
};
export const addSystemIcon = async (reqBody) => {
    return await API.post(`SystemIcon/Add`, reqBody).catch((error) => {
        return error;
    });
};
export const updateSystemIcon = async (reqBody) => {
    return await API.put(`SystemIcon/Update`, reqBody).catch((error) => {
        return error;
    });
};