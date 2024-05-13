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
import { event } from 'jquery';

const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "libraryControlledTerminologyCategoryGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const extendData = (dataState, selectedState, expandedState) => {
  return mapTree(dataState, subItemsField, (item) =>
    extendDataItem(item, subItemsField, {
      selected: selectedState[idGetter(item)],
      expanded: expandedState[idGetter(item)],
    })
  );
};


const ControlledTerminology = () => {
  const [dataItemIndex, setDataItemIndex] = React.useState(0);
  const [showSubFolderItem, setShowSubFolderItem] = React.useState(false);
  const [showFileItem, setShowFileItem] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);

  const terminologyCategory = JSON.parse(localStorage.getItem('categoryData')) || []
  const dataTreeCategory = createDataTree(terminologyCategory, i => i.libraryControlledTerminologyCategoryGuid, i => i.parentId, subItemsField);

  const [terminologyCodeData, setTerminologyCodeData] = React.useState([])
  const dataTreeCode = createDataTree(terminologyCodeData, i => i.libraryControlledTerminologyId, i => i.parentId, subItemsField);

  const [showCode, setShowCode] = React.useState(false);
  const [openAddItem, setOpenAddItem] = React.useState(false);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [showCodeContext, setShowCodeContext] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
  const [newData, setNewData] = React.useState({});
  const [showSelected, setShowSelected] = React.useState(false);
  const [uniqueId, setUniqueId] = React.useState('');
  const [detailFile, setDetailFile] = React.useState(false);
  const [showPop, setShowPop] = React.useState(false);
  const [showEditPop, setShowEditPop] = React.useState(false);
  const [type, setType] = React.useState('');
  const [folderName, setFolderName] = React.useState();
  const [fileName, setFileName] = React.useState();
  const [standardName, setStandardName] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const toggleDialog = () => {
    setVisible(!visible);
  };
  const [rowId, setRowId] = React.useState('');
  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCategory],
    itemInEdit: undefined,
  });

  const [stateCode, setStateCode] = React.useState([...dataTreeCode]);
  const [selectedState, setSelectedState] = React.useState({});

  const [state, setState] = React.useState({
    data: [...dataTreeCategory],
    itemInEdit: undefined,
  });
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

  const onExpandChangeCategory = React.useCallback(
    (e) => {
      setExpandedState({
        ...expandedState,
        [idGetter(e.dataItem)]: !e.value,
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

  const [expanded, setExpanded] = React.useState([1, 2, 32]);


  const onExpandChange = e => {
    setExpanded(e.value ? expanded.filter(libraryControlledTerminologyCategoryGuid => libraryControlledTerminologyCategoryGuid !== e.dataItem.libraryControlledTerminologyCategoryGuid) : [...expanded, e.dataItem.libraryControlledTerminologyCategoryGuid]);
  };
  const callback = item => expanded.includes(item.libraryControlledTerminologyCategoryGuid) ? extendDataItem(item, subItemsField, {
    [expandField]: true
  }) : item;

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
  //  alert('code')
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
    // }
    setShowPop(false)

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
      field: 'libraryControlledTerminologyDescription',
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
      ...state,
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

  const getCategaory = () => {
    axios.get('http://dataarcapi.com/api/ControlledTerminology/GetControlledTerminologyCategories').then((response) => {
      //console.log('res', response.data);
      localStorage.setItem('categoryData', JSON.stringify(response.data));
      // setTerminologyCategory(response.data);
      setStateCategory({
        ...state,
        data: response.data,
      });
    }
    )
  }
  const getTerminologyCode = (Guid)=>{
    axios.get(`http://dataarcapi.com/api/ControlledTerminology/GetControlledTerminology/${Guid}`).then((response) => {
      console.log('resCode', response.data);
      setTerminologyCodeData(response.data)

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
        <Header />
        <section className="main_content">
          <div className='icon-treelist'>
            <Splitter
              style={{
                height: "100vh",
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
                }} data={mapTree(dataTreeCode, subItemsField, callback)}
                  rowRender={RowRender}
                  onRowContextMenu={(event)=>handleContextMenu(event, openCodeContextMenu, setSelectedRow, offset)}
                  editField={editField}
                  expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columnsCode}
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
            onSelect={handleOnSelect}
            onClose={handleCloseMenu}
          >
            <MenuItem
              text={`Detail`}
              data={{
                action: "detailFolder",
              }}
              icon="detail-section"
            />
            {/* <MenuItem
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
            /> */}
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
          {showEditPop && (
            <IconEditingDialog
              itemInEdit={stateCategory.itemInEdit}
              save={save}
              cancel={() => setShowEditPop(false)}
              title={selectedRow.libraryControlledTerminologyCategoryNameShort}
              id={"libraryControlledTerminologyCategoryNameShort"}

            />
          )}
          {(showDetail || detailFile) && (
            <ControlledDetailDialog selectedRow={selectedRow} cancel={cancelDetail} />
          )}
        </section>
      </div>
    </>
  )
}

export default ControlledTerminology
