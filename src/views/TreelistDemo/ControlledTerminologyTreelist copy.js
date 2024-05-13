// import React, { useEffect, useState } from 'react'
import TreelistDemoSideBar from './TreelistDemoSideBar'
// import axios from 'axios'
import { TreeList, createDataTree, extendDataItem, getSelectedState, mapTree, removeItems } from '@progress/kendo-react-treelist';
import { useInternationalization } from '@progress/kendo-react-intl';

import { TerminologyData } from '../../terminologyData';
import folderImg from '../../assets/images/folder2.svg'
import { ContextMenu, MenuItem, Splitter } from '@progress/kendo-react-layout';
import { TerminologyCode } from '../../terminologyCode';
import { getter } from '@progress/kendo-react-common';
import React, { useEffect } from 'react';
import Header from '../Header';
import IconDetailDialog from './AddEditTreelist/IconDetailDialog';
import ControlledDetailDialog from './AddEditTreelist/ControlledDetailDialog';
import IconAddDialog from './AddEditTreelist/IconAddDialog';
import IconAddParent from './AddEditTreelist/IconAddParent';
import IconEditingDialog from './AddEditTreelist/IconEditingDialog';
import axios from 'axios';

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
// const dataTreeCategory = createDataTree(TerminologyData, i => i.libraryControlledTerminologyCategoryGuid, i => i.parentId, subItemsField);
// const dataTreeCode = createDataTree(TerminologyCode, i => i.libraryControlledTerminologyId, i => i.parentId, subItemsField);

