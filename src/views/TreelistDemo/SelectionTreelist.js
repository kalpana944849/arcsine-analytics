// import * as React from 'react';
// import { TreeList, mapTree, extendDataItem, getSelectedState, getSelectedStateFromKeyDown, createDataTree } from '@progress/kendo-react-treelist';
// import {  RadioGroup } from '@progress/kendo-react-inputs';
// import { getter } from '@progress/kendo-react-common';
// import employees from '../../flat-data';
// const DATA_ITEM_KEY = 'id';
// const SUB_ITEMS_FIELD = 'employees';
// const EXPAND_FIELD = 'expanded';
// const SELECTED_FIELD = 'selected';
// const idGetter = getter(DATA_ITEM_KEY);
// const dataTree = createDataTree(employees, i => i.folderId, i => i.parentId, SUB_ITEMS_FIELD);
// const selectionModes = [{
//   value: 'single',
//   label: 'Single selection mode'
// }, {
//   value: 'multiple',
//   label: 'Multiple selection mode'
// }];

// const SelectionTreelist = () => {
  
//   const dataState = [...dataTree.slice()];
//   const [selectedState, setSelectedState] = React.useState({});
//   const [expanded, setExpanded] = React.useState({
//     1: true,
//     2: true,
//     32: true
//   });
  
//   const [selectionMode, setSelectionMode] = React.useState(selectionModes[1].value);

//   // const callback = (item) =>
//   // expanded.includes(item.id)
//   //   ? extendDataItem(item, SUB_ITEMS_FIELD, {
//   //       [EXPAND_FIELD]: true,
//   //     })
//   //   : item;
//   const extendData = (dataState, selectedState, expanded) => {
//     return mapTree(dataState, SUB_ITEMS_FIELD,(item) =>
//     EXPAND_FIELD.includes(item.id)
//       ? extendDataItem(item, SUB_ITEMS_FIELD, {
//           [EXPAND_FIELD]: true,
//       selected: selectedState[idGetter(item)],
//       expanded: expanded[idGetter(item)]
//     })
//     : item);
//   };
//   const onExpandChange = React.useCallback( (e) => {
//     setExpanded({ 
//       e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId],
//     [idGetter(e.dataItem)] : !e.value
//   });
// },[expanded]
//   ) ; 
  
//   // const onExpandChange = React.useCallback(e => {
//   //   setExpanded({
//   //     ...expanded,
//   //     [idGetter(e.dataItem)]: !e.value
//   //   });
//   // }, [expanded]);
//   const onSelectionChange = React.useCallback(event => {
//     const newSelectedState = getSelectedState({
//       event,
//       selectedState: selectedState,
//       dataItemKey: DATA_ITEM_KEY
//     });
//     setSelectedState(newSelectedState);
//   }, [selectedState]);
//   const onKeyDown = event => {
//     const newSelectedState = getSelectedStateFromKeyDown({
//       event,
//       selectedState: selectedState,
//       dataItemKey: DATA_ITEM_KEY
//     });
//     setSelectedState(newSelectedState);
//   };

//   const onSelectionModeChange = event => {
//     setSelectionMode(event.value);
//   };
//   return <div>
        
//         <RadioGroup value={selectionMode} onChange={onSelectionModeChange} data={selectionModes} />
//         <TreeList style={{
//       maxHeight: '510px',
//       overflow: 'auto'
//     }} data={extendData(dataState, selectedState, expanded)} selectedField={SELECTED_FIELD} expandField={EXPAND_FIELD} subItemsField={SUB_ITEMS_FIELD} dataItemKey={DATA_ITEM_KEY} selectable={{
//       enabled: true,
     
//       mode: selectionMode
//     }} navigatable={true} onSelectionChange={onSelectionChange} onExpandChange={onExpandChange} onKeyDown={onKeyDown} columns={[{
//       field: 'name',
//       title: 'Name',
//       expandable: true,
//       width: '31%'
//     }, {
//       field: 'position',
//       title: 'Position',
//       width: '31%'
//     }, {
//       field: 'hireDate',
//       title: 'Hire Date',
//       format: '{0:d}',
//       width: '31%'
//     }]} />
//       </div>;
// };
// export default SelectionTreelist