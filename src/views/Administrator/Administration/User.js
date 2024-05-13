// import React, { useEffect, useState } from 'react'
import TreelistDemoSideBar from "../../TreelistDemo/TreelistDemoSideBar";
import { Users_Permission, VariablesData, analysisSet, treatments,LoginAtmp, PassWordReset } from '../../../flat-data';

import { Switch } from "@progress/kendo-react-inputs";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
// import axios from 'axios'
import {
  TreeList,
  createDataTree,
  extendDataItem,
  getSelectedState,
  mapTree,
  removeItems,
} from "@progress/kendo-react-treelist";

import folderImg from "../../../assets/images/folder2.svg";
import fileImg from "../../../assets/images/file.svg";
import {
  ContextMenu,
  MenuItem,
  Splitter,
  SplitterPane,
  TabStrip,
  TabStripTab,
} from "@progress/kendo-react-layout";
// import { TerminologyCode } from '../../terminologyCode';
import { getter } from "@progress/kendo-react-common";

import React, { useEffect, useState } from "react";
import Header from "../../Header";
import ControlledDetailDialog from "../../TreelistDemo/AddEditTreelist/ControlledDetailDialog";
import IconAddDialog from "../../TreelistDemo/AddEditTreelist/IconAddDialog";
//import IconAddParent from '../../AddEditTreelist/IconAddParent';
import IconAddParent from "../../TreelistDemo/AddEditTreelist/IconAddParent";

import IconEditingDialog from "../../TreelistDemo/AddEditTreelist/IconEditingDialog";
import axios from "axios";
import CustomCell from "../../../components/common/CustomCell";
import RowRender from "../../../components/common/RowRender";
import { handleContextMenu, onChange } from "../../../utils/common-helper";
import ControlledCodeDetailDialog from "../../TreelistDemo/AddEditTreelist/ControlledCodeDetailDialog";
import { Link, NavLink, useLocation } from "react-router-dom";
import FullScreenLoader from "../../../utils/Loaders/FullScreenLoader";
import FullScreenLoaderRight from "../../../utils/Loaders/FullScreenLoaderRight";
import MainLayout from "../../../components/layout/MainLayout";
import Version from "../../../components/layout/Version";
import SapTreeList from "../../statistical-analysis-plan/SapTreeList";
import Permission from "./Permission";
import LoginAttemps from "./LoginAttemps";
import PasswordChange from "./PasswordChange";
import AdminSidebar from "./AdminSidebar";

const expandField = "expanded";
const subItemsField = "employees";
const editField = "inEdit";
const DATA_ITEM_KEY = "userId";
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

