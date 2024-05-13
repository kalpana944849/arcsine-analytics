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
import {
	getParsedFromLocalStorage,
	handleContextMenu,
	onChange,
	formatTimestamp
} from "../../utils/common-helper";
import { getter } from "@progress/kendo-react-common";
import RowRender from "../../components/common/RowRender";
import CustomCell from "../../components/common/CustomCell";
import Version from "../../components/layout/Version";
import {
	addSap,
	addVersion,
	updateVersion,
	getSap,
	getSapId,
	getSapType,
	updateSap,
} from "../../services/statistical-analysis-plan-service";
import fileImg from "../../assets/images/file.svg";
import { Grid, GridCell, GridColumn } from "@progress/kendo-react-grid";
import "@progress/kendo-theme-default/dist/all.css";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import CustomLoader from "../../utils/Loaders/CustomLoader";
import commonSchema from "../../utils/validationSchema/common-schema";

const expandField = "expanded";
const subItemsField = "employees";
const editField = "inEdit";
const DATA_ITEM_KEY = "sapId";
const SELECTED_FIELD = "selected";
const DATA_ITEM_KEY_VERSION = "sapVersionGuid";
const SELECTED_FIELD_VERSION = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const idGetterVer = getter(DATA_ITEM_KEY_VERSION);

