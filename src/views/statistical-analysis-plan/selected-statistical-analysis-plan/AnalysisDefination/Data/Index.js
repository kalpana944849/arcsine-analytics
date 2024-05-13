import React, { useEffect, useState } from "react";
import {
	getIdFromString,
	getParsedFromLocalStorage,
	handleContextMenu,
	onChange,
} from "../../../../../utils/common-helper";
import { ContextMenu, MenuItem, Splitter } from "@progress/kendo-react-layout";
import SweetAlert from "react-bootstrap-sweetalert";
import {
	TreeList,
	createDataTree,
	extendDataItem,
	getSelectedState,
	mapTree,
	removeItems,
} from "@progress/kendo-react-treelist";
import { getter } from "@progress/kendo-react-common";
import RowRender from "../../../../../components/common/RowRender";
import CustomCell from "../../../../../components/common/CustomCell";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import {
	addVariable,
	getControlledTerminology,
	getSapData,
	getSapDataCollection,
	getSapDataEndpoints,
	getSapDataSet,
	getSapEndpointInput,
	getVariableInput,
	updateCollection,
	updateSapDataSet,
	getLibraryCodingDictionary,
	deleteSapData
} from "../../../../../services/statistical-analysis-plan-service";
import VariableInput from "./VariableInput";
import EndPointInput from "./EndPointInput";
import { useFormik } from "formik";
import commonSchema from "../../../../../utils/validationSchema/common-schema";
import { dataGeneralSchema } from "../../../../../utils/validationSchema/validation-schema";
import MoveToDifferentFolder from "./MoveToDifferentFolderModal";
import VariableRelationship from "./VariableRelationship";