const ControlledTerminology = () => {
  const [dataItemIndex, setDataItemIndex] = React.useState(0);
  const [showSubFolderItem, setShowSubFolderItem] = React.useState(false);
  const [showFileItem, setShowFileItem] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);


  const [terminologyCodeData, setTerminologyCodeData] = React.useState(TerminologyCode)
  const dataTreeCode = createDataTree(terminologyCodeData, i => i.libraryControlledTerminologyId, i => i.parentId, subItemsField);
  const dataTreeCategory = createDataTree(TerminologyData, i => i.libraryControlledTerminologyCategoryGuid, i => i.parentId, subItemsField);
  const [showCode, setShowCode] = React.useState(false)
  const [openAddItem, setOpenAddItem] = React.useState(false);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
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

  const handleContextMenuOpen = (e, dataItem) => {
    e.preventDefault();
    setDataItemIndex(
      dataTreeCategory.findIndex((i) => i.libraryControlledTerminologyCategoryGuid === dataItem.libraryControlledTerminologyCategoryGuid)
    );
    setSelectedRow(dataItem);
    offset.current = {
      left: e.pageX,
      top: e.pageY,
    };
    if (dataItem.parentId == null) {
      setShowFolderItem(true);
    } else if (dataItem.parentId != null && dataItem.hasOwnProperty('employees')) {
      setShowSubFolderItem(true);
    } else {
      setShowFileItem(true)
    }
  };
  const handleContextMenu = (event) => {
    handleContextMenuOpen(event.syntheticEvent, event.dataItem);
  };
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

  // const MyCell = (props) => {
  //   const intl = useInternationalization();

  //   const { hasChildren, level = [0], expanded, dataItem, format } = props;
  //   // setHasChildren(hasChildren)
  //   const data = dataItem[props.field];
  //   let dataAsString = '';

  //   if (data !== undefined && data !== null) {
  //     dataAsString = format ?
  //       intl.format(format, data) :
  //       data.toString();
  //   }

  // const icons = [];
  // if (props.expandable) {
  //   icons.push(...level.slice(1).map((_x, i) => (<span className="k-icon k-i-none" key={i} />)));
  //   if (hasChildren) {
  //     icons.push(
  //       <span
  //         className={`k-icon k-i-${expanded ? 'collapse' : 'expand'}`}
  //         key="expand-collapse"
  //         onClick={event => props.onExpandChange(event, dataItem)}
  //       />
  //     );
  //   } else {
  //     icons.push(<span className="k-icon k-i-none" key={icons.length} />);
  //   }
  // }
  //   return (
  //     <td
  //       style={props.style}
  //       className={props.className}
  //       colSpan={props.colSpan}
  //       onClick={(event)=>{
  //         if (rowId === props.id) {
  //           return false
  //         }
  //         setRowId(props.id)
  //         props.selectionChange(event);
  //         setShowCode(true);
  //         let codeData = TerminologyCode;
  //         let filteredCode = codeData.filter((x)=>x.libraryControlledTerminologyCategoryGuid === props.dataItem.libraryControlledTerminologyCategoryGuid)
  //         setTerminologyCodeData(filteredCode)
  //       }}
  //     >
  //       {icons}
  //       <img src={folderImg} alt="folder-icon" className='me-2' />
  //       {dataAsString}
  //     </td>
  //   );

  // }
  const MyCell = (props) => {
    const intl = useInternationalization();
    // props.isSelected = true

    const { hasChildren, level = [0], expanded, dataItem, format } = props;
    const data = dataItem[props.field];
    let dataAsString = '';

    if (data !== undefined && data !== null) {
      dataAsString = format ?
        intl.format(format, data) :
        data.toString();
    }

    const icons = [];
    if (props.expandable) if (props.expandable) {
      icons.push(...level.slice(1).map((_x, i) => (<span className="k-icon k-i-none" key={i} />)));
      if (hasChildren) {
        icons.push(
          <span
            className={`k-icon k-i-${expanded ? 'collapse' : 'expand'}`}
            key="expand-collapse"
            onClick={event => props.onExpandChange(event, dataItem)}
          />
        );
      } else {
        icons.push(<span className="k-icon k-i-none" key={icons.length} />);
      }
    }
    return (
      <td
        style={props.style}
        className={props.className}
        colSpan={props.colSpan}
        //selected works here
        onClick={(event) => {
          if (rowId === props.id) {
            return false
          }
          setShowCode(true);
          let codeData = TerminologyCode;
          let filteredCode = codeData.filter((x) => x.libraryControlledTerminologyCategoryId == props.dataItem.libraryControlledTerminologyCategoryId)
          setTerminologyCodeData(filteredCode)

          // if (isChange) {
          //   if (standardName !== selectedRow.libraryControlledTerminologyCategoryNameShort) {
          //     toggleDialog();
          //     return false
          //   }
          // }
          setRowId(props.id);
          props.selectionChange(event);
          setNewData(props.dataItem);
          setShowSelected(true);
          setStandardName(props.dataItem.libraryControlledTerminologyCategoryNameShort);
          setSelectedRow(props.dataItem);
          setUniqueId(props.dataItem.libraryControlledTerminologyCategoryGuid);
        }}
      >
        {icons}
        <img src={folderImg} alt="folder-icon" className='me-2' />
        {/* <img className=' me-2 treelist-carrent-icon-space' src={props.dataItem.standardIcon} alt='standardIcon' /> */}
        {dataAsString}
      </td>
    );

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
  const MyCellCode = (props) => {
    const intl = useInternationalization();

    const { hasChildren, level = [0], expanded, dataItem, format } = props;
    // setHasChildren(hasChildren)
    const data = dataItem[props.field];
    let dataAsString = '';

    if (data !== undefined && data !== null) {
      dataAsString = format ?
        intl.format(format, data) :
        data.toString();
    }

    const icons = [];
    if (props.expandable) {
      icons.push(...level.slice(1).map((_x, i) => (<span className="k-icon k-i-none" key={i} />)));
      if (hasChildren) {
        icons.push(
          <span
            className={`k-icon k-i-${expanded ? 'collapse' : 'expand'}`}
            key="expand-collapse"
            onClick={event => props.onExpandChange(event, dataItem)}
          />
        );
      } else {
        icons.push(<span className="k-icon k-i-none" key={icons.length} />);
      }
    }
    return (
      <td
        style={props.style}
        className={props.className}
        colSpan={props.colSpan}
      >
        {icons}
        <img src={folderImg} className='me-2' />
        {dataAsString}
      </td>
    );

  }
  const columnsCategory = [
    {
      field: 'libraryControlledTerminologyCategoryNameShort',
      title: 'Controlled Terminology Category',
      expandable: true,
      width: '500px',
      cell: (props) => <MyCell {...props} />,
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
      cell: (props) => <MyCellCode {...props} />,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Code
            </td>
            {/* <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} ><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td> */}
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
  const rowRender = (row, props) => {
    const rowColor = localStorage.getItem('row-color') || '#d3d3d3';
    const rowColor2 = localStorage.getItem('row-color2') || '#ffffff';
    let color = '#fff';
    let level = props.level.length;
    let rowIndexEven = props.ariaRowIndex % 2;
    switch (level) {
      case 1:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      case 2:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      case 3:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      case 4:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      default:
        color = '#fff';
    }
    let style = { ...row.props.style, backgroundColor: color };
    return <tr className='selected-row' {...row.props} style={style}></tr>;

  };

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

  // Splitter
  const onChange = (event) => {
    if (event.newState[0].collapsed) {
      event.newState[1].collapsible = false
      event.newState[1].size = undefined
    } else {
      event.newState[1].collapsible = true
    }
    if (event.newState[1].collapsed) {
      event.newState[0].collapsible = false
    } else {
      event.newState[0].collapsible = true
    }
    setPanes(event.newState);
  };
useEffect(()=>{
  axios.get('http://dataarcapi.com/api/ControlledTerminology/GetControlledTerminologyCategories').then((response)=>{
    console.log('res', response.data);
  }
  )

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
                marginBottom:'10px'
              }}
              panes={panes}
              orientation={"horizontal"}
              onChange={onChange}
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
                onRowContextMenu={handleContextMenu}

                rowRender={rowRender}
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
                  rowRender={rowRender}
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
            {/* Added icon in Context */}
            <MenuItem
              // text={`Add ${selectedRow.libraryControlledTerminologyCategoryNameShort} Folder`}
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
          
          9{openAddItem && (
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
                    // "parentId": '5301685A-DD05-452C-88B2-1E8FCEC97172',
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
