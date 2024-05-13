import {createSlice} from "@reduxjs/toolkit"
const controlledTerminologyList = JSON.parse(localStorage.getItem('controlledTerminologyList'));
const controlledTerminologySlice = createSlice({
    name : 'controlledTerminology',
    initialState : {
        controlledTerminology : controlledTerminologyList!==null?controlledTerminologyList:[]
    },
    reducers : {
        setControlledTerminology : (state, action) => {
            state.controlledTerminology = action.payload.controlledTerminology
        }
    }
})

export const {setControlledTerminology} = controlledTerminologySlice.actions;
export default controlledTerminologySlice.reducer;