// import React, { useEffect, useState } from 'react'
import TreelistDemoSideBar from './TreelistDemoSideBar'
// import axios from 'axios'
import { TreeList, createDataTree, extendDataItem, getSelectedState, mapTree, removeItems } from '@progress/kendo-react-treelist';

import { TerminologyData } from '../../terminologyData';
import folderImg from '../../assets/images/folder2.svg'
import { ContextMenu, MenuItem, Splitter } from '@progress/kendo-react-layout';
// import { TerminologyCode } from '../../terminologyCode';
import { getter } from '@progress/kendo-react-common';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import IconDetailDialog from './AddEditTreelist/IconDetailDialog';
import ControlledDetailDialog from './AddEditTreelist/ControlledDetailDialog';
import IconAddDialog from './AddEditTreelist/IconAddDialog';
import IconAddParent from './AddEditTreelist/IconAddParent';
import IconEditingDialog from './AddEditTreelist/IconEditingDialog';
import axios from 'axios';
import CustomCell from '../../components/common/CustomCell';
import RowRender from '../../components/common/RowRender';
import { handleContextMenu, onChange } from '../../utils/common-helper';
import ControlledCodeDetailDialog from './AddEditTreelist/ControlledCodeDetailDialog';

const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "libraryControlledTerminologyCategoryGuid";
const DATA_ITEM_KEY1 = "libraryControlledTerminologyGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const idGetter1 = getter(DATA_ITEM_KEY1);

const extendData = (dataState, selectedState, expandedState) => {
  return mapTree(dataState, subItemsField, (item) =>
    extendDataItem(item, subItemsField, {
      selected: selectedState[idGetter(item)],
      expanded: expandedState[idGetter(item)],
    })
  );
};
const extendData1 = (dataState, selectedState, expandedState) => {
  return mapTree(dataState, subItemsField, (item) =>
    extendDataItem(item, subItemsField, {
      selected: selectedState[idGetter1(item)],
      expanded: expandedState[idGetter1(item)],
    })
  );
};


const ControlledTerminologyTreelist = () => {
  const [dataItemIndex, setDataItemIndex] = React.useState(0);
  const [showSubFolderItem, setShowSubFolderItem] = React.useState(false);
  const [showFileItem, setShowFileItem] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showCodeDetail, setShowCodeDetail] = React.useState(false);

  const [showCode, setShowCode] = React.useState(false);
  const [openAddItem, setOpenAddItem] = React.useState(false);
  const [openAddItemCode, setOpenAddItemCode] = React.useState(false);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [showCodeContext, setShowCodeContext] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
  const [selectedCodeRow, setSelectedCodeRow] = React.useState([{ parentId: null }]);
  const [newData, setNewData] = React.useState({});
  const [showSelected, setShowSelected] = React.useState(false);
  const [uniqueId, setUniqueId] = React.useState('');
  const [detailFile, setDetailFile] = React.useState(false);
  const [showPop, setShowPop] = React.useState(false);
  const [showCodePop, setShowCodePop] = React.useState(false);
  const [showEditPop, setShowEditPop] = React.useState(false);
  const [showEditCodePop, setShowEditCodePop] = React.useState(false);
  const [type, setType] = React.useState('');
  const [folderName, setFolderName] = React.useState();
  const [fileName, setFileName] = React.useState();
  const [standardName, setStandardName] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const toggleDialog = () => {
    setVisible(!visible);
  };
  const [rowId, setRowId] = React.useState('');
  const categoryData = JSON.parse(localStorage.getItem('categoryData'))||[]
  const dataTreeCate = createDataTree(categoryData, i => i.libraryControlledTerminologyCategoryGuid, i => i.parentId, subItemsField);
  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCate],
    itemInEdit: undefined,
  });

  const [stateCode, setStateCode] = React.useState({
    data: [],
    itemInEdit: undefined,
  });
  const [selectedState, setSelectedState] = React.useState({});
  const [selectedCodeState, setSelectedCodeState] = React.useState({});

  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });

  const offset = React.useRef({
    left: 0,
    top: 0,
  });

  const openContextMenu = (dataItem)=>{
      if (dataItem.parentId == null) {
      setShowFolderItem(true);
    } else if (dataItem.parentId != null && dataItem.hasOwnProperty('employees')) {
      setShowSubFolderItem(true);
    } else {
      setShowFileItem(true)
    }
  }
  const openCodeContextMenu = (dataItem)=>{
      if (dataItem.parentId == null) {
      setShowCodeContext(true);
    }
  }
  const handleCloseMenu = () => {
    setShowFolderItem(false);
  };
  const handleCodeCloseMenu = () => {
    setShowCodeContext(false);
  };

  const onExpandChangeCategory = React.useCallback(
    (e) => {
      setExpandedState({
        ...expandedState,
        [idGetter(e.dataItem)]: !e.value,
      });
    },
    [expandedState]
  );
  const onExpandChangeCode = React.useCallback(
    (e) => {
      setExpandedState({
        ...expandedState,
        [idGetter1(e.dataItem)]: !e.value,
      });
    },
    [expandedState]
  );

  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      Object.keys(newSelectedState).forEach((key) => {
        if (key != event.dataItem.libraryControlledTerminologyCategoryGuid) {
          delete newSelectedState[key]
        }
      })
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );
  const onCodeSelectionChange = React.useCallback(
    (event) => {
      // alert(1)
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedCodeState,
        dataItemKey: DATA_ITEM_KEY1,     
      });
      console.log('newSelectedState', newSelectedState)
      Object.keys(newSelectedState).forEach((key) => {
        if (key != event.dataItem.libraryControlledTerminologyGuid) {
          delete newSelectedState[key]
        }
      })
      setSelectedCodeState(newSelectedState);
    },
    [selectedCodeState]
  );
  const [panes, setPanes] = React.useState([
    {
      size: "50%",
      min: "20%",
      collapsible: true,
      scrollable: false,

    },
    {
      min: "20%",
      collapsible: true,
      scrollable: false,

    }
  ]);


