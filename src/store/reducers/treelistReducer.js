import {createSlice} from "@reduxjs/toolkit"
const treeListDemo = JSON.parse(localStorage.getItem('treeListDemo'));
const treelistSlice = createSlice({
    name : 'treelist',
    initialState : {
        treelist : treeListDemo!==null?treeListDemo:[]
    },
    reducers : {
        setTreelist : (state, action) => {
            state.treelist = action.payload.treelist
        }
    }
})

export const {setTreelist} = treelistSlice.actions;
export default treelistSlice.reducer;