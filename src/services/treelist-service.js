 import axios from "axios";

export const TreelistService = () => {
    return axios.get("treeList.json").catch((error) => {
        return error;
    });
};

export const ControlledTerminologyService = () => {
    return axios.get("controlledTerminology.json").catch((error) => {
        return error;
    });
};

