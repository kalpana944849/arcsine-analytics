import React, { useEffect, useState, useCallback, useRef } from "react";
import { Splitter, TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import { createDataTree, TreeList, extendDataItem, mapTree, getSelectedState } from "@progress/kendo-react-treelist";
import { getter } from "@progress/kendo-react-common";
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import SweetAlert from "react-bootstrap-sweetalert";

import CustomLoader from "../../../../utils/Loaders/CustomLoader";
import RowRender from "../../../../components/common/RowRender";
import CustomCell from "../../../../components/common/CustomCell";
import { handleContextMenu, onChange } from "../../../../utils/common-helper";
import TocParameterView from "./TocParameterView";
import TocDisplayView from "./TocDisplayView";
import TocCodeView from "./TocCodeView";
import { getSapTocBySapID, deleteSapTocByGUID } from "../../../../services/toc-service";

const expandField = "expanded";
const subItemsField = "items";
const editField = "inEdit";
const DATA_ITEM_KEY = "sapTocId";
const SELECTED_FIELD = "selected";
const DATA_ITEM_KEY_VERSION = "sapVersionGuid";
const SELECTED_FIELD_VERSION = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const idGetterVer = getter(DATA_ITEM_KEY_VERSION);

const TableOfContentsView = () => {
    const offset = useRef({ left: 0, top: 0 });
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState("parameter");
    const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [activeContextRowData, setActiveContextRowData] = useState(null);
    const [reload, setReload] = useState(false);
    const [selectedState, setSelectedState] = useState(() => {
        return JSON.parse(localStorage.getItem("sapTocSelectedState")) || {};
    });
    const [stateCategory, setStateCategory] = useState({
        data: [],
        itemInEdit: undefined
    });
    const [panes, setPanes] = useState([
        {
            size: "25%",
            min: "20%",
            collapsible: true,
            scrollable: false
        },
        {
            min: "20%",
            collapsible: true,
            scrollable: false
        }
    ]);
    const [expandedState, setExpandedState] = useState(() => {
        return JSON.parse(localStorage.getItem("SAPexpandedState")) || {};
    });

    const handleSelect = (e) => {
        setSelected(e.selected);
    };

    const columnsCategory = [
        {
            field: "sapTocNameShort",
            title: "Icon Name Short",
            expandable: true,
            width: "500px",
            cell: (props) => (
                <CustomCell
                    {...props}
                    onRowClick={onCategoryRowClick}
                    expandIconClick={expandIconClick}
                // icon={`fas fa-light fa-chart-user`}
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
                        <td>Table of Contents</td>
                        <td style={{ border: "none" }}>
                            <button
                                className="me-2"
                                style={{ border: "none" }}
                            // onClick={() => {
                            // 	setShowAddPopupSap(true);
                            // 	setParentId(0);
                            // 	setIsFolder(false);
                            // }}
                            >
                                <i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
                            </button>
                            <button
                                style={{ border: "none" }}
                            // onClick={() => {
                            // 	setShowAddPopupSap(true);
                            // 	setParentId(0);
                            // 	setIsFolder(true);
                            // }}
                            >
                                <i className="k-icon k-i-folder-add k-color-dark" title="Add Folder"></i>
                            </button>
                        </td>
                    </th>
                );
            }
        }
    ];

    const onCategoryRowClick = (event, props) => {
        const { dataItem } = props;
        setSelectedRow(dataItem);
        props.selectionChange(event);
    };

    const expandIconClick = (dataItem) => {
        return false;
    };

    const onExpandChangeCategory = useCallback((e) => {
        setExpandedState({
            ...expandedState,
            [idGetter(e.dataItem)]: !e.value
        });
    }, [expandedState]);

    const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) =>
            extendDataItem(item, subItemsField, {
                selected: selectedState[idGetter(item)],
                expanded: expandedState[idGetter(item)]
            })
        );
    };

    const onSelectionChange = React.useCallback((event) => {
        const newSelectedState = getSelectedState({
            event,
            selectedState: selectedState,
            dataItemKey: DATA_ITEM_KEY,
        });
        Object.keys(newSelectedState).forEach((key) => {
            if (key != event.dataItem.sapTocId) {
                delete newSelectedState[key];
            }
        });
        setSelectedState(newSelectedState);
        localStorage.setItem("sapTocSelectedState", JSON.stringify(newSelectedState));

        // setItemSelectedState(newSelectedState);
    }, [selectedState]);

    const getSapToc = async (loading) => {
        setLoading(loading);
        const response = await getSapTocBySapID(43, 24);
        if (response.status == 200) {
            localStorage.setItem("SapTocData", JSON.stringify(response.data.data));
            const dataTreeCate = createDataTree(
                response.data.data,
                (i) => i.sapTocId,
                (i) => i.parentId,
                subItemsField
            );
            setStateCategory({
                ...stateCategory,
                data: dataTreeCate,
            });
            setLoading(false);
        }
    };

    const deleteRow = async () => {
        try {
            const response = await deleteSapTocByGUID(activeContextRowData.sapTocGuid);

            if (response && response.data.status === "OK") {
                setReload(!reload);
                setShowSuccessAlert(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getSapToc();
    }, [reload]);

    const openContextMenu = (dataItem) => {
        setActiveContextRowData(dataItem);
        setShowContextMenu(true);
        setSelectedRow(dataItem);
    };

    const handleOnSelect = (e) => {
        switch (e.item.data.action) {
            case "delete":
                setShowConfirmationAlert(true);
                break;
            default:
        }
        setShowContextMenu(true);
    };

    const handleCloseMenu = () => {
        setShowContextMenu(false);
    }

    return (
        <div className="main_content">
            <Splitter
                style={{ height: "100%" }}
                panes={panes}
                orientation={"horizontal"}
                onChange={(event) => onChange(event, setPanes)}
                scrollable={false}
            >
                <div
                    style={{ position: "relative", height: "100vh" }}
                    className="tree_list_scroll"
                >
                    {loading && <CustomLoader />}
                    <TreeList
                        style={{ border: "none", maxHeight: "100%", overflow: "auto" }}
                        data={extendData(stateCategory.data, selectedState, expandedState)}
                        rowRender={RowRender}
                        navigatable={true}
                        selectedField={SELECTED_FIELD}
                        selectable={{ enabled: true }}
                        onSelectionChange={onSelectionChange}
                        expandField={expandField}
                        subItemsField={subItemsField}
                        onExpandChange={onExpandChangeCategory}
                        columns={columnsCategory}
                        onRowContextMenu={(event) => {
                            handleContextMenu(
                                event,
                                openContextMenu,
                                setSelectedRow,
                                offset
                            )
                        }}
                    />
                </div>
                <div className="visitsTablesWrapper toc" style={{ padding: "20px 12px" }}>
                    <div className="head_section">
                        <div>
                            <span>Table 15.1: 1</span>
                        </div>
                        <div>
                            <span>MMRM analysis of XXX change from baseline</span>
                            <span>ITT</span>
                            <span>Subtitle 1</span>
                            <span>Subtitle 2</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <div className="form-group mb-3">
                                <select className="form-select form-control" value={selectedItem} onChange={(e) => {
                                    setSelectedItem(e.target.value);
                                }}>
                                    <option value="parameter">Parameter</option>
                                    <option value="display">Display</option>
                                    <option value="code">Code</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {selectedItem === "parameter" && <TocParameterView />}
                    {selectedItem === "display" && <TocDisplayView />}
                    {selectedItem === "code" && <TocCodeView />}
                </div>
            </Splitter>

            <SweetAlert
                show={showSuccessAlert}
                success
                title="Success"
                onConfirm={() => {
                    setShowSuccessAlert(false);
                    setReload(!reload);
                }}
            >
                TOC has been deleted successfully.
            </SweetAlert>

            {/* Confirmation Alert */}
            <SweetAlert
                show={showConfirmationAlert}
                showCancel
                cancelBtnText="No"
                confirmBtnText="Yes"
                cancelBtnBsStyle="light"
                title="Confirm to delete"
                onConfirm={() => {
                    deleteRow();
                    setShowConfirmationAlert(false);
                }}
                onCancel={() => {
                    setShowConfirmationAlert(false);
                }}
            >
                Are you sure?
            </SweetAlert>

            <ContextMenu
                show={showContextMenu}
                offset={offset.current}
                onSelect={handleOnSelect}
                onClose={handleCloseMenu}
                className="context-menu"
            >
                <MenuItem
                    text="Delete"
                    data={{ action: "delete" }}
                    icon="trash"
                />
                <MenuItem
                    text="Add File"
                    data={{ action: "addFile" }}
                    icon="file"
                />
                <MenuItem
                    text="Add Folder"
                    data={{ action: "addFolder" }}
                    icon="folder"
                    cssClass="separator"
                />
                <MenuItem
                    text="Move to Different Folder"
                    data={{ action: "moveToDifferentFolder" }}
                    icon="folder"
                />
                <MenuItem
                    text="Move Up within Folder"
                    data={{ action: "moveUpWithinFolder" }}
                    icon="."
                />
                <MenuItem
                    text="Move Down within Folder"
                    data={{ action: "moveDownWithinFolder" }}
                    icon="."
                />
            </ContextMenu>
        </div>
    );
};

export default TableOfContentsView;
