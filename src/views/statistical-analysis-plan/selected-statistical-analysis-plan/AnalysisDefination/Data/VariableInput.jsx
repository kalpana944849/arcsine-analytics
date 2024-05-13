import React, { useState, useRef, useEffect } from "react";
// import RowRender from "../../components/common/RowRender";
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
import CustomCell from "../../../../../components/common/CustomCell";
import RowRender from "../../../../../components/common/RowRender";
import { handleContextMenu } from './../../../../../utils/common-helper';
import CustomCellVariable from "../../../../../components/common/CustomCellVariable";
import { deleteVariableInput, updateVariable } from "../../../../../services/statistical-analysis-plan-service";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
// import CustomCell from "../../components/common/CustomCell";
const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapDataVariableId";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const VariableInput = (props) => {
	const extendData = (dataState, selectedState, expandedState) => {
		return mapTree(dataState, subItemsField, (item) =>
			extendDataItem(item, subItemsField, {
				selected: selectedState[idGetter(item)],
				expanded: expandedState[idGetter(item)],
			})
		);
	};
	console.log('data', props.data)
	const demoData = props.data;
	const dataTreeCate = createDataTree(
		demoData,
		(i) => i.sapDataVariableId,
		(i) => i.parentId,
		subItemsField
	);
	const offset = useRef({ left: 0, top: 0 });
	const [showContextMenu, setShowContextMenu] = useState(false);
	const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
	const [selectedState, setSelectedState] = React.useState({});
	const [showPopupView, setShowPopupView] = React.useState(false);
	const [showPopupEdit, setShowPopupEdit] = React.useState(false);
	const [btnLoading, setBtnLoading] = React.useState(false);
	const [selected, setSelected] = React.useState(0);
	const [showAlertDel, setShowAlertDel] = React.useState(false);
	const [showAlert, setShowAlert] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const handleSelect = (e) => {
		setSelected(e.selected);
	};
	const [expandedState, setExpandedState] = React.useState({
		1: true,
		2: true,
		32: true,
	});
	const [stateCategory, setStateCategory] = React.useState(
		{
			data: [],
			itemInEdit: undefined,
		}
	);
	useEffect(() => {
		setStateCategory({
			data: [...dataTreeCate],
			itemInEdit: undefined,
		})
	}, [demoData])
	const columnsCategory = [
		{
			field: "Personal Information",
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
						<td style={{ border: "none" }}>
							<button
								className="me-2"
								style={{ border: "none" }}
								onClick={() => {
									//   setShowAddPopupSap(true);
									props.setShowAddPopupVariable(true)
									props.setIsFolder(true)
									props.setParentIdVariable(null)
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
									//   setShowAddPopupSap(true);
									props.setShowAddPopupVariable(true)
									props.setIsFolder(false)
									props.setParentIdVariable(null)
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
			children: [
				{
					// field: "SapDataVariableTypeNameShort",
					field: "sapDataVariableNameShort",
					title: "SAP Data Variable",
					expandable: true,
					width: "300px",
					cell: (props) => (
						<CustomCell
							{...props}
							onRowClick={() => { 
								setSelectedRow(props.dataItem)
								// console.log('props.dataItem', props.dataItem) 
							}}
							expandIconClick={() => { }}
							isCalledFromSapVariablesTable={true}
						/>
					),

				},
				{
					// field: "SapDataVariableTypeNameShort",
					field: "sapDataVariableTypeShortName",
					title: " SAP Data Variable Type ",

					width: "500px",
					cell: (props) => (
						<CustomCellVariable
							{...props}
							onRowClick={() => { }}
							expandIconClick={() => { }}
							isCalledFromSapVariablesTable={true}
						/>
					),

				},
			]
		},
	];
	const onExpandChangeCategory = React.useCallback(
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
	};
	const handleCloseMenu = () => {
		setShowContextMenu(false);
	}
	const handleDelete = async () => {
		// console.log('select122', selectedRow)
		// return
		setShowAlertDel(false)
		setMessage('Variable deleted successfully.')
		const response = await deleteVariableInput(selectedRow.sapDataVariableGuid);
		if (response.status === 200) {
			props.getVariable(props.id)
			setShowAlert(true)
		}
	}
	const handleOnSelect = (e) => {
		switch (e.item.data.action) {
			case "delete":
				setShowAlertDel(true)
				break;
			case "view":
				setShowPopupView(true)
				break;
			case "edit":
				setShowPopupEdit(true)
				break;
			case "addItem":
				props.setShowAddPopupVariable(true);
				props.setIsFolder(false);
				props.setParentIdVariable(selectedRow.sapDataVariableId)
				break;
			case "addFolder":
				props.setShowAddPopupVariable(true);
				props.setIsFolder(true);
				props.setParentIdVariable(selectedRow.sapDataVariableId)
				break;
			default:
		}
		console.log('selectedRow', selectedRow)
		setShowContextMenu(false);
	};
	const formik = useFormik({
		initialValues: {
			shortName: selectedRow.sapDataVariableNameShort,
			longName: selectedRow.sapDataVariableNameLong,
			desc: selectedRow.sapDataVariableDescription
		},
		enableReinitialize: true,
		// validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				"sapDataVariableId": selectedRow.sapDataVariableId,
				"sapDataVariableGuid": selectedRow.sapDataVariableGuid,
				"companyId": 1,
				"sapId": 43,
				"sapVersionId": 24,
				"sapDataCollectionId": selectedRow.sapDataCollectionId,
				"sapDataDatasetId": selectedRow.sapDataDatasetId,
				"parentId": selectedRow.parentId,
				"parentGuid": selectedRow.parentGuid,
				"isFolder": selectedRow.isFolder,
				"sapDataVariableNameShort": values.shortName,
				"sapDataVariableNameLong": values.longName,
				"sapDataVariableDescription": values.desc,
				"sapDataVariableTypeId": selectedRow.sapDataVariableTypeId,
				"sapDataVariableTypeShortName": "string",
				"displayOrder": selectedRow.displayOrder,
				"createdBy": null,
				"updatedBy": null,
				"sapDataVariableInputDTOs": []
			}
			setBtnLoading(true)
			setMessage('Variable has been updated successfully.');
			const response = await updateVariable(reqBody);
			if (response.status == 200) {
				props.getVariable(props.id)
				setBtnLoading(false)
				setShowPopupEdit(false)
				// alert('Updated succesfully')
				setShowAlert(true)
			}
			console.log('values', values)
		},
	});
	return (

		<div className="vh-100 tree_list_scroll td-hover td-icon">
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
				selectable={{
					enabled: true,
				}}
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
			<ContextMenu
				show={showContextMenu}
				offset={offset.current}
				onSelect={handleOnSelect}
				onClose={handleCloseMenu}
				className="context-menu"
			>
				<MenuItem
					text="View"
					data={{ action: "view" }}
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
			<div class={`modal fade  ${showPopupView ? "show d-block" : ""} `} id="exampleModal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Variable View {selectedRow.isFolder ? 'Folder' : 'Item'}</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setShowPopupView(false)}
							></button>
						</div>
						<div class="modal-body">
							<form>
								<div className="mt-3">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Short Name </label>
											<input type="text" class="form-control" id="shortName" name="shortName" value={selectedRow.sapDataVariableNameShort} readOnly />
										</div>
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Long Name </label>
											<input type="text" class="form-control" id="longName" name="longName" value={selectedRow.sapDataVariableNameLong} readOnly />
										</div>
									</div>
									<div class="mb-3">
										<label htmlFor="exampleInputEmail1" class="form-label">Description</label>
										<input type="text" class="form-control" id="desc" name="desc" value={selectedRow.sapDataVariableDescription} readOnly />
									</div>
									{/* {!isFolderVariable && */}
										<>
											<div className={`mb-3 ${selectedRow.isFolder ? "d-none" : ""}`}>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Variable Content Type
												</label>
												<select
													class="form-select form-control"
													aria-label="Default select example"
													placeholder="select dataset type"
													name="variableContentType"
													
												>
													<option selected value="">
														select variable content type
													</option>
													{props.terminologyVariable.length > 0 &&
														props.terminologyVariable.map((x, i) => {
															return (
																<option
																	key={i}
																	value={x.libraryControlledTerminologyId}
																>
																	{x.libraryControlledTerminologyNameShort}
																</option>
															);
														})}
												</select>
											</div>
											<div className={`mb-3 ${selectedRow.isFolder ? "d-none" : ""}`}>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Value Type
												</label>
												<select
													class="form-select form-control"
													aria-label="Default select example"
													placeholder="select dataset type"
													name="valueType"
													
												>
													<option selected value="">
														select variable type
													</option>
													{props.terminologyValueType.length > 0 &&
														props.terminologyValueType.map((x, i) => {
															return (
																<option
																	key={i}
																	value={x.libraryControlledTerminologyId}
																>
																	{x.libraryControlledTerminologyNameShort}
																</option>
															);
														})}
												</select>
											</div>
										</>
									{/* } */}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div class={`modal fade  ${showPopupEdit ? "show d-block" : ""} `} id="exampleModal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Variable Edit {selectedRow.isFolder ? 'Folder' : 'Item'}</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setShowPopupEdit(false)}
							></button>
						</div>
						<div class="modal-body">
							<form onSubmit={formik.handleSubmit}>
								<div className="mt-3">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Short Name </label>
											<input type="text" class="form-control" id="shortName" name="shortName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.shortName} />
										</div>
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">Long Name </label>
											<input type="text" class="form-control" id="longName" name="longName" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.longName} />
										</div>
									</div>
									<div class="mb-3">
										<label htmlFor="exampleInputEmail1" class="form-label">Description</label>
										<input type="text" class="form-control" id="desc" name="desc" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.desc} />
									</div>
									{/* {!isFolderVariable && */}
									<>
											<div className={`mb-3 ${selectedRow.isFolder ? "d-none" : ""}`}>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Variable Content Type
												</label>
												<select
													class="form-select form-control"
													aria-label="Default select example"
													placeholder="select dataset type"
													name="variableContentType"
													
												>
													<option selected value="">
														select variable content type
													</option>
													{props.terminologyVariable.length > 0 &&
														props.terminologyVariable.map((x, i) => {
															return (
																<option
																	key={i}
																	value={x.libraryControlledTerminologyId}
																>
																	{x.libraryControlledTerminologyNameShort}
																</option>
															);
														})}
												</select>
											</div>
											<div className={`mb-3 ${selectedRow.isFolder ? "d-none" : ""}`}>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Value Type
												</label>
												<select
													class="form-select form-control"
													aria-label="Default select example"
													placeholder="select dataset type"
													name="valueType"
													
												>
													<option selected value="">
														select variable type
													</option>
													{props.terminologyValueType.length > 0 &&
														props.terminologyValueType.map((x, i) => {
															return (
																<option
																	key={i}
																	value={x.libraryControlledTerminologyId}
																>
																	{x.libraryControlledTerminologyNameShort}
																</option>
															);
														})}
												</select>
											</div>
										</>
									{/* } */}
									<div className="d-flex">
										<button type="submit" className="btn btn-primary w-100 mt-2 me-2"
											// onClick={() => setShowPopupEdit(false)}
											disabled={
												formik.values.shortName == selectedRow.sapDataVariableNameShort &&
												formik.values.longName == selectedRow.sapDataVariableNameLong &&
												formik.values.desc == selectedRow.sapDataVariableDescription
											}
										>
											{btnLoading ? (
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											) : (
												""
											)}

											Save
										</button>
										<button type="button" className="btn btn-outline-primary w-100 mt-2"
											onClick={() => {
												formik.resetForm();
											}}
											disabled={
												formik.values.shortName == selectedRow.sapDataVariableNameShort &&
												formik.values.longName == selectedRow.sapDataVariableNameLong &&
												formik.values.desc == selectedRow.sapDataVariableDescription
											}
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
			<SweetAlert
				show={showAlertDel}
				danger
				showCancel
				cancelBtnText="No"
				confirmBtnText="Yes"
				confirmBtnBsStyle="primary"
				cancelBtnBsStyle="secondary"
				title="Are you sure?"
				onConfirm={() => handleDelete()}
				onCancel={() => setShowAlertDel(false)}
				focusCancelBtn
			>
				Are you sure you want to delete this ?
			</SweetAlert>
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
		</div>
	);
};
export default VariableInput;