import * as React from 'react';
import { Link } from 'react-router-dom';

import { TreeList, TreeListDraggableRow, TreeListTextEditor, TreeListToolbar, createDataTree, extendDataItem, mapTree, moveTreeItem, removeItems } from '@progress/kendo-react-treelist';
import KendoCommandCell from './KendoCommandCell';
import demoData from '../../flat-data';
import { DragAndDrop } from '@progress/kendo-react-common';
import TreelistDemoSideBar from './TreelistDemoSideBar';
import Header from '../Header';

export const ReorderContext = React.createContext({
    reorder: () => { },
    dragStart: () => { },
});

const expandField = 'expanded';
const subItemsField = 'employees';
const editField = 'inEdit';
const dataTree = createDataTree(demoData, i => i.folderId, i => i.parentId, subItemsField);

const TreelistDemo = () => {
    const [state, setState] = React.useState({
        data: [...dataTree],
        expanded: [1, 2, 32],
        inEdit: []

    });

    // const addChild= dataItem => {
    //   const newRecord = createNewItem();
    //   setState({
    //     ...state,
    //     inEdit:[ ...state.inEdit, newRecord],
    //     expanded: [...state.expanded, dataItem.folderId],
    //     data : modifySubItems(state.data, subItemsField, item => item.folderId === dataItem.folderId, subItems => [newRecord, ...subItems])
    //   })
    // }

    const enterEdit = dataItem => {
        setState({
            ...state,
            inEdit: [...state.inEdit, extendDataItem(dataItem, subItemsField)]
        })
    }

    const save = dataItem => {
        const {
            ...itemToSave
        } = dataItem;
        setState({
            ...state,
            data: mapTree(state.data, subItemsField, item => item.folderId === itemToSave.folderId ? itemToSave : item),
            inEdit: state.inEdit.filter(i => i.folderId !== itemToSave.folderId)
        })
    }

    const cancel = editedItem => {
        const {
            inEdit,
            data
        } = state;
        if (editedItem.isNew) {
            return remove(editedItem);
        }
        setState({
            ...state,
            data: mapTree(data, subItemsField, item => item.folderId === editedItem.folderId ? inEdit.find(i => i.folderId === item.folderId) : item),
            inEdit: inEdit.filter(i => i.folderId !== editedItem.folderId)
        });
    };

    const remove = dataItem => {
        setState({
            ...state,
            data: removeItems(state.data, subItemsField, i => i.folderId === dataItem.folderId),
            inEdit: state.inEdit.filter(i => i.folderId !== dataItem.folderId)
        });
    };

    const onExpandChange = event => {
        setState({
            ...state,
            expanded: event.value ? state.expanded.filter(folderId => folderId !== event.dataItem.folderId) : [...state.expanded, event.dataItem.folderId]
        });

    };
    const callback = item => state.expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
        [expandField]: true
    }) : item;

    const onRowDrop = event => {
        setState({
            ...state,
            data: moveTreeItem(state.data, event.dragged, event.draggedOver, subItemsField)
        });
    };

    const onItemChange = event => {
        const field = event.field;
        setState({
            ...state,
            data: mapTree(state.data, subItemsField, item => item.folderId === event.dataItem.folderId ? extendDataItem(item, subItemsField, {
                [field]: event.value
            }) : item)
        });
    };

    // const addRecord = () => {
    //   const newRecord = createNewItem();
    //   setState({
    //     ...state,
    //     data: [newRecord, ...state.data],
    //     inEdit: [...state.inEdit, {
    //       ...newRecord
    //     }]
    //   });
    // };

    // const createNewItem = () => {
    //   const timestamp = new Date().getTime();
    //   return {
    //     folderId: timestamp,
    //     isNew: true
    //   };
    // };
    const CommandCell = KendoCommandCell(enterEdit, remove, save, cancel, editField);

    const columns = [{
        field: 'folderNameShort',
        title: 'Short Name',
        expandable: true,
        editCell: TreeListTextEditor,

        width: '180px'
    },
    {
        field: 'folderNameLong',
        title: 'Long Name',
        editCell: TreeListTextEditor,

        width: '180px'
    },
    {
        cell: CommandCell,
        width: '360px'
    }
    ];
    // Reorder
    const [activeItem, setActiveItem] = React.useState(null);
    const reorder = (e) => {
        let dataItem = e.draggedItem
       let direction = 'after'
        if (activeItem === dataItem) {
            return;
        }
        let reorderedData = state.data.slice();
        let prevIndex = reorderedData.findIndex((p) => p === activeItem);
        let nextIndex =
            reorderedData.findIndex((p) => p === dataItem) +
            (direction === "before" ? -1 : 0);
        if (prevIndex > nextIndex) {
            nextIndex++;
        }
        reorderedData.splice(prevIndex, 1);
        reorderedData.splice(nextIndex, 0, activeItem || reorderedData[0]);
        console.log('reorderedData', reorderedData);
        setState({
            ...state,
            data: reorderedData,
        })
    };
    const dragStart = (dataItem) => {
        setActiveItem(dataItem.draggedItem);
        console.log('data', dataItem)
    };

    return (
        <div className="main">
           <TreelistDemoSideBar/>

            <div className="main_section">
              <Header/>
                <section className="main_content">
                    <ReorderContext.Provider
                        value={{
                            reorder: reorder,
                            dragStart: dragStart,
                        }}
                    >
                        <DragAndDrop>
                            <TreeList style={{
                                maxHeight: '1000px',
                                overflow: 'auto'
                            }}
                                // data={mapTree(state.data, subItemsField, callback)} expandField={expandField} onRowDrop={onRowDrop} row={TreeListDraggableRow} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columns} />

                                data={mapTree(state.data, subItemsField, callback, item => extendDataItem(item, subItemsField, {
                                    [expandField]: state.expanded.includes(item.folderId),
                                    [editField]: Boolean(state.inEdit.find(i => i.folderId === item.folderId))
                                }))} editField={editField} expandField={expandField} subItemsField={subItemsField} onRowDrag={dragStart} onRowDrop={reorder} onItemChange={onItemChange} row={TreeListDraggableRow} onExpandChange={onExpandChange} columns={columns} reorderable={true} toolbar={<TreeListToolbar>
                                    <button title="Add new" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" >
                                        Add new
                                    </button>
                                </TreeListToolbar>} />
                        </DragAndDrop>
                    </ReorderContext.Provider>

                </section>
            </div>
        </div>
    );
};

export default TreelistDemo