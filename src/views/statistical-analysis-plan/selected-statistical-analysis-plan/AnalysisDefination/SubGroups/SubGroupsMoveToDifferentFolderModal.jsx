import React, { useState } from "react";
import { TreeList, createDataTree, extendDataItem, mapTree } from "@progress/kendo-react-treelist";
import { getter } from "@progress/kendo-react-common";
import RowRender from "../../../../../components/common/RowRender";
import CustomCell from "../../../../../components/common/CustomCell";

const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapAnalysisSetGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const SubGroupsMoveToDifferentFolderModal = ({ closeModal, treelistData, id, col_field}) => {
    let expandObj = {};
    const sapCollectionData = treelistData || [];
    const dataTreeCate = createDataTree(
        sapCollectionData,
        (i) => i.id,
        (i) => i.parentId,
        subItemsField
    );
    const [stateCategory, setStateCategory] = useState({
        data: [...dataTreeCate],
        itemInEdit: undefined
    });
    const [selectedState, setSelectedState] = useState(() => {
        return JSON.parse(localStorage.getItem("DataselectedState")) || {};
    });
    const [expandedState, setExpandedState] = useState(() => {
        return JSON.parse(localStorage.getItem("DataexpandedState")) || expandObj;
    });

    const columnsCategory = [
        {
            field: col_field,
            title: "Icon Name Short",
            expandable: true,
            width: "500px",
            cell: (props) => {
                return (
                    <CustomCell
                        {...props}
                        onRowClick={() => { }}
                        expandIconClick={() => { }}
                        icon={"fas fa-light fa-file"
                            // props.dataItem?.id?.includes("SapDataCollectionId")
                            //     ? "fas fa-light fa-database"
                            //     : "fas fa-sharp fa-regular fa-table"
                        }
                    />
                );
            },
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
                        <td>Analysis Set</td>
                    </th>
                );
            },
        },
    ];

    const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) => {
            let dataId = idGetter(item);
            expandObj[dataId] = true;
            return extendDataItem(item, subItemsField, {
                selected: selectedState[idGetter(item)],
                expanded: expandedState[idGetter(item)],
            });
        });
    };

    return (
        <div
            class="modal modal-lg fade show d-block"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Move to Different Folder</h5>
                        <button
                            type="button"
                            class="btn-close"
                            id="close_add_parent"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => closeModal(false)}
                        ></button>
                    </div>
                    <div class="modal-body">
                        <TreeList
                            className="tree_scroll"
                            style={{
                                border: "none",
                                maxHeight: "100%",
                                overflow: "auto",
                            }}
                            data={extendData(stateCategory.data, selectedState, expandedState)}
                            rowRender={RowRender}
                            // onSelectionChange={onSelectionChange}
                            // navigatable={true}
                            // selectedField={SELECTED_FIELD}
                            // selectable={{
                            //     enabled: true,
                            // }}
                            expandField={expandField}
                            subItemsField={subItemsField}
                            // onExpandChange={onExpandChangeCategory}
                            columns={columnsCategory}
                        />
                        <div className="d-flex">
                            <button
                                type="button"
                                className="btn btn-primary w-100 mt-2 me-2"
                                onClick={() => closeModal(false)}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline-primary w-100 mt-2"
                                onClick={() => closeModal(false)}

                            >
                                Discard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubGroupsMoveToDifferentFolderModal;