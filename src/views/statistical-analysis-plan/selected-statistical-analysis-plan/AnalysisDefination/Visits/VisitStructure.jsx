import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TreeList, createDataTree, mapTree, extendDataItem, getSelectedState } from '@progress/kendo-react-treelist';
import { getter } from "@progress/kendo-react-common";
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import SweetAlert from "react-bootstrap-sweetalert";

import RowRender from '../../../../../components/common/RowRender';
import CustomCell from '../../../../../components/common/CustomCell';
import { handleContextMenu } from '../../../../../utils/common-helper';
import AddUpdateVisitPeriodModal from './Modals/AddUpdateVisitPeriodModal';
import AddUpdateVisitModal from './Modals/AddUpdateVisitModal';
import AddUpdateVisitTimeModal from './Modals/AddUpdateVisitTimeModal';
import { deleteVisitPeriod, deleteVisit, deleteVisitTime } from '../../../../../services/visit-service';

const expandField = "expanded";
const subItemsField = "items";
const DATA_ITEM_KEY = "sapVisitGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const VisitStructure = (props) => {
    const { data, reload, setReload } = props;
    let expandObj = {};
    const offset = useRef({ left: 0, top: 0 });
    const [selectedState, setSelectedState] = useState({});
    const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showAddPeriodModal, setShowAddPeriodModal] = useState(false);
    const [showAddVisitModal, setShowAddVisitModal] = useState(false);
    const [showAddVisitTimeModal, setShowAddVisitTimeModal] = useState(false);
    const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
    const [dataLevelID, setDataLevelID] = useState(0);
    const [periodModalState, setPeriodModalState] = useState("Add");
    const [visitModalState, setVisitModalState] = useState("Add");
    const [visitTimeModalState, setVisitTimeModalState] = useState("Add");
    const [activeContextRowData, setActiveContextRowData] = useState(null);
    const [expandedState, setExpandedState] = useState(() => {
        return JSON.parse(localStorage.getItem("DataexpandedState")) || expandObj;
    });
    const columnsCategory = [
        {
            field: "sapVisitShortName",
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
                    tableName="visit-structure"
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
                        <td>Visit Structure</td>
                        <td style={{ border: "none" }}>
                            {(selectedState[selectedRow.sapVisitGuid] && dataLevelID === 1) && <button className="btn btn-primary btn-sm me-2" onClick={() => {
                                setPeriodModalState("add");
                                setShowAddPeriodModal(true);
                            }}>Add Period</button>}
                            {(selectedState[selectedRow.sapVisitGuid] && (dataLevelID === 1 || dataLevelID === 2)) && <button className="btn btn-primary btn-sm me-2" onClick={() => {
                                setShowAddVisitModal(true);
                                setVisitModalState("add");
                            }}>Add Visit</button>}
                            {(selectedState[selectedRow.sapVisitGuid] && (dataLevelID === 2 || dataLevelID === 3)) && <button className="btn btn-primary btn-sm me-2" onClick={() => { 
                                setShowAddVisitTimeModal(true);
                                setVisitTimeModalState("add");
                            }}>Add Time</button>}
                            <button style={{ border: "none" }} onClick={() => {
                                setPeriodModalState("add");
                                setShowAddPeriodModal(true);
                            }}>
                                <i className="k-icon k-i-file-add k-color-dark" title="Add Period"></i>
                            </button>
                        </td>
                    </th>
                );
            }
        }
    ];
    
    useEffect(() => {
        // localStorage.setItem("DataexpandedState", JSON.stringify(expandedState));
        // localStorage.setItem("DataselectedState", JSON.stringify(selectedState));
    }, [expandedState]);

    // useEffect(() => {
    //     if (dataLevelID === 3 && selectedRow) {
    //         const visit = data.find((item) => item.sapVisitId == selectedRow.parentId);
    //         const parts = (visit.parentId).split('_');
    //         setSapVisitPeriodId(parts[1]);
    //         console.log(visit.parentId)
    //     }
    // }, [selectedRow]);

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
        (i) => i.sapVisitGuid,
        (i) => i.parentGuid,
        subItemsField
    );

    const [stateCategory, setStateCategory] = useState({
        data: [...dataTree],
        itemInEdit: undefined
    });

    const onExpandChangeCategory = React.useCallback(
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
        setDataLevelID(dataItem.sapDataLevelId);
        props.selectionChange(event);
    };

    const onSelectionChange = useCallback(event => {
        const newSelectedState = getSelectedState({
            event,
            selectedState: selectedState,
            dataItemKey: DATA_ITEM_KEY
        });
        Object.keys(newSelectedState).forEach(key => {
            if (key !== event.dataItem.sapVisitGuid) {
                delete newSelectedState[key];
            }
        });
        setSelectedState(newSelectedState);
        if (!newSelectedState) setDataLevelID(0);
    }, [selectedState]);

    const openContextMenu = (dataItem) => {
        setDataLevelID(dataItem.sapDataLevelId);
        setActiveContextRowData(dataItem);
        setShowContextMenu(true);
        setSelectedRow(dataItem);
    };

    const handleOnSelect = (e) => {
        switch (e.item.data.action) {
            case "addPeriod":
                setShowAddPeriodModal(true);
                setPeriodModalState("add");
                break;
            case "viewPeriod":
                setShowAddPeriodModal(true);
                setPeriodModalState("view");
                break;
            case "editPeriod":
                setShowAddPeriodModal(true);
                setPeriodModalState("edit");
                break;
            case "deletePeriod":
                setShowConfirmationAlert(true);
                break;
            case "addVisit":
                setShowAddVisitModal(true);
                setVisitModalState("add");
                break;
            case "viewVisit":
                setShowAddVisitModal(true);
                setVisitModalState("view");
                break;
            case "editVisit":
                setShowAddVisitModal(true);
                setVisitModalState("edit");
                break;
            case "deleteVisit":
                setShowConfirmationAlert(true);
                break;
            case "addTime":
                setShowAddVisitTimeModal(true);
                setVisitTimeModalState("add");
                break;
            case "viewTime":
                setShowAddVisitTimeModal(true);
                setVisitTimeModalState("view");
                break;
            case "editTime":
                setShowAddVisitTimeModal(true);
                setVisitTimeModalState("edit");
                break;
            case "deleteTime":
                setShowConfirmationAlert(true);
                break;
            default:
        }
        setShowContextMenu(true);
    };

    const handleCloseMenu = () => {
        setShowContextMenu(false);
    }

    const deleteRow = async () => {
        try {
            let response;
            let sapVisitGuid = activeContextRowData.sapVisitGuid;

            if (dataLevelID === 1) {
                response = await deleteVisitPeriod(sapVisitGuid);
            } else if (dataLevelID === 2) {
                response = await deleteVisit(sapVisitGuid);
            } else if (dataLevelID === 3) {
                response = await deleteVisitTime(activeContextRowData.sapVisitGuid);
            }

            if (response && response.data.status === "OK") {
                setReload(!reload);
            }
        } catch (error) {
            console.log(error);
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

            <AddUpdateVisitPeriodModal
                setShowSuccessAlert={setShowSuccessAlert}
                setSuccessMessage={setSuccessMessage}
                showAddPeriodModal={showAddPeriodModal}
                setShowAddPeriodModal={setShowAddPeriodModal}
                periodModalState={periodModalState}
                setPeriodModalState={setPeriodModalState}
                selectedRow={selectedRow}
            />
            <AddUpdateVisitModal
                setShowSuccessAlert={setShowSuccessAlert}
                setSuccessMessage={setSuccessMessage}
                showAddVisitModal={showAddVisitModal}
                setShowAddVisitModal={setShowAddVisitModal}
                visitModalState={visitModalState}
                setVisitModalState={setVisitModalState}
                selectedRow={selectedRow}
            />
            <AddUpdateVisitTimeModal
                setShowSuccessAlert={setShowSuccessAlert}
                setSuccessMessage={setSuccessMessage}
                showAddVisitTimeModal={showAddVisitTimeModal}
                setShowAddVisitTimeModal={setShowAddVisitTimeModal}
                visitTimeModalState={visitTimeModalState}
                setVisitTimeModalState={setVisitTimeModalState}
                selectedRow={selectedRow}
                dataLevelID={dataLevelID}
                data={data}
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
                    data={{ action: dataLevelID === 1 ? "viewPeriod" : (dataLevelID === 2 ? "viewVisit" : (dataLevelID === 3 ? "viewTime" : "view")) }}
                    icon="eye"
                    
                />
                <MenuItem
                    text="Edit"
                    data={{ action: dataLevelID === 1 ? "editPeriod" : (dataLevelID === 2 ? "editVisit" : (dataLevelID === 3 ? "editTime" : "edit")) }}
                    icon="edit"
                />
                <MenuItem
                    text="Delete"
                    data={{ action: dataLevelID === 1 ? "deletePeriod" : (dataLevelID === 2 ? "deleteVisit" : (dataLevelID === 3 ? "deleteTime" : "delete")) }}
                    icon="delete"
                    cssClass="separator"
                />
                {dataLevelID === 1 &&
                    <MenuItem
                        text="Add Period"
                        data={{ action: "addPeriod" }}
                    />
                }
                {(dataLevelID === 1 || dataLevelID === 2) &&
                    <MenuItem
                        text="Add Visit"
                        data={{ action: "addVisit" }}
                    />
                }
                {(dataLevelID === 2 || dataLevelID === 3) &&
                    <MenuItem
                        text="Add Time"
                        data={{ action: "addTime" }}
                    />
                }
            </ContextMenu>
        </>
    );
};

export default VisitStructure;
