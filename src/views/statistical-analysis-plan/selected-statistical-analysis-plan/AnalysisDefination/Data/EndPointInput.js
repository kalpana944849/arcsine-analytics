import React, { useState, useCallback, useRef, useEffect } from "react";
import { getter } from "@progress/kendo-react-common";
import {
	TreeList,
	createDataTree,
	extendDataItem,
	getSelectedState,
	mapTree,
	removeItems,
} from "@progress/kendo-react-treelist";
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import SweetAlert from "react-bootstrap-sweetalert";

import CustomCell from "../../../../../components/common/CustomCell";
import RowRender from "../../../../../components/common/RowRender";
import { handleContextMenu } from './../../../../../utils/common-helper';
import { deleteEndpoint } from "../../../../../services/statistical-analysis-plan-service";
import AddUpdateDataEndpointModal from "./AddUpdateDataEndpointModal";
import VariableDisplayModal from "./VariableDisplayModal";

const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapEndpointGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const EndPointInput = (props) => {
	const { data, reload, setReload, setEndpointData, showData } = props;
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [showAddPopupFile, setShowAddPopupFile] = useState(false);
	const offset = useRef({ left: 0, top: 0 });
	const [showContextMenu, setShowContextMenu] = useState(false);
	const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
	const [activeContextRowData, setActiveContextRowData] = useState(null);
	const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
	const [endpointModalState, setEnpointModalState] = useState("add");
	const [showSuccessAlert, setShowSuccessAlert] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [tableModalShow,setTableModalShow] = useState(false)
	const [responseVariable, setResponseVariable] = useState([])

	const extendData = (dataState, selectedState, expandedState) => {
		return mapTree(dataState, subItemsField, (item) =>
			extendDataItem(item, subItemsField, {
				selected: selectedState[idGetter(item)],
				expanded: expandedState[idGetter(item)],
			})
		);
	};
	
	const dataTreeCate = createDataTree(
		data,
		(i) => i.sapEndpointId,
		(i) => i.parentId,
		subItemsField
	);
	const [selectedState, setSelectedState] = useState({});
	const [selected, setSelected] = useState(0);
	const handleSelect = (e) => {
		setSelected(e.selected);
	};
	const [expandedState, setExpandedState] = useState({
		1: true,
		2: true,
		32: true,
	});
	const [stateCategory, setStateCategory] = useState({
		data: [...dataTreeCate],
		itemInEdit: undefined
	});
	const columnsCategory = [
		{
			field: "endpointNameShort",
			title: " ",
			expandable: true,
			width: "500px",
			cell: (props) => (
				<CustomCell
					{...props}
					onRowClick={() => { }}
					expandIconClick={() => { }}
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
						<td>{props.title}</td>
						<td style={{border: "none"}}>
							<button
								type="button"
								className="me-2"
								style={{border: "none"}}
								onClick={() => {
									setEnpointModalState("add");
									setShowAddPopup(true);
								}}
							>
								<i className="k-icon k-i-folder-add k-color-dark" title="Add Folder"></i>
							</button>
							<button
								type="button"
								style={{border: "none"}}
								onClick={() => setShowAddPopupFile(true)}
							>
								<i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
							</button>
						</td>
					</th>
				);
			}
		}
	];

	const onExpandChangeCategory = useCallback(
		(e) => {
			setExpandedState({
				...expandedState,
				[idGetter(e.dataItem)]: !e.value,
			});
		},
		[expandedState]
	);

	const openContextMenu = (dataItem) => {
		setShowContextMenu(true);
		setActiveContextRowData(dataItem);
		setSelectedRow(dataItem);
	};

	const handleCloseMenu = () => {
		setShowContextMenu(false);
	}

	const handleOnSelect = (e) => {
		switch (e.item.data.action) {
			case "addItem":
				setShowAddPopupFile(true);
				break;
			case "addFolder":
				setShowAddPopup(true);
				setEnpointModalState("add");
				break;
			case "editFolder":
				setShowAddPopup(true);
				setEnpointModalState("edit");
				break;
			case "viewFolder":
				setShowAddPopup(true);
				setEnpointModalState("view");
				break;
			case "delete":
				setShowConfirmationAlert(true);
				break;
			default:
		}
		setShowContextMenu(false);
	};

	const deleteRow = async () => {
        try {
            const sapVisitGuid = activeContextRowData.sapEndpointGuid;
			const response = await deleteEndpoint(sapVisitGuid);

            if (response && response.data.status === "OK") {
				setReload(!reload);
            }
        } catch (error) {
            console.error(error);
        }
    };

	return (
		<div className="vh-100 tree_list_scroll">
			<TreeList
				style={{
					border: "none",
					maxHeight: "100%",
					overflow: "auto",
				}}
				data={extendData(stateCategory.data, selectedState, expandedState)}
				rowRender={RowRender}
				navigatable={true}
				selectedField={SELECTED_FIELD}
				selectable={{enabled: true}}
				noRecords="No Data Found"
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

			<AddUpdateDataEndpointModal
                setShowSuccessAlert={setShowSuccessAlert}
                setSuccessMessage={setSuccessMessage}
                showAddEndpointModal={showAddPopup}
                setShowAddEndpointModal={setShowAddPopup}
                modalState={endpointModalState}
                setModalState={setEnpointModalState}
                selectedRow={selectedRow}
				setTableModalShow={setTableModalShow}
				responseVariable={responseVariable}
				showData={showData}
            />

            {console.log('responseVariableresponseVariable', responseVariable)}

           <VariableDisplayModal
			 setShowSuccessAlert={setShowSuccessAlert}
			 setSuccessMessage={setSuccessMessage}
			 showAddEndpointModal={showAddPopup}
			 setShowAddEndpointModal={setShowAddPopup}
			 modalState={endpointModalState}
			 setModalState={setEnpointModalState}
			 selectedRow={selectedRow}
			 tableModalShow={tableModalShow}
			 setTableModalShow={setTableModalShow}
			 setResponseVariable={setResponseVariable}
			/>

			{/* <div class={`modal fade  ${showAddPopup ? "show d-block" : ""} `} id="exampleModal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Add Endpoint Folder</h5>
							<button type="button" class="btn-close" id="close_add_parent" data-bs-dismiss="modal"
								onClick={() => setShowAddPopup(false)}
							></button>
						</div>
						<div class="modal-body">
							<form>
								<div className="mt-3">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Short Name <sup className="text-danger">*</sup></label>
											<input type="text" class="form-control" id="shortName" name="shortName" />
										</div>
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Long Name <sup className="text-danger">*</sup></label>
											<input type="text" class="form-control" id="longName" name="longName" />
										</div>
									</div>
									<div class="mb-3">
										<label htmlFor="exampleInputEmail1" class="form-label">Description</label>
										<input type="text" class="form-control" id="desc" name="desc" />
									</div>
									<div className="d-flex">
										<button type="button" className="btn btn-primary w-100 mt-2 me-2"
											disabled={true}
											onClick={() => setShowAddPopup(false)}
										>
											Save
										</button>
										<button type="button" className="btn btn-outline-primary w-100 mt-2" 
											disabled={true}
											onClick={() => setShowAddPopup(false)}
										>
											Discard
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div> */}

			<div class={`modal fade  ${showAddPopupFile ? "show d-block" : ""} `} id="exampleModal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Add Endpoint File</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setShowAddPopupFile(false)}
							></button>
						</div>
						<div class="modal-body">
							<form>
								<div className="mt-3">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Short Name <sup className="text-danger">*</sup></label>
											<input type="text" class="form-control" id="shortName" name="shortName" />
										</div>
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Long Name <sup className="text-danger">*</sup></label>
											<input type="text" class="form-control" id="longName" name="longName" />
										</div>
									</div>
									<div class="mb-3">
										<label htmlFor="exampleInputEmail1" class="form-label">Description</label>
										<input type="text" class="form-control" id="desc" name="desc" />
									</div>
									<div className="d-flex">
										<button type="button" className="btn btn-primary w-100 mt-2 me-2" 
											disabled={true}
											onClick={() => setShowAddPopupFile(false)}
										>
											Save
										</button>
										<button type="button" className="btn btn-outline-primary w-100 mt-2" 
											disabled={true}
											onClick={() => setShowAddPopupFile(false)}
										>
											Discard
										</button>
		
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			

			</div>

			<ContextMenu
				show={showContextMenu}
				offset={offset.current}
				onSelect={handleOnSelect}
				onClose={handleCloseMenu}
				className="context-menu"
			>
				<MenuItem
					text="View"
					data={{ action: selectedRow.isFolder ? "viewFolder" : "viewFile" }}
					icon="eye"
				/>
				<MenuItem
					text="Edit"
					data={{ action: "edit" }}
					icon="edit"
				/>
				<MenuItem
					text="Delete"
					data={{ action: "delete" }}
					icon="delete"
					cssClass="separator"
				/>
				<MenuItem
					text="Add Item"
					data={{ action: "addItem" }}
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
				/>
				<MenuItem
					text="Move Up within Folder"
					data={{ action: "moveUpWithinFolder" }}
				/>
				<MenuItem
					text="Move Down within Folder"
					data={{ action: "moveDownWithinFolder" }}
				/>
			</ContextMenu>

			
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
		</div>
	);
};

export default EndPointInput;