const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapDataGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const Data = props => {
	const {showData} = props;
	let expandObj = {};
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
	// const []
	const sapCollectionData =
		JSON.parse(localStorage.getItem("dataCollectionSap")) || [];
	const dataTreeCate = createDataTree(
		sapCollectionData,
		(i) => i.sapDataId,
		(i) => i.parentId,
		subItemsField
	);
	// const [selectedState, setSelectedState] = React.useState({});
	const [selectedState, setSelectedState] = React.useState(() => {
		return JSON.parse(localStorage.getItem("DataselectedState")) || {};
	});
	const [selected, setSelected] = React.useState(0);
	const [showAddPopup, setShowAddPopup] = React.useState(false);
	const [isFolder, setIsFolder] = React.useState(false);
	const [isFolderVariable, setIsFolderVariable] = React.useState(false);
	const [parentIdVariable, setParentIdVariable] = React.useState(null);
	const [showAddPopupVariable, setShowAddPopupVariable] = React.useState(false);
	const [btnLoading, setBtnLoading] = React.useState(false);
	const [showAlert, setShowAlert] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [VariableData, setVariableData] = React.useState([]);
	const [endpointData, setEndpointData] = useState([]);
	const [collectionData, setCollectionData] = React.useState({});
	const [dataSetTypeId, setDataSetTypeId] = useState("");
	const [terminology, setTerminology] = useState([]);
	const [terminologyVariable, setTerminologyVariable] = useState([]);
	const [terminologyValueType, setTerminologyValueType] = useState([]);
	const [reload, setReload] = useState([]);
	const [isOCCDSSelected, setIsOCCDSSelected] = useState(false);
	const [codingTypes, setCodingTypes] = useState([]);
	const [codingVersions, setCodingVersions] = useState([]);
	const [libraryCodingDictionary, setLibraryCodingDictionary] = useState([]);
	const [dataSet, setDataSet] = React.useState({
		sapDataDatasetNameShort: "",
		sapDataDatasetNameLong: "",
		sapDataDatasetDescription: "",
	});
	const [showMoveToDifferentFolderModal, setShowMoveToDifferentFolderModal] = useState(false);
	const handleSelect = (e) => {
		setSelected(e.selected);
		if (e.selected == 0) {
			getControlledTerminologyData(1028, setTerminology);
		} else if (e.selected == 1) {
			getControlledTerminologyData(1029, setTerminologyVariable);
			getControlledTerminologyData(1044, setTerminologyValueType);
		}
	};
	// const [expandedState, setExpandedState] = React.useState({
	//   1: true,
	//   2: true,
	//   32: true,
	// });
	const [expandedState, setExpandedState] = React.useState(() => {
		return JSON.parse(localStorage.getItem("DataexpandedState")) || expandObj;
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
	const getVariable = async (id) => {
		const response = await getVariableInput(id);
		if (response.status == 200) {
			setVariableData(response.data.data);
		}

		// arr1.forEach((x) => {
		//     let obj = {};
		//     if(x.sapDataVariableId != null && x.parentId == null){
		//         obj = {...x, sapDataVariableNameShort: `${x.sapDataVariableNameShort}: ${x.sapDataVariableTypeShortName}`}
		//         data.push(obj);
		//     } 
		//     else {
		//       response.data.data.forEach((y) => {
		//           if (y.sapDataVariableId == x.parentId) {
		//               let a = `${x.parentId}-0`;
		//               if (String(x.sapDataVariableId) != String(a)) {
		//                   obj = {...x, sapDataVariableNameShort: ` ${x.sapDataVariableNameShort}`}
		//                   data.push(obj);
		//               } else {
		//                   data.push(x);
		//               }
		//           }
		//       });
		//   }
		// });
	}

	const getCollection = async (id) => {
		const response = await getSapDataCollection(id);
		if (response.status == 200) {
			setCollectionData(response.data.data);
		}
	};

	const getEndpoint = async (sapID, sapVersionID, sapDataDatasetID) => {
		const response = await getSapDataEndpoints(sapID, sapVersionID, sapDataDatasetID);
		if (response.status === 200) {
			setEndpointData(response.data.data);
		}
	};

	const getDataSet = async (id, versionId) => {
		const response = await getSapDataSet(id, versionId);
		if (response.status == 200) {
			setDataSet(response.data.data);
			if (response.data.data.sapDataDatasetTypeId === 212) {
				setIsOCCDSSelected(true);
			} else {
				setIsOCCDSSelected(false);
			}
			// setDataSetTypeId(response.data.data?.sapDataDatasetTypeId);
			handleChangeCodingType(null, response.data.data.sapDataDatasetCodingDictionaryId);
		} else {
			setDataSet({
				sapDataDatasetNameShort: "",
				sapDataDatasetNameLong: "",
				sapDataDatasetDescription: "",
			});
		}
	};
	let dataRowId = localStorage.getItem('dataRowId') ? localStorage.getItem('dataRowId') : ''
	const [rowId, setRowId] = useState("");
	const [isChange, setIsChange] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const onRowClick = async (event, props) => {
		const current_id = props
		if ((current_id.dataItem.sapDataGuid == dataRowId)) {
			return false;
		}
		// if ((rowId === props.id) || (current_id == dataRowId)) {
		//   return false;
		// }
		if (isChange) {
			setShowDialog(true);
			return false;
		}

		setRowId(props.id);
		localStorage.setItem('dataRowId', props.dataItem.sapDataGuid);
		props.selectionChange(event);
		setSelected(0);
		setShowSelected(true);
		setSelectedRow(props.dataItem);
		console.log(props.dataItem);
		localStorage.setItem("dataSelectedRow", JSON.stringify(props.dataItem));
		const id = getIdFromString(props.dataItem.sapDataId);
		getVariable(id);
		getCollection(id);
		getDataSet(id, props.dataItem.sapVersionId);
		getEndpoint(dataSelectedRow.sapId, dataSelectedRow.sapVersionId,  id);
		getControlledTerminologyData(1028, setTerminology);
	};
	const [stateCategory, setStateCategory] = React.useState({
		data: [...dataTreeCate],
		itemInEdit: undefined,
	});
	const [showSelected, setShowSelected] = React.useState(false);
	const [selectedRowCotext, setSelectedRowContext] = React.useState(false);
	const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);

	const columnsCategory = [
		{
			field: "sapDataNameShort",
			title: "Icon Name Short",
			expandable: true,
			width: "500px",
			cell: (props) => {
				return (
					<CustomCell
						{...props}
						onRowClick={onRowClick}
						expandIconClick={() => { }}
						icon={
							props.dataItem?.sapDataId?.includes("SapDataCollectionId")
								? "fas fa-light fa-database"
								: "fas fa-sharp fa-regular fa-table"
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
						<td>Data</td>
						<td style={{ border: "none" }}>
							<button
								style={{ border: "none" }}
								className="me-2"
								onClick={() => {
									setShowAddPopup(true);
									setIsFolder(false);
								}}
							>
								<i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
							</button>
							<button
								style={{ border: "none" }}
								onClick={() => {
									setShowAddPopup(true);
									setIsFolder(true);
								}}
							>
								<i className="k-icon k-i-folder-add k-color-dark" title="Add Folder"></i>
							</button>
						</td>
					</th>
				);
			},
		},
	];

	const dataSelectedRow = getParsedFromLocalStorage('dataSelectedRow', {});
	useEffect(() => {
		if (Object.keys(dataSelectedRow).length > 0) {
			setSelectedRow(dataSelectedRow)
			const id = getIdFromString(dataSelectedRow.sapDataId);
			getVariable(id);
			getCollection(id);
			getDataSet(id, dataSelectedRow.sapVersionId);
			getEndpoint(dataSelectedRow.sapId, dataSelectedRow.sapVersionId,  id);
			getControlledTerminologyData(1028, setTerminology);
			setShowSelected(true);
		}
	}, []);

	useEffect(() => {
		if (Object.keys(dataSelectedRow).length > 0) {
			const id = getIdFromString(dataSelectedRow.sapDataId);
			getEndpoint(dataSelectedRow.sapId, dataSelectedRow.sapVersionId, id);
		}
	}, [reload]);

	const onExpandChangeCategory = React.useCallback(
		(e) => {
			setExpandedState({
				...expandedState,
				[idGetter(e.dataItem)]: !e.value,
			});
		},
		[expandedState]
	);

	const getData = async () => {
		const response = await getSapData();
		if (response.status == 200) {
			const Data = response.data.data;
			localStorage.setItem("dataCollectionSap", JSON.stringify(Data));
			const dataTreeCategory = createDataTree(
				Data,
				(i) => i.sapDataId,
				(i) => i.parentId,
				subItemsField
			);
			setStateCategory({
				...stateCategory,
				data: dataTreeCategory,
			});
		}
	};
	const onSelectionChange = React.useCallback(
		(event) => {
			const newSelectedState = getSelectedState({
				event,
				selectedState: selectedState,
				dataItemKey: DATA_ITEM_KEY,
			});
			Object.keys(newSelectedState).forEach((key) => {
				if (key !== event.dataItem.sapDataGuid) {
					delete newSelectedState[key];
				}
			});
			setSelectedState(newSelectedState);
			localStorage.setItem(
				"DataselectedState",
				JSON.stringify(newSelectedState)
			);
		},
		[selectedState]
	);

	const formik = useFormik({
		initialValues: {
			shortName: dataSet?.sapDataDatasetNameShort,
			longName: dataSet?.sapDataDatasetNameLong,
			desc: dataSet?.sapDataDatasetDescription,
			dataSetType: dataSet?.sapDataDatasetTypeId ? (dataSet?.sapDataDatasetTypeId).toString() : "",
			codingType: dataSet?.sapDataDatasetCodingDictionaryId,
			codingVersion: dataSet.sapDataDatasetCodingDictionaryVersionId
		},
		enableReinitialize: true,
		validationSchema: dataGeneralSchema,
		validateOnChange: true,
    	validateOnBlur: true,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapDataDatasetId: dataSet.sapDataDatasetId,
				sapDataDatasetGuid: dataSet.sapDataDatasetGuid,
				companyId: 1,
				sapId: 43,
				sapVersionId: dataSet.sapVersionId,
				sapDataCollectionId: dataSet.sapDataCollectionId,
				parentId: dataSet.parentId,
				parentGuid: dataSet.parentGuid,
				isFolder: dataSet.isFolder,
				sapDataDatasetNameShort: values.shortName,
				sapDataDatasetNameLong: values.longName,
				sapDataDatasetDescription: values.desc,
				sapDataDatasetTypeId: values.dataSetType,
				displayOrder: 2,
				createdBy: "",
				updatedBy: "",
				createdDate: dataSet.createdDate,
				updatedDate: dataSet.updatedDate,
				deleted: true,
				sapDataDatasetInputDTOs: [],
				sapDataDatasetCodingDictionaryId: values.codingType,
  				sapDataDatasetCodingDictionaryVersionId: values.codingVersion
			};

			setMessage("Data Set has been updated successfully.");
			const response = await updateSapDataSet(reqBody);

			if (response.status == 200) {
				getData();
				getDataSet(dataSet.sapDataDatasetId, dataSet.sapVersionId);
				setDataSetTypeId(dataSet.sapDataDatasetId);
				setShowAlert(true);
				setIsChange(false);
			}
		},
	});

	const formikCollection = useFormik({
		initialValues: {
			directory: collectionData?.sapDataCollectionUrl,
			shortName: collectionData?.sapDataCollectionNameShort,
			longName: collectionData?.sapDataCollectionNameLong,
			desc: collectionData?.sapDataCollectionDescription,
			cutOffDate: collectionData?.sapDataCollectionCutOff?.split("T")[0],
			extentOfCleaning: collectionData?.sapDataCollectionCleaning,
		},
		enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapDataCollectionId: collectionData.sapDataCollectionId,
				sapDataCollectionGuid: collectionData.sapDataCollectionGuid,
				companyId: collectionData.companyId,
				sapId: collectionData.sapId,
				sapVersionId: collectionData.sapVersionId,
				parentId: collectionData.parentId,
				parentGuid: collectionData.parentGuid,
				isFolder: collectionData.isFolder,
				sapDataCollectionNameShort: values.shortName,
				sapDataCollectionNameLong: values.longName,
				sapDataCollectionDescription: values.desc,
				sapDataCollectionCutOff: values.cutOffDate,
				sapDataCollectionCleaning: values.extentOfCleaning,
				sapDataCollectionUrl: collectionData.sapDataCollectionUrl,
				displayOrder: collectionData.displayOrder,
				createdBy: collectionData.createdBy,
				updatedBy: collectionData.updatedBy,
				createdDate: collectionData.createdDate,
				updatedDate: collectionData.updatedDate,
				deleted: collectionData.deleted,
				sapDataDatasetInputDTOs: collectionData.sapDataDatasetInputDTOs,
				sapDataCollectionInputDTOs: collectionData.sapDataCollectionInputDTOs,
			};
			setMessage("Collection has been updated successfully.");
			const response = await updateCollection(reqBody);
			if (response.status == 200) {
				getData();
				getCollection(collectionData?.sapDataCollectionId);
				setShowAlert(true);
				setIsChange(false);
			}
		},
	});

	const formikVariable = useFormik({
		initialValues: {
			shortName: "",
			longName: "",
			desc: "",
			variableContentType: "",
			valueType: "",
		},
		enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapDataVariableId: 0,
				sapDataVariableGuid: "",
				companyId: 1,
				sapId: 43,
				sapVersionId: 24,
				sapDataCollectionId: 1,
				sapDataDatasetId: getIdFromString(selectedRow.sapDataId),
				parentId: parentIdVariable,
				parentGuid: "",
				isFolder: isFolderVariable,
				sapDataVariableNameShort: values.shortName,
				sapDataVariableNameLong: values.longName,
				sapDataVariableDescription: values.desc,
				// sapDataVariableTypeId: null,
				sapDataVariableTypeId: values.variableContentType,
				displayOrder: 1,
				createdBy: null,
				updatedBy: null,
				createdDate: null,
				updatedDate: null,
				deleted: null,
				sapDataVariableInputDTOs: [],
			};
			if(isFolderVariable){
				reqBody.sapDataVariableTypeId = null
			}
			setMessage("Variable has been added successfully.");
			setBtnLoading(true)
			const response = await addVariable(reqBody);
			if (response.status == 200) {
				const id = getIdFromString(selectedRow?.sapDataId)
				getVariable(id)
				setShowAddPopupVariable(false);
				setBtnLoading(false)
				setShowAlert(true);
				resetForm()
			} else {
				setShowAddPopupVariable(false);
				resetForm();
			}
		},
	});

	const getControlledTerminologyData = async (id, setState) => {
		const response = await getControlledTerminology(id);
		if (response.status == 200) {
			setState(response.data.data);
		}
	};

	useEffect(() => {
		localStorage.setItem("DataexpandedState", JSON.stringify(expandedState));
		localStorage.setItem("DataselectedState", JSON.stringify(selectedState));
	}, [expandedState]);

	useEffect(() => {
		getData();
	}, []);

	// context menu
	const [showContextMenu, setShowContextMenu] = useState(false);
	const offset = React.useRef({
		left: 0,
		top: 0,
	});
	const handleCloseMenu = () => {
		setShowContextMenu(false);
	};
	const openContextMenu = (dataItem) => {
		// setSelectedRow(dataItem);
		setShowContextMenu(true);
	};

	const handleDetailFolder = () => { };
	const handleAddFolder = () => {
		setShowAddPopup(true);
		setIsFolder(true);
	};
	const handleAddItem = () => {
		setShowAddPopup(true);
		setIsFolder(false);
	};
	const handleEditFolder = () => { };
	const handleDeleteFolder = async () => {
		// const respnse = await deleteTreatmentType()
		const response = await deleteSapData(
			dataSet.sapDataDatasetGuid,
			"test"
		  );
		  if (response.status == 200) {
			getData();
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
			case "moveToDifferentFolder":
				setShowMoveToDifferentFolderModal(true);
				break;
			default:
		}
		setShowContextMenu(false);
	};

	const formikData = useFormik({
		initialValues: {
			shortName: "",
			longName: "",
			desc: "",
			directory: "",
			cutOffDate: "",
			extentOfCleaning: "",
		},
		// enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			setShowAddPopup(false);
			resetForm();
		},
	});

	useEffect(() => {
		const getCodingTypes = async () => {
			const cTypes = [];
			const response = await getLibraryCodingDictionary();
			const { status, data } = response;
			if (status === 200) {
				setLibraryCodingDictionary(data.data);
				data.data.forEach((item) => {
					cTypes.push({
						libraryCodingDictionaryId: item.libraryCodingDictionaryId,
						libraryCodingDictionaryNameShort: item.libraryCodingDictionaryNameShort
					});
				});
				setCodingTypes(cTypes);
			}
		};
		getCodingTypes();
	}, []);

	const handleChangeCodingType = (e, codingType=null) => {
		formik.setFieldValue("codingVersion", ""); 
		if (libraryCodingDictionary.length > 0) {
			const cVersions = [];
			libraryCodingDictionary.forEach((item) => {
				if (codingType !== null || codingType === undefined && item.libraryCodingDictionaryId == codingType) {
					formik.setFieldValue("codingType", codingType); 
					item.libraryCodingDictionaryVersionDTOs.forEach((codingDictionaryVersion) => {
						cVersions.push({
							libraryCodingDictionaryVersionNumber: codingDictionaryVersion.libraryCodingDictionaryVersionNumber,
							libraryCodingDictionaryVersionId: codingDictionaryVersion.libraryCodingDictionaryVersionId
						});
					});
				} else if (e !== null) {
					formik.handleChange(e);
					if (item.libraryCodingDictionaryId == e.target.value) {
						item.libraryCodingDictionaryVersionDTOs.forEach((codingDictionaryVersion) => {
							cVersions.push({
								libraryCodingDictionaryVersionNumber: codingDictionaryVersion.libraryCodingDictionaryVersionNumber,
								libraryCodingDictionaryVersionId: codingDictionaryVersion.libraryCodingDictionaryVersionId
							});
						});
					}
				}
			});
			setCodingVersions(cVersions);
		}
	};

	return (
		<>
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
					className="tree_scroll"
					style={{
						border: "none",
						maxHeight: "100%",
						overflow: "auto",
					}}
					data={extendData(stateCategory.data, selectedState, expandedState)}
					rowRender={RowRender}
					onSelectionChange={onSelectionChange}
					navigatable={true}
					selectedField={SELECTED_FIELD}
					selectable={{
						enabled: true,
					}}
					expandField={expandField}
					subItemsField={subItemsField}
					onExpandChange={onExpandChangeCategory}
					columns={columnsCategory}
					onRowContextMenu={(event) =>
						handleContextMenu(event, openContextMenu, setSelectedRowContext, offset)
					}
				/>
				{showSelected ? (
					<div className={`mt-4 tab_custom ${showSelected ? "" : "d-none"}`}>
						<TabStrip selected={selected} onSelect={handleSelect} scrollable={true}>
							<TabStripTab title="General">
								<div>
									{selectedRow?.sapDataId?.includes("SapDataCollectionId") && (
										<form 
											className="d-block"
											onSubmit={formikCollection.handleSubmit}
										>
											<div className="mt-3 ">
												<div
													className={`mb-3 ${selectedRow?.isFolder ? "d-none" : ""
														}`}
												>
													<label
														htmlFor="exampleInputEmail1"
														class="form-label"
													>
														Directory
													</label>
													<input
														type="text"
														class="form-control"
														id="desc"
														name="directory"
														onBlur={formikCollection.handleBlur}
														onChange={(e) => {
															formikCollection.handleChange(e);
															setIsChange(true);
														}}
														value={formikCollection.values.directory}
													/>
												</div>
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
															className={`form-control ${formikCollection.touched.shortName &&
																formikCollection.errors.shortName
																? "is-invalid"
																: ""
																}`}
															id="shortName"
															onBlur={formikCollection.handleBlur}
															onChange={(e) => {
																formikCollection.handleChange(e);
																setIsChange(true);
															}}
															value={formikCollection.values.shortName}
														/>
														{formikCollection.touched.shortName &&
															formikCollection.errors.shortName ? (
															<div className="invalid-feedback">
																{formikCollection.errors.shortName}
															</div>
														) : (
															""
														)}
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
															onBlur={formikCollection.handleBlur}
															onChange={(e) => {
																formikCollection.handleChange(e);
																setIsChange(true);
															}}
															value={formikCollection.values.longName}
														/>
													</div>
												</div>
												<div class="mb-3">
													<label
														htmlFor="exampleInputEmail1"
														class="form-label"
													>
														Description
													</label>
													<input
														type="text"
														class="form-control"
														id="desc"
														name="desc"
														onBlur={formikCollection.handleBlur}
														onChange={(e) => {
															formikCollection.handleChange(e);
															setIsChange(true);
														}}
														value={formikCollection.values.desc}
													/>
												</div>
												<div
													className={`mb-3 ${selectedRow?.isFolder ? "d-none" : ""
														}`}
												>
													<label
														htmlFor="exampleInputEmail1"
														className="form-label"
													>
														Cut-off date
													</label>
													<input
														type="date"
														class="form-control"
														id="cutOffDate"
														name="cutOffDate"
														onBlur={formikCollection.handleBlur}
														onChange={(e) => {
															formikCollection.handleChange(e);
															setIsChange(true);
														}}
														// value="1970-01-01"
														value={formikCollection.values.cutOffDate}
													/>
												</div>
												<div
													className={`mb-3 ${selectedRow?.isFolder ? "d-none" : ""
														}`}
												>
													<label
														htmlFor="exampleInputEmail1"
														class="form-label"
													>
														Extent of cleaning
													</label>
													<input
														type="text"
														class="form-control"
														id="extentOfCleaning"
														name="extentOfCleaning"
														onBlur={formikCollection.handleBlur}
														onChange={(e) => {
															formikCollection.handleChange(e);
															setIsChange(true);
														}}
														value={formikCollection.values.extentOfCleaning}
													/>
												</div>
												<div className="d-flex">
													<button
														type="submit"
														className="btn btn-primary w-100 mt-2 me-2"
														disabled={
															(formikCollection.values.shortName ==
																collectionData?.sapDataCollectionNameShort &&
																formikCollection.values.longName ==
																collectionData?.sapDataCollectionNameLong &&
																formikCollection.values.desc ==
																collectionData?.sapDataCollectionDescription &&
																formikCollection.values.directory ==
																collectionData?.sapDataCollectionUrl &&
																formikCollection.values.extentOfCleaning ==
																collectionData?.sapDataCollectionCleaning &&
																formikCollection.values.cutOffDate ==
																collectionData?.sapDataCollectionCutOff?.split(
																	"T"
																)[0]) ||
															(formikCollection.touched.shortName &&
																formikCollection.errors.shortName)
														}
													>
														Save
													</button>
													<button
														type="button"
														className="btn btn-outline-primary w-100 mt-2"
														disabled={
															formikCollection.values.shortName ==
															collectionData?.sapDataCollectionNameShort &&
															formikCollection.values.longName ==
															collectionData?.sapDataCollectionNameLong &&
															formikCollection.values.desc ==
															collectionData?.sapDataCollectionDescription &&
															formikCollection.values.directory ==
															collectionData?.sapDataCollectionUrl &&
															formikCollection.values.extentOfCleaning ==
															collectionData?.sapDataCollectionCleaning &&
															formikCollection.values.cutOffDate ==
															collectionData?.sapDataCollectionCutOff?.split(
																"T"
															)[0]
														}
														onClick={formikCollection.resetForm}
													>
														Discard
													</button>
												</div>
											</div>
										</form>
									)}
									{selectedRow?.sapDataId?.includes("SapDatasetId") && (
										<form
											className="d-block"
											onSubmit={(e) => {
												formik.handleSubmit(e);
												e.preventDefault();
											}}
										>
											<div className="mt-3 ">
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
															className={`form-control ${formik.touched.shortName &&
																formik.errors.shortName
																? "is-invalid"
																: ""
																}`}
															id="shortName"
															onBlur={formik.handleBlur}
															onChange={(e) => {
																formik.handleChange(e);
																setIsChange(true);
															}}
															value={formik.values.shortName}
														/>
														{formik.touched.shortName &&
															formik.errors.shortName ? (
															<div className="invalid-feedback">
																{formik.errors.shortName}
															</div>
														) : (
															""
														)}
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
															onBlur={formik.handleBlur}
															onChange={(e) => {
																formik.handleChange(e);
																setIsChange(true);
															}}
															value={formik.values.longName}
														/>
													</div>
												</div>
												<div class="mb-3">
													<label
														htmlFor="exampleInputEmail1"
														class="form-label"
													>
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
															setIsChange(true);
														}}
														value={formik.values.desc}
													/>
												</div>
												<div className={`mb-3 ${dataSet?.isFolder ? "d-none" : ""}`}>
													<label htmlFor="exampleInputEmail1" class="form-label">Dataset Type</label>
													<select
														class="form-select form-control"
														aria-label="Default select example"
														name="dataSetType"
														onBlur={formik.handleBlur}
														value={formik.values.dataSetType}
														onChange={(e) => {
															formik.handleChange(e);
															// setDataSetTypeId(e.target.value);
															formik.setFieldValue("dataSetType", e.target.value);
															if (Number(e.target.value) === 212) {
																setIsOCCDSSelected(true);
															} else {
																setIsOCCDSSelected(false);
																formik.setFieldValue("codingType", "");
																formik.setFieldValue("codingVersion", "");
															}
														}}
													>
														<option selected value="">select dataset type</option>
														{terminology.length > 0 &&
															terminology.map((x, i) => {
																return (
																	<option key={i} value={x.libraryControlledTerminologyId}>{x.libraryControlledTerminologyNameShort}</option>
																);
															})
														}
													</select>
												</div>

												{isOCCDSSelected &&
													<div className={`row mb-3 ${dataSet?.isFolder ? "d-none" : ""}`}>
														<div className="col">
															<label class="form-label">Coding Type<sup className="text-danger">*</sup></label>
															<select
																class={`form-select form-control ${formik.touched.codingType && formik.errors.codingType ? "is-invalid" : ""}`}
																name="codingType"
																value={formik.values.codingType}
																onBlur={formik.handleBlur}
																onChange={handleChangeCodingType}
															>
																<option value="">Select Coding Type</option>
																{codingTypes.length > 0 && codingTypes.map((codingType, index) => {
																	return <option key={index} value={codingType.libraryCodingDictionaryId}>{codingType.libraryCodingDictionaryNameShort}</option>;
																})}
															</select>
															{formik.touched.codingType && formik.errors.codingType &&
																<div className="invalid-feedback">{formik.errors.codingType}</div>
															}
														</div>
														<div className="col">
															<label class="form-label">Coding Version<sup className="text-danger">*</sup></label>
															<select
																class={`form-select form-control ${formik.touched.codingVersion && formik.errors.codingVersion ? "is-invalid" : ""}`}
																name="codingVersion"
																onChange={formik.handleChange}
																value={formik.values.codingVersion}
																disabled={formik.values.codingType === ""}
															>
																<option value="">Select Coding Version</option>
																{codingVersions.length > 0 && codingVersions.map((codingVersion, index) => {
																	return <option key={index} value={codingVersion.libraryCodingDictionaryVersionId}>{codingVersion.libraryCodingDictionaryVersionNumber}</option>;
																})}
															</select>
															{formik.touched.codingVersion && formik.errors.codingVersion &&
																<div className="invalid-feedback">{formik.errors.codingVersion}</div>
															}
														</div>
													</div>
												}
												<div className="d-flex">
													<button
														type="submit"
														className="btn btn-primary w-100 mt-2 me-2"
														// disabled={
														// 	(formik.values.shortName == dataSet?.sapDataDatasetNameShort &&
														// 		formik.values.longName == dataSet?.sapDataDatasetNameLong &&
														// 		formik.values.desc == dataSet?.sapDataDatasetDescription &&
														// 		(formik.values.dataSetType == dataSet?.sapDataDatasetTypeId ||
														// 			formik.values.dataSetType == "")) || (formik.touched.shortName && formik.errors.shortName)
														// }
														// onClick={()=>setIsChange(false)}
														disabled={!formik.dirty || JSON.stringify(formik.values) == JSON.stringify(formik.initialValues)}
													>
														Save
													</button>
													<button
														type="button"
														className="btn btn-outline-primary w-100 mt-2"
														// disabled={
														// 	formik.values.shortName == dataSet?.sapDataDatasetNameShort &&
														// 	formik.values.longName == dataSet?.sapDataDatasetNameLong &&
														// 	formik.values.desc == dataSet?.sapDataDatasetDescription &&
														// 	(formik.values.dataSetType == dataSet?.sapDataDatasetTypeId || formik.values.dataSetType == "") &&
														// }
														disabled={!formik.dirty || JSON.stringify(formik.values) == JSON.stringify(formik.initialValues)}
														onClick={() => {
															formik.resetForm();
															formik.setFieldValue("dataSetType", (dataSet?.sapDataDatasetTypeId).toString());
															if (dataSet?.sapDataDatasetTypeId == 212) {
																setIsOCCDSSelected(true);
															} else {
																setIsOCCDSSelected(false);
															}
															setIsChange(false);
														}}
													>
														Discard
													</button>
												</div>
											</div>
										</form>
									)}
								</div>
							</TabStripTab>
							<TabStripTab
								contentClassName="variable"
								title="Variables"
								disabled={
									selectedRow?.sapDataId?.includes("SapDataCollectionId") ||
									selectedRow.isFolder
								}
							>
								<div className="">
									<VariableInput
										title="Variables"
										data={VariableData}
										getVariable={getVariable}
										id={getIdFromString(selectedRow?.sapDataId)}
										setShowAddPopupVariable={setShowAddPopupVariable}
										setIsFolder={setIsFolderVariable}
										setParentIdVariable={setParentIdVariable}
										terminologyVariable = {terminologyVariable}
										terminologyValueType = {terminologyValueType}
									/>
								</div>
							</TabStripTab>
							<TabStripTab contentClassName="variable relationship" title="Variable Relationship"
							disabled={
									selectedRow?.sapDataId?.includes("SapDataCollectionId") ||
									selectedRow.isFolder || (terminology.find((x)=>x.libraryControlledTerminologyId == formik.values.dataSetType)?.libraryControlledTerminologyNameShort == "ADSL" || terminology.find((x)=>x.libraryControlledTerminologyId == formik.values.dataSetType)?.libraryControlledTerminologyNameShort == "OCCDS")
								}>
								<div>
									<VariableRelationship />
								</div>
							</TabStripTab>
							<TabStripTab
								title="Endpoints"
								disabled={
									selectedRow?.sapDataId?.includes("SapDataCollectionId") ||
									selectedRow.isFolder || (terminology.find((x)=>x.libraryControlledTerminologyId == formik.values.dataSetType)?.libraryControlledTerminologyNameShort == "ADSL" || terminology.find((x)=>x.libraryControlledTerminologyId == formik.values.dataSetType)?.libraryControlledTerminologyNameShort == "OCCDS")
								}
							>
								<div>
									<form onSubmit={(e) => { }}>
										<div className="mt-3 ">
											{/* <div class="row mb-3">
                      <div class="col">
                        <label htmlFor="exampleInputEmail1" class="form-label">
                          Parameter Code Variable
                          <sup className="text-danger">*</sup>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="shortName"
                        />
                      </div>
                      <div class="col">
                        <label htmlFor="exampleInputEmail1" class="form-label">
                          Parameter Variable
                        </label>
                        <input type="text" class="form-control" id="longName" />
                      </div>
                    </div> */}
											<EndPointInput
											showData={showData}
												title="Endpoints"
												data={endpointData}
												reload={reload}
												setReload={setReload}
												setEndpointData={setEndpointData}
											/>

											{/* <div className="d-flex">
                        <button
                          type="submit"
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
                      </div> */}
										</div>
									</form>
								</div>
							</TabStripTab>
						</TabStrip>
					</div>
				) : (
					<div
						className="d-flex justify-content-center align-items-center"
						style={{ height: "100%" }}
					>
						<p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
							No data is selected. Please select data.
						</p>
					</div>
				)}
			</Splitter>
			<ContextMenu
				show={showContextMenu}
				offset={offset.current}
				onSelect={handleOnSelect}
				onClose={handleCloseMenu}
				className="context-menu"
			>
				<MenuItem
					text={`Delete`}
					data={{
						action: "deleteFolder",
					}}
					icon="delete"
				/>
				{!selectedRowCotext.isFolder && !selectedRowCotext?.sapDataId?.includes("SapDatasetId") &&
					<MenuItem
						data={{
							action: "addFolder",
						}}
						render={() => <>Add Data set Folder</>}
						icon="folder"
					/>
				}
				{!selectedRowCotext.isFolder && !selectedRowCotext?.sapDataId?.includes("SapDatasetId") &&
					<MenuItem
						data={{
							action: "addItem",
						}}
						render={() => <>Add Data set</>}
						icon="file"
					/>
				}
				{selectedRowCotext.isFolder && !selectedRowCotext?.sapDataId?.includes("SapDatasetId") &&
					<MenuItem
						data={{
							action: "addItem",
						}}
						render={() => <>Add Data collection folder</>}
						icon="folder"
					/>
				}
				{selectedRowCotext.isFolder && selectedRowCotext?.sapDataId?.includes("SapDatasetId") &&
					<MenuItem
						data={{
							action: "addFolder",
						}}
						render={() => <>Add Data set folder</>}
						icon="folder"
					/>
				}
				{selectedRowCotext.isFolder &&
					<MenuItem
						data={{
							action: "addItem",
						}}
						render={() => (
							<>
								{/* <img src={fileImg} /> */}
								Add{" "}
								{selectedRowCotext?.sapDataId?.includes("SapDatasetId")
									? "Dataset"
									: "Data Collection"}
							</>
						)}
						icon="file"
						cssClass="separator"
					/>
				}
				<MenuItem
					text={`Move to Different Folder`}
					data={{
						action: "moveToDifferentFolder",
					}}
				/>
				<MenuItem
					text={`Move Up within Folder`}
					data={{
						action: "moveUpWithinFolder",
					}}
				/>
				<MenuItem
					text={`Move Down within Folder`}
					data={{
						action: "moveDownWithinFolder",
					}}
				/>
			</ContextMenu>
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

			<SweetAlert
				show={showDialog}
				info
				showCancel
				cancelBtnText="No"
				confirmBtnText="Yes"
				confirmBtnBsStyle="primary"
				cancelBtnBsStyle="secondary"
				title="Are you sure?"
				onConfirm={() => setShowDialog(false)}
				onCancel={() => {
					formik.resetForm();
					setShowDialog(false);
					setIsChange(false);
				}}
				focusCancelBtn
			>
				Do you want to save changes?
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
								{isFolder ? "Add Data Folder " : "Add Data Collection"}
							</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									setShowAddPopup(false);
									formikData.resetForm();
								}}
							></button>
						</div>
						<div class="modal-body">
							<form onSubmit={formikData.handleSubmit}>
								<div className="mt-3">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">
												Short Name <sup className="text-danger">*</sup>
											</label>
											<input
												type="text"
												className={`form-control ${formikData.touched.shortName &&
													formikData.errors.shortName
													? "is-invalid"
													: ""
													}`}
												id="shortName"
												name="shortName"
												onBlur={formikData.handleBlur}
												onChange={formikData.handleChange}
												value={formikData.values.shortName}
											/>
											{formikData.touched.shortName &&
												formikData.errors.shortName ? (
												<div className="invalid-feedback">
													{formikData.errors.shortName}
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
												onChange={formikData.handleChange}
												value={formikData.values.longName}
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
											onChange={formikData.handleChange}
											value={formikData.values.desc}
										/>
									</div>
									<div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
										<label htmlFor="exampleInputEmail1" class="form-label">
											Directory
										</label>
										<input
											type="text"
											class="form-control"
											id="directory"
											name="directory"
											onChange={formikData.handleChange}
											value={formikData.values.directory}
										/>
									</div>
									<div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
										<label htmlFor="exampleInputEmail1" class="form-label">
											Cut off date
										</label>
										<input
											type="date"
											class="form-control"
											id="cutOffDate"
											name="cutOffDate"
											onChange={formikData.handleChange}
											value={formikData.values.cutOffDate}
										/>
									</div>
									<div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
										<label htmlFor="exampleInputEmail1" class="form-label">
											Extent of cleaning
										</label>
										<input
											type="text"
											class="form-control"
											id="label"
											name="extentOfCleaning"
											onChange={formikData.handleChange}
											value={formikData.values.extentOfCleaning}
										/>
									</div>
									<div className="d-flex">
										<button
											//type="submit"
											type="submit"
											className="btn btn-primary w-100 mt-2 me-2"
											//disabled={formik.values.shortName == ""}
											disabled={
												(formikData.values.shortName == "" &&
													formikData.values.longName == "" &&
													formikData.values.desc == "" &&
													formikData.values.extentOfCleaning == "" &&
													formikData.values.cutOffDate == "" &&
													formikData.values.directory == "") ||
												(formikData.touched.shortName &&
													formikData.errors.shortName)
											}
										>
											Save
										</button>
										<button
											type="button"
											className="btn btn-outline-primary w-100 mt-2"
											onClick={() => {
												formikData.resetForm();
											}}
											disabled={
												formikData.values.shortName == "" &&
												formikData.values.longName == "" &&
												formikData.values.desc == "" &&
												formikData.values.extentOfCleaning == "" &&
												formikData.values.cutOffDate == "" &&
												formikData.values.directory == ""
											}
										//onClick={formik.resetForm}
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
			<div
				class={`modal fade  ${showAddPopupVariable ? "show d-block" : ""} `}
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">
								{isFolderVariable
									? "Add Variable Folder "
									: "Add Variable File"}
							</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									setShowAddPopupVariable(false);
									formikVariable.resetForm();
								}}
							></button>
						</div>
						<div class="modal-body">
							<form onSubmit={formikVariable.handleSubmit}>
								<div className="mt-3">
									<div class="row mb-3">
										<div class="col">
											<label htmlFor="exampleInputEmail1" class="form-label">
												Short Name <sup className="text-danger">*</sup>
											</label>
											<input
												type="text"
												className={`form-control ${formikVariable.touched.shortName &&
													formikVariable.errors.shortName
													? "is-invalid"
													: ""
													}`}
												id="shortName"
												name="shortName"
												onChange={formikVariable.handleChange}
												onBlur={formikVariable.handleBlur}
												value={formikVariable.values.shortName}
											// onChange={formikVariable.handleChange}
											/>
											{formikVariable.touched.shortName &&
												formikVariable.errors.shortName ? (
												<div className="invalid-feedback">
													{formikVariable.errors.shortName}
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
												onChange={formikVariable.handleChange}
												onBlur={formikVariable.handleBlur}
												value={formikVariable.values.longName}
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
											onChange={formikVariable.handleChange}
											onBlur={formikVariable.handleBlur}
											value={formikVariable.values.desc}
										/>
									</div>
									{!isFolderVariable &&
										<>
											<div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Variable Content Type
												</label>
												<select
													class="form-select form-control"
													aria-label="Default select example"
													placeholder="select dataset type"
													name="variableContentType"
													onChange={formikVariable.handleChange}
													onBlur={formikVariable.handleBlur}
													value={formikVariable.values.variableContentType}
												>
													<option selected value="">
														select variable content type
													</option>
													{terminologyVariable.length > 0 &&
														terminologyVariable.map((x, i) => {
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
											<div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Value Type
												</label>
												<select
													class="form-select form-control"
													aria-label="Default select example"
													placeholder="select dataset type"
													name="valueType"
													onChange={formikVariable.handleChange}
													onBlur={formikVariable.handleBlur}
													value={formikVariable.values.valueType}
												>
													<option selected value="">
														select variable type
													</option>
													{terminologyValueType.length > 0 &&
														terminologyValueType.map((x, i) => {
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
									}
									{/* <button type="submit" className="btn btn-primary w-100 mt-2">
                    Add
                  </button> */}
									<div className="d-flex">
										<button
											type="submit"
											className="btn btn-primary w-100 mt-2 me-2"
											disabled={
												(formikVariable.values.shortName == "" &&
													formikVariable.values.longName == "" &&
													formikVariable.values.desc == "" &&
													formikVariable.values.variableContentType == "" &&
													formikVariable.values.valueType == "") ||
												(formikVariable.touched.shortName &&
													formikVariable.errors.shortName)
											}
										>
											{btnLoading ? (
												<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											) : (
												""
											)}
											Save
										</button>
										<button
											type="button"
											className="btn btn-outline-primary w-100 mt-2"
											onClick={formikVariable.resetForm}
											disabled={
												formikVariable.values.shortName == "" &&
												formikVariable.values.longName == "" &&
												formikVariable.values.desc == "" &&
												formikVariable.values.variableContentType == "" &&
												formikVariable.values.valueType == ""
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

			{showMoveToDifferentFolderModal && <MoveToDifferentFolder closeModal={setShowMoveToDifferentFolderModal} />}
		</>
	);
};

export default Data;
