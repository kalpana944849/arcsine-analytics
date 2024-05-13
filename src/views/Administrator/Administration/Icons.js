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
import { ContextMenu, MenuItem, Splitter } from "@progress/kendo-react-layout";
import { getter } from "@progress/kendo-react-common";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomCellIcons from "../../../components/common/CustomCellIcons";
import RowRender from "../../../components/common/RowRender";
import { handleContextMenu, onChange } from "../../../utils/common-helper";
import { Link, NavLink, useLocation } from "react-router-dom";
import FullScreenLoader from "../../../utils/Loaders/FullScreenLoader";
import Version from "../../../components/layout/Version";
import {
  addSystemIcon,
  deleteSystemIcon,
  systemIcon,
  systemIconById,
  updateSystemIcon,
} from "../../../services/icon-service";
import { useFormik } from "formik";
import iconSchema from "../../../utils/validationSchema/icon-schema";
import SweetAlert from "react-bootstrap-sweetalert";
import IconDetail from "./Icon-Detail/IconDetail";
import AdminSidebar from "./AdminSidebar";

const expandField = "expanded";
const subItemsField = "employees";
const editField = "inEdit";
const DATA_ITEM_KEY = "iconGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const fileInputRef = React.createRef();


const Icons = () => {
  const iconId = localStorage.getItem("expandedItemId") || "";
  const [flag, setFlag] = useState(true);
  const extendData = (dataState, selectedState, expandedState) => {
    return mapTree(dataState, subItemsField, (item) => {
      if (flag && item.iconId == iconId) {
        return extendDataItem(item, subItemsField, {
          selected: selectedState[idGetter(item)],
          expanded: true,

        });

      }
      return extendDataItem(item, subItemsField, {
        selected: selectedState[idGetter(item)],
        expanded: expandedState[idGetter(item)],
      });
    });
  };

  const expandIconClick = (dataItem) => {
    if (dataItem.parentId == null) {
      localStorage.setItem("expandedItemId", dataItem.iconId);
      setFlag(false);
      console.log('11',dataItem.iconId)
    }
  };

  //const pathName = window.location.pathname;
  const version = process.env.REACT_APP_VERSION;
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const [Loader, showLoader] = React.useState(false);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
  const [newData, setNewData] = React.useState({});
  const [showSelected, setShowSelected] = React.useState(false);
  const [isActive, setActive] = React.useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = React.useState(false);
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [isCode, setCode] = React.useState(false);
  const [parentId, setParentId] = React.useState(null);
  const [parentGuid, setParentGuid] = React.useState(null);
  const [isFolder, setIsFolder] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = useState("")
  const [showDetail, setShowDetail] = React.useState(false);
  const [detailFile, setDetailFile] = React.useState(false);



  // Add parent
  const [shortName, setShortName] = useState("");
  const [longName, setLongName] = useState("");
  const [desc, setDesc] = useState("");
  const [label, setLabel] = useState("");

  const handleToggle = () => {
    setActive(!isActive);
  };

  const [rowId, setRowId] = React.useState("");
  const categoryData = JSON.parse(localStorage.getItem("systemIconData")) || [];
  const dataTreeCate = createDataTree(
    categoryData,
    (i) => i.iconId,
    (i) => i.parentId,
    subItemsField
  );
  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCate],
    itemInEdit: undefined,
  });
  const [state, setState] = React.useState({
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
        if (key !== event.dataItem.iconGuid) {
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
    setRowId(props.id);
    props.selectionChange(event);
    setNewData(props.dataItem);
    setShowSelected(true);
    setSelectedRow(props.dataItem);
    // setFileName(props.dataItem.fileName);
    setFile(`http://${props.dataItem?.s3bucket}/${props.dataItem?.iconUrl}`);
    // getSystemIconById(props.dataItem.iconGuid);
    setShortName(props.dataItem.iconNameShort);
    setLongName(
      props.dataItem.iconNameLong == null ? "" : props.dataItem.iconNameLong
    );
    setDesc(props.dataItem.iconDescription);
    // setDesc(props.dataItem.iconDescription == null ? "" : props.dataItem.iconDescription);
    if (props.dataItem.iconLabel == null) {
      setLabel("");
    } else {
      setLabel(props.dataItem.iconLabel);
    }
  };

  const columnsCategory = [
    {
      field: "iconNameShort",
      title: "Icon Name Short",
      expandable: true,
      width: "500px",
      cell: (props) => (
        <CustomCellIcons
          {...props}
          onRowClick={onCategoryRowClick}
          expandIconClick={expandIconClick}
        />
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
            <td>Icons</td>
            <td style={{ border: "none" }}>
              <button
                className="me-2"
                style={{ border: "none" }}
                onClick={() => {
                  setCode(false);
                  setShowAddPopup(true);
                  setParentId(null);
                  setIsFolder(true);
                  setShowSelected(false);
                  setFile('')
                  // resetForm();
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
                  setShowSelected(false);
                  setFile('')
                  // resetForm();
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
  const cancelDetail = () => {
    setShowDetail(false)
    setDetailFile(false)
  };

  const handleAddFolder = () => {
    setIsFolder(true);
    setShowAddPopup(true);
    setParentId(selectedRow.iconId);
    setParentGuid(selectedRow.parentGuid);
    setShowSelected(false);
    // resetForm()
  };
  const handleAddItem = () => {
    setIsFolder(false);
    setShowAddPopup(true);
    setParentId(selectedRow.iconId);
    setParentGuid(selectedRow.parentGuid);
    setShowSelected(false);
    // resetForm()
  };

  const handleEditFolder = () => {
    setShowUpdatePopup(true);
    setShortName(selectedRow.iconNameShort);
    setLongName(selectedRow.libraryControlledTerminologyCategoryNameLong);
    setDesc(selectedRow.libraryControlledTerminologyCategoryDescription);
  };

  const handleDeleteFolder = async () => {
    showLoader(true);
    const response = await deleteSystemIcon(selectedRow);
    if (response.status == 200) {
      getSystemIcon();
      showLoader(false);
    }
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

  const getSystemIcon = async () => {
    const response = await systemIcon();

    if (response.status == 200) {
      localStorage.setItem(
        "systemIconData",
        JSON.stringify(response.data.data)
      );
      const dataTreeCategory = createDataTree(
        response.data.data,
        (i) => i.iconId,
        (i) => i.parentId,
        subItemsField
      );
      showLoader(false);
      setStateCategory({
        ...stateCategory,
        data: dataTreeCategory,
      });
    }
  };
  const getIconById = async () => {
    const response = await systemIconById(selectedRow.iconGuid);
    if(response.status == 200){
      setSelectedRow(response.data.data)
      setFile(`http://${response.data.data?.s3bucket}/${response.data.data?.iconUrl}`);
    }
  }

  useEffect(() => {
    getSystemIcon();
  }, []);

  const [file, setFile] = useState(selectedRow.iconUrl);
  const [fileName, setFileName] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const resetForm = () => {
    setShortName("");
    setLongName("");
    setDesc("");
    setLabel("");
    setFile("");
    setFileName("");
    handleResetFile();
  };
  const handleResetFile = () => {
    // Create a new file input element
    const newFileInput = document.createElement("input");
    newFileInput.type = "file";
    newFileInput.addEventListener("change", handleChange);

    // Replace the existing file input with the new one
    fileInputRef.current.parentNode.replaceChild(
      newFileInput,
      fileInputRef.current
    );

    // Update the fileInputRef to point to the new input element
    fileInputRef.current = newFileInput;
   
  };
  function handleChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    setFileName(file.name);
    // setBase64Image(reader.result);
    reader.onloadend = () => {
      // When the reader has read the file, set the base64 image data to state
      setBase64Image(reader.result);
    };

    if (file) {
      // Read the file as a data URL, triggering the onloadend event above
      reader.readAsDataURL(file);
    }
    setFile(URL.createObjectURL(e.target.files[0]));
  }

  const formikSave = useFormik({
    initialValues: {
      shortName: shortName,
      longName: longName,
      desc: desc,
      label: label,
    },
    enableReinitialize: true,
    validationSchema: iconSchema,
    onSubmit: async (values, { resetForm }) => {
      let base64WithoutPrefix;
      if (base64Image != "") {
        base64WithoutPrefix = base64Image?.split(",")[1];
      }
      const reqBody = {
        iconId: newData.iconId,
        iconGuid: newData.iconGuid,
        companyId: 1,
        parentId: newData.parentId,
        parentGuid: newData.parentGuid,
        isFolder: newData.isFolder,
        iconNameShort: values.shortName,
        iconNameLong: values.longName,
        iconDescription: values.desc,
        iconLabel: values.label,
        iconUrl: newData.iconUrl,
        displayOrder: 1,
        base64Image: base64WithoutPrefix,
        fileName: fileName,
      };
      setMessage("System Icon has been updated successfully.")
      const response = await updateSystemIcon(reqBody);
      if (response.status == 200) {
        getSystemIcon();
        setShowAlert(true);
        getIconById();
        setFileName("");
        setBase64Image("");
      }
    },
  });
  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      desc: "",
      label: "",
    },
    validationSchema: iconSchema,
    onSubmit: async (values, { resetForm }) => {
      let base64WithoutPrefix;
      if (base64Image != "") {
        base64WithoutPrefix = base64Image?.split(",")[1];
      }
      const reqBody = {
        iconId: 0,
        iconGuid: "",
        companyId: 1,
        parentId: parentId,
        parentGuid: parentGuid,
        isFolder: isFolder,
        iconNameShort: values.shortName,
        iconNameLong: values.longName,
        iconDescription: values.desc,
        iconLabel: values.label,
        iconUrl: null,
        displayOrder: 0,
        base64Image: base64WithoutPrefix,
        fileName: fileName,
      };
      setMessage("System Icon has been added successfully.")
      const response = await addSystemIcon(reqBody);
      if (response.status == 200) {
        getSystemIcon();
        setShowAddPopup(false);
        setFile("");
        resetForm();
        setShowAlert(true);
      }
    },
  });
  return (
    <div className="main">
       <AdminSidebar setActive ={setActive}/>
      <div className={!isActive ? " main_section bodyexpand" : "main_section"}>
        <section className="main_content">
          {Loader === true ? <FullScreenLoader /> : ""}
          <div className="icon-treelist">
            <Splitter
              style={{
                height: "100%",
              }}
              panes={panes}
              orientation={"horizontal"}
              onChange={(event) => onChange(event, setPanes)}
              scrollable={false}
            >
              <TreeList
                style={{
                  border: "none",
                  maxHeight: "100%",
                  overflow: "auto",
                  // width: '720px'
                }}
                data={extendData(
                  stateCategory.data,
                  selectedState,
                  expandedState
                )}
                onSelectionChange={onSelectionChange}
                onRowContextMenu={(event) =>
                  handleContextMenu(
                    event,
                    openContextMenu,
                    setSelectedRow,
                    offset
                  )
                }
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

              <div
                style={{ border: "none" }}
                className={`icon-treelist-form ${showSelected ? "" : "d-none"}`}
              >
                <form
                  onSubmit={(e) => {
                    // setShowSelected(false);
                    // handleUpdate(e);
                    formikSave.handleSubmit();
                    e.preventDefault();
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
                    <td className="mt-2">Selected Icon</td>
                  </th>
                  <div
                    className="mt-3 "
                    style={{ borderTop: "1px solid gray" }}
                  >
                    <div class="row mb-3">
                      <div class="col">
                        <label htmlFor="exampleInputEmail1" class="form-label">
                          Short Name
                          <sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="shortName"
                          name="shortName"
                          onBlur={formikSave.handleBlur}
                          onChange={(e) => {
                            setShortName(e.target.value);
                            formikSave.handleChange(e);
                          }}
                          value={formikSave.values.shortName}
                        />
                        {formikSave.touched.shortName &&
                        formikSave.errors.shortName ? (
                          <small className="text-danger validationError">
                            {formikSave.errors.shortName}
                          </small>
                        ) : (
                          ""
                        )}
                      </div>
                      <div class="col">
                        <label htmlFor="exampleInputEmail1" class="form-label">
                          Long Name
                          <sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="longName"
                          name="longName"
                          onBlur={formikSave.handleBlur}
                          onChange={(e) => {
                            setLongName(e.target.value);
                            formikSave.handleChange(e);
                          }}
                          // value={longName}
                          value={formikSave.values.longName}
                        />
                        {formikSave.touched.longName &&
                        formikSave.errors.longName ? (
                          <small className="text-danger validationError">
                            {formikSave.errors.longName}
                          </small>
                        ) : (
                          ""
                        )}
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
                        onChange={(e) => {
                          setDesc(e.target.value);
                          formikSave.handleChange(e);
                        }}
                        // value={desc}
                        value={formikSave.values.desc}
                      />
                    </div>
                    <div class="mb-3">
                      <label htmlFor="exampleInputEmail1" class="form-label">
                        Label
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="label"
                        name="label"
                        onChange={(e) => {
                          setLabel(e.target.value);
                          formikSave.handleChange(e);
                        }}
                        // value={label}
                        value={formikSave.values.label}
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-between">
                      <label className="mt-2">Select Image:</label>
                      <input
                        className="mt-2"
                        type="file"
                        style={{ cursor: "pointer", width: "50%" }}
                        onChange={handleChange}
                      />
                      {file ? (
                        <img
                          className="mt-3 mb-3 image-preview"
                          title="image-preview"
                          src={file}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="d-flex">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-2 me-2"
                        disabled={
                          !formikSave.isValid ||
                          (formikSave.values.shortName ===
                            selectedRow.iconNameShort &&
                            formikSave.values.longName ===
                              selectedRow.iconNameLong && formikSave.values.label ===
                              selectedRow.iconLabel && formikSave.values.desc ===
                              selectedRow.iconDescription && fileName == '')
                        }
                      >
                        {formikSave.isSubmitting && (
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          ></div>
                        )}
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary w-100 mt-2"
                        onClick={() => {
                          formikSave.resetForm();
                          setShortName(selectedRow.iconNameShort);
                          setLongName(selectedRow.iconNameLong);
                          setLabel(selectedRow.iconLabel);
                          setDesc(selectedRow.iconDescription);

                        }}

                      >
                        Discard
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
            </Splitter>
            
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
                    System Icon
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    id="close_add_parent"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      setShowAddPopup(false);
                      formik.resetForm();
                    }}
                  ></button>
                </div>
                <div class="modal-body">
                  <form
                    onSubmit={(e) => {
                      formik.handleSubmit();
                      e.preventDefault();
                    }}
                  >
                    <div
                      className="mt-3 "
                      style={{ borderTop: "1px solid gray" }}
                    >
                      <div class="row mb-3">
                        <div class="col">
                          <label
                            htmlFor="exampleInputEmail1"
                            class="form-label"
                          >
                            Short Name <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="shortName"
                            name="shortName"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              setShortName(e.target.value);
                              formik.handleChange(e);
                            }}
                            value={formik.values.shortName}
                          />
                          {formik.touched.shortName &&
                          formik.errors.shortName ? (
                            <small className="text-danger validationError">
                              {formik.errors.shortName}
                            </small>
                          ) : (
                            ""
                          )}
                        </div>
                        <div class="col">
                          <label
                            htmlFor="exampleInputEmail1"
                            class="form-label"
                          >
                            Long Name <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="longName"
                            name="longName"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              setLongName(e.target.value);
                              formik.handleChange(e);
                            }}
                            // value={longName}
                            value={formik.values.longName}
                          />
                          {formik.touched.longName && formik.errors.longName ? (
                            <small className="text-danger validationError">
                              {formik.errors.longName}
                            </small>
                          ) : (
                            ""
                          )}
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
                          onChange={(e) => {
                            setDesc(e.target.value);
                            formik.handleChange(e);
                          }}
                          // value={desc}
                          value={formik.values.desc}
                        />
                      </div>
                      <div class="mb-3">
                        <label htmlFor="exampleInputEmail1" class="form-label">
                          Label
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="label"
                          name="label"
                          onChange={(e) => {
                            setLabel(e.target.value);
                            formik.handleChange(e);
                          }}
                          // value={label}
                          value={formik.values.label}
                        />
                      </div>
                      <div className="d-flex flex-column justify-content-between">
                        <label className="mt-2">Select Image:</label>
                        <input
                          ref={fileInputRef}
                          className="mt-2"
                          type="file"
                          style={{ cursor: "pointer", width: "50%" }}
                          onChange={handleChange}
                        />
                        {file ? (
                         <img
                            className="mt-3 mb-3 image-preview "
                            title="image-preview"
                            src={file}
                          /> 
                        ) : (
                          ""
                        )}
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-2"
                        disabled={!formik.isValid}
                      >
                        {formik.isSubmitting && (
                          <div
                            className="spinner-border spinner-border-sm text-light me-2"
                            role="status"
                          ></div>
                        )}
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* <SweetAlert
          show={showAlert}
            custom
            showCancel
            showCloseButton
            confirmBtnText="Yes"
            cancelBtnText="No"
            confirmBtnBsStyle="primary"
            cancelBtnBsStyle="light"
            customIcon="https://raw.githubusercontent.com/djorg83/react-bootstrap-sweetalert/master/demo/assets/thumbs-up.jpg"
            title="Do you like thumbs?"
            onConfirm={()=>setShowAlert(false)}
            onCancel={()=>console.log('')}
          >
            You will find they are up!
          </SweetAlert> */}
          <SweetAlert
            show={showAlert}
            success
            title="Success"
            onConfirm={() => {
              setShowAlert(false);
              setMessage('');
            }}
          >
            {message}
          </SweetAlert>
          <ContextMenu
          // className="conMenu"
            show={showFolderItem}
            offset={offset.current}
            onSelect={handleOnSelect}
            onClose={handleCloseMenu}
          >
            <MenuItem
          
              text={`Detail ${selectedRow.iconNameShort}`}
              data={{
                action: "detailFolder",
              }}
              icon="detail-section"
            />
            <MenuItem
              text={`Delete ${selectedRow.iconNameShort}`}
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
                  Add {selectedRow.iconNameShort} Folder
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
                    selectedRow.iconNameShort
                  }{" "}
                  Item
                </>
              )}
            />
          </ContextMenu>
          {(showDetail || detailFile) && (
            <IconDetail selectedRow={selectedRow} title={selectedRow.iconNameShort} id={selectedRow.iconId} cancel={cancelDetail} />
          )}
        </section>
        
      </div>
      
    </div>
  );
};

export default Icons;
