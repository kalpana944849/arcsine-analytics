import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TreeList, createDataTree, mapTree, extendDataItem, getSelectedState } from '@progress/kendo-react-treelist';
import { getter } from "@progress/kendo-react-common";
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import SweetAlert from "react-bootstrap-sweetalert";

import RowRender from '../../../../../components/common/RowRender';
import CustomCell from '../../../../../components/common/CustomCell';
import { handleContextMenu } from '../../../../../utils/common-helper';
import { deleteVisitFlagFolder } from '../../../../../services/visit-service';
import AddUpdateVisitFlagFolderModal from './Modals/AddUpdateVisitFlagFolderModal';
import AddUpdateVisitFlagModal from './Modals/AddUpdateVisitFlagModal';

const expandField = "expanded";
const subItemsField = "items";
const DATA_ITEM_KEY = "sapVisitFlagGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const VisitFlag = (props) => {
    const { data, visitStructureTreeData, reload, setReload } = props;
    let expandObj = {};
    const offset = useRef({ left: 0, top: 0 });
    const [selectedState, setSelectedState] = useState({});
    const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showAddFlagModal, setShowAddFlagModal] = useState(false);
    const [showAddFlagFolderModal, setShowAddFlagFolderModal] = useState(false);
    const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
    const [flagModalState, setFlagModalState] = useState("Add");
    const [flagFolderModalState, setFlagFolderModalState] = useState("Add");
    const [activeContextRowData, setActiveContextRowData] = useState(null);
    const [expandedState, setExpandedState] = useState(() => {
        return JSON.parse(localStorage.getItem("DataexpandedState")) || expandObj;
    });
    const columnsCategory = [
        {
            field: "visitFlagNameShort",
            title: "Icon Name Short",
            expandable: true,
            width: "500px",
            cell: (props) => (
                <CustomCell
                    {...props}
                    onRowClick={onRowClick}
                    expandIconClick={() => { }}
                    icon='fa-regular fa-calendar-check'
                    iconTitle="Calendar"
                    iconForThirdLevelRow="fa-regular fa-clock"
                    iconTitleForThirdLevelRow="Time"
                />
            ),
            headerCell: () => {
                return (
                    <th
                        style={{
                            top: "0px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <td>Visit Flag</td>
                        <td className="border-0">
                            {(selectedState[selectedRow.sapVisitFlagGuid]) &&
                                <button className="border-0" onClick={() => {
                                    setFlagModalState("add");
                                    setShowAddFlagModal(true);
                                }}>
                                    <i className="k-icon k-i-file-add k-color-dark" title="Add Flag"></i>
                                </button>
                            }
                            <button className="ms-2 border-0" onClick={() => {
                                setFlagFolderModalState("add");
                                setShowAddFlagFolderModal(true);
                            }}>
                                <i className="k-icon k-i-folder-add k-color-dark" title="Add Folder"></i>
                            </button>
                        </td>
                    </th>
                );
            }
        }
    ];
    
    // useEffect(() => {
    //     localStorage.setItem("DataexpandedState", JSON.stringify(expandedState));
    //     localStorage.setItem("DataselectedState", JSON.stringify(selectedState));
    // }, [expandedState]);

    const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) => {
            let dataId = idGetter(item);
            expandObj[dataId] = true;
            return extendDataItem(item, subItemsField, {
                selected: selectedState[idGetter(item)],
                expanded: expandedState[idGetter(item)]
            });
        });
    };

    const dataTree = createDataTree(
        data,
        (i) => i.sapVisitFlagGuid,
        (i) => i.parentGuid,
        subItemsField
    );

    const [stateCategory, setStateCategory] = useState({
        data: [...dataTree],
        itemInEdit: undefined
    });

    const onExpandChangeCategory = useCallback(
        (e) => {
            setExpandedState({
                ...expandedState,
                [idGetter(e.dataItem)]: !e.value
            });
        },
        [expandedState]
    );

    const onRowClick = (event, props) => {
        const { dataItem } = props;
        setSelectedRow(dataItem);
        props.selectionChange(event);
    };

    const onSelectionChange = useCallback(event => {
        const newSelectedState = getSelectedState({
            event,
            selectedState: selectedState,
            dataItemKey: DATA_ITEM_KEY
        });
        Object.keys(newSelectedState).forEach(key => {
            if (key !== event.dataItem.sapVisitFlagGuid) {
                delete newSelectedState[key];
            }
        });
        setSelectedState(newSelectedState);
    }, [selectedState]);

    const openContextMenu = (dataItem) => {
        setActiveContextRowData(dataItem);
        setShowContextMenu(true);
        setSelectedRow(dataItem);
    };

    const handleOnSelect = (e) => {
        switch (e.item.data.action) {
            case "addFlagFolder":
                setShowAddFlagFolderModal(true);
                setFlagFolderModalState("add");
                break;
            case "viewFlagFolder":
                setShowAddFlagFolderModal(true);
                setFlagFolderModalState("view");
                break;
            case "editFlagFolder":
                setShowAddFlagFolderModal(true);
                setFlagFolderModalState("edit");
                break;
            case "deleteFlagFolder":
                setShowConfirmationAlert(true);
                break;
            case "addFlag":
                setShowAddFlagModal(true);
                setFlagModalState("add");
                break;
            case "viewFlag":
                setShowAddFlagModal(true);
                setFlagModalState("view");
                break;
            case "editFlag":
                setShowAddFlagModal(true);
                setFlagModalState("edit");
                break;
            case "deleteFlag":
                setShowConfirmationAlert(true);
                break;
            default:
        }
        setShowContextMenu(false);
    };

    const handleCloseMenu = () => {
        setShowContextMenu(false);
    }

    const deleteRow = async () => {
        try {
            let sapVisitFlagGuid = activeContextRowData.sapVisitFlagGuid;
            let response = await deleteVisitFlagFolder(sapVisitFlagGuid);

            if (response && response.data.status === "OK") {
                setShowSuccessAlert(true);
                setSuccessMessage("Flag folder has been deleted successfully.")
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="visit-structure-table-wrapper">
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

            <AddUpdateVisitFlagModal 
                setShowSuccessAlert={setShowSuccessAlert}
                setSuccessMessage={setSuccessMessage}
                showAddFlagModal={showAddFlagModal}
                setShowAddFlagModal={setShowAddFlagModal}
                flagModalState={flagModalState}
                setFlagModalState={setFlagModalState}
                selectedRow={selectedRow}
                visitStructureTreeData={visitStructureTreeData}
            />

            <AddUpdateVisitFlagFolderModal
                setShowSuccessAlert={setShowSuccessAlert}
                setSuccessMessage={setSuccessMessage}
                showAddFlagFolderModal={showAddFlagFolderModal}
                setShowAddFlagFolderModal={setShowAddFlagFolderModal}
                flagFolderModalState={flagFolderModalState}
                setFlagFolderModalState={setFlagFolderModalState}
                selectedRow={selectedRow}
            />

            <SweetAlert
                show={showSuccessAlert}
                success
                title="Success"
                onConfirm={() => {
                    setShowSuccessAlert(false);
                    setSuccessMessage("");
                    setReload(!reload);
                }}
            >
                {successMessage}
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
                    text="View"
                    data={{ action: selectedRow?.isFolder ? "viewFlagFolder" : "viewFlag" }}
                    icon="eye"
                />
                <MenuItem
                    text="Edit"
                    data={{ action: selectedRow?.isFolder ? "editFlagFolder" : "editFlag" }}
                    icon="edit"
                />
                <MenuItem
                    text="Delete"
                    data={{ action: selectedRow?.isFolder ? "deleteFlagFolder" : "deleteFlag" }}
                    icon="delete"
                    cssClass="separator"
                />
                <MenuItem
                    text="Add Item"
                    data={{ action: "addFlag" }}
                    icon="file"
                />
                <MenuItem
                    text="Add Folder"
                    data={{ action: "addFlagFolder" }}
                    icon="folder"
                    cssClass="separator"
                />
                <MenuItem
                    text="Move to Different Folder"
                    data={{ action: "moveToDifferentFolder" }}
                    icon="."
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
        </>
    );
};

export default VisitFlag;