const onCategoryRowClick = (event, props) =>{
  if (rowId === props.id) {
    return false
  }
  setShowCode(true);
  setRowId(props.id);
  props.selectionChange(event);
  setNewData(props.dataItem);
  setShowSelected(true);
  setStandardName(props.dataItem.libraryControlledTerminologyCategoryNameShort);
  setSelectedRow(props.dataItem);
  setUniqueId(props.dataItem.libraryControlledTerminologyCategoryGuid);
  getTerminologyCode(props.dataItem.libraryControlledTerminologyCategoryGuid);
}
const onCodeRowClick = (event, props) =>{
  props.selectionChange(event);
  setSelectedCodeRow(props.dataItem);
}

  const addFolder = () => {
    if (!selectedRow.hasOwnProperty('employees')) {
      selectedRow.employees = []
    }
    selectedRow.employees.push(
      {
        "libraryControlledTerminologyCategoryId": selectedRow.libraryControlledTerminologyCategoryId,
        "libraryControlledTerminologyCategoryGuid": "5301685A-DD05-452C-88B2-1E8FCEC97156",
        "companyId": 1,
        "isSystem": false,
        "parentId": selectedRow.libraryControlledTerminologyCategoryGuid,
        // "parentId": '5301685A-DD05-452C-88B2-1E8FCEC97172',
        "isFolder": false,
        "libraryControlledTerminologyCategoryNameShort": folderName,
        "libraryControlledTerminologyCategoryNameLong": "Covariance Matrix",
        "libraryControlledTerminologyCategoryDescription": "Covariance Matrix",
        "isExtendable": false,
        "iconId": null,
        "displayOrder": 1,
      }
    )
    setStateCategory({
      ...stateCategory,
      itemInEdit: undefined,
      data: mapTree(stateCategory.data, subItemsField,
        (item) =>
          item.libraryControlledTerminologyCategoryGuid === selectedRow.libraryControlledTerminologyCategoryGuid ? selectedRow : item
      )
    });
    setShowPop(false)

  };
  const addCodeFolder = () => {
    if (!selectedCodeRow.hasOwnProperty('employees')) {
      selectedCodeRow.employees = []
    }
    selectedCodeRow.employees.push(
      {
        "libraryControlledTerminologyId": selectedCodeRow.libraryControlledTerminologyCategoryId,
        "libraryControlledTerminologyGuid": "F6F7E6B4-742E-4035-A5D6-705C33AA47CF",
        "libraryControlledTerminologyCategoryId": 1,
        "parentId": selectedCodeRow.libraryControlledTerminologyGuid,
        "isFolder": false,
        "libraryControlledTerminologyNameShort": folderName,
        "libraryControlledTerminologyNameLong": "Unstructured",
        "libraryControlledTerminologyDescription": "Unstructured",
        "isCustom": false,
        "isHidden": false,
        "displayOrder": 1
      }
    )

    setStateCode({
      ...stateCode,
      itemInEdit: undefined,
      data: mapTree(stateCode.data, subItemsField,
        (item) =>
          item.libraryControlledTerminologyGuid === selectedCodeRow.libraryControlledTerminologyGuid ? selectedCodeRow : item
      )
    });
    setShowCodePop(false)

  };

  const columnsCategory = [
    {
      field: 'libraryControlledTerminologyCategoryNameShort',
      title: 'Controlled Terminology Category',
      expandable: true,
      width: '500px',
      cell: (props) => <CustomCell {...props} onRowClick={onCategoryRowClick}/>,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Category
            </td>
            <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} onClick={() => {
                setOpenAddItem(true);
                setType('folder')
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setOpenAddItem(true);
                setType('file')
              }}><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td>
          </th>
        )
      }
    }
  ];

  const columnsCode = [
    {
      field: 'libraryControlledTerminologyNameShort',
      title: 'Controlled Terminology Code',
      expandable: true,
      width: '500px',
      cell: (props) => <CustomCell {...props} onRowClick={onCodeRowClick}/>,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Code
            </td>
            <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} onClick={() => {
                setOpenAddItemCode(true);
                setType('folder')
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setOpenAddItemCode(true);
                setType('file')
              }}><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td>
          </th>
        )
      }
    }

  ];

  const handleDetailFolder = () => {
    setShowDetail(true);
  }
  const cancelPop = () => {
    setShowPop(false)
  };
  const cancelDetail = () => {
    setShowDetail(false)
    setDetailFile(false)
  };
  const cancelCodeDetail = () => {
    setShowCodeDetail(false)
    // setDetailFile(false)
  };
  const handleAddFolder = () => {
    setShowPop(true);
    setType('folder')
  }
  const save = (itemInEdit) => {

    setShowEditPop(false);

    setStateCategory({
      ...stateCategory,
      itemInEdit: undefined,
      data: mapTree(stateCategory.data, subItemsField,
        (item) =>
          itemInEdit.libraryControlledTerminologyCategoryGuid === item.libraryControlledTerminologyCategoryGuid ? itemInEdit : item
      )
    });
  };
  const saveCode = (itemInEdit) => {
    setShowEditCodePop(false);
    setStateCode({
      ...stateCode,
      itemInEdit: undefined,
      data: mapTree(stateCode.data, subItemsField,
        (item) =>
          itemInEdit.libraryControlledTerminologyGuid === item.libraryControlledTerminologyGuid ? itemInEdit : item
      )
    });
  };
  const edit = (dataItem) => {
    setStateCategory({
      ...stateCategory,
      itemInEdit: extendDataItem(dataItem, subItemsField),
    });
  };
  const handleEditFolder = () => {
    setShowEditPop(true);
    setType('folder');
    edit(selectedRow)
  }
  const remove = (dataItem) => {
    setStateCategory({
      ...stateCategory,
      data: removeItems(stateCategory.data, subItemsField, (i) => i.libraryControlledTerminologyCategoryGuid === dataItem.libraryControlledTerminologyCategoryGuid),
    });
  };
  const handleDeleteFolder = () => {
    remove(selectedRow)
  }

  const handleOnSelect = (e) => {
    switch (e.item.data.action) {
      case "detailFolder":
        handleDetailFolder();
        break;
      case "addFolder":
        handleAddFolder();
        break;
      // case "addItem":
      //   handleAddItem();
      //   break;
      case "editFolder":
        handleEditFolder();
        break;
      case "deleteFolder":
        handleDeleteFolder();
        break;
      default:
    }
    setShowFolderItem(false);
  };

  const handleDetailCodeFolder = ()=>{
     setShowCodeDetail(true);
  }
  const handleEditCodeFolder = ()=>{
    setShowEditCodePop(true);
    setType('folder');
    setStateCode({
      ...stateCode,
      itemInEdit: extendDataItem(selectedCodeRow, subItemsField),
    });
  }
  const handleAddCodeFolder = ()=>{
    setShowCodePop(true)
    setType('folder')
  }
  const handleDeleteCodeFolder = ()=>{
    setStateCode({
      ...stateCode,
      data: removeItems(stateCode.data, subItemsField, (i) => i.libraryControlledTerminologyGuid === selectedCodeRow.libraryControlledTerminologyGuid),
    });
  }
  const handleOnCodeSelect = (e) => {
    switch (e.item.data.action) {
      case "detailCodeFolder":
        handleDetailCodeFolder();
        break;
      case "addCodeFolder":
        handleAddCodeFolder();
        break;
      case "editCodeFolder":
        handleEditCodeFolder();
        break;
      case "deleteCodeFolder":
        handleDeleteCodeFolder();
        break;
      default:
    }
    setShowCodeContext(false);
  };

  const getCategaory = () => {
    axios.get('http://dataarcapi.com/api/ControlledTerminology/GetControlledTerminologyCategories').then((response) => {
      localStorage.setItem('categoryData', JSON.stringify(response.data));
      const dataTreeCategory = createDataTree(response.data, i => i.libraryControlledTerminologyCategoryGuid, i => i.parentId, subItemsField);
      setStateCategory({
        ...stateCategory,
        data: dataTreeCategory,
      });
    }
    )
  }
  const getTerminologyCode = (Guid)=>{
    axios.get(`http://dataarcapi.com/api/ControlledTerminology/GetControlledTerminology/${Guid}`).then((response) => {
      console.log('resCode', response.data);
      const dataTreeCode = createDataTree(response.data, i => i.libraryControlledTerminologyGuid, i => i.parentId, subItemsField);
      setStateCode({
        ...stateCode,
        data: dataTreeCode,
      });
    }
    )
  }
  useEffect(() => {
    getCategaory();

  }, [])
  return (
    <>
      <div className="main">
        <TreelistDemoSideBar />
      </div>
      <div className="main_section">
        <section className="main_content">
          <div className='icon-treelist'>
            <Splitter
              style={{
                height: "94vh",
                marginBottom: '10px'
              }}
              panes={panes}
              orientation={"horizontal"}
              onChange={(event)=>onChange(event, setPanes)}
              scrollable={false}
            >
              <TreeList style={{
                border: 'none',
                maxHeight: '100vh',
                overflow: 'auto',
                marginBottom: '10px'
                // width: '720px'
              }} data={extendData(stateCategory.data, selectedState, expandedState)}
                onSelectionChange={onSelectionChange}
                onRowContextMenu={(event)=>handleContextMenu(event, openContextMenu, setSelectedRow, offset)}

                rowRender={RowRender}
                editField={editField}
                navigatable={true}
                selectedField={SELECTED_FIELD}
                selectable={{
                  enabled: true,
                }}
                expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChangeCategory} columns={columnsCategory}
              />

              {showCode ?
                <TreeList style={{
                  border: 'none',
                  maxHeight: '100vh',
                  overflow: 'auto',
                }} 
                  data={extendData1(stateCode.data, selectedCodeState, expandedState)}
                  onSelectionChange={onCodeSelectionChange}
                  rowRender={RowRender}
                  onRowContextMenu={(event)=>handleContextMenu(event, openCodeContextMenu, setSelectedCodeRow, offset)}
                  editField={editField}
                  navigatable={true}
                  selectedField={SELECTED_FIELD}
                  selectable={{
                    enabled: true,
                  }}
                  expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChangeCode} columns={columnsCode}
                /> : <></>
              }
            </Splitter>
          </div>
          <ContextMenu
            show={showFolderItem}
            offset={offset.current}
            onSelect={handleOnSelect}
            onClose={handleCloseMenu}
          >
            <MenuItem
              text={`Detail ${selectedRow.libraryControlledTerminologyCategoryNameShort}`}
              data={{
                action: "detailFolder",
              }}
              icon="detail-section"
            />
            <MenuItem
              text={`Edit ${selectedRow.libraryControlledTerminologyCategoryNameShort}`}
              data={{
                action: "editFolder",
              }}
              icon="edit"
            />

            <MenuItem
              text={`Delete ${selectedRow.libraryControlledTerminologyCategoryNameShort}`}
              data={{
                action: "deleteFolder",
              }}
              icon="delete"
            />
            <MenuItem
              data={{
                action: "addFolder",
              }}
              render={() => (
                <>
                  <img src={folderImg} />
                  Add {selectedRow.libraryControlledTerminologyCategoryNameShort} Folder
                </>
              )}
            />
          </ContextMenu>
          <ContextMenu
            show={showCodeContext}
            offset={offset.current}
            onSelect={handleOnCodeSelect}
            onClose={handleCodeCloseMenu}
          >
            <MenuItem
              text={`Detail ${selectedCodeRow.libraryControlledTerminologyNameShort}`}
              data={{
                action: "detailCodeFolder",
              }}
              icon="detail-section"
            />
              <MenuItem
              text={`Edit ${selectedCodeRow.libraryControlledTerminologyNameShort}`}
              data={{
                action: "editCodeFolder",
              }}
              icon="edit"
            />
                        <MenuItem
              text={`Delete ${selectedCodeRow.libraryControlledTerminologyNameShort}`}
              data={{
                action: "deleteCodeFolder",
              }}
              icon="delete"
            />
            <MenuItem
              data={{
                action: "addCodeFolder",
              }}
              render={() => (
                <>
                  <img src={folderImg} />
                  Add {selectedCodeRow.libraryControlledTerminologyNameShort} Folder
                </>
              )}
            />
            
          </ContextMenu>

          {openAddItem && (
            <IconAddParent
              setFolderName={setFolderName}
              type={type}
              save={() => {
                setStateCategory({
                  ...stateCategory,
                  data: [...stateCategory.data,
                  {
                    "libraryControlledTerminologyCategoryId": 500,
                    "libraryControlledTerminologyCategoryGuid": "5301685A-DD05-452C-88B2-1E8FCEC97156",
                    "companyId": 1,
                    "isSystem": false,
                    "parentId": null,
                    "isFolder": false,
                    "libraryControlledTerminologyCategoryNameShort": folderName,
                    "libraryControlledTerminologyCategoryNameLong": "Covariance Matrix",
                    "libraryControlledTerminologyCategoryDescription": "Covariance Matrix",
                    "isExtendable": false,
                    "iconId": null,
                    "displayOrder": 1,

                  }
                  ]
                });
                setOpenAddItem(false);
              }}
              cancel={() => setOpenAddItem(false)}
            />
          )}
          {openAddItemCode && (
            <IconAddParent
              setFolderName={setFolderName}
              type={type}
              save={() => {
                setStateCode({
                  ...stateCode,
                  data: [...stateCode.data,
                    {
                      "libraryControlledTerminologyId":250 ,
                      "libraryControlledTerminologyGuid": "F6F7E6B4-742E-4035-A5D6-705C33AA47CD",
                      "libraryControlledTerminologyCategoryId": 1,
                      "parentId": null,
                      "isFolder": false,
                      "libraryControlledTerminologyNameShort": folderName,
                      "libraryControlledTerminologyNameLong": "Unstructured",
                      "libraryControlledTerminologyDescription": "Unstructured",
                      "isCustom": false,
                      "isHidden": false,
                      "displayOrder": 1
                    }
                  ]
                });
                setOpenAddItemCode(false);
              }}
              cancel={() => setOpenAddItemCode(false)}
            />
          )}
          {showPop && (
            <IconAddDialog
              selectedRow={selectedRow}
              setFolderName={setFolderName}
              setFileName={setFileName}
              type={type}
              save={addFolder}
              cancel={cancelPop}
              title={selectedRow.libraryControlledTerminologyCategoryNameShort}
            />
          )}
          {showCodePop && (
            <IconAddDialog
              selectedRow={selectedCodeRow}
              setFolderName={setFolderName}
              setFileName={setFileName}
              type={type}
              save={addCodeFolder}
              cancel={()=>setShowCodePop(false)}
              title={selectedCodeRow.libraryControlledTerminologyNameShort}
            />
          )}
          {showEditPop && (
            <IconEditingDialog
              itemInEdit={stateCategory.itemInEdit}
              save={save}
              cancel={() => setShowEditPop(false)}
              title={selectedRow.libraryControlledTerminologyCategoryNameShort}
              id={"libraryControlledTerminologyCategoryNameShort"}

            />
          )}
          {showEditCodePop && (
            <IconEditingDialog
              itemInEdit={stateCode.itemInEdit}
              save={saveCode}
              cancel={() => setShowEditCodePop(false)}
              title={selectedCodeRow.libraryControlledTerminologyNameShort}
              id={"libraryControlledTerminologyNameShort"}

            />
          )}
          {(showDetail || detailFile) && (
            <ControlledDetailDialog selectedRow={selectedRow} title={selectedRow.libraryControlledTerminologyCategoryNameShort} id={selectedRow.libraryControlledTerminologyCategoryGuid} cancel={cancelDetail} />
          )}
          {(showCodeDetail) && (
            <ControlledCodeDetailDialog selectedRow={selectedCodeRow} cancel={cancelCodeDetail} />
          )}
        </section>
      </div>
    </>
  )
}

export default ControlledTerminologyTreelist
