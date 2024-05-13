/* eslint-disable no-undef */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TreeList, createDataTree, mapTree, extendDataItem, removeItems, getSelectedState, TreeListSelectionCell } from '@progress/kendo-react-treelist';
import employeesFlat from '../../standard-component';
import { Link } from 'react-router-dom';
import { useInternationalization } from '@progress/kendo-react-intl';
import File from '../../assets/images/folder2.svg'
import { Button } from '@progress/kendo-react-buttons';
import IconEditingDialog from './AddEditTreelist/IconEditingDialog';
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import IconAddDialog from './AddEditTreelist/IconAddDialog';
import { useDispatch, useSelector } from 'react-redux';
import { setTreelist } from '../../store/reducers/treelistReducer';
import { TreelistService } from '../../services/treelist-service';
import IconDetailDialog from './AddEditTreelist/IconDetailDialog';
import { getter } from '@progress/kendo-react-common';
import IconAddParent from './AddEditTreelist/IconAddParent';
import { Splitter } from "@progress/kendo-react-layout";
import { event } from 'jquery';
import TreelistDemoSideBar from './TreelistDemoSideBar';


const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "standardComponentUniqueId";
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
const IconTreelist = () => {
  const [dataItemIndex, setDataItemIndex] = React.useState(0);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [showFileItem, setShowFileItem] = React.useState(false);
  const [showSubFolderItem, setShowSubFolderItem] = React.useState(false);
  const [showPop, setShowPop] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
  const [folderName, setFolderName] = React.useState();
  const [fileName, setFileName] = React.useState();
  const [type, setType] = React.useState('');
  const [showDetail, setShowDetail] = React.useState(false);
  const [detailFile, setDetailFile] = React.useState(false);
  const [standardName, setStandardName] = React.useState('');
  const [uniqueId, setUniqueId] = React.useState('');
  const [showSelected, setShowSelected] = React.useState(false);
  const [openAddItem, setOpenAddItem] = React.useState(false);


  const dispatch = useDispatch();
  const DemoTreelist = useSelector((state) => state.treelist.treelist);
  const getTreeListDemo = async () => {
    if (DemoTreelist.length === 0) {
      const response = await TreelistService();
      if (response.status === 200) {
        dispatch(setTreelist({ treelist: response.data.demoTreelist }));
        localStorage.setItem('treeListDemo', JSON.stringify(response.data.demoTreelist));

      }
    }

  };
  const dataTree = createDataTree(DemoTreelist, i => i.standardComponentUniqueId, i => i.parentId, subItemsField);

  const offset = React.useRef({
    left: 0,
    top: 0,
  });

  const handleContextMenuOpen = (e, dataItem) => {
    e.preventDefault();
    setDataItemIndex(
      dataTree.findIndex((i) => i.standardComponentUniqueId === dataItem.standardComponentUniqueId)
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
  const handleCloseFileMenu = () => {
    setShowFileItem(false);
  };
  const handleCloseSubMenu = () => {
    setShowSubFolderItem(false);
  };
  const handleDetailFolder = () => {
    setShowDetail(true);
  }
  const handleAddFolder = () => {
    setShowPop(true);
    setType('folder')
  }
  const handleAddItem = () => {
    setShowPop(true);
    setType('file')
  }
  const handleEditFolder = () => {
    edit(selectedRow);
  }
  const handleDeleteFolder = () => {
    remove(selectedRow);
  }
  const handleOnSelect = (e) => {
    switch (e.item.data.action) {
      case "detailFolder":
        handleDetailFolder();
        break;
      case "addFolder":
        handleAddFolder();
        break;
      case "addItem":
        handleAddItem();
        break;
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
  const handleOnSelectSub = (e) => {
    switch (e.item.data.action) {
      case "detailFolder":
        handleDetailFolder();
        break;
      case "addFolder":
        handleAddFolder();
        break;
      case "addItem":
        handleAddItem();
        break;
      case "editFolder":
        handleEditFolder();
        break;
      case "deleteFolder":
        handleDeleteFolder();
        break;
      default:
    }
    setShowSubFolderItem(false);
  };

  const handleEditFile = () => {
    edit(selectedRow);
  }
  const handleDeleteFile = () => {
    remove(selectedRow);
  }
  const handleOnSelectFile = (e) => {
    switch (e.item.data.action) {
      case "detailFile":
        setDetailFile(true)
        break;
      case "editFile":
        handleEditFile();
        break;
      case "deleteFile":
        handleDeleteFile();
        break;
      default:
    }
    setShowFileItem(false);
  };

  const [addOpen, setAddOpen] = React.useState(false)

  const [state, setState] = React.useState({
    data: [...dataTree],
    itemInEdit: undefined,
  });

  const [expanded, setExpanded] = React.useState([1, 2, 32]);
  const [selectedState, setSelectedState] = React.useState({});
  const [newName, setNewName] = React.useState(state.itemInEdit);

  const handleAddOpen = () => {
    setAddOpen(true)
  }
  const edit = (dataItem) => {
    setState({
      ...state,
      itemInEdit: extendDataItem(dataItem, subItemsField),
    });
  };
  const remove = (dataItem) => {
    setState({
      ...state,
      data: removeItems(state.data, subItemsField, (i) => i.standardComponentUniqueId === dataItem.standardComponentUniqueId),
    });
  };
  const cellWithEditing = (props) => {
    return (
      <td>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          className="k-grid-edit-command"
          themeColor={"primary"}
          onClick={() => {
            edit(props.dataItem);
          }}
        >
          Edit
        </Button>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          className="k-grid-remove-command"
          onClick={() => {

            remove(props.dataItem);
          }}
        >
          Remove
        </Button>
      </td>
    );
  };
//   const handleSubmit =
//   (itemInEdit) => {
//     // let loggedInUser = localStorage.getItem('treeListDemo');
//     // let parsedata = JSON.parse(loggedInUser);
//     // console.log('loggedInUser', parsedata[0]) 
    
//     // for (var i = 0; i < parsedata.length; ++i) {
//     //     if (parsedata[i]['standardComponentUniqueId'] === '1-1-0-0') {
//     //         parsedata[i]['Username'] = 'Thomas';
//     //     }
      
//     // }

  const save = (itemInEdit) => {
    console.log(state.data)
   
    setState({

      ...state,
      itemInEdit: undefined,
      data: mapTree(state.data, subItemsField,
        (item) =>
          itemInEdit.standardComponentUniqueId === item.standardComponentUniqueId ? itemInEdit : item
      )
    });
  };

  const addFolder = () => {
    if (selectedRow.hasOwnProperty('employees')) {
      selectedRow.employees.push(
        {
          companyId: 1,
          iconTypeId: 2,
          levelTypeId: 2,
          parentId: "1-1-0-0",
          standardIconId: 17,
          standardComponentTreeLabel: folderName,
          // employees: [{
          //   companyId: 1, iconTypeId: 2, levelTypeId: 2, parentId:
          //     "1-1-0-0", standardIconId: 17, standardComponentTreeLabel: fileName, standardIcon: "http://giblets-001-site2.dtempurl.com/images/icon/parameter-database.png"
          // }],
          standardIcon: `${type === 'file' ? selectedRow.standardIcon.replace('folder', 'parameter') : selectedRow.standardIcon}`
        }
      )

      setState({
        ...state,
        itemInEdit: undefined,
        data: mapTree(state.data, subItemsField,
          (item) =>
            item.standardComponentUniqueId === selectedRow.standardComponentUniqueId ? selectedRow : item
        )
      });
    }
    setShowPop(false)

  };
  const cancel = () => {
    setState({
      ...state,
      itemInEdit: undefined,
    });
  };
  const cancelPop = () => {
    setShowPop(false)
  };
  const cancelDetail = () => {
    setShowDetail(false)
    setDetailFile(false)
  };
  const AddCommandCell = () => {
    return (
      <td>
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          className="k-grid-edit-command"
          themeColor={"primary"}
          onClick={() => {
            handleAddOpen()
          }}
        >
          Add
        </Button>


      </td>

    );

  };

  // const onExpandChange = e => {
  //   setExpanded(e.value ? expanded.filter(standardComponentUniqueId => standardComponentUniqueId !== e.dataItem.standardComponentUniqueId) : [...expanded, e.dataItem.standardComponentUniqueId]);
  // };
  // const callback = item => expanded.includes(item.standardComponentUniqueId) ? extendDataItem(item, subItemsField, {
  //   [expandField]: true
  // }) : item;

  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });
  const [newData, setNewData] = React.useState([]);

  const onExpandChange = React.useCallback(
    (e) => {
      setExpandedState({
        ...expandedState,
        [idGetter(e.dataItem)]: !e.value,
      });
    },
    [expandedState]
  );
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
    if (props.expandable) {
      icons.push(...level.slice(1).map((_x, i) => (<span className="k-icon k-i-none k-indent-space" key={i}/>)));
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
        onClick={(event)=>props.selectionChange(event)}
      >
      
        {icons}
        
        <img className=' me-2 treelist-carrent-icon-space' src={props.dataItem.standardIcon} alt='standardIcon'  />
        {dataAsString}
      </td>
    );

  }
  const columns = [

    {
      field: 'standardComponentTreeLabel',
      title: 'Short Name',
      expandable: true,
      width: '350px',
      
      cell: MyCell,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
            Standard Component
            </td>
            <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} onClick={() => {
                setOpenAddItem(true);
                setType('folder')
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setOpenAddItem(true);
                setType('file')
              }}><i className='k-icon k-i-file-add k-color-dark'  title='Add File'></i></button>
            </td>
          </th>
        )
      }

    },

  ];


  const onRowClick = React.useCallback(

    (event) => {
      
      console.log('dataitem', event.dataItem)
      setNewData(event.dataItem);
      setShowSelected(true)
      setStandardName(event.dataItem.standardComponentTreeLabel);
      setUniqueId(event.dataItem.standardComponentUniqueId)
    }
  ,[]
  )
  const handleSubmitData = (itemInEdit) => {
 
    
setNewData(undefined)
    setState({
      ...state,
      itemInEdit: undefined,
      
      data: mapTree(state.data, subItemsField, (item) =>
      itemInEdit.standardComponentUniqueId === item.standardComponentUniqueId ? itemInEdit : item
      )
    });
  }

  const onSelectionChange = React.useCallback(
    (event) => {
      setSelectedState({})
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      Object.keys(newSelectedState).forEach((key)=> {
        if(key !== event.dataItem.standardComponentUniqueId){
             delete newSelectedState[key]
        }
      })
      console.log('newSelectedState', newSelectedState)
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const handleStdCompChange = (e) => {
    setNewName(e.target.value)
  }
  // const onSelectionChange = React.useCallback(
  //   (event) => {
  //     setSelectedState({})
  //     const newSelectedState = getSelectedState({
  //       event,
  //       selectedState: selectedState,
  //       dataItemKey: DATA_ITEM_KEY,
  //     });
  //     console.log('newSelectedState', newSelectedState)
  //     setSelectedState(newSelectedState);
  //   },
  //   [selectedState]
  // );
  // const onSelectionChange = (event) => {
  //   const newSelectedState = getSelectedState({
  //     event,
  //     selectedState: selectedState,
  //     dataItemKey: DATA_ITEM_KEY,
  //   });
  //   console.log('newSelectedState', newSelectedState)
  //   setSelectedState(newSelectedState)
  // }

  // splitter
  const [panes, setPanes] = React.useState([
    {
      size: "50%",
      min: "20%",
      collapsible: true,
      scrollable : false,
      
    },
    {
      min: "20%",
      collapsible: true,
      scrollable : false,
     
    }
  ]);
  const [inputValue, setInputValue] = React.useState('');
  
  // Event handler to update the input value as the user types
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    
  }
  const onChange = (event) => {
    if(event.newState[0].collapsed){
      event.newState[1].collapsible = false
      event.newState[1].size = undefined
    } else{
      event.newState[1].collapsible = true
    }
    if(event.newState[1].collapsed){
      event.newState[0].collapsible = false
    } else{
      event.newState[0].collapsible = true
    }
    setPanes(event.newState);
  };
  const handleSubmit = (event) => {
    // event.preventDefault(); // Prevent the default form submission behavior

    // Perform actions with the form data, e.g., send it to an API
    console.log('Form submitted with value:', inputValue);

    // You can also reset the form or perform other actions here

    // Clear the form input
    setInputValue('');
  }
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
  // const rowRender = (row, props) => {
  //   let color = '#fff';
  //   let level = props.level.length;
  //   let rowIndexEven = props.ariaRowIndex % 2;
  //   switch (level) {
  //     case 1:
  //       color = rowIndexEven ? '#d3d3d3' : '#fff';
  //       break;
  //     case 2:
  //       color = rowIndexEven ? '#d3d3d3' : '#fff';
  //       break;
  //     case 3:
  //       color = rowIndexEven ? '#d3d3d3' : '#fff';
  //       break;
  //     case 4:
  //       color = rowIndexEven ? '#d3d3d3' : '#fff';
  //       break;
  //     default:
  //       color = '#fff';
  //   }
  //   let style = { ...row.props.style, backgroundColor: color };
  //   return <tr className='selected-row' {...row.props} style={style}></tr>;
  
  // };


  React.useEffect(() => {
    getTreeListDemo();
  }, []);

  return (
    <>
      <div className="main">
      <TreelistDemoSideBar/>
      </div>
      <div className="main_section">
        <header className="header"></header>
        <section className="main_content">
          <div className='icon-treelist'>
            <Splitter
              style={{
                height: "100vh",
              }}
              panes={panes}
              orientation={"horizontal"}  
              onChange={onChange}
              scrollable = {false}
            >
              <TreeList
                style={{
                  border: 'none',
                  maxHeight: "100vh",
                  overflow: "auto",
                  // width: '50%',

                }}
                rowRender={rowRender}
                onRowClick={onRowClick}
                onSelectionChange={onSelectionChange}
                onRowContextMenu={handleContextMenu}
                // data={mapTree(state.data, subItemsField, callback)}
                data={extendData(state.data, selectedState, expandedState)}
                editField={editField}
                expandField={expandField}
                selectedField={SELECTED_FIELD}
                subItemsField={subItemsField}
                navigatable={true}
                onExpandChange={onExpandChange}
                columns={columns}
                selectable={{
                  enabled: true,
                }}

              />
              
              <div style={{border: 'none'}} className={`icon-treelist-form ${showSelected ? '' : 'd-none'}`}>
                <form  onSubmit={(e) =>
                {
                  e.preventDefault()
                handleSubmitData(newData)
                setShowSelected(false)
                }
                 }>
                  <div className="mb-3" style={{border:'none'}}>
                    <label htmlFor="standardName" className="form-label">Standard Name</label>
                    <input type="text" className="form-control" id="standardName" onChange={e => setStandardName(e.target.value)} value={standardName} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="longName" className="form-label">Unique Id</label>
                    <input type="text" className="form-control" id="longName" value={uniqueId}  onChange={handleInputChange} disabled/>
         
                  </div>
                  <button type="submit"  className="btn btn-primary w-100">Save</button>
                </form>
              </div>
            </Splitter>
          </div>
            <ContextMenu
            show={showFolderItem}
            offset={offset.current}
            onSelect={handleOnSelect}
            onClose={handleCloseMenu}
          >
            <MenuItem
              text={`Detail ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "detailFolder",
              }}
              icon="detail-section"
            />
            <MenuItem
              text={`Edit ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "editFolder",
              }}
              icon="edit"
            />
            <MenuItem
              text={`Delete ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "deleteFolder",
              }}
              icon="delete"
            />
            {/* Added icon in Context */}
            <MenuItem
              // text={`Add ${selectedRow.standardComponentTreeLabel} Folder`}
              data={{
                action: "addFolder",
              }}
              render={() => (
                <>
                  <img src={selectedRow.standardIcon} alt="standard Icon" />
                  Add {selectedRow.standardComponentTreeLabel} Folder
                </>
              )}
            />
              <MenuItem
              // text={`Add ${selectedRow.standardComponentTreeLabel} Folder`}
              data={{
                action: "addItem",

              }}
              render={() => (
                <>
               {/* {selectedRow.employees[0].standardIcon === 'undefined' ? <img src={selectedRow.standardIcon} alt="standard Icon" /> :  <img src={selectedRow.employees[0].standardIcon} alt="standard Icon" />} */}
                  <img src={selectedRow.standardIcon.replace('folder', 'parameter')} alt="standard Icon" />
                  Add {selectedRow.standardComponentTreeLabel} Items
                </>
              )}
            />


          </ContextMenu>
          <ContextMenu
            show={showSubFolderItem}
            offset={offset.current}
            onSelect={handleOnSelectSub}
            onClose={handleCloseSubMenu}
          >
            <MenuItem
              text={` Detail  ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "detailFolder",
              }}
              icon="detail-section"
            />

            <MenuItem
              text={`Edit ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "editFolder",
              }}
              icon="edit"
            />
            <MenuItem
              text={`Delete ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "deleteFolder",
              }}
              icon="delete"
            />
                {/* Added icon in Context */}
                <MenuItem
              // text={`Add ${selectedRow.standardComponentTreeLabel} Folder`}
              data={{
                action: "addFolder",
              }}
              render={() => (
                <>
                  <img src={selectedRow.standardIcon} alt="standard Icon" />
                  Add {selectedRow.standardComponentTreeLabel} Folder
                </>
              )}
            />
              <MenuItem
              // text={`Add ${selectedRow.standardComponentTreeLabel} Folder`}
              data={{
                action: "addItem",

              }}
              render={() => (
                <>
                  <img src={selectedRow.standardIcon.replace('folder', 'parameter')} alt="standard Icon" />
                  Add {selectedRow.standardComponentTreeLabel} Item
                </>
              )}
            />
          </ContextMenu>
          <ContextMenu
            show={showFileItem}
            offset={offset.current}
            onSelect={handleOnSelectFile}
            onClose={handleCloseFileMenu}
          >
            <MenuItem
              text={`Detail ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "detailFile",
              }}
              icon="detail-section"
            />
            <MenuItem
              text={`Edit ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "editFile",
              }}
              icon="edit"
            />
            <MenuItem
              text={`Delete ${selectedRow.standardComponentTreeLabel}`}
              data={{
                action: "deleteFile",
              }}
              icon="delete"
            />
          </ContextMenu>

          {state.itemInEdit && (
            <IconEditingDialog
              itemInEdit={state.itemInEdit}
              save={save}
              cancel={cancel}
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
            />
          )}
          {openAddItem && (
            <IconAddParent
              setFolderName={setFolderName}
              type={type}
              save={() => {
                setState({
                  ...state,
                  data: [...state.data,
                  {
                    companyId: 1,
                    iconTypeId: 2,
                    levelTypeId: 2,
                    parentId: null,
                    standardIconId: 17,
                    standardComponentTreeLabel: folderName,
                    standardIcon: `images/icon/${type === 'file' ? 'parameter' : 'folder'}-database.png`

                  }
                  ]
                });
                setOpenAddItem(false);
              }}
              cancel={() => setOpenAddItem(false)}
            />
          )}
          {(showDetail || detailFile) && (
            <IconDetailDialog selectedRow={selectedRow} cancel={cancelDetail} />
          )}
        </section>
      </div>
    </>
  );
}
export default IconTreelist