const User = () => {
  const version = process.env.REACT_APP_VERSION;
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const [showDetail, setShowDetail] = React.useState(false);
  const [showCodeDetail, setShowCodeDetail] = React.useState(false);

  const [Loader, showLoader] = React.useState(false);
  const [LoaderRight, showLoaderRight] = React.useState(false);
  const [showCode, setShowCode] = React.useState(false);
  const [openAddItem, setOpenAddItem] = React.useState(false);
  const [openAddItemCode, setOpenAddItemCode] = React.useState(false);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [showCodeContext, setShowCodeContext] = React.useState(false);
  const [isChange, setIsChange] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
  const [selectedCodeRow, setSelectedCodeRow] = React.useState([
    { parentId: null },
  ]);
  const [newData, setNewData] = React.useState({});
  const [showSelected, setShowSelected] = React.useState(false);
  const [uniqueId, setUniqueId] = React.useState("");
  const [detailFile, setDetailFile] = React.useState(false);
  const [showPop, setShowPop] = React.useState(false);
  const [showCodePop, setShowCodePop] = React.useState(false);
  const [showEditPop, setShowEditPop] = React.useState(false);
  const [showEditCodePop, setShowEditCodePop] = React.useState(false);
  const [type, setType] = React.useState("");
  const [folderName, setFolderName] = React.useState();
  const [fileName, setFileName] = React.useState();
  const [standardName, setStandardName] = React.useState("");
  const [isActive, setActive] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = React.useState(false);
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [isCode, setCode] = React.useState(false);
  const [parentId, setParentId] = React.useState(null);
  const [isExtendable, setIsExtendable] = React.useState(false);
  const [isFolder, setIsFolder] = React.useState(true);
  const [isGeneral, setIsGeneral] = React.useState(true);
  const [isLoginPassword, setIsLoginPassword] = React.useState(false);
  const [isPermission, setIsPermission] = React.useState(false);
  const [selected, setSelected] = React.useState(0);
  const handleSelect = (e) => {
    setSelected(e.selected);
  };

  // Add parent
  const [shortName, setShortName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [longName, setLongName] = useState("");
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState()
  const [countryNumber, setCountryNumber] = useState(1)
  const [accountGroupName, setAccountGroupName] = useState('')


  const [desc, setDesc] = useState("");

  const resetForm = () => {
    setShortName("");
    setLongName("");
    setDesc("");
    setIsExtendable(false);
    setIsFolder(true);
    setParentId(null);
    setCode(false);
  };
  const handleAddParent = (e) => {
    if (isCode) {
      handleAddCodeParent(e);
    } else {
      let closeBtn = document.getElementById("close_add_parent");
      e.preventDefault();
      const reqBody = {
        libraryControlledTerminologyCategoryId: 0,
        libraryControlledTerminologyCategoryGuid: "",
        companyId: 1,
        isSystem: true,
        parentId: parentId,
        isFolder: isFolder,
        libraryControlledTerminologyCategoryNameShort: shortName,
        libraryControlledTerminologyCategoryNameLong: longName,
        libraryControlledTerminologyCategoryDescription: desc,
        isExtendable: isExtendable,
        iconId: 0,
        displayOrder: 0,
      };
      showLoader(true);
      axios
        .post(
          "http://dataarcapi.com/api/LibraryControlledTerminologyCategory/Add",
          reqBody
        )
        .then((response) => {
          console.log("response", response);
          getCategaory();
          resetForm();
          showLoader(false);
          closeBtn.click();
        });
    }
  };
 
  const toggleDialog = () => {
    setVisible(!visible);
  };
  const handleToggle = () => {
    setActive(!isActive);
  };

  const [rowId, setRowId] = React.useState("");
  const categoryData = JSON.parse(localStorage.getItem("categoryData")) || [];
  const dataTreeCate = createDataTree(
    categoryData,
    (i) => i.companyId,
    (i) => i.userId,
    subItemsField
  );
  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCate],
    itemInEdit: undefined,
  });

  const [selectedState, setSelectedState] = React.useState({});
  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });

  const offset = React.useRef({
    left: 0,
    top: 0,
  });

  const openContextMenu = (dataItem) => {
    console.log("dat", dataItem);
    if (dataItem.parentId == null) {
      setShowFolderItem(true);
    } else if (
      dataItem.parentId != null &&
      dataItem.hasOwnProperty("employees")
    ) {
      setShowFolderItem(true);
    } else {
      setShowFolderItem(true);
    }
  };
  const openCodeContextMenu = (dataItem) => {
    setShowCodeContext(true);
    if (dataItem.parentId == null) {
    }
  };
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
  

  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      Object.keys(newSelectedState).forEach((key) => {
        if (key !== event.dataItem.standardComponentUniqueId) {
          delete newSelectedState[key];
        }
      });
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
    },
  ]);

  const onCategoryRowClick = (event, props) => {
    if (rowId === props.id) {
      return false;
    }
    setShowCode(true);
    setRowId(props.id);
    props.selectionChange(event);
    setNewData(props.dataItem);
    setShowSelected(true);
    setFirstName(props.dataItem.userNameFirst)
    setLastName(props.dataItem.userNameLast)
    setEmail(props.dataItem.userEmail)
    setPhoneNumber( props.dataItem.userPhoneNumber)
    setCountryNumber( props.dataItem.userPhoneCountry)
    setAccountGroupName( props.dataItem.accountGroupName)
    setStandardName(
      props.dataItem.libraryControlledTerminologyCategoryNameShort
    );
    setSelectedRow(props.dataItem);
    setUniqueId(props.dataItem.libraryControlledTerminologyCategoryId);
  };
  

  const addFolder = () => {
    // if (!selectedRow.hasOwnProperty('employees')) {
    //   selectedRow.employees = []
    // }
    // selectedRow.employees.push(
    //   {
    //     "libraryControlledTerminologyCategoryId": selectedRow.libraryControlledTerminologyCategoryId,
    //     "libraryControlledTerminologyCategoryId": "5301685A-DD05-452C-88B2-1E8FCEC97156",
    //     "companyId": 1,
    //     "isSystem": false,
    //     "parentId": selectedRow.libraryControlledTerminologyCategoryId,
    //     // "parentId": '5301685A-DD05-452C-88B2-1E8FCEC97172',
    //     "isFolder": false,
    //     "libraryControlledTerminologyCategoryNameShort": folderName,
    //     "libraryControlledTerminologyCategoryNameLong": "Covariance Matrix",
    //     "libraryControlledTerminologyCategoryDescription": "Covariance Matrix",
    //     "isExtendable": false,
    //     "iconId": null,
    //     "displayOrder": 1,
    //   }
    // )
    // setStateCategory({
    //   ...stateCategory,
    //   itemInEdit: undefined,
    //   data: mapTree(stateCategory.data, subItemsField,
    //     (item) =>
    //       item.libraryControlledTerminologyCategoryId === selectedRow.libraryControlledTerminologyCategoryId ? selectedRow : item
    //   )
    // });
    // setShowPop(false)
  };
  

  const handleGeneral = () => {
    setIsGeneral(true);
    setIsPermission(false);
    setIsLoginPassword(false);
  };
  const handlePermission = () => {
    setIsPermission(true);
    setIsGeneral(false);
    setIsLoginPassword(false);
  };
  const handleLoginPassword = () => {
    setIsLoginPassword(true);
    setIsGeneral(false);
    setIsPermission(false);
  };

  const columnsCategory = [
    {
      field: "userNameFirst",
      title: "Controlled Terminology Category",
      expandable: true,
      width: "500px",
      cell: (props) => (
        <CustomCell {...props} onRowClick={onCategoryRowClick} />
      ),
      headerCell: () => {
        return (
          <th
            style={{
              top: "0px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <td>User</td>
            <td style={{ border: "none" }}>
              <button
                className="me-2"
                style={{ border: "none" }}
                onClick={() => {
                  setCode(false);
                  setShowAddPopup(true);
                  setParentId(null);
                  setIsFolder(true);
                  // setOpenAddItem(true);
                  // setType('folder');
                }}
              >
                <i
                  className="k-icon k-i-folder-add k-color-dark"
                  title="Add Folder"
                ></i>
              </button>
              <button
                style={{ border: "none" }}
                onClick={() => {
                  setCode(false);
                  setShowAddPopup(true);
                  setParentId(null);
                  setIsFolder(false);
                }}
              >
                <i
                  className="k-icon k-i-file-add k-color-dark"
                  title="Add File"
                ></i>
              </button>
            </td>
          </th>
        );
      },
    },
  ];

  

  const handleDetailFolder = () => {
    setShowDetail(true);
  };
  const cancelPop = () => {
    setShowPop(false);
  };
  const cancelDetail = () => {
    setShowDetail(false);
    setDetailFile(false);
  };
  const cancelCodeDetail = () => {
    setShowCodeDetail(false);
    // setDetailFile(false)
  };
  const handleAddFolder = () => {
    setIsFolder(true);
    setShowAddPopup(true);
    setParentId(selectedRow.libraryControlledTerminologyCategoryId);
  };
  const handleAddItem = () => {
    setIsFolder(false);
    setShowAddPopup(true);
    setParentId(selectedRow.libraryControlledTerminologyCategoryId);
  };
  const save = (itemInEdit) => {
    setShowEditPop(false);

    setStateCategory({
      ...stateCategory,
      itemInEdit: undefined,
      data: mapTree(stateCategory.data, subItemsField, (item) =>
        itemInEdit.libraryControlledTerminologyCategoryId ===
        item.libraryControlledTerminologyCategoryId
          ? itemInEdit
          : item
      ),
    });
  };
  const saveCode = (itemInEdit) => {
    setShowEditCodePop(false);
    setStateCode({
      ...stateCode,
      itemInEdit: undefined,
      data: mapTree(stateCode.data, subItemsField, (item) =>
        itemInEdit.libraryControlledTerminologyGuid ===
        item.libraryControlledTerminologyGuid
          ? itemInEdit
          : item
      ),
    });
  };
  const edit = (dataItem) => {
    setStateCategory({
      ...stateCategory,
      itemInEdit: extendDataItem(dataItem, subItemsField),
    });
  };
  const handleEditFolder = () => {
    setShowUpdatePopup(true);
    setShortName(selectedRow.libraryControlledTerminologyCategoryNameShort);
    setLongName(selectedRow.libraryControlledTerminologyCategoryNameLong);
    setDesc(selectedRow.libraryControlledTerminologyCategoryDescription);
  };
  const handleUpdateParent = (e) => {
    if (isCode) {
      handleUpdateCodeParent(e);
    } else {
      let closeBtn = document.getElementById("close_edit_parent");
      e.preventDefault();
      const reqBody = {
        libraryControlledTerminologyCategoryId:
          selectedRow.libraryControlledTerminologyCategoryId,
        libraryControlledTerminologyCategoryGuid:
          selectedRow.libraryControlledTerminologyCategoryGuid,
        companyId: 1,
        isSystem: true,
        parentId: 0,
        isFolder: selectedRow.isFolder,
        libraryControlledTerminologyCategoryNameShort: shortName,
        libraryControlledTerminologyCategoryNameLong: longName,
        libraryControlledTerminologyCategoryDescription: desc,
        isExtendable: isExtendable,
        iconId: 0,
        displayOrder: 0,
      };
      showLoader(true);
      axios
        .put(
          "http://dataarcapi.com/api/LibraryControlledTerminologyCategory/Update",
          reqBody
        )
        .then((response) => {
          console.log("response", response);
          getCategaory();
          showLoader(false);
          closeBtn.click();
        });
    }
  };
  const remove = (dataItem) => {
    showLoader(true);
    axios
      .delete(
        `http://dataarcapi.com/api/LibraryControlledTerminologyCategory/Delete?LibraryControlledTerminologyCategoryId=${dataItem.libraryControlledTerminologyCategoryId}`
      )
      .then((response) => {
        getCategaory();
        showLoader(false);
      });
  };
  const handleDeleteFolder = () => {
    remove(selectedRow);
  };

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

  
  
  

  const getCategaory = () => {
    showLoader(true);
    axios
    .get("http://dataarcapi.com/api/AccountUser/GetAll")
      //.get("http://dataarcapi.com/api/ControlledTerminology/GetAll")
      .then((response) => {
        localStorage.setItem("userData", JSON.stringify(response.data.data));
        const dataTreeCategory = createDataTree(
          response.data.data,
          (i) => i.userId,
          (i) => i.parentId,
          subItemsField
        );
        showLoader(false);
        setStateCategory({
          ...stateCategory,
          data: dataTreeCategory,
        });
      });
  };
  
  
  useEffect(() => {
    getCategaory();
  }, []);
  const [file, setFile] = useState();
  function handleChange(e) {
    console.log(e.target.files);
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  console.log('4',isActive)


  return (
    <div className="main">
     <AdminSidebar setActive ={setActive}/>
      <div className={!isActive ? " main_section bodyexpand" : "main_section"}>
        <section>
          {Loader === true ? <FullScreenLoader /> : ""}
          {LoaderRight === true ? <FullScreenLoaderRight /> : ""}
          <div
            className="icon-treelist"
            style={{ height: "100%", padding: "20px" }}
          >
            <Splitter
              style={{
                maxHeight: "100%",
              }}
              panes={panes}
              orientation={"horizontal"}
              onChange={(event) => onChange(event, setPanes)}
              scrollable={false}
            >
              <TreeList
                style={{
                  border: "none",
                  maxHeight: "94vh",
                  overflow: "auto",
                  // width: '720px'
                }}
                data={extendData(
                  stateCategory.data,
                  selectedState,
                  expandedState
                )}
                onSelectionChange={onSelectionChange}
                // onRowContextMenu={(event) =>
                //   handleContextMenu(
                //     event,
                //     openContextMenu,
                //     setSelectedRow,
                //     offset
                //   )
                // }
                rowRender={RowRender}
                editField={editField}
                navigatable={true}
                selectedField={SELECTED_FIELD}
                selectable={{
                  enabled: true,
                }}
                expandField={expandField}
                subItemsField={subItemsField}
                onExpandChange={onExpandChangeCategory}
                columns={columnsCategory}
              />

              {showSelected ? 
              <div
                style={{ border: "none" }}
                className={
                  `icon-treelist-form ${showSelected ? "Hello" : "d-none"}` || {
                    showSelected,
                  }
                }
              >
                <form
                  // onSubmit={(e) => {
                  //   e.preventDefault();
                  //   handleSubmitData(newData);
                  //   setShowSelected(false);
                  // }}
                  onSubmit={() => {
                    setShowSelected(false);
                  }}
                >
                  <th
                    style={{
                      top: "0px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TabStrip
                      style={{ width: "100%" }}
                      selected={selected}
                      onSelect={handleSelect}
                    >
                      <TabStripTab title="General">
                        <div className="col-md-12">
                          <form>
                            <div className="mt-3">
                              <div class="row mb-3">
                                <div class="col">
                                  <label
                                    htmlFor="exampleInputEmail1"
                                    class="form-label"
                                  >
                                    First Name{" "}
                                    <sup className="text-danger">*</sup>
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="shortName"
                                    name="shortName"
                                    //onBlur={formikSave.handleBlur}
                                    onChange={(e) => {
                                      setFirstName(e.target.value);

                                      //formikSave.handleChange(e);
                                    }}
                                    value={firstName}
                                    //value={formikSave.values.shortName}
                                  />
                                </div>
                                <div class="col">
                                  <label
                                    htmlFor="exampleInputEmail1"
                                    class="form-label"
                                  >
                                    Last Name{" "}
                                    <sup className="text-danger">*</sup>
                                  </label>
                                  <input
                                    type="text"
                                    class="form-control"
                                    id="longName"
                                    name="longName"
                                    onClick={(e) => {
                                      setLastName(e.target.value);
                                    }}
                                    value={lastName}
                                  />
                                </div>
                              </div>
                              <div class="mb-3">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  class="form-label"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  class="form-control"
                                  id="desc"
                                  name="desc"
                                  onClick={(e) => {
                                    setEmail(e.target.value);
                                  }}
                                  value={email}
                                />
                              </div>
                              <div class="mb-3">
                                <label
                                  htmlFor="exampleInputEmail1"
                                  class="form-label"
                                >
                                  Phone Number
                                  <PhoneInput
                                    country={
                                      countryNumber === null
                                        ? "us"
                                        : countryNumber
                                    }
                                    // onChange={(e) => {
                                    //   setPhoneNumber(e.target.value);
                                    // }}
                                    //value={phoneNumber}
                                    inputProps={{
                                      name: "phone",
                                      required: true,
                                      autoFocus: true,
                                    }}
                                  />
                                </label>
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary w-100 mt-2"
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </TabStripTab>
                      <TabStripTab title="Permissions">
                        <div className="col-md-12">
                          <div className="mb-3" style={{ border: "none" }}>
                            <h6
                              style={{
                                backgroundColor: "#f1f1f1",
                                borderTop: "2px solid gray",
                                borderBottom: "2px solid gray",
                                padding: "10px 0px 10px 5px",
                              }}
                              htmlFor="standardName"
                              className="form-label"
                            >
                              Global Roles
                            </h6>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-3" style={{ border: "none" }}>
                              <p> Super Admin</p>
                              <Switch
                                className="switchFirst"
                                checked={
                                  accountGroupName === "SuperAdmin"
                                    ? true
                                    : false
                                }
                                onLabel={"Super Admin"}
                                offLabel={"Super Admin"}
                              />
                              <div className="row mt-3">
                                {/* <p> Global Librarian</p>

                                <div className="col-md-4 k-mr-6 ">
                                  <Switch
                                    className="switchSecond"
                                    checked={accountGroupName === 'Global Librarian' ? true : false}
                                    onLabel={"Global Librarian"}
                                    offLabel={"Global Librarian"}
                                  />
                                </div> */}

                                <div className="col-md-4 k-mr-6 ">
                                <p> Global Librarian</p>

                                  <Switch
                                    className="switchSecond"
                                    checked={
                                      accountGroupName === "Global Librarian"
                                        ? true
                                        : false
                                    }
                                    onLabel={"Global Librarian"}
                                    offLabel={"Global Librarian"}
                                  />
                                </div>


                                <div className="col-md-4">
                                <p> Base User </p>

                                  <Switch
                                    className="switchThird k-switch-track"
                                    checked={
                                      accountGroupName === "Base User"
                                        ? true
                                        : false
                                    }
                                    onLabel={"Base User"}
                                    offLabel={"Base User"}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3"></div>

                          <div>
                            <Permission
                              title="Permissions"
                              data={Users_Permission}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100 mt-4"
                          >
                            Save
                          </button>
                        </div>
                      </TabStripTab>
                      <TabStripTab title="Login/Password">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3" style={{ border: "none" }}>
                              <label
                                htmlFor="standardName"
                                className="form-label"
                              >
                                Password Last Modified
                              </label>
                              <div className="row">
                                <div className="col-sm-4">
                                  <p
                                    style={{
                                      border: "1px solid gray",
                                      padding: "5px",
                                    }}
                                  >
                                    23-02-10, 10:57 AM
                                  </p>
                                </div>
                                <div className="col-sm-4">
                                  <button
                                    className="btn btn-primary"
                                    style={{
                                      fontSize: "16px",
                                      padding: "5px",
                                      width: "150px",
                                    }}
                                  >
                                    Reset Password
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div>
                              <LoginAttemps
                                title="Login Attemps"
                                data={LoginAtmp}
                              />
                            </div>
                            <div style={{ marginTop: "40px" }}>
                              <PasswordChange
                                title="Password Reset"
                                data={PassWordReset}
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary w-100 mt-4"
                          >
                            Save
                          </button>
                        </div>
                      </TabStripTab>
                    </TabStrip>
                  </th>
                </form>
              </div>
              : 
              <div style={{padding:"15px 5px", backgroundColor:'#fafafa'}}>
                  <h6 style={{textAlign:'center'}}>Please Select User</h6>
                  </div>
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
                  Add{" "}
                  {
                    selectedRow.libraryControlledTerminologyCategoryNameShort
                  }{" "}
                  Folder
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
                  Add{" "}
                  {
                    selectedRow.libraryControlledTerminologyCategoryNameShort
                  }{" "}
                  Item
                </>
              )}
            />
          </ContextMenu>
          <ContextMenu show={showCodeContext} offset={offset.current}>
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
                  Add {
                    selectedCodeRow.libraryControlledTerminologyNameShort
                  }{" "}
                  Folder
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
                  Add {
                    selectedCodeRow.libraryControlledTerminologyNameShort
                  }{" "}
                  Item
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
                  data: [
                    ...stateCategory.data,
                    {
                      libraryControlledTerminologyCategoryId: 500,
                      libraryControlledTerminologyCategoryId:
                        "5301685A-DD05-452C-88B2-1E8FCEC97156",
                      companyId: 1,
                      isSystem: false,
                      parentId: null,
                      isFolder: false,
                      libraryControlledTerminologyCategoryNameShort: folderName,
                      libraryControlledTerminologyCategoryNameLong:
                        "Covariance Matrix",
                      libraryControlledTerminologyCategoryDescription:
                        "Covariance Matrix",
                      isExtendable: false,
                      iconId: null,
                      displayOrder: 1,
                    },
                  ],
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
                  data: [
                    ...stateCode.data,
                    {
                      libraryControlledTerminologyId: 250,
                      libraryControlledTerminologyGuid:
                        "F6F7E6B4-742E-4035-A5D6-705C33AA47CD",
                      libraryControlledTerminologyCategoryId: 1,
                      parentId: null,
                      isFolder: false,
                      libraryControlledTerminologyNameShort: folderName,
                      libraryControlledTerminologyNameLong: "Unstructured",
                      libraryControlledTerminologyDescription: "Unstructured",
                      isCustom: false,
                      isHidden: false,
                      displayOrder: 1,
                    },
                  ],
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
          {(showDetail || detailFile) && (
            <ControlledDetailDialog
              selectedRow={selectedRow}
              title={selectedRow.libraryControlledTerminologyCategoryNameShort}
              id={selectedRow.libraryControlledTerminologyCategoryId}
              cancel={cancelDetail}
            />
          )}
          {showCodeDetail && (
            <ControlledCodeDetailDialog
              selectedRow={selectedCodeRow}
              cancel={cancelCodeDetail}
            />
          )}
        </section>
      </div>
      <div
        class={`modal fade  ${showAddPopup ? "show d-block" : ""} `}
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Icons
              </h5>
              <button
                type="button"
                class="btn-close"
                id="close_add_parent"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  resetForm();
                  setShowAddPopup(false);
                }}
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => handleAddParent(e)}>
                {/* <div class="form-check">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={(e) => setIsFolder(true)} checked={isFolder}/>
                      <label class="form-check-label" for="flexRadioDefault1">
                        Folder
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e) => setIsFolder(false)} checked={!isFolder}/>
                      <label class="form-check-label" for="flexRadioDefault2">
                        Item
                      </label>
                    </div> */}
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="shortName"
                      name="shortName"
                      onChange={(e) => setShortName(e.target.value)}
                      value={shortName}
                    />
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Long Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="longName"
                      name="longName"
                      onChange={(e) => setLongName(e.target.value)}
                      value={longName}
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="desc"
                    name="desc"
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                  />
                </div>
                <div class="form-check form-switch mb3">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    onChange={(e) => setIsExtendable(e.target.checked)}
                    checked={isExtendable}
                  />
                  <label class="form-check-label" for="flexSwitchCheckChecked">
                    Extendable
                  </label>
                </div>

                <button type="submit" class="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal fade  ${showUpdatePopup ? "show d-block" : ""} `}
        id="exampleModalEdit"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Icons
              </h5>
              <button
                type="button"
                class="btn-close"
                id="close_edit_parent"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setShowUpdatePopup(false);
                  resetForm();
                }}
              ></button>
            </div>
            <div class="modal-body">
              <form onSubmit={(e) => handleUpdateParent(e)}>
                {/* <div class="form-check">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={(e) => setIsFolder(true)} checked={isFolder} />
                      <label class="form-check-label" for="flexRadioDefault1">
                        Folder
                      </label>
                    </div>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e) => setIsFolder(false)} checked={!isFolder} />
                      <label class="form-check-label" for="flexRadioDefault2">
                        Item
                      </label>
                    </div> */}
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="shortName"
                      name="shortName"
                      onChange={(e) => setShortName(e.target.value)}
                      value={shortName}
                    />
                  </div>
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Long Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="longName"
                      name="longName"
                      onChange={(e) => setLongName(e.target.value)}
                      value={longName}
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="desc"
                    name="desc"
                    onChange={(e) => setDesc(e.target.value)}
                    value={desc}
                  />
                </div>
                <div class="form-check form-switch mb3">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                    onChange={(e) => setIsExtendable(e.target.checked)}
                    checked={isExtendable}
                  />
                  <label class="form-check-label" for="flexSwitchCheckChecked">
                    Extendable
                  </label>
                </div>
                <button type="submit" class="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
