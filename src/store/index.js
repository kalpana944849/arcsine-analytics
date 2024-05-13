import {configureStore} from '@reduxjs/toolkit'
import treelistSlice from './reducers/treelistReducer'
import controlledTerminology from './reducers/controlledTerminologyReducer';
const store = configureStore({
    reducer :{
        treelist : treelistSlice,
        controlledTerminology : controlledTerminology
    }
});

export default store ;