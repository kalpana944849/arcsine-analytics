import { ContextMenu, MenuItem, Splitter } from "@progress/kendo-react-layout";
import {
  TreeList,
  createDataTree,
  extendDataItem,
  getSelectedState,
  mapTree,
  removeItems,
} from "@progress/kendo-react-treelist";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleContextMenu, onChange } from "../../utils/common-helper";
import demoData from "../../flat-data";
import { getter } from "@progress/kendo-react-common";
import RowRender from "../../components/common/RowRender";
import CustomCell from "../../components/common/CustomCell";
import Version from "../../components/layout/Version";
import {
  addVersion,
  getSap,
  getSapId,
} from "../../services/statistical-analysis-plan-service";
import folderImg from "../../assets/images/folder2.svg";
import fileImg from "../../assets/images/file.svg";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import FullScreenLoader from "../../utils/Loaders/FullScreenLoader";

// import CustomCell from "../../components/common/CustomCellIcons"

const expandField = "expanded";
const subItemsField = "employees";
const editField = "inEdit";
const DATA_ITEM_KEY = "sapId";
const SELECTED_FIELD = "selected";
const DATA_ITEM_KEY_VERSION = "sapVersionGuid";
const SELECTED_FIELD_VERSION = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const idGetterVer = getter(DATA_ITEM_KEY_VERSION);

