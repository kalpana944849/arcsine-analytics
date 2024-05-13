import * as React from 'react';
import {Link} from 'react-router-dom';

import {TreeList, TreeListDraggableRow, TreeListTextEditor, TreeListToolbar, createDataTree, extendDataItem, mapTree, moveTreeItem, removeItems} from '@progress/kendo-react-treelist';
import KendoCommandCell from './KendoCommandCell';
import demoData from '../../flat-data';
const expandField = 'expanded';
const subItemsField = 'employees';
const editField = 'inEdit';
const dataTree = createDataTree(demoData, i => i.folderId, i => i.parentId, subItemsField);

const TreelistDemo = () => {
    const [state, setState] = React.useState({
        data: [...dataTree],
        expanded: [1, 2,32],
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
            inEdit: [...state.inEdit, extendDataItem(dataItem,subItemsField)]
        })
    }

    const save = dataItem => {
        const {
            ...itemToSave
        } = dataItem;
        setState({
            ...state,
            data : mapTree(state.data, subItemsField, item => item.folderId === itemToSave.folderId ? itemToSave:item),
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
            expanded : event.value ? state.expanded.filter(folderId => folderId !== event.dataItem.folderId) : [...state.expanded, event.dataItem.folderId]
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
   
    return (
        <div className="main">
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4>
                            <Link to="#">Arcsine Analytics</Link>
                        </h4>
                        <Link to="#" class="sidebar_btn" onclick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home \</Link>
                                </li>
                 
                                {/* <li class="breadcrumb-item-inner2">
                    <Link to="#">Manage Project</Link>
                  </li> */}
                            </ol>
                        </nav>
                    </div>
        
                    <ul className="sidebar_list">
            
                        <li  >
                            <Link to="/external-form-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>External Form Treelist</span></Link>
                        </li>
                        <li >
                                <Link to="/icon-treelist">
                                    <i className="fa-solid fa-database"></i>
                                    <span>Icon Treelist</span></Link>
                            </li>
                        <li className="active"><Link to="/manage-project">
                            <i className="fa-regular fa-square-plus"></i>
                            <span>Drag&DropTreelist</span></Link>
                        </li>
               
                        <li>
                            <Link to="/simple-treelist">
                                <i className="fa-solid fa-book"></i>
                                <span>Simple Data Treelist</span></Link>
                        </li>
                        <li>
                            <Link to="/custom-treelist-cell">
                                <i className="fa-solid fa-database"></i>
                                <span>Custom Treelist Cell</span></Link>
                        </li>
                        <li>
                            <Link to="/filter-sort-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Filter&Sort Treelist</span></Link>
                        </li>
                        <li>
                            <Link to="/resizable-column-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Resizable Column Treelist</span></Link>
                        </li>
                        <li >
                            <Link to="/locked-column-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Locked Column Treelist</span></Link>
                        </li>
                        <li  >
                            <Link to="/reorder-column-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Reorder Column Treelist</span></Link>
                        </li>
                        <li >
                            <Link to="/column-menu-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Column Menu Treelist</span></Link>
                        </li> 
                        <li   >
                            <Link to="/excel-export-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Excel Export Treelist</span></Link>
                        </li>
                    </ul>
            
                </div>
            </div>

            <div className="main_section">
                <header className="header">
          
                </header>
                <section className="main_content">
          
                    <TreeList style={{
                        maxHeight: '1000px',
                        overflow: 'auto'
                    }} 
                    // data={mapTree(state.data, subItemsField, callback)} expandField={expandField} onRowDrop={onRowDrop} row={TreeListDraggableRow} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columns} />

                    data={mapTree(state.data, subItemsField, callback,item => extendDataItem(item, subItemsField, {
                        [expandField]: state.expanded.includes(item.folderId),
                        [editField]: Boolean(state.inEdit.find(i => i.folderId === item.folderId))
                    }))} editField={editField} expandField={expandField} subItemsField={subItemsField} onItemChange={onItemChange} onRowDrop={onRowDrop} row={TreeListDraggableRow} onExpandChange={onExpandChange} columns={columns} toolbar={<TreeListToolbar>
                        <button title="Add new" className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary" >
              Add new
                        </button>
                    </TreeListToolbar>} />;    
            
                </section>
            </div>
        </div>
    );
};

export default TreelistDemo