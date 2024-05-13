import React, { useState } from "react";
import { getter } from "@progress/kendo-react-common";
import {
	TreeList,
	createDataTree,
	extendDataItem,
	mapTree
} from "@progress/kendo-react-treelist";

import RowRender from "../../components/common/RowRender";
import sapData from "../../flat-data";
import CustomCell from "../../components/common/CustomCell";
import { visitFlag } from './../../flat-data';

const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapId";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const SapTreeList = (props) => {
	const [selectedState, setSelectedState] = useState({});
	const [selected, setSelected] = useState(0);
	const [flagShowAddPopup, setFlagShowAddPopup] = useState(false);
	const [showMoveToDifferentFolderPopup, setShowMoveToDifferentFolderPopup] = useState(false);
	const [showVisiFlagAddFilePopup, setShowVisiFlagAddFilePopup] = useState(false);
	const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);

	const extendData = (dataState, selectedState, expandedState) => {
		return mapTree(dataState, subItemsField, (item) =>
			extendDataItem(item, subItemsField, {
				selected: selectedState[idGetter(item)],
				expanded: expandedState[idGetter(item)],
			})
		);
	};

	const demoData = props.data;
	const dataTreeCate = createDataTree(
		demoData,
		(i) => i.sapId,
		(i) => i.parentId,
		subItemsField
	);

	const [expandedState, setExpandedState] = React.useState({
		1: true,
		2: true,
		32: true,
	});
	const [stateCategory, setStateCategory] = React.useState({
		data: [...dataTreeCate],
		itemInEdit: undefined,
	});
	const columnsCategory = [
		{
			field: "sapNameShort",
			title: "Icon Name Short",
			expandable: true,
			width: "500px",
			cell: (props) => (
				<CustomCell
					{...props}
					onRowClick={onRowClick}
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
						{props.title === 'Visit Structure' &&
							<td style={{ border: "none" }}>
								<button
									style={{ border: "none" }}
									onClick={() => {
										setSelected(0);
										setShowAddPeriodModal(true);
									}}
								>
									<i
										className="k-icon k-i-file-add k-color-dark"
										title="Add File"
									></i>
								</button>
							</td>
						}
						{props.title === 'Visit Flag' &&
							<td style={{ border: "none" }}>
								<button
									className="me-2"
									style={{ border: "none" }}
									onClick={() => {
										setShowVisiFlagAddFilePopup(true);
									}}
								>
									<i
										className="k-icon k-i-file-add k-color-dark"
										title="Add File"
									></i>
								</button>
								<button
									style={{ border: "none" }}
									onClick={() => {
										setFlagShowAddPopup(true);
									}}
								>
									<i
										className="k-icon k-i-folder-add k-color-dark"
										title="Add Folder"
									></i>
								</button>
							</td>
						}
					</th>
				);
			},
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

	const onRowClick = async (event, props) => {
		setSelectedRow(props.dataItem);
	};

	return (
		<>
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
			/>

			{/* Visit Flag */}
			<div
				className={`modal fade  ${flagShowAddPopup ? "show d-block" : ""} `}
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Add Folder</h5>
							<button
								type="button"
								className="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setFlagShowAddPopup(false)}
							></button>
						</div>
						<div className="modal-body">
							<form>
								<div className="mt-3">
									<div className="row mb-3">
										<div className="col">
											<label htmlFor="exampleInputEmail1" className="form-label">Short Name</label>
											<input
												type="text"
												className="form-control"
												id="shortName"
												name="shortName"
											/>
										</div>
										<div className="col">
											<label htmlFor="exampleInputEmail1" className="form-label">Long Name</label>
											<input
												type="text"
												className="form-control"
												id="longName"
												name="longName"
											/>
										</div>
									</div>
									<div className="row mb-3">
										<div className="col">
											<label htmlFor="exampleInputEmail1" className="form-label">Description</label>
											<input
												type="text"
												className="form-control"
												id="descripiton"
												name="descripiton"
											/>
										</div>
									</div>
									<div className="d-flex">
										<button
											type="button"
											className="btn btn-primary w-100 mt-2 me-2"
										>
											Save
										</button>
										<button
											type="button"
											className="btn btn-primary w-100 mt-2"
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

			{/* Move to different folder */}
			<div
				className={`modal fade  ${showMoveToDifferentFolderPopup ? "show d-block" : ""} `}
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Move to Different Folder</h5>
							<button
								type="button"
								className="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setShowMoveToDifferentFolderPopup(false)}
							></button>
						</div>
						<div className="modal-body">
							<table className="table table-striped table-hover">
								<thead></thead>
								<tbody>
									<tr>
										<td>Visit Flag</td>
									</tr>
									<tr>
										<td>All Visits</td>
									</tr>
									<tr>
										<td>Randomized DB Period</td>
									</tr>
									<tr>
										<td>Randomized DB Period including Baseline Visit</td>
									</tr>
									<tr>
										<td>Follow-up Period</td>
									</tr>
								</tbody>
							</table>

							<div className="d-flex">
								<button
									type="button"
									className="btn btn-primary w-100 mt-2 me-2"
								>
									Save
								</button>
								<button
									type="button"
									className="btn btn-primary w-100 mt-2"
								>
									Discard
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Visit Flag Add File */}
			<div
				className={`modal fade  ${showVisiFlagAddFilePopup ? "show d-block" : ""} `}
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">Visit Flag</h5>
							<button
								type="button"
								className="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => setShowVisiFlagAddFilePopup(false)}
							></button>
						</div>
						<div className="modal-body">
							<form>
								<div className="mt-3">
									<div className="row mb-3">
										<div className="col">
											<label htmlFor="exampleInputEmail1" className="form-label">Short Name</label>
											<input
												type="text"
												className="form-control"
												id="shortName"
												name="shortName"
											/>
										</div>
										<div className="col">
											<label htmlFor="exampleInputEmail1" className="form-label">Long Name</label>
											<input
												type="text"
												className="form-control"
												id="longName"
												name="longName"
											/>
										</div>
									</div>
									<div className="row mb-3">
										<div className="col">
											<label htmlFor="exampleInputEmail1" className="form-label">Description</label>
											<input
												type="text"
												className="form-control"
												id="descripiton"
												name="descripiton"
											/>
										</div>
									</div>
									<div className="row mb-3">
										<div className="col-6">
											<label htmlFor="exampleInputEmail1" className="form-label">Label</label>
											<input
												type="text"
												className="form-control"
												id="label"
												name="label"
											/>
										</div>
									</div>
									<div className="row">
										<div className="col-12">
											<table className="table table-striped table-hover">
												<thead>
													<tr>
														<th>Select Visits</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>Period 1: Screening Period</td>
													</tr>
													<tr>
														<td>Period 2: Double-Blind Period</td>
													</tr>
													<tr>
														<td>Period 3: Follow-up Period</td>
													</tr>
													<tr>
														<td>General</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
									<div className="d-flex">
										<button
											type="button"
											className="btn btn-primary w-100 mt-2 me-2"
										>
											Save
										</button>
										<button
											type="button"
											className="btn btn-primary w-100 mt-2"
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
		</>
	);
};

export default SapTreeList;