const SapDataPlan = () => {
  const extendData = (dataState, selectedState, expandedState) => {
    return mapTree(dataState, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        selected: selectedState[idGetter(item)],
        expanded: expandedState[idGetter(item)],
      })
    );
  };
  const selectionModes = [
    {
      value: "single",
      label: "Single selection mode",
    },
    {
      value: "multiple",
      label: "Multiple selection mode",
    },
  ];
  const [selectionMode, setSelectionMode] = React.useState(
    selectionModes[0].value
  );
  const demoData = JSON.parse(localStorage.getItem("SapData")) || [];
  // const sss = JSON.parse(localStorage.getItem("SAP_Version")) || [];
  const [sapVersion, setSapVersion] = useState([]);
  const [rollName, setRollNmae] = useState(null);
  const [Loader, showLoader] = React.useState(false);

  const dataTreeCate = createDataTree(
    demoData,
    (i) => i.sapId,
    (i) => i.parentId,
    subItemsField
  );
  const getSAP = async () => {
    showLoader(true);
    const response = await getSap();

    if (response.status == 200) {
      localStorage.setItem("SapData", JSON.stringify(response.data.data));
      console.log("pas", response.data.data);
      const dataTreeCate = createDataTree(
        demoData,
        (i) => i.sapId,
        (i) => i.parentId,
        subItemsField
      );
      //showLoader(false);
      setStateCategory({
        ...stateCategory,
        data: dataTreeCate,
      });
      showLoader(false);
    }
  };

  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCate],
    itemInEdit: undefined,
  });
  const getSAPId = async (id, userId) => {
    console.log("id", id);
    const response = await getSapId(id, userId);

    if (response.status == 200) {
      localStorage.setItem("SapDataId", JSON.stringify(response.data.data));
      // localStorage.setItem("SAP_Version",JSON.stringify(response.data.data?.sapVersionDTOs))
      setSapVersion(response.data.data?.sapVersionDTOs);
      console.log("verRes", response.data.data);
      setRollNmae(response.data.data?.roleName);
      console.log(
        "response.data.data.sapVersionDTOs",
        response.data.data?.sapVersionDTOs
      );
      const dataTreeCate = createDataTree(
        demoData,
        (i) => i.sapId,
        (i) => i.parentId,
        subItemsField
      );
      //showLoader(false);
      setStateCategory({
        ...stateCategory,
        data: dataTreeCate,
      });
    }
  };

  console.log("sapd", stateCategory.data);
  const version = process.env.REACT_APP_VERSION;

  const [selectedState, setSelectedState] = React.useState({});
  const [showSelected, setShowSelected] = React.useState(false);
  const [shortName, setShortName] = useState("");
  const [longName, setLongName] = useState("");
  const [desc, setDesc] = useState("");
  const [showAddPopup, setShowAddPopup] = React.useState(false);
  const [showAddPopupSap, setShowAddPopupSap] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [isActive, setActive] = React.useState(false);
  const [selectedStateVer, setSelectedStateVer] = React.useState({});

  const onSelectionChangeVer = (event) => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY_VERSION,
    });
    setSelectedStateVer(newSelectedState);
  };

  const handleToggle = () => {
    setActive(!isActive);
  };

  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });

  const offset = React.useRef({
    left: 0,
    top: 0,
  });

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
        if (key != event.dataItem.sapId) {
          delete newSelectedState[key];
        }
      });
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );
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

  // context menu
  const handleDetailFolder = () => {};
  const handleAddFolder = () => {
    setShowAddPopupSap(true);
  };
  const handleAddItem = () => {
    setShowAddPopupSap(true);
  };
  const handleEditFolder = () => {
    setShowAddPopupSap(true);
  };
  const handleDeleteFolder = () => {};
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
  const onCategoryRowClick = (event, props) => {
    props.selectionChange(event);
    setShowSelected(true);
    setSelectedRow(props.dataItem);
    console.log(props.dataItem);
    setShortName(props.dataItem.sapNameShort);
    setLongName(props.dataItem.sapNameLong);
    setDesc(props.dataItem.sapDescription);
    getSAPId(props.dataItem.sapGuid, 16);
    localStorage.setItem("sapDataItem", JSON.stringify(props.dataItem));
  };

  const expandIconClick = (dataItem) => {
    // if (dataItem.parentId == null) {
    //   localStorage.setItem("expandedItemId", dataItem.iconId);
    //   setFlag(false);
    // }
  };
  const columnsCategory = [
    {
      field: "sapNameShort",
      title: "Icon Name Short",
      expandable: true,
      width: "500px",
      cell: (props) => (
        <CustomCell
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
            <td>Data</td>
            <td style={{ border: "none" }}>
              <button
                className="me-2"
                style={{ border: "none" }}
                onClick={() => {
                  setShowAddPopupSap(true);
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
                  setShowAddPopupSap(true);
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

  useEffect(() => {
    // getSAPId();
    getSAP();
  }, []);
  const [selectedRowVer, setSelectedRowVer] = useState(null);

  const handleRowClick = (event, props) => {
    if (selectedRowVer === props.dataItem) {
      setSelectedRowVer(null); // Unselect the row if it's already selected
    } else {
      setSelectedRowVer(props.dataItem);
    }
    props.selectionChange(event);
  };
  const customColumnTemplate = (props) => {
    return (
      <td>
        <input
          type="radio"
          name="rowSelector"
          disabled={rollName == "Reviewer" ? true : false}
          onChange={() => {
            // props.selectionChange(props.dataItem);
          }}
          id={props.dataItem.sapVersionGuid}
        />
      </td>
    );
  };
  const [selectedCell, setSelectedCell] = React.useState("");
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const offsetVersion = React.useRef({
    left: 0,
    top: 0,
  });
  const handleContextMenuOpenVersion = (e) => {
    e.preventDefault();
    offsetVersion.current = {
      left: e.pageX,
      top: e.pageY,
    };
    if (rollName != "Reviewer") {
      setShow(true);
    }
  };
  const handleCloseMenuVersion = () => {
    setShow(false);
  };
  const handleOnSelectVersion = (e) => {
    switch (e.item.data.action) {
      case "copyCell":
        console.log("");
        break;
      default:
    }
    setShow(false);
  };
  const handleContextMenuVersion = (event) => {
    handleContextMenuOpenVersion(event.syntheticEvent);
    const { dataItem, field } = event;
    if (field) {
      const cell = dataItem[field];
      setSelectedCell(cell);
    }
  };

  const formik = useFormik({
    initialValues: {
      number: "",
      shortName: "",
      longName: "",
      desc: "",
    },
    // validationSchema: iconSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("val", values);
      const reqBody = {
        sapVersionId: 0,
        sapVersionGuid: "",
        companyId: 1,
        sapId: selectedRow.sapId,
        sapVersionNumber: values.number,
        sapVersionNameShort: values.shortName,
        sapVersionNameLong: values.longName,
        sapVersionDescription: values.desc,
      };
      setMessage("Version has been added successfully.");
      const response = await addVersion(reqBody);
      console.log("res", response);
      if (response.status == 200) {
        resetForm();
        setShowAddPopup(false);
        setShowAlert(true);
        getSAPId(selectedRow.sapId);
      }
    },
  });
  const formikSap = useFormik({
    initialValues: {
      number: "",
      shortName: "",
      longName: "",
      desc: "",
    },
    // validationSchema: iconSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("val", values);
    },
  });
  const sapItem = JSON.parse(localStorage.getItem("sapDataItem")) || {};
  useEffect(() => {
    return () => {
      localStorage.removeItem("sapDataItem");
    };
  }, []);
  return (
    <div className="main">
      <div
        className={
          isActive ? "main_menu sidebar menuexpand" : "main_menu sidebar"
        }
        id="sidebar"
      >
        <div className="main_menu_child">
          <div className="sidebar_top">
            <h4>
              <Link to="/">Arcsine Analytics</Link>
            </h4>
            <Link onClick={() => handleToggle()} to="#" className="sidebar_btn">
              <i className="fa-solid fa-bars-staggered"></i>
            </Link>
          </div>

          <div className="sidebar_breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home \</Link>
                </li>
                <li className="breadcrumb-item-inner">
                  <Link to="#">Statistical Analysis</Link>
                </li>
                {/* <li class="breadcrumb-item-inner2">
                    <Link to="#">Manage Project</Link>
                  </li> */}
              </ol>
            </nav>
          </div>

          <ul className="sidebar_list">
            <li className="active">
              <Link to="#">
                {Object.keys(sapItem).length > 0 ? (
                  <>
                    <span>{sapItem.sapNameShort}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-square-plus"></i>
                    <span>Select SAP</span>
                  </>
                )}
              </Link>
            </li>
            <li>
              <a>
                <i className="fa-solid fa-database"></i>
                <span>Data</span>
              </a>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-book"></i>
                <span>Analysis Set and Treatment</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-database"></i>
                <span>Endpoints, Analysis Flags, Visits</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="fa-solid fa-database"></i>
                <span>Subgroups</span>
              </Link>
            </li>
          </ul>

          <div className="" style={{ minHeight: "50vh" }}>
            <ul className="sidebar_list_bottom position-absolute bottom-0 start-0 w-100">
              <li s title="user-profile">
                <Link
                  to="#"
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                >
                  <i className="fas fa-user"></i>
                  <span>User Profile</span>
                </Link>
              </li>
              <li title={`Vesion (${version})`}>
                <Link
                  to="#"
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                >
                  <i className="fas fa-yin-yang"></i>
                  <Version />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={isActive ? " main_section bodyexpand" : "main_section"}>
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
              {showSelected ? (
                <div
                  style={{ border: "none" }}
                  className={`icon-treelist-form ${
                    showSelected ? "" : "d-none"
                  }`}
                >
                  <form onSubmit={(e) => {}}>
                    <th
                      style={{
                        top: "0px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <td className="mt-2">Selected SAP</td>
                    </th>
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
                            Short Name
                            <sup className="text-danger">*</sup>
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="shortName"
                            readOnly={rollName == "Reviewer" ? true : false}
                            name="shortName"
                            onChange={(e) => {
                              setShortName(e.target.value);
                            }}
                            value={shortName}
                          />
                        </div>
                        <div class="col">
                          <label
                            htmlFor="exampleInputEmail1"
                            class="form-label"
                          >
                            Long Name
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="longName"
                            readOnly={rollName == "Reviewer" ? true : false}
                            name="longName"
                            onChange={(e) => {
                              setLongName(e.target.value);
                            }}
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
                          readOnly={rollName == "Reviewer" ? true : false}
                          name="desc"
                          onChange={(e) => {
                            setDesc(e.target.value);
                          }}
                          value={desc}
                        />
                      </div>
                      <div className="mt-5">
                        <div
                          className="mb-2"
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {rollName == "Reviewer" ? (
                            ""
                          ) : (
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={() => {
                                setShowAddPopup(true);
                              }}
                            >
                              Add
                            </button>
                          )}
                        </div>
                        <Grid
                          data={
                            sapVersion?.map((item) => ({
                              ...item,
                              [SELECTED_FIELD_VERSION]:
                                selectedStateVer[idGetterVer(item)],
                            })) || []
                          }
                          selectable={{
                            enabled: true,
                            drag: false,
                            cell: false,
                            mode: "single",
                          }}
                          navigatable={true}
                          // onSelectionChange={onSelectionChangeVer}
                          onContextMenu={handleContextMenuVersion}
                          dataItemKey={DATA_ITEM_KEY_VERSION}
                          selectedField={SELECTED_FIELD_VERSION}
                          onRowClick={(e) => {
                            console.log("verDatahhh", e.dataItem);
                            document
                              .getElementById(e.dataItem.sapVersionGuid)
                              .click();
                          }}
                        >
                          <GridColumn
                            // field="selection"
                            cell={customColumnTemplate}
                            width="50"
                            title=" "
                          />
                          <GridColumn
                            field="sapVersionNumber"
                            title="Version"
                          />
                          <GridColumn
                            field="sapVersionNameShort"
                            title="Short Name"
                          />
                          <GridColumn field="sapVersionDate" title=" " />
                        </Grid>
                      </div>
                      {rollName == "Reviewer" ? (
                        ""
                      ) : (
                        <div className="d-flex">
                          <button
                            type="submit"
                            className="btn btn-primary w-100 mt-2 me-2"
                            disabled={
                              selectedRow.sapNameShort == shortName &&
                              selectedRow.sapNameLong == longName &&
                              selectedRow.sapDescription == desc
                            }
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary w-100 mt-2"
                            disabled={
                              selectedRow.sapNameShort == shortName &&
                              selectedRow.sapNameLong == longName &&
                              selectedRow.sapDescription == desc
                            }
                            onClick={() => {
                              setDesc(selectedRow.sapDescription);
                              setShortName(selectedRow.sapNameShort);
                              setLongName(selectedRow.sapNameLong);
                            }}
                          >
                            Discard
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <>
                </>
              )}
            </Splitter>
            <ContextMenu
              show={showFolderItem}
              offset={offset.current}
              onSelect={handleOnSelect}
              onClose={handleCloseMenu}
            >
              <MenuItem
                text={`Detail ${selectedRow.sapNameShort}`}
                data={{
                  action: "detailFolder",
                }}
                icon="detail-section"
              />
              <MenuItem
                text={`Delete ${selectedRow.sapNameShort}`}
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
                    Add {selectedRow.iconNameShort} Item
                  </>
                )}
              />
            </ContextMenu>
            {rollName == "Reviewer" ? (
              ""
            ) : (
              <ContextMenu
                show={show}
                offset={offsetVersion.current}
                onSelect={handleOnSelectVersion}
                onClose={handleCloseMenuVersion}
              >
                <MenuItem
                  text="View"
                  data={{
                    action: "copyCell",
                  }}
                  icon="eye"
                />
                <MenuItem
                  text="edit"
                  data={{
                    action: "copyCell",
                  }}
                  icon="edit"
                />
              </ContextMenu>
            )}
          </div>
          <SweetAlert
            show={showAlert}
            success
            title="Success"
            onConfirm={() => {
              setShowAlert(false);
              setMessage("");
            }}
          >
            {message}
          </SweetAlert>
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
                    Version
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
                      // style={{ borderTop: "1px solid gray" }}
                    >
                      <div class="row mb-3">
                        <div class="col-12">
                          <label
                            htmlFor="exampleInputEmail1"
                            class="form-label"
                          >
                            Number
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="shortName"
                            name="number"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              formik.handleChange(e);
                            }}
                            value={formik.values.number}
                          />
                        </div>
                      </div>
                      <div class="row mb-3">
                        <div class="col-12">
                          <label
                            htmlFor="exampleInputEmail1"
                            class="form-label"
                          >
                            Short Name
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="shortName"
                            name="shortName"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              formik.handleChange(e);
                            }}
                            value={formik.values.shortName}
                          />
                        </div>
                        <div class="col-12">
                          <label
                            htmlFor="exampleInputEmail1"
                            class="form-label"
                          >
                            Long Name
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="longName"
                            name="longName"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                              formik.handleChange(e);
                            }}
                            value={formik.values.longName}
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
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          value={formik.values.desc}
                        />
                      </div>
                      <div className="d-flex">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 mt-2 me-2"
                          disabled={
                            formik.values.number == "" &&
                            formik.values.shortName == "" &&
                            formik.values.longName == "" &&
                            formik.values.desc == ""
                          }
                          onClick={() => formik.resetForm()}
                        >
                          Discard
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary w-100 mt-2"
                          disabled={
                            formik.values.number == "" &&
                            formik.values.shortName == "" &&
                            formik.values.longName == "" &&
                            formik.values.desc == ""
                          }
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* add sap */}
          <div
            class={`modal fade  ${showAddPopupSap ? "show d-block" : ""} `}
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    SAP
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    id="close_add_parent"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      setShowAddPopupSap(false);
                      formikSap.resetForm();
                    }}
                  ></button>
                </div>
                <div class="modal-body">
                  <form
                    onSubmit={(e) => {
                      formikSap.handleSubmit();
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
                            onBlur={formikSap.handleBlur}
                            onChange={(e) => {
                              setShortName(e.target.value);
                              formikSap.handleChange(e);
                            }}
                            value={formikSap.values.shortName}
                          />
                          {formikSap.touched.shortName &&
                          formikSap.errors.shortName ? (
                            <small className="text-danger validationError">
                              {formikSap.errors.shortName}
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
                            onBlur={formikSap.handleBlur}
                            onChange={(e) => {
                              setLongName(e.target.value);
                              formikSap.handleChange(e);
                            }}
                            // value={longName}
                            value={formikSap.values.longName}
                          />
                          {formikSap.touched.longName &&
                          formikSap.errors.longName ? (
                            <small className="text-danger validationError">
                              {formikSap.errors.longName}
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
                            formikSap.handleChange(e);
                          }}
                          // value={desc}
                          value={formikSap.values.desc}
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
                            formikSap.handleChange(e);
                          }}
                          // value={label}
                          value={formikSap.values.label}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-2"
                        disabled={!formikSap.isValid}
                      >
                        {formikSap.isSubmitting && (
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
        </section>
      </div>
    </div>
  );
};

export default SapDataPlan;