const StatisticalAnalysisPlan = ({
	setSapItem,
	setCheckedVersion,
	setSapVersionNameShort,
	checkedVersion,
	showGeneral,
	setShowGeneral,
	setShowSap,
	setShowAnDef,
}) => {
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
	const sapData = getParsedFromLocalStorage("SapData", []);
	// const demoData = JSON.parse(localStorage.getItem("SapData")) || [];
	const [sapVersion, setSapVersion] = useState([]);
	const [rollName, setRollNmae] = useState(null);
	const [Loader, showLoader] = React.useState(false);
	const [itemSelectedState, setItemSelectedState] = React.useState(false);

	const [stateCategory, setStateCategory] = React.useState({
		data: [],
		itemInEdit: undefined,
	});

	const [selectedState, setSelectedState] = React.useState(() => {
		return JSON.parse(localStorage.getItem("SAPselectedState")) || {};
	});

	const [expandedState, setExpandedState] = React.useState(() => {
		return JSON.parse(localStorage.getItem("SAPexpandedState")) || {};
	});

	const getSAP = async (loading, isEdit = false) => {
		setLoading(loading);
		const response = await getSap();

		if (response.status == 200) {
			localStorage.setItem("SapData", JSON.stringify(response.data.data));
			const dataTreeCate = createDataTree(
				response.data.data,
				(i) => i.sapId,
				(i) => i.parentId,
				subItemsField
			);
			//showLoader(false);
			setStateCategory({
				...stateCategory,
				data: dataTreeCate,
			});
			if (isEdit) {
				const updatedData = response.data.data.find((x) => x.sapId == selectedRow.sapId)
				localStorage.setItem("sapDataItem", JSON.stringify(updatedData));
				setSelectedRow(updatedData)
			}

			setLoading(false);
		}
	};

	const getSAPId = async (id, userId) => {
		const response = await getSapId(id, userId);
		if (response.status == 200) {
			localStorage.setItem("SapDataId", JSON.stringify(response.data.data));
			localStorage.setItem(
				"SAP_Version",
				JSON.stringify(response.data.data?.sapVersionDTOs)
			);
			setSapVersion(response.data.data?.sapVersionDTOs);

			localStorage.setItem(
				"sapVersionId",
				response.data.data?.sapVersionDTOs[0].sapVersionId
			);

			localStorage.setItem(
				"sapVersionNumber",
				response.data.data?.sapVersionDTOs[0].sapVersionNumber
			);

			setCheckedVersion(response.data.data?.sapVersionDTOs[0].sapVersionNumber);
			const sapVersionGuid =
				response.data.data?.sapVersionDTOs[0].sapVersionGuid;
			let obj = {};
			obj[sapVersionGuid] = true;
			setSelectedStateVer(obj);

			setSapVersionNameShort(
				response.data.data?.sapVersionDTOs[0].sapVersionNameShort
			);

			setCheckedState(response.data.data?.sapVersionDTOs[0].sapVersionGuid);
			setRollNmae(response.data.data?.roleName);
			// alert(1)
			// console.log('response.data.data?.roleName', response.data.data)

			const dataTreeCate = createDataTree(
				sapData,
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

	const version = process.env.REACT_APP_VERSION;

	const [showSelected, setShowSelected] = React.useState(false);
	const [shortName, setShortName] = useState("");
	const [longName, setLongName] = useState("");
	const [desc, setDesc] = useState("");
	const [sapVersionShortName, setSapVersionShortName] = useState("");
	const [sapVersionLongName, setSapVersionLongName] = useState("");
	const [sapVersionNumber, setSapVersionNumber] = useState();
	const [sapVersionDate, setSapVersionDate] = useState();

	const [showAddPopup, setShowAddPopup] = React.useState(false);
	const [showAddPopupSap, setShowAddPopupSap] = React.useState(false);
	const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);
	const [parentId, setParentId] = React.useState(null);
	const [isFolder, setIsFolder] = React.useState(false);
	const [showFolderItem, setShowFolderItem] = React.useState(false);
	const [isActive, setActive] = React.useState(false);
	const [selectedStateVer, setSelectedStateVer] = React.useState({});
	const [loading, setLoading] = useState(false);
	const [checkedState, setCheckedState] = useState("");
	const [selectedRowContext, setSelectedRowContext] = React.useState([{ parentId: null }]);
	const [sapTypeName, setSapTypeName] = useState('CSR Final Analysis');
	const [versionModalTitle, setVersionModalTitle] = useState('Add');
	const [selectedVersion, setSelectedVersion] = useState(null);

	const onSelectionChangeVer = (event) => {
		const newSelectedState = getSelectedState({
			event,
			selectedState: selectedState,
			dataItemKey: DATA_ITEM_KEY_VERSION,
		});
		// const selectedItem = event.dataItems.find(x => x.sapVersionGuid == Object.keys(newSelectedState)[0]);

		setSelectedStateVer(newSelectedState);
		document.getElementById(Object.keys(newSelectedState)[0]).click();
	};

	const resetVersionForm = (param) => {
		const { sapVersionNumber, sapVersionNameShort, sapVersionNameLong, sapVersionDescription } = param;
		formik.setFieldValue('number', sapVersionNumber);
		formik.setFieldValue('shortName', sapVersionNameShort);
		formik.setFieldValue('longName', sapVersionNameLong);
		formik.setFieldValue('desc', sapVersionDescription);
	};

	const handleToggle = () => {
		setActive(!isActive);
	};

	// const [expandedState, setExpandedState] = React.useState({
	//   1: true,
	//   2: true,
	//   32: true,
	// });

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

	const onSelectionChange = React.useCallback((event) => {
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
		localStorage.setItem(
			"SAPselectedState",
			JSON.stringify(newSelectedState)
		);

		setItemSelectedState(newSelectedState);

		if (Object.values(newSelectedState).some(value => !value)) {
			localStorage.removeItem("rowId");
			localStorage.removeItem("sapDataItem");
			setRowId("");
			setSapItem("");
			setShowSelected(false);
			setCheckedVersion(false);
		} else {
			setShowSelected(true);
		}
	}, [selectedState]);

	const openContextMenu = (dataItem) => {
		setSelectedRowContext(dataItem)

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
	const handleDetailFolder = () => { };
	const handleAddFolder = () => {
		setShowAddPopupSap(true);
	};
	const handleAddItem = () => {
		console.log("selectedRow", selectedRow);
		setParentId(selectedRow.sapId);
		setShowAddPopupSap(true);
	};
	const handleEditFolder = () => {
		setShowAddPopupSap(true);
	};
	const handleDeleteFolder = () => { };
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

	let sapRowId = localStorage.getItem('sapRowId') ? localStorage.getItem('sapRowId') : ''
	const onCategoryRowClick = (event, props) => {
		const { dataItem } = props;
		const current_id = dataItem.sapId
		if ((current_id == sapRowId)) {
			return false;
		}

		setSelectedRow(dataItem);
		props.selectionChange(event);

		localStorage.setItem("rowId", props.id);
		localStorage.setItem("sapDataItem", JSON.stringify(dataItem));
		localStorage.setItem('sapRowId', props.dataItem.sapId);
		setShortName(dataItem.sapNameShort);
		setLongName(dataItem.sapNameLong);
		setDesc(dataItem.sapDescription);
		setSapItem(dataItem);
		getSAPId(dataItem.sapGuid, 16);
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
						<td>SAP</td>
						<td style={{ border: "none" }}>
							<button
								className="me-2"
								style={{ border: "none" }}
								onClick={() => {
									setShowAddPopupSap(true);
									setParentId(0);
									setIsFolder(true);
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
									setParentId(0);
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

	useEffect(() => {
		getSAP(true);
		localStorage.setItem("SAPexpandedState", JSON.stringify(expandedState));
		localStorage.setItem("SAPselectedState", JSON.stringify(selectedState));

		localStorage.setItem(
			"SAPitemSelectedState",
			JSON.stringify(itemSelectedState)
		);
	}, [expandedState]);
	const [selectedRowVer, setSelectedRowVer] = useState(null);

	const handleRowClick = (event, props) => {
		if (selectedRowVer === props.dataItem) {
			setSelectedRowVer(null); // Unselect the row if it's already selected
		} else {
			setSelectedRowVer(props.dataItem);
		}
		props.selectionChange(event);
	};

	let customColumnTemplate = GridCell;
	customColumnTemplate = (props) => {
		const handleVersionChange = (event) => {
			setCheckedState(event.target.value);
			setCheckedVersion(props.dataItem.sapVersionNumber);
			setSapVersionNumber(props.dataItem.sapVersionNumber);
			setSapVersionNameShort(props.dataItem?.sapVersionNameShort);
			setSapVersionShortName(props.dataItem?.sapVersionNameShort);
			setSapVersionLongName(props.dataItem.sapVersionNameLong);
			setSapVersionDate(props.dataItem.sapVersionDate);
		};
		return (
			<td
				colspan="1"
				class="k-table-td"
				role="gridcell"
				aria-colindex="2"
				aria-selected="false"
				data-grid-col-index="1"
				tabindex="0"
				data-keyboardnavlevel="0"
				data-keyboardnavid="63486f03-b20c-4056-b658-b9930a74e9a3_2-1_cell"
				style={{ left: "0px", right: "0px" }}
			>
				<input
					type="radio"
					name="rowSelector"
					disabled={rollName == "Reviewer" ? true : false}
					value={props.dataItem.sapVersionGuid}
					onChange={handleVersionChange}
					checked={checkedState === props.dataItem.sapVersionGuid}
					id={props.dataItem.sapVersionGuid}
				/>
				{/* <RadioButton name="rowSelector" checked={selectedStateVer[idGetter(props.dataItem)]} value={props.dataItem.sapVersionGuid} onChange={handleVersionChange} id={props.dataItem.sapVersionGuid}/> */}
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

	const handleContextMenuVersion = (event) => {
		handleContextMenuOpenVersion(event.syntheticEvent);
		const { dataItem, field } = event;
		resetVersionForm(dataItem);
		setSelectedVersion(dataItem);

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
			desc: ""
		},
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapVersionId: selectedVersion ? selectedVersion.sapVersionId : 0,
				sapVersionGuid: selectedVersion ? selectedVersion.sapVersionGuid : "",
				companyId: selectedVersion ? selectedVersion.companyId : 1,
				sapId: selectedVersion ? selectedVersion.sapId : selectedRow.sapId,
				sapVersionNumber: values.number,
				sapVersionNameShort: values.shortName,
				sapVersionNameLong: values.longName,
				sapVersionDescription: values.desc
			};
			var response;

			if (versionModalTitle === 'Add') {
				response = await addVersion(reqBody);
			} else if (versionModalTitle === "Update") {
				response = await updateVersion(reqBody);
			}

			if (response.status == 200) {
				resetForm();
				setMessage(`Version has been ${versionModalTitle === "Add" ? 'added' : 'updated'} successfully.`);
				setShowAddPopup(false);
				setShowAlert(true);
				getSAPId(selectedRow.sapGuid, 16);
			}
		}
	});

	const formikSap = useFormik({
		initialValues: {
			shortName: "",
			longName: "",
			desc: "",
			sapType: ""
		},
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapId: 0,
				sapGuid: "",
				contentTypeId: 0,
				companyId: 1,
				parentId: parentId,
				parentGuid: "",
				isFolder: isFolder,
				sapNameShort: values.shortName,
				sapNameLong: values.longName,
				sapDescription: values.desc,
				sapTypeId: values.sapType,
				sapTypeName: sapTypeName,
				displayOrder: 1,
				roleName: null,
				sapVersionDTOs: null,
				createdBy: null,
				updatedBy: null,
				selected: false,
			};
			console.log("reqBody", reqBody);
			setMessage("SAP has been added successfully.");
			const response = await addSap(reqBody);
			if (response.status == 200) {
				setShowAlert(true);
				getSAP(false);
				setShowAddPopupSap(false);
				resetForm();
			}
		},
	});

	// const sapDataItem = JSON.parse(localStorage.getItem("sapDataItem"));
	const sapDataItem = getParsedFromLocalStorage("sapDataItem", {});
	const SAP_Version = getParsedFromLocalStorage("SAP_Version", []);



	console.log('sapDataItemsapDataItem', sapDataItem)

	useEffect(() => {
		if (Object.keys(sapDataItem).length > 0) {
			setShowSelected(true);
			setSelectedRow(sapDataItem);
		}

		if (sapData) {
			const dataTreeCate = createDataTree(
				sapData,
				(i) => i.sapId,
				(i) => i.parentId,
				subItemsField
			);

			setStateCategory({
				...stateCategory,
				data: dataTreeCate,
			});
		}
		if (SAP_Version.length > 0) {
			setSapVersion(SAP_Version);
			setSapVersionNumber(SAP_Version[0].sapVersionNumber);
			setSapVersionNameShort(SAP_Version[0].sapVersionNameShort);
			setSapVersionShortName(SAP_Version[0].sapVersionNameShort);
			setSapVersionLongName(SAP_Version[0].sapVersionNameLong);
			setSapVersionDate(SAP_Version[0].sapVersionDate);
			setCheckedState(SAP_Version[0].sapVersionGuid);
			const sapVersionGuid = SAP_Version[0].sapVersionGuid;
			let obj = {};
			obj[sapVersionGuid] = true;
			setSelectedStateVer(obj);
		}
	}, []);

	const formikSapSave = useFormik({
		initialValues: {
			shortName: selectedRow?.sapNameShort,
			longName: selectedRow?.sapNameLong,
			desc: selectedRow?.sapDescription,
			sapType: selectedRow?.sapTypeId,
		},
		validationSchema: commonSchema,
		enableReinitialize: true,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapId: selectedRow.sapId,
				sapGuid: selectedRow.sapGuid,
				contentTypeId: 0,
				companyId: 1,
				parentId: selectedRow.parentId,
				parentGuid: selectedRow.parentGuid,
				isFolder: false,
				sapNameShort: values.shortName,
				sapNameLong: values.longName,
				sapDescription: values.desc,
				sapTypeId: values.sapType,
				sapTypeName: sapTypeName,
				displayOrder: 1,
				roleName: selectedRow.roleName,
				sapVersionDTOs: null,
				createdBy: selectedRow.createdBy,
				updatedBy: selectedRow.updatedBy,
			};
			console.log('reqBody', reqBody);
			console.log('selectedRow', selectedRow);
			setMessage("SAP has been updated successfully.");
			const response = await updateSap(reqBody);
			if (response.status == 200) {
				setShowAlert(true);
				getSAP(true, true);
				// const currentSap = stateCategory.data.find((x)=>x.sapId == sapDataItem.sapId)
				setShowGeneral(false);
				setShowAnDef(false);
				// formikSapSave.values.shortName = currentSap?.sapNameShort;
				// formikSapSave.values.longName = currentSap?.sapNameLong;
				// formikSapSave.values.desc = currentSap?.sapDescription;
				// formikSapSave.values.sapType = currentSap?.sapTypeId;
			}
			console.log("reqBody", reqBody);
		},
	});

	const formikSapGeneral = useFormik({
		initialValues: {
			shortName: selectedRow?.sapNameShort,
			longName: selectedRow?.sapNameLong,
			desc: selectedRow?.sapDescription,
			sapType: selectedRow?.sapTypeId,
		},
		enableReinitialize: true,
		onSubmit: async (values, { resetForm }) => {
			console.log("val", values);
			const reqBody = {
				sapId: selectedRow.sapId,
				sapGuid: selectedRow.sapGuid,
				contentTypeId: 0,
				companyId: 1,
				parentId: selectedRow.parentId,
				parentGuid: selectedRow.parentGuid,
				isFolder: false,
				sapNameShort: values.shortName,
				sapNameLong: values.longName,
				sapDescription: values.desc,
				sapTypeId: values.sapType,
				sapTypeName: sapTypeName,
				displayOrder: 1,
				roleName: null,
				sapVersionDTOs: null,
				createdBy: null,
				updatedBy: null,
			};
			setMessage("SAP has been updated successfully.");
			const response = await updateSap(reqBody);
			if (response.status == 200) {
				getSAP(true, true);
				setShowAlert(true);
			}
		},
	});

	const customColumnForVersionDate = (props) => {
		return (
			<td>
				{formatTimestamp(props.dataItem.sapVersionDate)}
			</td>
		);
	};
	const [sapType, setSapType] = useState([])

	/**
	 * Get Sap Data Type List ...
	 */
	const getSatDataType = async () => {
		const response = await getSapType(1054);
		if (response.status == 200) {
			setSapType(response.data.data)
		}
		console.log('sapType', response);
	}

	useEffect(() => {
		getSatDataType()
	}, []);

	const handleOnSelectVersion = (e) => {
		switch (e.item.data.action) {
			case "view":
				setShowAddPopup(true);
				setVersionModalTitle('View');
				break;
			case "edit":
				setShowAddPopup(true);
				setVersionModalTitle('Update');
				break;
			default:
		}
		setShow(false);
	};

	return (
		<section className="main_content">
			{/* {Loader === true ? <FullScreenLoader /> : ""} */}
			<div className="icon-treelist">
				{showGeneral ? (
					<div
						style={{ border: "none", width: "100%" }}
						className={`icon-treelist-form`}
					>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								formikSapGeneral.handleSubmit();
							}}
						>
							<th
								style={{
									top: "0px",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							></th>
							<div className="mt-3 ">
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
											readOnly={rollName == "Reviewer" ? true : false}
											name="shortName"
											onBlur={formikSapGeneral.handleBlur}
											onChange={(e) => {
												formikSapGeneral.handleChange(e);
											}}
											value={formikSapGeneral.values.shortName}
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
											readOnly={rollName == "Reviewer" ? true : false}
											name="longName"
											onBlur={formikSapGeneral.handleBlur}
											onChange={(e) => {
												formikSapGeneral.handleChange(e);
											}}
											value={formikSapGeneral.values.longName}
										/>
									</div>
								</div>
								<div class="row mb-3">
									<div class="col">
										<label htmlFor="exampleInputEmail1" class="form-label">
											Description
										</label>
										<input
											type="text"
											class="form-control"
											// readOnly={rollName == "Reviewer" ? true : false}
											name="desc"
											onBlur={formikSapGeneral.handleBlur}
											onChange={(e) => {
												formikSapGeneral.handleChange(e);
											}}
											value={formikSapGeneral.values.desc}
										/>
									</div>
									<div class="col">
										<label htmlFor="exampleInputEmail1" class="form-label">
											Sap Type
										</label>
										<select
											id="sapType"
											name="sapType"
											class="form-select form-control"
											onChange={(e) => {
												formikSapGeneral.handleChange(e);
												formikSapGeneral.setFieldValue(
													"sapType",
													e.target.value
												);
												const sapName = sapType.find((x) => x.libraryControlledTerminologyId == e.target.value)
												setSapTypeName(sapName.libraryControlledTerminologyNameShort);
											}}
											onBlur={formikSapGeneral.handleBlur}
											value={formikSapGeneral.values.sapType}
										>
											{sapType.length > 0 &&
												sapType?.map((x, i) => {
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
								</div>
								<hr />
								<h5>Version</h5>
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
											readOnly={rollName == "Reviewer" ? true : false}
											name="shortName"
											onChange={(e) => {
												setSapVersionNameShort(e.target.value);
												setSapVersionShortName(e.target.value);
											}}
											value={sapVersionShortName}
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
											readOnly={rollName == "Reviewer" ? true : false}
											name="longName"
											onChange={(e) => {
												setSapVersionLongName(e.target.value);
											}}
											value={sapVersionLongName}
										/>
									</div>
								</div>
								<div class="row mb-3">
									<div class="col">
										<label htmlFor="exampleInputEmail1" class="form-label">
											Number
										</label>
										<input
											type="text"
											class="form-control"
											id="shortName"
											readOnly={rollName == "Reviewer" ? true : false}
											onChange={(e) => {
												setSapVersionNumber(e.target.value);
											}}
											name="Version Number"
											value={sapVersionNumber}
										/>
									</div>
									<div class="col">
										<label htmlFor="exampleInputEmail1" class="form-label">
											Version Date
										</label>
										<input
											type="text"
											class="form-control"
											id="longName"
											readOnly={rollName == "Reviewer" ? true : false}
											onChange={(e) => {
												setSapVersionDate(e.target.value);
											}}
											name="Version Date"
											value={formatTimestamp(sapVersionDate)}
										/>
									</div>
								</div>
								{rollName == "Reviewer" ? (
									""
								) : (
									<div className="d-flex">
										<button
											type="submit"
											className="btn btn-primary w-100 mt-2 me-2"
											disabled={
												formikSapGeneral.values.shortName ==
												sapDataItem.sapNameShort &&
												formikSapGeneral.values.longName ==
												sapDataItem.sapNameLong &&
												formikSapGeneral.values.desc ==
												sapDataItem.sapDescription &&
												formikSapGeneral.values.sapType ==
												sapDataItem.sapTypeId &&
												sapVersionShortName ==
												sapVersion[0]?.sapVersionNameShort &&
												sapVersionLongName ==
												sapVersion[0]?.sapVersionNameLong &&
												sapVersionNumber == sapVersion[0].sapVersionNumber &&
												sapVersionDate == sapVersion[0].sapVersionDate
											}
										>
											Save
										</button>
										<button
											type="button"
											className="btn btn-outline-primary w-100 mt-2"
											disabled={
												formikSapGeneral.values.shortName ==
												sapDataItem.sapNameShort &&
												formikSapGeneral.values.longName ==
												sapDataItem.sapNameLong &&
												formikSapGeneral.values.desc ==
												sapDataItem.sapDescription &&
												formikSapGeneral.values.sapType ==
												sapDataItem.sapTypeId &&
												sapVersionShortName ==
												sapVersion[0]?.sapVersionNameShort &&
												sapVersionLongName ==
												sapVersion[0]?.sapVersionNameLong &&
												sapVersionNumber == sapVersion[0].sapVersionNumber &&
												sapVersionDate == sapVersion[0].sapVersionDate
											}
											onClick={() => {
												formikSapGeneral.resetForm();
												setSapVersionShortName(
													sapVersion[0].sapVersionNameShort
												);
												setSapVersionLongName(sapVersion[0].sapVersionNameLong !== null ? sapVersion[0].sapVersionNameLong : "");
												setSapVersionNumber(sapVersion[0].sapVersionNumber);
												setSapVersionDate(sapVersion[0].sapVersionDate);
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
					<Splitter
						style={{
							height: "100%",
						}}
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
								className="tree_scroll"
								style={{
									border: "none",
									maxHeight: "100%",
									overflow: "auto",
									scrollBehavior: "smooth",
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
										setSelectedRowContext,
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
						</div>
						{showSelected ? (
							<div
								style={{ border: "none" }}
								className={`icon-treelist-form ${showSelected ? "" : "d-none"}`}
							>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										formikSapSave.handleSubmit();
									}}
									className="version_table"
								>
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
												<label htmlFor="exampleInputEmail1" class="form-label">
													Short Name
													<sup className="text-danger">*</sup>
												</label>
												<input
													type="text"
													className={`form-control ${formikSapSave.touched.shortName &&
														formikSapSave.errors.shortName
														? "is-invalid"
														: ""
														}`}
													id="shortName"
													readOnly={rollName == "Reviewer" ? true : false}
													name="shortName"
													onBlur={formikSapSave.handleBlur}
													onChange={(e) => {
														formikSapSave.handleChange(e);
														setShortName(e.target.value);
													}}
													value={formikSapSave.values.shortName}
												/>
												{formikSapSave.touched.shortName &&
													formikSapSave.errors.shortName ? (
													<div className="invalid-feedback">
														{formikSapSave.errors.shortName}
													</div>
												) : (
													""
												)}
											</div>
											<div class="col">
												<label htmlFor="exampleInputEmail1" class="form-label">
													Long Name
												</label>
												<input
													type="text"
													class="form-control"
													id="longName"
													readOnly={rollName == "Reviewer" ? true : false}
													name="longName"
													onBlur={formikSapSave.handleBlur}
													onChange={(e) => {
														formikSapSave.handleChange(e);
														setLongName(e.target.value);
													}}
													value={formikSapSave.values.longName}
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
												onBlur={formikSapSave.handleBlur}
												onChange={(e) => {
													formikSapSave.handleChange(e);
													setDesc(e.target.value);
												}}
												value={formikSapSave.values.desc}
											/>
										</div>
										{!selectedRow.isFolder && <div class="mb-3">
											<label htmlFor="decode" class="form-label">Sap Type</label>
											<select
												id="sapType"
												name="sapType"
												class="form-select form-control"
												onChange={(e) => {
													formikSapSave.handleChange(e);
													formikSapSave.setFieldValue(
														"sapType",
														e.target.value
													);
													const sapName = sapType.find((x) => x.libraryControlledTerminologyId == e.target.value)
													setSapTypeName(sapName.libraryControlledTerminologyNameShort);
												}}
												onBlur={formikSapSave.handleBlur}
												value={formikSapSave.values.sapType}
											>
												{sapType.length > 0 &&
													sapType.map((x, i) => {
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
										</div> }
										<div className="mt-3 mb-3">
											<div
												className="mb-2"
												style={{
													display: "flex",
													justifyContent: "flex-end",
												}}
											></div>
											{!selectedRow.isFolder ? (
												<div className="hello version-grid">
													<Grid
														className="version-grid2"
														data={
															sapVersion?.map((item) => ({
																...item,
																[SELECTED_FIELD_VERSION]:
																	selectedStateVer[idGetterVer(item)],
															})) || []
														}
														selectable={{
															enabled: true,
															// cell: true,
														}}
														navigatable={true}
														onSelectionChange={onSelectionChangeVer}
														onContextMenu={handleContextMenuVersion}
														dataItemKey={DATA_ITEM_KEY_VERSION}
														selectedField={SELECTED_FIELD_VERSION}
														onRowClick={(e) => {
															document
																.getElementById(e.dataItem.sapVersionGuid)
																.click();
														}}
													>
														<GridColumn
															field=""
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
														<GridColumn
															field="sapVersionDate"
															title=" "
															cell={customColumnForVersionDate}
															headerCell={() => (
																<div
																	style={{
																		display: "flex",
																		justifyContent: "right",
																	}}
																>
																	<button
																		type="button"
																		style={{ border: "none" }}
																		className={`${rollName == "Reviewer" ? "d-none" : ""}`}
																		onClick={() => {
																			setShowAddPopup(true);
																			setSelectedVersion(null);
																		}}
																	>
																		<i
																			className="k-icon k-i-file-add k-color-dark"
																			title="Add File"
																		></i>
																	</button>
																</div>
															)}
														/>
													</Grid>
												</div>
											) : (
												""
											)}
										</div>
										{rollName == "Reviewer" ? (
											""
										) : (
											<div className="d-flex">
												<button
													type="submit"
													className="btn btn-primary w-100 mt-2 me-2"
													disabled={
														(formikSapSave.values.shortName ==
															selectedRow?.sapNameShort &&
															formikSapSave.values.longName ==
															selectedRow?.sapNameLong &&
															formikSapSave.values.desc ==
															selectedRow?.sapDescription &&
															formikSapSave.values.sapType ==
															selectedRow?.sapTypeId
														) ||
														(formikSapSave.touched.shortName &&
															formikSapSave.errors.shortName)
													}
												>
													{formikSapSave.isSubmitting && (
														<div
															className="spinner-border spinner-border-sm text-light me-2"
															role="status"
														></div>
													)}
													Save
												</button>
												<button
													type="button"
													className="btn btn-outline-primary w-100 mt-2"
													disabled={
														formikSapSave.values.shortName ==
														selectedRow?.sapNameShort &&
														formikSapSave.values.longName ==
														selectedRow?.sapNameLong &&
														formikSapSave.values.desc ==
														selectedRow?.sapDescription &&
														formikSapSave.values.sapType ==
														selectedRow?.sapTypeId
													}
													onClick={() => {
														formikSapSave.resetForm();
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
							<div
								className="d-flex justify-content-center align-items-center"
								style={{ height: "100%" }}
							>
								<p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
									SAP is not selected. Please select a SAP.
								</p>
							</div>
						)}
					</Splitter>
				)}

				<ContextMenu
					show={showFolderItem}
					offset={offset.current}
					onSelect={handleOnSelect}
					onClose={handleCloseMenu}
				>
					<MenuItem
						text={`Delete ${selectedRowContext.sapNameShort}`}
						data={{
							action: "deleteFolder",
						}}
						icon="delete"
					/>
					{/* <MenuItem
						data={{
						action: "addFolder",
						}}
						render={() => (
						<>
							<img src={folderImg} />
							Add {selectedRow.iconNameShort} Folder
						</>
						)}
					/> */}
					<MenuItem
						data={{
							action: "addItem",
						}}
						render={() => (
							<>
								<img src={fileImg} />
								Add {selectedRowContext.iconNameShort} Item
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
								action: "view"
							}}
							icon="eye"
						/>
						<MenuItem
							text="edit"
							data={{
								action: "edit"
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
							<h5 class="modal-title" id="exampleModalLabel">{versionModalTitle} Version</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									setShowAddPopup(false);
									setVersionModalTitle('Add');
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
								<div>
									<div class="row mb-3">
										<div class="col-12">
											<label htmlFor="exampleInputEmail1" class="form-label">
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
												readOnly={versionModalTitle === 'View'}
											/>
										</div>
									</div>
									<div class="row">
										<div class="col-12 mb-3">
											<label htmlFor="exampleInputEmail1" class="form-label">
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
												readOnly={versionModalTitle === 'View'}
											/>
										</div>
										<div class="col-12 mb-3">
											<label htmlFor="exampleInputEmail1" class="form-label">
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
												readOnly={versionModalTitle === 'View'}
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
											readOnly={versionModalTitle === 'View'}
										/>
									</div>
									{versionModalTitle === 'View' &&
										<div class="mb-3">
											<label htmlFor="exampleInputEmail1" class="form-label">Date</label>
											<input
												type="text"
												class="form-control"
												name="date"
												onBlur={formik.handleBlur}
												value={formatTimestamp(selectedVersion.createdDate)}
												readOnly={versionModalTitle === 'View'}
											/>
										</div>
									}
									{versionModalTitle !== 'View' &&
										<div className="d-flex">
											<button
												type="submit"
												className="btn btn-primary w-100 mt-2 me-2"
												disabled={
													selectedVersion !== null ? (
														formik.values.number == selectedVersion?.sapVersionNumber &&
														formik.values.shortName == selectedVersion?.sapVersionNameShort &&
														formik.values.longName == selectedVersion?.sapVersionNameLong &&
														formik.values.desc == selectedVersion?.sapVersionDescription
													) : (
														formik.values.number == '' &&
														formik.values.shortName == '' &&
														formik.values.longName == '' &&
														formik.values.desc == ''
													)
												}
											>
												{formik.isSubmitting && (
													<div
														className="spinner-border spinner-border-sm text-light me-2"
														role="status"
													></div>
												)}
												Save
											</button>
											<button
												type="button"
												className="btn btn-outline-primary w-100 mt-2"
												disabled={
													selectedVersion !== null ? (
														formik.values.number == selectedVersion?.sapVersionNumber &&
														formik.values.shortName == selectedVersion?.sapVersionNameShort &&
														formik.values.longName == selectedVersion?.sapVersionNameLong &&
														formik.values.desc == selectedVersion?.sapVersionDescription
													) : (
														formik.values.number == '' &&
														formik.values.shortName == '' &&
														formik.values.longName == '' &&
														formik.values.desc == ''
													)
												}
												onClick={() => {
													formik.resetForm();
													if (selectedVersion !== null) {
														resetVersionForm(selectedVersion);
													}
												}}
											>
												Discard
											</button>
										</div>
									}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div class={`modal-backdrop fade ${showAddPopup ? 'show' : 'd-none'}`}></div>

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
								onClick={(e) => {
									e.preventDefault();
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
								<div className="mt-3 ">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">
												Short Name <sup className="text-danger">*</sup>
											</label>
											<input
												type="text"
												className={`form-control ${formikSap.touched.shortName &&
													formikSap.errors.shortName
													? "is-invalid"
													: ""
													}`}
												id="shortName"
												name="shortName"
												// onBlur={formikSap.handleBlur}
												onChange={(e) => {
													// setShortName(e.target.value);
													formikSap.handleChange(e);
												}}
												value={formikSap.values.shortName}
											/>
											{formikSap.touched.shortName &&
												formikSap.errors.shortName ? (
												<div className="invalid-feedback">
													{formikSap.errors.shortName}
												</div>
											) : (
												""
											)}
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
												// onBlur={formikSap.handleBlur}
												onChange={(e) => {
													// setLongName(e.target.value);
													formikSap.handleChange(e);
												}}
												// value={longName}
												value={formikSap.values.longName}
											/>
											{/* {formikSap.touched.longName &&
                      formikSap.errors.longName ? (
                        <small className="text-danger validationError">
                          {formikSap.errors.longName}
                        </small>
                      ) : (
                        ""
                      )} */}
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
												// setDesc(e.target.value);
												formikSap.handleChange(e);
											}}
											// value={desc}
											value={formikSap.values.desc}
										/>
									</div>
									<div class={`mb-3 ${isFolder ? 'd-none' : ''}`}>
										<label htmlFor="decode" class="form-label">Sap Type</label>
										<select
											id="sapType"
											name="sapType"
											class="form-select form-control"
											onChange={(e) => {
												formikSap.handleChange(e);
												formikSap.setFieldValue(
													"sapType",
													e.target.value
												);
												if (e.target.value != '') {
													const sapName = sapType.find((x) => x.libraryControlledTerminologyId == e.target.value)
													setSapTypeName(sapName.libraryControlledTerminologyNameShort);
												}
											}}
											onBlur={formikSap.handleBlur}
											value={formikSap.values.sapType}
										>
											<option value="">Select Sap Type</option>
											{sapType.length > 0 &&
												sapType.map((x, i) => {
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
									<div className="d-flex">
										<button
											type="submit"
											className="btn btn-primary w-100 mt-2 me-2"
											disabled={
												(formikSap.values.shortName == "" &&
													formikSap.values.longName == "" &&
													formikSap.values.desc == "" &&
													formikSap.values.sapType == ""
												) ||
												(formikSap.touched.shortName &&
													formikSap.errors.shortName)
											}
										>
											{formikSap.isSubmitting && (
												<div
													className="spinner-border spinner-border-sm text-light me-2"
													role="status"
												></div>
											)}
											Save
										</button>
										<button
											type="button"
											className="btn btn-outline-primary w-100 mt-2"
											onClick={formikSap.resetForm}
											disabled={
												formikSap.values.shortName == "" &&
												formikSap.values.longName == "" &&
												formikSap.values.desc == "" &&
												formikSap.values.sapType == ""
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
		</section>
	);
};

export default StatisticalAnalysisPlan;
