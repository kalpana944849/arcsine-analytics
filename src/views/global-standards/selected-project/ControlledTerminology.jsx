// import React, { useEffect, useState } from 'react'
import TreelistDemoSideBar from '../../TreelistDemo/TreelistDemoSideBar'
// import axios from 'axios'
import { TreeList, createDataTree, extendDataItem, getSelectedState, mapTree, removeItems } from '@progress/kendo-react-treelist';

import folderImg from '../../../assets/images/folder2.svg'
import fileImg from '../../../assets/images/file.svg'
import { ContextMenu, MenuItem, Splitter } from '@progress/kendo-react-layout';
// import { TerminologyCode } from '../../terminologyCode';
import { getter } from '@progress/kendo-react-common';
import React, { useCallback, useEffect, useState } from 'react';
import Header from '../../Header';
import ControlledDetailDialog from '../../TreelistDemo/AddEditTreelist/ControlledDetailDialog';
import IconAddDialog from '../../TreelistDemo/AddEditTreelist/IconAddDialog';
//import IconAddParent from '../../AddEditTreelist/IconAddParent';
import IconAddParent from '../../TreelistDemo/AddEditTreelist/IconAddParent';

import IconEditingDialog from '../../TreelistDemo/AddEditTreelist/IconEditingDialog';
import axios from 'axios';
import CustomCell from '../../../components/common/CustomCell';
import RowRender from '../../../components/common/RowRender';
import { getParsedFromLocalStorage, handleContextMenu, onChange } from '../../../utils/common-helper';
import ControlledCodeDetailDialog from '../../TreelistDemo/AddEditTreelist/ControlledCodeDetailDialog';
import { Link, useLocation } from 'react-router-dom';
import FullScreenLoader from '../../../utils/Loaders/FullScreenLoader';
import FullScreenLoaderRight from '../../../utils/Loaders/FullScreenLoaderRight';
import MainLayout from '../../../components/layout/MainLayout';
import Version from '../../../components/layout/Version';
import { ControlledTerminologyCodeDelete, addTerminologyCategory, addTerminologyCode, getTerminologyCategory, terminologyCategoryDelete, terminologyCategoryUpdate, terminologyCodeGetById, terminologyCodeUpdate } from '../../../services/controlled-terminology-service';
import { useFormik } from 'formik';
import commonSchema from '../../../utils/validationSchema/common-schema';

const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "libraryControlledTerminologyCategoryId";
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


