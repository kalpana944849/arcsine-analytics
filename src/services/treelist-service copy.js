import axios from "axios";

export const TreelistService = () => {
    return axios.get("treeList.json").catch((error) => {
        return error;
    });
};
// import axios from "axios";

// export const TreelistService = () => {
//     return axios.get("ControlledTerminology/GetControlledTerminologyCategories").catch((error) => {
//         return error;
//     });
// };