const ControlledTerminology = () => {
  const version = process.env.REACT_APP_VERSION;
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const [dataItemIndex, setDataItemIndex] = React.useState(0);
  const [showSubFolderItem, setShowSubFolderItem] = React.useState(false);
  const [showFileItem, setShowFileItem] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  // const [showDetailCode, setShowDetailCode] = React.useState(false);
  const [showCodeDetail, setShowCodeDetail] = React.useState(false);

  const [Loader, showLoader] = React.useState(false);
  const [btnLoading, setBtnLoading] = React.useState(false);
  const [LoaderRight, showLoaderRight] = React.useState(false);
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
  const [isActive, setActive] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = React.useState(false);
  const [showUpdatePopupCode, setShowUpdatePopupCode] = React.useState(false);
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [showAddPopupCode, setShowAddPopupCode] = React.useState(false);
  const [isCode, setCode] = React.useState(false);
  const [parentId, setParentId] = React.useState(null);
  const [parentGuid, setParentGuid] = React.useState("");
  const [isExtendable, setIsExtendable] = React.useState(false);
  const [isCustom, setIsCustom] = React.useState(false);
  const [isHidden, setIsHidden] = React.useState(false);
  const [isFolder, setIsFolder] = React.useState(true);
  const [isFolderCode, setIsFolderCode] = React.useState(true);
  const [itemSelectedState, setItemSelectedState] = React.useState('');



  // Add parent
  const [shortName, setShortName] = useState('')
  const [longName, setLongName] = useState('')
  const [desc, setDesc] = useState('')

  const resetForm = () => {
    setShortName('')
    setLongName('')
    setDesc('')
    setIsExtendable(false);
    setIsCustom(false)
    setIsHidden(false)
    setIsFolder(true);
    setIsFolderCode(true)
    setParentId(null);
    setParentGuid(null);
    setCode(false)
  }
  // const handleAddParent = async (e) => {
  //   if (isCode) {
  //     handleAddCodeParent(e)
  //   } else {
  //     let closeBtn = document.getElementById('close_add_parent')
  //     e.preventDefault()
  //     const reqBody = {
  //       libraryControlledTerminologyCategoryId: 0,
  //       libraryControlledTerminologyCategoryGuid: "",
  //       companyId: 1,
  //       isSystem: true,
  //       parentId: parentId,
  //       parentGuid: parentGuid,
  //       isFolder: isFolder,
  //       libraryControlledTerminologyCategoryNameShort: shortName,
  //       libraryControlledTerminologyCategoryNameLong: longName,
  //       libraryControlledTerminologyCategoryDescription: desc,
  //       isExtendable: isExtendable,
  //       iconId: 0,
  //       displayOrder: 0
  //     }
  //     showLoader(true)
  //     const respose = await addTerminologyCategory(reqBody)
  //     if (respose.status == 200) {
  //       getCategaory()
  //       resetForm()
  //       showLoader(false)
  //       closeBtn.click();
  //     }
  //   }
  // }
  // const handleAddCodeParent = async (e) => {
  //   let closeBtn = document.getElementById('close_add_parent')
  //   e.preventDefault()
  //   const reqBody = {
  //     "libraryControlledTerminologyId": 0,
  //     "libraryControlledTerminologyGuid": "",
  //     "companyId": 1,
  //     "libraryControlledTerminologyCategoryId": selectedRow.libraryControlledTerminologyCategoryId,
  //     "parentId": parentId,
  //     "parentGuid": parentGuid,
  //     "isFolder": isFolder,
  //     "libraryControlledTerminologyNameShort": shortName,
  //     "libraryControlledTerminologyNameLong": longName,
  //     "libraryControlledTerminologyDescription": desc,
  //     "isCustom": true,
  //     "isHidden": true,
  //     "displayOrder": 0
  //   }
  //   showLoaderRight(true)
  //   const response = await addTerminologyCode(reqBody);
  //   if (response.status == 200) {
  //     getTerminologyCode(selectedRow.libraryControlledTerminologyCategoryGuid)
  //     showLoaderRight(false)
  //     resetForm()
  //     setCode(false)
  //     closeBtn.click();
  //   }
  // }
  const handleToggle = () => {
    setActive(!isActive);
  };
  const [rowId, setRowId] = React.useState('');
  const [stateCategory, setStateCategory] = React.useState({
    data: [],
    itemInEdit: undefined,
  });

  const [stateCode, setStateCode] = React.useState({
    data: [],
    itemInEdit: undefined,
  });
  const [selectedState, setSelectedState] = React.useState(
    () => {
      return JSON.parse(localStorage.getItem('terminologySelectedState')) || {}
    }
  );
  const [selectedCodeState, setSelectedCodeState] = React.useState({});

  const [expandedState, setExpandedState] = React.useState(
    () => {
      return JSON.parse(localStorage.getItem('expandedState')) || {}
    });



  const offset = React.useRef({
    left: 0,
    top: 0,
  });

  const openContextMenu = (dataItem) => {
    if (dataItem.parentId == null) {
      setShowFolderItem(true);
    } else if (dataItem.parentId != null && dataItem.hasOwnProperty('employees')) {
      setShowFolderItem(true);
    } else {
      setShowFolderItem(true)
    }
  }

  const openCodeContextMenu = (dataItem) => {
    setShowCodeContext(true);
    if (dataItem.parentId == null) {
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
        if (key != event.dataItem.libraryControlledTerminologyCategoryId) {
          delete newSelectedState[key]
        }
      })
      setSelectedState(newSelectedState);
      setItemSelectedState(newSelectedState);
      localStorage.setItem(
				"terminologySelectedState",
				JSON.stringify(newSelectedState)
			);
    },
    [selectedState]
  );

  const onCodeSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedCodeState,
        dataItemKey: DATA_ITEM_KEY1,
      });
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


  const onCategoryRowClick = (event, props) => {
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
    setUniqueId(props.dataItem.libraryControlledTerminologyCategoryId);
    getTerminologyCode(props.dataItem.libraryControlledTerminologyCategoryGuid);
    localStorage.setItem("terminologySelectedRow", JSON.stringify(props.dataItem));
  }
  const terminologySelectedRow = getParsedFromLocalStorage('terminologySelectedRow', {});
	useEffect(() => {
		if (Object.keys(terminologySelectedRow).length > 0) {
			setSelectedRow(terminologySelectedRow)
      setStandardName(terminologySelectedRow.libraryControlledTerminologyCategoryNameShort);
      setUniqueId(terminologySelectedRow.libraryControlledTerminologyCategoryId);
      getTerminologyCode(terminologySelectedRow.libraryControlledTerminologyCategoryGuid);
      setNewData(terminologySelectedRow);
			setShowSelected(true);
      setShowCode(true);
		}
	}, []);
  const onCodeRowClick = (event, props) => {
    props.selectionChange(event);
    setSelectedCodeRow(props.dataItem);
  }

  // const addFolder = () => {

  // };
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
        "parentGuid": selectedCodeRow.parentGuid,
        "isFolder": false,
        "libraryControlledTerminologyNameShort": folderName,
        "libraryControlledTerminologyNameLong": "Unstructured",
        "libraryControlledTerminologyDescription": "Unstructured",
        "isCustom": isCustom,
        "isHidden": isHidden,
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
    setShowCodePop(false);
  };

  const columnsCategory = [
    {
      field: 'libraryControlledTerminologyCategoryNameShort',
      title: 'Controlled Terminology Category',
      expandable: true,
      width: '500px',
      cell: (props) => <CustomCell {...props} onRowClick={onCategoryRowClick} />,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Category
            </td>
            <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} onClick={() => {
                setCode(false);
                setShowAddPopup(true);
                setParentId(null)
                setIsFolder(true)
                // setOpenAddItem(true);
                // setType('folder');
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setCode(false);
                setShowAddPopup(true);
                setParentId(null)
                setIsFolder(false)
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
      cell: (props) => <CustomCell {...props} onRowClick={onCodeRowClick} />,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Code
            </td>
            <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} onClick={() => {
                setShowAddPopupCode(true);
                setCode(true)
                setParentId(null)
                // setIsFolder(true)
                setIsFolderCode(true)
                // setType('folder')
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setShowAddPopupCode(true);
                setCode(true)
                setParentId(null)
                // setIsFolder(false)
                setIsFolderCode(false)
              }}><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td>
          </th>
        )
      }
    }

  ];
  const columnsCodes = [
    {
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Code
            </td>
            <td style={{ border: 'none' }}>

              <button className='me-2' style={{ border: 'none' }} disabled><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} disabled><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
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
    setIsFolder(true);
    setShowAddPopup(true)
    setParentId(selectedRow.libraryControlledTerminologyCategoryId)
  }
  const handleAddItem = () => {
    setIsFolder(false);
    setShowAddPopup(true);
    setParentId(selectedRow.libraryControlledTerminologyCategoryId)
  }
  const save = (itemInEdit) => {

    setShowEditPop(false);

    setStateCategory({
      ...stateCategory,
      itemInEdit: undefined,
      data: mapTree(stateCategory.data, subItemsField,
        (item) =>
          itemInEdit.libraryControlledTerminologyCategoryId === item.libraryControlledTerminologyCategoryId ? itemInEdit : item
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

  const formikAdd = useFormik({
    initialValues: {
      shortName: '',
      longName: '',
      desc: ''
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log('valuesAdd', values)
      // let closeBtn = document.getElementById('close_add_parent')
      // e.preventDefault()
      const reqBody = {
        libraryControlledTerminologyCategoryId: 0,
        libraryControlledTerminologyCategoryGuid: "",
        companyId: 1,
        isSystem: true,
        parentId: parentId,
        parentGuid: parentGuid,
        isFolder: isFolder,
        libraryControlledTerminologyCategoryNameShort: values.shortName,
        libraryControlledTerminologyCategoryNameLong: values.longName,
        libraryControlledTerminologyCategoryDescription: values.desc,
        isExtendable: isExtendable,
        iconId: 0,
        displayOrder: 0
      }
      // showLoader(true)
      setBtnLoading(true);
      const respose = await addTerminologyCategory(reqBody)
      if (respose.status == 200) {
        getCategaory()
        resetForm()
        // showLoader(false)
        setBtnLoading(false);
        setShowAddPopup(false);
      }
    },
  })
  const formikAddCode = useFormik({
    initialValues: {
      shortName: '',
      longName: '',
      desc: ''
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "libraryControlledTerminologyId": 0,
        "libraryControlledTerminologyGuid": "",
        "companyId": 1,
        "libraryControlledTerminologyCategoryId": selectedRow.libraryControlledTerminologyCategoryId,
        "parentId": parentId,
        "parentGuid": parentGuid,
        "isFolder": isFolderCode,
        "libraryControlledTerminologyNameShort": values.shortName,
        "libraryControlledTerminologyNameLong": values.longName,
        "libraryControlledTerminologyDescription": values.desc,
        "isCustom": isCustom,
        "isHidden": isHidden,
        "displayOrder": 0
      }
      showLoaderRight(true)
      const response = await addTerminologyCode(reqBody);
      if (response.status == 200) {
        getTerminologyCode(selectedRow.libraryControlledTerminologyCategoryGuid)
        showLoaderRight(false)
        resetForm()
        setCode(false)
        setShowAddPopupCode(false)
        setIsCustom(false);
        setIsHidden(false);
      }
    },
  })
  const formikUpdate = useFormik({
    initialValues: {
      shortName: selectedRow.libraryControlledTerminologyCategoryNameShort,
      longName: selectedRow.libraryControlledTerminologyCategoryNameLong,
      desc: selectedRow.libraryControlledTerminologyCategoryDescription,
      isExtendable: selectedRow.isExtendable
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        libraryControlledTerminologyCategoryId: selectedRow.libraryControlledTerminologyCategoryId,
        libraryControlledTerminologyCategoryGuid: selectedRow.libraryControlledTerminologyCategoryGuid,
        companyId: 1,
        isSystem: true,
        parentId: 0,
        isFolder: selectedRow.isFolder,
        libraryControlledTerminologyCategoryNameShort: values.shortName,
        libraryControlledTerminologyCategoryNameLong: values.longName,
        libraryControlledTerminologyCategoryDescription: values.desc,
        isExtendable: isExtendable,
        iconId: 0,
        displayOrder: 0
      }
      // showLoader(true)
      setBtnLoading(true);
      const response = await terminologyCategoryUpdate(reqBody)
      if (response.status == 200) {
        getCategaory()
        // showLoader(false)
        setBtnLoading(false);
        setShowUpdatePopup(false)
      }
    },
  });

  const formikCode = useFormik({
    initialValues: {
      shortName: selectedCodeRow.libraryControlledTerminologyNameShort,
      longName: selectedCodeRow.libraryControlledTerminologyNameLong,
      desc: selectedCodeRow.libraryControlledTerminologyDescription
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody =
      {
        "libraryControlledTerminologyId": selectedCodeRow.libraryControlledTerminologyId,
        "libraryControlledTerminologyGuid": selectedCodeRow.libraryControlledTerminologyGuid,
        "companyId": 1,
        "libraryControlledTerminologyCategoryId": selectedCodeRow.libraryControlledTerminologyCategoryId,
        "parentId": null,
        "parentGuid": "",
        "isFolder": selectedCodeRow.isFolder,
        "libraryControlledTerminologyNameShort": values.shortName,
        "libraryControlledTerminologyNameLong": values.longName,
        "libraryControlledTerminologyDescription": values.desc,
        "isCustom": isCustom,
        "isHidden": isHidden,
        "displayOrder": 3
      }

      // showLoaderRight(true)
      setBtnLoading(true);
      const response = await terminologyCodeUpdate(reqBody);
      if (response.status == 200) {
        getTerminologyCode(selectedRow.libraryControlledTerminologyCategoryGuid)
        setCode(false)
        // showLoaderRight(false)
        setBtnLoading(false);
        resetForm()
        setShowUpdatePopupCode(false);
      }
    },
  });

  const handleEditFolder = () => {
    setShowUpdatePopup(true)
    setShortName(selectedRow.libraryControlledTerminologyCategoryNameShort);
    setLongName(selectedRow.libraryControlledTerminologyCategoryNameLong);
    setDesc(selectedRow.libraryControlledTerminologyCategoryDescription);
    setIsExtendable(selectedRow.isExtendable);
  }

  const remove = async (dataItem) => {
    showLoader(true)
    const response = await terminologyCategoryDelete(dataItem)
    if (response.status == 200) {
      getCategaory()
      showLoader(false)
    }
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

  const handleDetailCodeFolder = () => {
    setShowCodeDetail(true);
  }

  const handleEditCodeFolder = () => {
    setCode(true)
    // setShowUpdatePopup(true)
    setShowUpdatePopupCode(true)
    setShortName(selectedCodeRow.libraryControlledTerminologyNameShort);
    setLongName(selectedCodeRow.libraryControlledTerminologyNameLong);
    setDesc(selectedCodeRow.libraryControlledTerminologyDescription);
    setIsCustom(selectedCodeRow.isCustom);
    setIsHidden(selectedCodeRow.isHidden);
  }
  const handleAddCodeFolder = () => {
    setCode(true)
    setShowAddPopupCode(true)
    setParentId(selectedCodeRow.libraryControlledTerminologyId)
    setIsFolderCode(true)
  }
  const handleAddCodeItem = () => {
    setCode(true)
    setShowAddPopupCode(true)
    setParentId(selectedCodeRow.libraryControlledTerminologyId)
    setIsFolderCode(false)
  }

  const removeCode = async(dataItem) => {
    const response = await ControlledTerminologyCodeDelete(dataItem)
    if(response.status == 200) {
      getTerminologyCode(selectedRow.libraryControlledTerminologyCategoryGuid)
    }
  }
  const handleDeleteCodeFolder = () => {
    removeCode(selectedCodeRow)
    // setStateCode({
    //   ...stateCode,
    //   data: removeItems(stateCode.data, subItemsField, (i) => i.libraryControlledTerminologyGuid === selectedCodeRow.libraryControlledTerminologyGuid),
    // });
  }
  const handleOnCodeSelect = (e) => {
    switch (e.item.data.action) {
      case "detailCodeFolder":
        handleDetailCodeFolder();
        break;
      case "addCodeFolder":
        handleAddCodeFolder();
        break;
      case "addCodeItem":
        handleAddCodeItem();
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

  const getCategaory = async () => {
    showLoader(true)
    const response = await getTerminologyCategory();
    if (response.status == 200) {
      const DisplayOrder = [...response.data.data].sort((a, b) => a.displayOrder - b.displayOrder);

      localStorage.setItem('categoryData', JSON.stringify(DisplayOrder));
      const dataTreeCategory = createDataTree(DisplayOrder, i => i.libraryControlledTerminologyCategoryId, i => i.parentId, subItemsField);
      showLoader(false)
      setStateCategory({
        ...stateCategory,
        data: dataTreeCategory,
      });
    }
  }


  const getTerminologyCode = async (Guid) => {
    showLoaderRight(true)
    const response = await terminologyCodeGetById(Guid);
    if (response.status == 200) {
      const DisplayOrder = [...response.data.data].sort((a, b) => a.displayOrder - b.displayOrder);
      const dataTreeCode = createDataTree(DisplayOrder, i => i.libraryControlledTerminologyId, i => i.parentId, subItemsField);
      showLoaderRight(false);
      setStateCode({
        ...stateCode,
        data: dataTreeCode,
      });
    }
  }
  useEffect(() => {
    getCategaory();
    localStorage.setItem('expandedState', JSON.stringify(expandedState));
    localStorage.setItem('selectedState', JSON.stringify(selectedState));
    localStorage.setItem('itemSelectedState', JSON.stringify(itemSelectedState));

  }, [expandedState])
  return (
    <div className="main">

      <div className={isActive ? 'main_menu sidebar menuexpand' : 'main_menu sidebar'} id="sidebar">
        <div className="main_menu_child">
          <div className="sidebar_top">

            <h4><Link to="/">Arcsine Analytics</Link></h4>
            <Link onClick={() => handleToggle()} to="#" className="sidebar_btn">
              <i
                className={
                  isActive
                    ? "fa-solid fa-circle-arrow-right"
                    : "fa-solid fa-circle-arrow-left"
                }
              ></i>
            </Link>
          </div>
          <div className="sidebar_breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/"><i className="fas fa-sharp fa-light fa-house me-3"></i>
                    <span>Home</span></Link></li>
                <li className="breadcrumb-item-inner link-unexpand"><Link to="/global-standards">\ Global Standards</Link></li>
              </ol>
            </nav>
          </div>
          <ul className="sidebar_list" >
            {/* <li>
              <Link to="/data-standards" className={`${pathName === '/data-standards' ? 'active' : ''}`}>
                <i className="fa-solid fa-database"></i>
                <span>Data Standards</span></Link>
            </li> */}
            <li className={`${splitLocation[1] === 'analysis-standards' ? 'active' : ''}`}>
              <Link to="/analysis-standards" >
                <i className="fas fa-sharp fa-light fa-chart-line"></i>
                <span>Analysis Standards</span></Link>
            </li>
            <li className={`${splitLocation[1] === 'controlledterminology-global' ? 'active' : ''}`} >
              <Link to="/controlledterminology-global" >
                <i className="fas fa-sharp fa-light fa-book-open"></i>
                <span>Controlled Terminology</span></Link>
            </li>
            <li className={`${splitLocation[1] === 'standard-components' ? 'active' : ''}`} >
              <Link to="/standard-components" >
              <i class="fa-solid fa-puzzle-piece"></i>
                <span>Standard Components</span></Link>
            </li>
            



          </ul>
          <div className="sidebar_bottom ">
            <ul
              className="sidebar_list_bottom position-absolute bottom-0 start-0 w-100 "
              style={{ maxHeight: "20vh" }}
            >
              <li title="user-profile">
                <Link
                  to="#"
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                >
                  <i class="fa-solid fa-id-card"></i>
                  <span>User Profile</span>
                </Link>
              </li>
              <li
              //title={`Vesion (${version})`}
              >
                <Link
                  title={`Version (${version})`}
                  to="#"
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                >
                  <i class="fa-solid fa-code-compare"></i>
                  <Version />
                </Link>
              </li>
            </ul>
          </div>

        </div>

      </div>
      <div className={isActive ? ' main_section bodyexpand' : 'main_section'} >

        <section className="main_content" >
          {Loader === true ? <FullScreenLoader /> : ''}
          {LoaderRight === true ? <FullScreenLoaderRight /> : ''}
          <div className='icon-treelist' >
            <Splitter
              style={{
                height: "100%",
              }}
              panes={panes}
              orientation={"horizontal"}
              onChange={(event) => onChange(event, setPanes)}
              scrollable={false}
            >
              <TreeList style={{
                border: 'none',
                maxHeight: '100%',
                overflow: 'auto',
                // width: '720px'
              }} data={extendData(stateCategory.data, selectedState, expandedState)}

                onSelectionChange={onSelectionChange}
                onRowContextMenu={(event) => handleContextMenu(event, openContextMenu, setSelectedRow, offset)}

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
                  maxHeight: '100%',
                  overflow: 'auto',
                }}
                  data={extendData1(stateCode.data, selectedCodeState, expandedState)}
                  onSelectionChange={onCodeSelectionChange}
                  rowRender={RowRender}
                  onRowContextMenu={(event) => handleContextMenu(event, openCodeContextMenu, setSelectedCodeRow, offset)}
                  editField={editField}
                  navigatable={true}
                  selectedField={SELECTED_FIELD}
                  selectable={{
                    enabled: true,
                  }}
                  expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChangeCode} columns={columnsCode}
                />
                :
                <>
                  <TreeList style={{
                    border: 'none',

                    overflow: 'auto',

                  }}
                    noRecords="Please Select Controlled Terminology Category"
                    columns={columnsCodes}
                  />

                </>
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
            <MenuItem
              data={{
                action: "addItem",
              }}
              render={() => (
                <>
                  <img src={fileImg} />
                  Add {selectedRow.libraryControlledTerminologyCategoryNameShort} Item
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
            <MenuItem
              data={{
                action: "addCodeItem",
              }}
              render={() => (
                <>
                  <img src={fileImg} />
                  Add {selectedCodeRow.libraryControlledTerminologyNameShort} Item
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
                    "libraryControlledTerminologyCategoryId": "5301685A-DD05-452C-88B2-1E8FCEC97156",
                    "companyId": 1,
                    "isSystem": false,
                    "parentId": null,
                    "parentGuid": "",
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
                    "libraryControlledTerminologyId": 250,
                    "libraryControlledTerminologyGuid": "F6F7E6B4-742E-4035-A5D6-705C33AA47CD",
                    "libraryControlledTerminologyCategoryId": 1,
                    "parentId": null,
                    "parentGuid": "",
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
              cancel={() => setShowCodePop(false)}
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
          {/* {(showDetail || detailFile) && (
            <ControlledDetailDialog selectedRow={selectedRow} title={selectedRow.libraryControlledTerminologyCategoryNameShort} id={selectedRow.libraryControlledTerminologyCategoryId} cancel={cancelDetail} />
          )}
          {(showCodeDetail) && (
            <ControlledCodeDetailDialog selectedRow={selectedCodeRow} cancel={cancelCodeDetail} />
          )} */}
        </section>
      </div>

      <div class={`modal fade  ${showAddPopup ? 'show d-block' : ''} `} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add Controlled Terminology Category {isFolder ? 'Folder' : 'File'}</h5>
              <button type="button" class="btn-close" id='close_add_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                resetForm();
                formikAdd.resetForm();
                setShowAddPopup(false)
              }}></button>
            </div>
            <div class="modal-body">
              <form onSubmit={formikAdd.handleSubmit}>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" className={`form-control ${formikAdd.touched.shortName &&
                      formikAdd.errors.shortName
                      ? "is-invalid"
                      : ""
                      }`} id='shortName' name='shortName' onBlur={formikAdd.handleBlur} onChange={formikAdd.handleChange} value={formikAdd.values.shortName} />
                    {formikAdd.touched.shortName &&
                      formikAdd.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formikAdd.errors.shortName}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' onBlur={formikAdd.handleBlur} onChange={formikAdd.handleChange} value={formikAdd.values.longName} />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' onBlur={formikAdd.handleBlur} onChange={formikAdd.handleChange} value={formikAdd.values.desc} />
                </div>
                <div className={`form-check form-switch mb3 ${isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsExtendable(e.target.checked)} checked={isExtendable} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Extendable</label>
                </div>
                <div className="d-flex mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={!isExtendable && !formikAdd.dirty}
                  >
                    {btnLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      ""
                    )}
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={()=> {
                      formikAdd.resetForm()
                      setIsExtendable(false)
                    }}
                    disabled={!isExtendable && !formikAdd.dirty}
                  >
                    Discard
                  </button>
                </div>
                {/* <button type="submit" class="btn btn-primary">Save</button> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class={`modal fade  ${showAddPopupCode ? 'show d-block' : ''} `} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add Controlled Terminology Code {isFolderCode ? 'Folder' : 'File'}</h5>
              <button type="button" class="btn-close" id='close_add_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                resetForm();
                formikAddCode.resetForm();
                setShowAddPopupCode(false);
                setIsCustom(false);
                setIsHidden(false);
              }}></button>
            </div>
            <div class="modal-body">
              <form onSubmit={formikAddCode.handleSubmit}>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" className={`form-control ${formikAddCode.touched.shortName &&
                      formikAddCode.errors.shortName
                      ? "is-invalid"
                      : ""
                      }`} id='shortName' name='shortName' onBlur={formikAddCode.handleBlur} onChange={formikAddCode.handleChange} value={formikAddCode.values.shortName} />
                    {formikAddCode.touched.shortName &&
                      formikAddCode.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formikAddCode.errors.shortName}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div class="col">
                                      <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' onBlur={formikAddCode.handleBlur} onChange={formikAddCode.handleChange} value={formikAddCode.values.longName} />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' onBlur={formikAddCode.handleBlur} onChange={formikAddCode.handleChange} value={formikAddCode.values.desc} />
                </div>
                <div className={`form-check form-switch mb3 ${isFolderCode ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsCustom(e.target.checked)} checked={isCustom} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Is Custom</label>
                </div>
                <div className={`form-check form-switch mb3 ${isFolderCode ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsHidden(e.target.checked)} checked={isHidden} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Is Hidden</label>
                </div>
                <div className="d-flex mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={(!isHidden && !isCustom && !formikAddCode.dirty)}
                  >
                    {btnLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      ""
                    )}
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={() => {
                      formikAddCode.resetForm()
                      setIsCustom(false);
                      setIsHidden(false);
                    }}
                    disabled={(!isHidden && !isCustom && !formikAddCode.dirty)}
                  >
                    Discard
                  </button>
                </div>
                {/* <button type="submit" class="btn btn-primary">Save</button> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div class={`modal fade  ${showAddPopupCode ? 'show d-block' : ''} `} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Controlled Terminology Category</h5>
              <button type="button" class="btn-close" id='close_add_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                resetForm();
                setShowAddPopupCode(false)
              }}></button>
            </div>
            <div class="modal-body">
              <form onSubmit={formikAddCode.handleSubmit}>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" class="form-control" id='shortName' name='shortName' onChange={(e) => setShortName(e.target.value)} value={shortName} />
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' onChange={(e) => setLongName(e.target.value)} value={longName} />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' onChange={(e) => setDesc(e.target.value)} value={desc} />
                </div>
                <div class="form-check form-switch mb3">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsExtendable(e.target.checked)} checked={isExtendable} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Extendable</label>
                </div>

                <button type="submit" class="btn btn-primary">Save</button>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      <div className={`modal fade  ${showUpdatePopup ? 'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Update Controlled Terminology Category {selectedRow.isFolder ? 'Folder' : 'File'}</h5>
              <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setShowUpdatePopup(false)
                resetForm();
                formikUpdate.resetForm();
              }}></button>
            </div>
            <div class="modal-body">
              <form onSubmit={formikUpdate.handleSubmit}>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" className={`form-control ${formikUpdate.touched.shortName &&
                      formikUpdate.errors.shortName
                      ? "is-invalid"
                      : ""
                      }`} id='shortName' name='shortName' onBlur={formikUpdate.handleBlur} onChange={formikUpdate.handleChange} value={formikUpdate.values.shortName} />
                    {formikUpdate.touched.shortName &&
                      formikUpdate.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formikUpdate.errors.shortName}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' onBlur={formikUpdate.handleBlur} onChange={formikUpdate.handleChange} value={formikUpdate.values.longName} />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' onBlur={formikUpdate.handleBlur} onChange={formikUpdate.handleChange} value={formikUpdate.values.desc} />
                </div>
                <div className={`form-check form-switch mb3 ${selectedRow.isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" name='isExtendable' id="flexSwitchCheckChecked" onChange={(e) => setIsExtendable(e.target.checked)} checked={isExtendable} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Extendable</label>
                </div>
                <div className="d-flex mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={((selectedRow.isExtendable == isExtendable) && !formikUpdate.dirty)}
                  >
                    {btnLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      ""
                    )}
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={()=>{
                      formikUpdate.resetForm();
                      setIsExtendable(selectedRow.isExtendable ? true : false);
                    }}
                    disabled={((selectedRow.isExtendable == isExtendable) && !formikUpdate.dirty)}

                  >
                    Discard
                  </button>
                </div>
                {/* <button type="submit" class="btn btn-primary">Save</button> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal fade  ${showUpdatePopupCode ? 'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Update Controlled Terminology Code</h5>
              <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setShowUpdatePopupCode(false);
                resetForm();
                formikCode.resetForm();
                console.log('selectedCodeRow', selectedCodeRow);
              }}></button>
            </div>
            <div class="modal-body">
              <form onSubmit={formikCode.handleSubmit}>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" className={`form-control ${formikCode.touched.shortName &&
                      formikCode.errors.shortName
                      ? "is-invalid"
                      : ""
                      }`} id='shortName' name='shortName' onBlur={formikCode.handleBlur} onChange={formikCode.handleChange} value={formikCode.values.shortName} />
                    {formikCode.touched.shortName &&
                      formikCode.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formikCode.errors.shortName}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' onBlur={formikCode.handleBlur} onChange={formikCode.handleChange} value={formikCode.values.longName} />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' onBlur={formikCode.handleBlur} onChange={formikCode.handleChange} value={formikCode.values.desc} />
                </div>
                <div className={`form-check form-switch mb3 ${selectedCodeRow.isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsCustom(e.target.checked)} checked={isCustom} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Is Custom</label>
                </div>
                <div className={`form-check form-switch mb3 ${selectedCodeRow.isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsHidden(e.target.checked)} checked={isHidden} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Is Hidden</label>
                </div>
                <div className="d-flex mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={(isHidden == selectedCodeRow.isHidden && isCustom === selectedCodeRow.isCustom && !formikCode.dirty) || btnLoading}
                  >
                    {btnLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      ""
                    )}
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={() => { 
                      formikCode.resetForm();
                      setIsCustom(selectedCodeRow.isCustom ? true : false);
                      setIsHidden(selectedCodeRow.isHidden ? true : false);
                     }}
                    disabled={(isHidden == selectedCodeRow.isHidden && isCustom === selectedCodeRow.isCustom && !formikCode.dirty) || btnLoading}
                  >
                    Discard
                  </button>
                </div>
                {/* <button type="submit" class="btn btn-primary">Save</button> */}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={`modal fade  ${showUpdatePopup ? 'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Controlled Terminology Category</h5>
              <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setShowUpdatePopup(false)
                resetForm();
              }}></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => handleUpdateParent(e)}>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" class="form-control" id='shortName' name='shortName' onChange={(e) => setShortName(e.target.value)} value={shortName} />
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' onChange={(e) => setLongName(e.target.value)} value={longName} />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' onChange={(e) => setDesc(e.target.value)} value={desc} />
                </div>
                <div class="form-check form-switch mb3">
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsExtendable(e.target.checked)} checked={isExtendable} />
                  <label class="form-check-label" for="flexSwitchCheckChecked">Extendable</label>
                </div>
                <div className="d-flex mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}

      <div className={`modal fade  ${showDetail ? 'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">View Controlled Terminology Category {selectedRow.isFolder ? 'Folder' : 'File'}</h5>

              <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setShowDetail(false)
                resetForm();
              }}></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" class="form-control" id='shortName' name='shortName' value={selectedRow.libraryControlledTerminologyCategoryNameShort} readOnly />
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' value={selectedRow.libraryControlledTerminologyCategoryNameLong} readOnly />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' value={selectedRow.libraryControlledTerminologyCategoryDescription} readOnly />
                </div>
                <div className={`form-check form-switch mb3 ${selectedRow.isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsExtendable(e.target.checked)} checked={selectedRow.isExtendable} disabled/>
                                  <label class="form-check-label" for="flexSwitchCheckChecked">Extendable</label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal fade  ${showCodeDetail ? 'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">View Controlled Terminology Code</h5>
              <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setShowCodeDetail(false)
              }}></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                    <input type="text" class="form-control" id='shortName' name='shortName' value={selectedCodeRow.libraryControlledTerminologyNameShort} readOnly />
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                    <input type="text" class="form-control" id='longName' name='longName' value={selectedCodeRow.libraryControlledTerminologyNameLong} readOnly />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                  <input type="text" class="form-control" id="desc" name='desc' value={selectedCodeRow.libraryControlledTerminologyDescription} readOnly />
                </div>
                <div className={`form-check form-switch mb3 ${selectedCodeRow.isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsCustom(e.target.checked)} checked={selectedCodeRow.isCustom} disabled/>
                  <label class="form-check-label" for="flexSwitchCheckChecked">Is Custom</label>
                </div>
                <div className={`form-check form-switch mb3 ${selectedCodeRow.isFolder ? 'd-none' : ''}`}>
                  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsHidden(e.target.checked)} checked={selectedCodeRow.isHidden} disabled/>
                  <label class="form-check-label" for="flexSwitchCheckChecked">Is Hidden</label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlledTerminology

// const UpdateForm = ({formik, show, setShow}) => {
//   return (
//     <div className={`modal fade  ${show ? 'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//     <div class="modal-dialog">
//       <div class="modal-content">
//         <div class="modal-header">
//           <h5 class="modal-title" id="exampleModalLabel">Controlled Terminology Category</h5>
//           <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={() => {
//             setShow(false)
//             formik.resetForm();
//           }}></button>
//         </div>
//         <div class="modal-body">
//           <form onSubmit={formik.handleSubmit}>
//             <div class="row mb-3">
//               <div class="col">
//                 <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
//                 <input type="text" class="form-control" id='shortName' name='shortName' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.shortName} />
//               </div>
//               <div class="col">
//                 <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
//                 <input type="text" class="form-control" id='longName' name='longName' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.longName} />
//               </div>
//             </div>
//             <div class="mb-3">
//               <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
//               <input type="text" class="form-control" id="desc" name='desc' onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.desc} />
//             </div>
//             <div class="form-check form-switch mb3">
//               <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={(e) => setIsExtendable(e.target.checked)} checked={isExtendable} />
//               <label class="form-check-label" for="flexSwitchCheckChecked">Extendable</label>
//             </div>
//             <div className="d-flex mt-4">
//               <button
//                 type="submit"
//                 className="btn btn-primary w-100 mt-2 me-2"
//                 disabled={!formik.dirty}
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-outline-primary w-100 mt-2"
//                 onClick={formik.resetForm}
//                 disabled={!formik.dirty}
//               >
//                 Discard
//               </button>
//             </div>
//             {/* <button type="submit" class="btn btn-primary">Save</button> */}
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
//   )
// }
