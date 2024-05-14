import {
	ContextMenu,
	MenuItem,
	Splitter,
	TabStrip,
	TabStripTab,
} from "@progress/kendo-react-layout";
import React, { useEffect, useState } from "react";
import { getParsedFromLocalStorage, onChange, panesJson } from "../../../../../utils/common-helper";
import {
	GetSapTreatmentPoolingDataBySapTreatmentTypeId,
	analysisSetVariable,
	deleteTreatmentType,
	getAnalysisSetInput,
	getDataSetVariableView,
	getTreatment,
	getTreatmentCode,
	getTreatmentDeCode,
	treatmentTableData,
	updateAnalysisSet,
	GetSapDatasetVariableViewByDSTypeIdAndVTypeId
} from "../../../../../services/statistical-analysis-plan-service";
import DynamicTreeList from "../../../../../components/common/DynamicTreeList";
import {
	AddAnalysisSet,
	AddPooledTreatmentGroup,
	AddTreatment,
	AddTreatmentFolder,
	AddTreatmentType,
} from "./Forms";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import { Grid, GridColumn, GridHeaderCell, GridNoRecords } from "@progress/kendo-react-grid";
import { FormTreatmentAdd, PooledTreatment, TreatmentInput } from "./FormTreatmentAdd";
import CustomLoader from "../../../../../utils/Loaders/CustomLoader";
import commonSchema from "../../../../../utils/validationSchema/common-schema";
import AnaSetMoveToDifferentFolderModal from "./AnaSetMoveToDifferentFolderModal";
import TreatmentMoveToDifferentFolderModal from "./TreatmentMoveToDifferentFolderModal";

const AnalysisSet = () => {
	const sapData = JSON.parse(localStorage.getItem("sapDataItem"));
	const sapId = sapData?.sapId || 43;
	const sapGuid = sapData?.sapGuid || "718FEA6B-25AF-4B89-9678-94981B17047B";
	const sapVersionId = sapData?.sapVersionId || 24;
	const [isFolder, setIsFolder] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [showAlert, setShowAlert] = React.useState(false);
	const [showAlertError, setShowAlertError] = React.useState(false);
	const [message, setMessage] = React.useState("");
	const [selected, setSelected] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [btnLoading, setBtnLoading] = React.useState(false);
	// Splitter
	const [panes, setPanes] = React.useState(panesJson);

	// AnalysisSet Input
	const [selectedAnalysisSet, setSelectedAnalysisSet] = useState({});
	const [isFolderAnaSet, setIsFolderAnaSet] = useState(false);
	const [isFolderTreatment, setIsFolderTreatment] = useState(false);
	const [analysisSet, setAnalysisSet] = useState([]);
	const [tab, setTab] = useState("analysisSet");
	const [analysisSetVariableData, setAnalysisSetVariableData] = useState([]);
	const [showAddAnalysisPop, setShowAnalysisPop] = useState(false);
	const [showUpdateAnalysis, setShowUpdateAnalysis] = useState(false);
	const [showUpdateTreatment, setShowUpdateTreatment] = useState(false);
	const [isChangeAnalysis, setIsChangeAnalysis] = useState(false);
	const [rowId, setRowId] = useState("");
	const [showAnalysisContextMenu, setShowAnalysisContext] = useState(false);
	const [showGridHeaderAddFile, setShowGridHeaderAddFile] = useState(false);
	const [showAddPooledTreatment, setShowAddPooledTreatment] = useState(false);
	const [checkedState, setCheckedState] = useState("");
	const [refrenceData, setRefrenceData] = useState([]);
	const [teatmentVariableCodes, setTeatmentVariableCodes] = useState([]);
	const [teatmentVariableDecodes, setTeatmentVariableDecodes] = useState([]);
	const [parentIdAnalysis, setParentIdAnalysis] = useState(null);
	const [showMoveToDifferentFolderModalAnaSet, setShowMoveToDifferentFolderModalAnaSet] = useState(false);
	const [showMoveToDifferentFolderModalTreatment, setShowMoveToDifferentFolderModalTreatment] = useState(false);
	const [isTableDataChanged, setIsTableDataChanged] = useState(false);

	const customColumnTemplate = (props) => {
		const handleVersionChange = (event) => {
			setTableData((prevState) => {
				let arr = [...prevState]
				prevState.forEach(treatment => {
					if (treatment.refrence) {
						treatment.refrence = false;
						props.dataItem.refrence = true;
					} else {
						props.dataItem.refrence = true;
					}
				});

				if (JSON.stringify(arr) !== tableDataCopy) {
					setIsTableDataChanged(true);
				} else {
					setIsTableDataChanged(false);
				}

				return arr;
			});
		};

		return (
			<td>
				<input
					type="radio"
					name="rowSelector"
					value={props.dataItem.refrence}
					onChange={handleVersionChange}
					checked={props.dataItem.refrence}
				/>
			</td>
		);
	};

	const customDisplayColumnTemplate = (props) => {
		const handleChange = (e) => {
			setTableData((prevState) => {
				let arr = [...prevState]
				prevState.forEach(treatment => {
					if (treatment == props.dataItem) {
						if (props.dataItem.check == true) {
							treatment.check = false;
							// props.dataItem.check = false
						} else {
							treatment.check = true;
							// props.dataItem.check = true;
						}
					}
				});

				if (JSON.stringify(arr) !== tableDataCopy) {
					setIsTableDataChanged(true);
				} else {
					setIsTableDataChanged(false);
				}

				return arr;
			});
		};

		return (
			<td>
				<input type="checkbox" checked={props.dataItem.check} onChange={handleChange} name="rowSelector" />
			</td>
		);
	};

	const customHeaderAdd = () => {
		return (
			<button
				style={{ border: "none" }}
				onClick={() => setShowGridHeaderAddFile(true)}
			>
				<i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
			</button>
		);
	};

	const customPooledHeader = () => {
		return (
			<button
				style={{ border: "none" }}
				onClick={() => setShowAddPooledTreatment(true)}
			>
				<i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
			</button>
		);
	};

	const offset = React.useRef({
		left: 0,
		top: 0,
	});
	const handleCloseMenu = () => {
		setShowAnalysisContext(false);
	};
	const handleDetailFolder = () => { };
	const handleAddFolder = () => {
		setShowAnalysisPop(true);
		setIsFolder(true);
		setParentIdAnalysis(selectedAnalysisSet.sapAnalysisSetId);
	};
	const handleAddItem = () => {
		setShowAnalysisPop(true);
		setIsFolder(false);
		setParentIdAnalysis(selectedAnalysisSet.sapAnalysisSetId);
	};
	const handleEditFolder = () => { };
	const handleDeleteFolder = async () => {
		// const respnse = await deleteTreatmentType()
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
				setShowMoveToDifferentFolderModalAnaSet(true)
			default:
		}
		setShowAnalysisContext(false);
	};
	const openContextMenu = (dataItem) => {
		if (dataItem.isFolder) {
			setIsFolderAnaSet(true);
		} else {
			setIsFolderAnaSet(false);
		}
		setShowAnalysisContext(true);
	};
	let analysisSetRowId = localStorage.getItem('analysisSetRowId') ? localStorage.getItem('analysisSetRowId') : ''
	const onRowClickAnalysisSet = (event, props) => {
		const current_id = props
		if ((current_id.dataItem.sapAnalysisSetId == analysisSetRowId)) {
			return false;
		}
		// if (rowId === props.id) {
		//   return false;
		// }
		if (isChangeAnalysis) {
			setShowDialog(true);
			return false;
		}
		console.log('anaItem', props.dataItem)
		props.selectionChange(event);
		setRowId(props.id);
		setSelectedAnalysisSet(props.dataItem);
		setShowUpdateAnalysis(true);
		localStorage.setItem('analysisSetRowId', props.dataItem.sapAnalysisSetId);
		localStorage.setItem("analysisSetSelectedRow", JSON.stringify(props.dataItem));
		// setShowUpdateTreatment(false);
	};
	const analysisSetSelectedRow = getParsedFromLocalStorage('analysisSetSelectedRow', {});
	useEffect(() => {
		if (Object.keys(analysisSetSelectedRow).length > 0) {
			console.log('analysisSetSelectedRow', analysisSetSelectedRow);
			setSelectedAnalysisSet(analysisSetSelectedRow)
			setShowUpdateAnalysis(true);
			getSapDatasetVariableView(210, 216, setAnalysisSetVariableData);
		}
	}, []);
	const analysisFolderClick = () => {
		setShowAnalysisPop(true);
		setIsFolder(true);
	};

	const analysisItemClick = () => {
		setShowAnalysisPop(true);
		setIsFolder(false);
	};
	const getAnalysisInput = async (sapId, sapVersionId, isEdit = false) => {
		setLoading(true);
		const response = await getAnalysisSetInput(sapId, sapVersionId);
		if (response.status == 200) {
			setLoading(false);
			setAnalysisSet(response.data.data.reverse());
			if (isEdit) {
				setSelectedAnalysisSet(
					response.data.data.filter(
						(x) => x.sapAnalysisSetId == selectedAnalysisSet.sapAnalysisSetId
					)[0] || {}
				);
			}
		}
	};

	const getAnalysisSetVariable = async (sapVersionId) => {
		// alert(1)
		const response = await analysisSetVariable(sapVersionId);
		if (response.status == 200) {
			setAnalysisSetVariableData(response.data.data);
		}
	};

	const getTreatmentVariables = async (sapDataDatasetTypeId, sapDataVariableTypeId) => {
		const response = await GetSapDatasetVariableViewByDSTypeIdAndVTypeId(sapDataDatasetTypeId, sapDataVariableTypeId);
		if (response.status == 200) {
			if (sapDataDatasetTypeId === 210 && sapDataVariableTypeId === 429) {
				setTeatmentVariableCodes(response.data.data);
			} else if(sapDataDatasetTypeId === 210 && sapDataVariableTypeId === 430) {
				setTeatmentVariableDecodes(response.data.data);
			}
		}
	};

	const formik = useFormik({
		initialValues: {
			shortName: selectedAnalysisSet?.analysisSetNameShort,
			longName: selectedAnalysisSet?.analysisSetNameLong,
			desc: selectedAnalysisSet?.analysisSetDescription,
			label: selectedAnalysisSet?.analysisSetLabel,
			valueForInc: selectedAnalysisSet?.analysisSetValueInclusion || "",
			variable: selectedAnalysisSet?.analysisSetVariableId,
			// variable: selectedAnalysisSet?.AnalysisSetVariableId,
		},
		enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {
				sapAnalysisSetId: selectedAnalysisSet.sapAnalysisSetId,
				sapAnalysisSetGuid: selectedAnalysisSet.sapAnalysisSetGuid,
				companyId: selectedAnalysisSet.companyId,
				sapId: selectedAnalysisSet.sapId,
				sapVersionId: selectedAnalysisSet.sapVersionId,
				parentId: selectedAnalysisSet.parentId,
				parentGuid: selectedAnalysisSet.parentGuid || "",
				isFolder: selectedAnalysisSet.isFolder,
				analysisSetNameShort: values.shortName,
				analysisSetNameLong: values.longName,
				analysisSetDescription: values.desc,
				AnalysisSetVariableId: values.variable || "",
				analysisSetValueInclusion: values.valueForInc,
				analysisSetLabel: values.label,
				displayOrder: selectedAnalysisSet.displayOrder,
				createdBy: selectedAnalysisSet.createdBy,
				updatedBy: selectedAnalysisSet.updatedBy,
				createdDate: selectedAnalysisSet.createdDate,
				updatedDate: selectedAnalysisSet.updatedDate,
				deleted: selectedAnalysisSet.deleted,
			};

			setBtnLoading(true);
			setMessage("Analysis Set has been updated successfully.");
			const response = await updateAnalysisSet(reqBody);
			if (response.status == 200) {
				getAnalysisInput(sapId, sapVersionId, true);
				setIsChangeAnalysis(false);
				setShowAlert(true);
				setBtnLoading(false);
				// resetForm();
			}
		},
	});
	useEffect(() => {
		getAnalysisInput(sapId, sapVersionId);
		getAnalysisSetVariable(sapVersionId);
		getTreatmentVariables(210, 429); // For Treatment Variable Codes
		getTreatmentVariables(210, 430); // For Treatment Variable Decodes
	}, []);

	// Treatment
	const [treatments, setTreatments] = useState([]);
	const [showTreatmentContextMenu, setShowTreatmentContext] = useState(false);
	const [selectedTreatment, setSelectedTreatment] = useState({});
	const [showAddTreatmentPop, setShowAddTreatmentPop] = useState(false);
	const [showAddTreatmentTypePop, setShowAddTreatmentTypePop] = useState(false);
	const [parentIdTreatment, setParentIdTreatment] = useState(null);
	const [parentGuidTreatment, setParentGuidTreatment] = useState("");
	const [showAddTreatmentFolderPop, setShowAddTreatmentFolderPop] =
		useState(false);
	const [showAddPooledTreatmentGroupPop, setShowAddPooledTreatmentGroupPop] =
		useState(false);
	// const onRowClickTreatment = (event, props) => {
	//   props.selectionChange(event);
	//   alert(props.id)
	// };
	let treatmentRowId = localStorage.getItem('treatmentRowId') ? localStorage.getItem('treatmentRowId') : ''
	const onRowClickTreatment = (event, props) => {
		const current_id = props
		if ((current_id.dataItem.sapTreatmentTypeId == treatmentRowId)) {
			return false;
		}
		// if (rowId === props.id) {
		//   return false;
		// }
		if (isChangeAnalysis) {
			setShowDialog(true);
			return false;
		}
		console.log('treatment', props.dataItem)
		props.selectionChange(event);
		setRowId(props.id);
		setSelectedTreatment(props.dataItem);
		setIsTableDataChanged(false);
		setShowUpdateTreatment(true);
		// setShowUpdateAnalysis(false);
		getPoolingData(props.dataItem?.sapTreatmentTypeId);
		getTreatmentTableData(props.dataItem?.sapTreatmentTypeId);
		localStorage.setItem('treatmentRowId', props.dataItem.sapTreatmentTypeId);
		localStorage.setItem("treatmentSelectedRow", JSON.stringify(props.dataItem));
	};

	const treatmentSelectedRow = getParsedFromLocalStorage('treatmentSelectedRow', {});
	useEffect(() => {
		if (Object.keys(treatmentSelectedRow).length > 0) {
			setSelectedTreatment(treatmentSelectedRow)
			setIsTableDataChanged(false);
			setShowUpdateTreatment(true);
			getPoolingData(treatmentSelectedRow.sapTreatmentTypeId);
			getTreatmentTableData(treatmentSelectedRow.sapTreatmentTypeId);
			getSapDatasetVariableView(210, 430, setTreatmentCode);
			getSapDatasetVariableView(210, 429, setTreatmentDeCode);
		}
	}, []);

	const treatmentItemClick = () => {
		setShowAddTreatmentTypePop(true);
	};
	const treatmentFolderClick = () => {
		setShowAddTreatmentFolderPop(true);
	};

	const getTreatmentData = async (sapId, sapVersionId, sapGuid) => {
		const response = await getTreatment(sapId, sapVersionId, sapGuid);
		if (response.status == 200) {
			setTreatments(response.data.data.reverse());
		}
	};
	const formikTreatment = useFormik({
		initialValues: {
			shortName: selectedTreatment?.treatmentTypeNameShort,
			longName: selectedTreatment?.treatmentTypeNameLong,
			desc: selectedTreatment?.treatmentTypeDescription,
			label: selectedTreatment?.treatmentTypeLabel,
			TreatmentVariableCode: selectedTreatment?.treatmentVariableCodeId,
			// TreatmentVariableDecode: selectedTreatment?.treatmentVariableDecodeId,
			decode: selectedTreatment?.treatmentVariableDecodeId
			// dropdown2: selectedTreatment?.treatmentVariableDecodeId
		},
		enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			const reqBody = {};
		},
	});
	const [treatmentCode, setTreatmentCode] = useState([]);
	const [treatmentDeCode, setTreatmentDeCode] = useState([]);

	const getSapDatasetVariableView = async (
		sapDataDatasetTypeId,
		sapDataVariableTypeId,
		setState
	) => {
		const response = await getDataSetVariableView(
			sapDataDatasetTypeId,
			sapDataVariableTypeId
		);
		setState(response.data.data);
	};
	useEffect(() => {
		getSapDatasetVariableView(210, 430, setTreatmentCode);
		getSapDatasetVariableView(210, 429, setTreatmentDeCode);
		getSapDatasetVariableView(210, 216, setAnalysisSetVariableData);
		// getSapDatasetVariableView(210, 223, setAnalysisFlagVariable);
	}, []);

	useEffect(() => {
		getTreatmentData(sapId, sapVersionId, sapGuid);
	}, []);

	const handleSelect = (e) => {
		setSelected(e.selected);
		if (e.selected == 0) {
			// setShowUpdateTreatment(false);
			// setShowAnalysisSet(true)
			setIsChangeAnalysis(false);
			setTab("analysisSet");
			setPanes(panesJson)
		} else {
			// setShowUpdateAnalysis(false);
			setIsChangeAnalysis(false);
			setTab("treatment");
			setPanes(
				[
					{
						size: "30%",
						min: "20%",
						collapsible: true,
						scrollable: false,
					},
					{
						min: "20%",
						collapsible: true,
						scrollable: true,
					},
				]
			)
		}
	};

	const handleCloseMenuTreatment = () => {
		setShowTreatmentContext(false);
	};

	const handleDetailFolderTreatment = () => { };

	const handleAddFolderTreatment = () => {
		setShowAddTreatmentFolderPop(true);
		setParentIdTreatment(selectedTreatment.sapTreatmentTypeId);
		setParentGuidTreatment(selectedTreatment.sapTreatmentTypeGuid);
	};

	const handleAddItemTreatment = () => {
		setShowAddTreatmentTypePop(true);
		setParentIdTreatment(selectedTreatment.sapTreatmentTypeId);
		setParentGuidTreatment(selectedTreatment.sapTreatmentTypeGuid);
		setIsFolder(false);
	};

	const handleEditFolderTreatment = () => { };
	const handleDeleteFolderTreatment = async () => {
		const response = await deleteTreatmentType(
			selectedTreatment?.sapTreatmentTypeId,
			"test"
		);
		if (response.status == 200) {
			getTreatmentData(sapId, sapVersionId, sapGuid);
		}
	};
	const handleOnSelectTreatment = (e) => {
		switch (e.item.data.action) {
			case "addFolder":
				handleAddFolderTreatment();
				break;
			case "addItem":
				handleAddItemTreatment();
				break;
			case "editFolder":
				handleEditFolderTreatment();
				break;
			case "deleteFolder":
				handleDeleteFolderTreatment();
				break;
			case "moveToDifferentFolderTreatment":
				setShowMoveToDifferentFolderModalTreatment(true);
				break;
			default:
		}
		setShowTreatmentContext(false);
	};
	const openContextMenuTreatment = (dataItem) => {
		if (dataItem.isFolder) {
			setIsFolderTreatment(true);
		} else {
			setIsFolderTreatment(false);
		}
		setShowTreatmentContext(true);
	};

	const [tableData, setTableData] = useState([]);
	const [tableDataCopy, setTableDataCopy] = useState([]);
	const [displayOrder, setDisplayOrder] = useState(0);
	const [pooledData, setPooledData] = useState([]);
	const getTreatmentTableData = async (sapTreatmentTypeId) => {
		const response = await treatmentTableData(sapTreatmentTypeId);
		if (response.status == 200) {
			const data = response.data.data
			let arr = [];
			data.forEach((x) => {
				let obj = {
					displayOrder: x.displayOrder,
					check: x.isDisplay,
					treatment: x.treatmentNameShort,
					refrence: x.isReference,
					label: x.treatmentId
				};
				arr.push(obj)
				if (x.isReference == true) {
					setCheckedState(true)
				}

			})
			setRefrenceData(arr)
			let maxDisplayOrderElement = 0
			if (arr.length > 0) {
				maxDisplayOrderElement = arr.reduce((maxElement, currentElement) => {
					return currentElement.displayOrder > maxElement.displayOrder ? currentElement : maxElement;
				}, arr[0]);
				setDisplayOrder(maxDisplayOrderElement.displayOrder + 1);
			}
			const DisplayOrder = [...arr].sort((a, b) => a.displayOrder - b.displayOrder);
			setTableData(DisplayOrder);
			setTableDataCopy(JSON.stringify(DisplayOrder));
		}
	};

	const getPoolingData = async (sapTreatmentTypeId) => {
		const response = await GetSapTreatmentPoolingDataBySapTreatmentTypeId(
			sapTreatmentTypeId
		);

		if (response.status == 200) {
			const data = response.data.data
			console.log('data', data);
			let arr = [];
			data.forEach((x) => {
				let obj = {
					selection: true,
					displayOrder: x.displayOrder,
					pooledTreatmentGroups: x.treatmentPoolingGroup,
					treatmentsPool: x.treatmentsPool,
					label: x.treatmentsLevel,
				}
				arr.push(obj)
			})
			setPooledData(arr);
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
				scrollable={true}
			>
				<div className="mt-4 tab_custom">
					<TabStrip selected={selected} onSelect={handleSelect}>
						<TabStripTab title="Analysis Set">
							<div style={{ position: "relative", height: "100vh" }}>
								{loading && <CustomLoader />}
								<DynamicTreeList
									title="Analysis Set"
									data={analysisSet}
									id="sapAnalysisSetId"
									guid="sapAnalysisSetGuid"
									col_field="analysisSetNameShort"
									onRowClick={onRowClickAnalysisSet}
									onFolderClick={analysisFolderClick}
									onItemClick={analysisItemClick}
									setSelectedRow={setSelectedAnalysisSet}
									offset={offset}
									openContextMenu={openContextMenu}
									localKey="analysisSetSelected"
									icon="fas fa-sharp fa-thin fa-users-rectangle"
								/>
							</div>
						</TabStripTab>
						<TabStripTab title="Treatments">
							<div>
								<DynamicTreeList
									title="Treatment Type"
									data={treatments}
									id="sapTreatmentTypeId"
									guid="sapTreatmentTypeGuid"
									col_field="treatmentTypeNameShort"
									onRowClick={onRowClickTreatment}
									onFolderClick={treatmentFolderClick}
									onItemClick={treatmentItemClick}
									setSelectedRow={setSelectedTreatment}
									offset={offset}
									openContextMenu={openContextMenuTreatment}
									localKey="treatmentSelected"
									icon="fas fa-sharp fa-light fa-syringe"
									iconTitle="Treatment"
								/>
							</div>
						</TabStripTab>
					</TabStrip>
				</div>
				<pane>
					{tab == "analysisSet" && (
						<>
							{showUpdateAnalysis ? (
								<div
									style={{ border: "none", overflow: "hidden" }}
									className={`p-2 ${showUpdateAnalysis ? "" : "d-none"}`}
								>
									<form onSubmit={formik.handleSubmit}>
										<th
											style={{
												top: "0px",
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<td className="mt-2">Selected Analysis Set</td>
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
														className={`form-control ${formik.touched.shortName &&
															formik.errors.shortName
															? "is-invalid"
															: ""
															}`}
														id="shortName"
														name="shortName"
														onBlur={formik.handleBlur}
														onChange={(e) => {
															formik.handleChange(e);
															setIsChangeAnalysis(true);
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
														name="longName"
														onBlur={formik.handleBlur}
														onChange={(e) => {
															formik.handleChange(e);
															setIsChangeAnalysis(true);
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
													onBlur={formik.handleBlur}
													onChange={(e) => {
														formik.handleChange(e);
														setIsChangeAnalysis(true);
													}}
													value={formik.values.desc}
												/>
											</div>
											<div
												className={`mb-3 ${selectedAnalysisSet.isFolder ? "d-none" : ""
													}`}
											>
												<label htmlFor="exampleInputEmail1" class="form-label">
													Label
												</label>
												<input
													type="text"
													class="form-control"
													id="label"
													onBlur={formik.handleBlur}
													onChange={(e) => {
														formik.handleChange(e);
														setIsChangeAnalysis(true);
													}}
													value={formik.values.label}
												/>
											</div>
											{!selectedAnalysisSet.isFolder &&
												<div
													className={`mb-3 ${selectedAnalysisSet.isFolder ? "d-none" : ""
														}`}
												>
													<div class="col">
														<label
															htmlFor="exampleInputEmail1"
															class="form-label"
														>
															Analysis Set Variable
														</label>
														<select
															class="form-select form-control"
															aria-label="Default select example"
															placeholder="select dataset type"
															onBlur={formik.handleBlur}
															onChange={(e) => {
																formik.handleChange(e);
																// setAnaSetVariable(e.target.value);
																setIsChangeAnalysis(true);
																formik.setFieldValue("variable", e.target.value);
															}}
															value={formik.values.variable}
														>
															<option selected value="">
																Select Analysis Set Variable
															</option>
															{analysisSetVariableData.length > 0 &&
																analysisSetVariableData.map((x, i) => {
																	return (
																		<option
																			key={i}
																			value={x.sapDataVariableId}
																		>
																			{x.sapDataDatasetVariableName}
																		</option>
																	);
																})}
														</select>
													</div>
													<div class="col">
														<label
															htmlFor="exampleInputEmail1"
															class="form-label"
														>
															Value for inclusion
														</label>
														<input
															type="text"
															class="form-control"
															id="valueForInc"
															name="valueForInc"
															onBlur={formik.handleBlur}
															onChange={(e) => {
																formik.handleChange(e);
																setIsChangeAnalysis(true);
															}}
															value={formik.values.valueForInc}
														/>
													</div>
												</div>
											}
											<div className="d-flex">
												<button
													type="submit"
													className="btn btn-primary w-100 mt-2 me-2"
													disabled={
														(formik.values.shortName ==
															selectedAnalysisSet.analysisSetNameShort &&
															formik.values.longName ==
															selectedAnalysisSet.analysisSetNameLong &&
															formik.values.desc ==
															selectedAnalysisSet.analysisSetDescription &&
															formik.values.label ==
															selectedAnalysisSet.analysisSetLabel &&
															formik.values.valueForInc ==
															selectedAnalysisSet.analysisSetValueInclusion &&
															formik.values.variable == selectedAnalysisSet?.analysisSetVariableId) ||
														(formik.touched.shortName &&
															formik.errors.shortName)
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
													disabled={
														formik.values.shortName ==
														selectedAnalysisSet.analysisSetNameShort &&
														formik.values.longName ==
														selectedAnalysisSet.analysisSetNameLong &&
														formik.values.desc ==
														selectedAnalysisSet.analysisSetDescription &&
														formik.values.label ==
														selectedAnalysisSet.analysisSetLabel &&
														formik.values.valueForInc ==
														selectedAnalysisSet.analysisSetValueInclusion &&
														formik.values.variable == selectedAnalysisSet?.analysisSetVariableId
													}
													onClick={() => {
														formik.resetForm();
														setIsChangeAnalysis(false);
													}}
												>
													Discard
												</button>
											</div>
										</div>
									</form>
								</div>
							) : (
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ height: "100%" }}
								>
									<p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
										AnalysisSet is not selected. Please select a AnalysisSet.
									</p>
								</div>
							)}
						</>
					)}
					{tab == "treatment" && (
						<>
							{showUpdateTreatment ? (
								<div>
									<div
										style={{ border: "none", overflow: "hidden" }}
										className={`p-2 ${showUpdateTreatment ? "" : "d-none"}`}
									>
										<form onSubmit={formikTreatment.handleSubmit}>
											<th
												style={{
													top: "0px",
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
												}}
											>
												<td className="mt-2">Treatment Type Details</td>
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
															className={`form-control ${formik.touched.shortName &&
																formik.errors.shortName
																? "is-invalid"
																: ""
																}`}
															id="shortName"
															name="shortName"
															onBlur={formikTreatment.handleBlur}
															onChange={(e) => {
																formikTreatment.handleChange(e);
																// setIsChangeAnalysis(true);
															}}
															value={formikTreatment.values.shortName}
														/>
														{formikTreatment.touched.shortName &&
															formikTreatment.errors.shortName ? (
															<div className="invalid-feedback">
																{formikTreatment.errors.shortName}
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
															name="longName"
															onBlur={formikTreatment.handleBlur}
															onChange={(e) => {
																formikTreatment.handleChange(e);
																setIsChangeAnalysis(true);
															}}
															value={formikTreatment.values.longName}
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
														onBlur={formikTreatment.handleBlur}
														onChange={(e) => {
															formikTreatment.handleChange(e);
															setIsChangeAnalysis(true);
														}}
														value={formikTreatment.values.desc}
													/>
												</div>

												<div
													className={`mb-3 ${selectedTreatment.isFolder ? "d-none" : ""
														}`}
												>
													<label
														htmlFor="exampleInputEmail1"
														class="form-label"
													>
														Label
													</label>
													<input
														type="text"
														class="form-control"
														id="label"
														onBlur={formikTreatment.handleBlur}
														onChange={(e) => {
															formikTreatment.handleChange(e);
															setIsChangeAnalysis(true);
														}}
														value={formikTreatment.values.label}
													/>
												</div>
												<div className={`row mb-3 ${selectedTreatment.isFolder ? "d-none" : ""}`}>
													<div class="col">
														<label htmlFor="TreatmentVariableCode" class="form-label">Treatment Variable Code</label>
														<select
															class="form-select form-control"
															placeholder="select dataset type"
															id="TreatmentVariableCode"
															name="TreatmentVariableCode"
															onBlur={formikTreatment.handleBlur}
															onChange={(e) => {
																formikTreatment.handleChange(e);
																// setAnaSetVariable(e.target.value);
																setIsChangeAnalysis(true);
																formikTreatment.setFieldValue(
																	"TreatmentVariableCode",
																	e.target.value
																);
															}}
															value={formikTreatment.values.TreatmentVariableCode}
														>
															<option selected value="">Select Treatment Code</option>
															{/* {teatmentVariableCodes.length > 0 && teatmentVariableCodes.map((code, index) => {
																return (
																	<option key={index} value={code.sapDataVariableId}>{code.sapDataVariableNameShort}</option>
																);
															})} */}

															{treatmentCode.length > 0 &&
																treatmentCode.map((x, i) => {
																	return (
																		<option key={i} value={x.sapDataVariableId}>{x.sapDataDatasetVariableName}</option>
																	);
																})
															}
														</select>
													</div>
													<div class="col">
														<label htmlFor="decode" class="form-label">Treatment Variable Decode</label>
														<select
															id="decode"
															name="decode"
															class="form-select form-control"
															onChange={(e) => {
																formikTreatment.handleChange(e);
																setIsChangeAnalysis(true);
																formikTreatment.setFieldValue("decode", e.target.value);
															}}
															onBlur={formikTreatment.handleBlur}
															value={formikTreatment.values.decode}
														>
															<option selected value="">Select Treatment Decode</option>
															{/* {teatmentVariableDecodes.length > 0 && teatmentVariableDecodes.map((code, index) => {
																return (
																	<option key={index} value={code.sapDataVariableId}>{code.sapDataVariableNameShort}</option>
																);
															})} */}

															{treatmentDeCode.length > 0 &&
																treatmentDeCode.map((x, i) => {
																	return (
																		<option key={i} value={x.sapDataVariableId}>{x.sapDataDatasetVariableName}</option>
																	);
																})
															}
														</select>
													</div>
												</div>
											</div>
											<div
												className={`mb-3 ${selectedTreatment.isFolder ? "d-none" : ""
													}`}
											>
												<Grid
													className="hello mt-4"
													style={{ textAlign: "center" }}
													data={pooledData}
													selectable={{
														enabled: true,
														drag: false,
														cell: false,
														mode: "single",
													}}
													scrollable="none"
													navigatable={true}
												>
													<GridColumn
														field="displayOrder"
														title="Display Order"
														sortable={true}
													/>
													<GridColumn
														field="pooledTreatmentGroups"
														title="Pooled Treatment Groups"
													/>
													<GridColumn
														field="treatmentsPool"
														title="Treatments Pool"
													/>
													<GridColumn
														field="label"
														title="Label"
													/>
													<GridColumn headerCell={customHeaderAdd} width="80" />
												</Grid>

												<Grid
													className="hello mt-4"
													data={tableData}
													selectable={{
														enabled: true,
														drag: false,
														cell: false,
														mode: "multiple",
													}}
													scrollable="none"
													navigatable={true}
												>
													<GridColumn
														field="displayOrder"
														title="Display Order"
													/>
													<GridColumn
														field="selection"
														cell={customDisplayColumnTemplate}
														title="Display"
													/>
													<GridColumn field="treatment" title="Treatment" />
													<GridColumn
														field="selection"
														title="Refrence"
														cell={customColumnTemplate}
													/>
													<GridColumn field="label" title="Label" />
													<GridColumn
														headerCell={customPooledHeader}
														width="80"
													/>
												</Grid>
											</div>
											<div className="d-flex mt-4">
												<button
													type="submit"
													className="btn btn-primary w-100 mt-2 me-2"
													disabled={
														(formikTreatment.values.shortName ==
															selectedTreatment?.treatmentTypeNameShort &&
															formikTreatment.values.longName ==
															selectedTreatment?.treatmentTypeNameLong &&
															formikTreatment.values.desc ==
															selectedTreatment?.treatmentTypeDescription &&
															formikTreatment.values.label ==
															selectedTreatment?.treatmentTypeLabel &&
															formikTreatment.values.TreatmentVariableCode ==
															selectedTreatment?.treatmentVariableCodeId &&
															formikTreatment.values.decode ==
															selectedTreatment?.treatmentVariableDecodeId && 
															!isTableDataChanged
														) ||
														(formikTreatment.touched.shortName &&
															formikTreatment.errors.shortName)
													}
												>
													Save
												</button>
												<button
													type="button"
													className="btn btn-outline-primary w-100 mt-2"
													disabled={
														(formikTreatment.values.shortName ==
															selectedTreatment?.treatmentTypeNameShort &&
															formikTreatment.values.longName ==
															selectedTreatment?.treatmentTypeNameLong &&
															formikTreatment.values.desc ==
															selectedTreatment?.treatmentTypeDescription &&
															formikTreatment.values.label ==
															selectedTreatment?.treatmentTypeLabel &&
															formikTreatment.values.TreatmentVariableCode ==
															selectedTreatment?.treatmentVariableCodeId &&
															formikTreatment.values.decode ==
															selectedTreatment?.treatmentVariableDecodeId &&
															!isTableDataChanged
														)
													}
													onClick={() => {
														formikTreatment.resetForm();
														setIsChangeAnalysis(false);
														setTableData(JSON.parse(tableDataCopy));
														setIsTableDataChanged(false);
													}}
												>
													Discard
												</button>
											</div>
										</form>
									</div>
								</div>
							) : (
								<div
									className="d-flex justify-content-center align-items-center"
									style={{ height: "100%" }}
								>
									<p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
										Treatment is not selected. Please select a treatment.
									</p>
								</div>
							)}
						</>
					)}
				</pane>
			</Splitter>

			<ContextMenu
				show={showAnalysisContextMenu}
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
				{isFolderAnaSet && (
					<MenuItem
						text={`Add File`}
						data={{
							action: "addItem",
						}}
						icon="file"
					/>
				)}
				{isFolderAnaSet && (
					<MenuItem
						text={`Add Folder`}
						data={{
							action: "addFolder",
						}}
						icon="folder"
						cssClass="separator"
					/>
				)}
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

			<ContextMenu
				show={showTreatmentContextMenu}
				offset={offset.current}
				onSelect={handleOnSelectTreatment}
				onClose={handleCloseMenuTreatment}
				className="context-menu"
			>
				<MenuItem
					text={`Delete`}
					data={{
						action: "deleteFolder",
					}}
					icon="delete"

				/>
				{isFolderTreatment && (
					<MenuItem
						text={`Add File`}
						data={{
							action: "addItem",
						}}
						icon="file"
					/>
				)}
				{isFolderTreatment && (
					<MenuItem
						text={`Add Folder`}
						data={{
							action: "addFolder",
						}}
						icon="folder"
						cssClass="separator"

					/>
				)}
				<MenuItem
					text={`Move to Different Folder`}
					data={{
						action: "moveToDifferentFolderTreatment",
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
			<FormTreatmentAdd
				showGridHeaderAddFile={showGridHeaderAddFile}
				setShowGridHeaderAddFile={setShowGridHeaderAddFile}
				selectedTreatment={selectedTreatment}
				setMessage={setMessage}
				setShowAlert={setShowAlert}
				setShowAlertError={setShowAlertError}
				getPoolingData={getPoolingData}
			/>
			<TreatmentInput
				showAddPooledTreatment={showAddPooledTreatment}
				setShowAddPooledTreatment={setShowAddPooledTreatment}
				selectedTreatment={selectedTreatment}
				setMessage={setMessage}
				setShowAlert={setShowAlert}
				setShowAlertError={setShowAlertError}
				getTreatmentTableData={getTreatmentTableData}
				displayOrder={displayOrder}
			/>
			<AddAnalysisSet
				showAddAnalysisPop={showAddAnalysisPop}
				setShowAnalysisPop={setShowAnalysisPop}
				getAnalysisInput={getAnalysisInput}
				sapId={sapId}
				sapVersionId={sapVersionId}
				isFolder={isFolder}
				parentId={parentIdAnalysis}
				setIsFolder={setIsFolder}
				setMessage={setMessage}
				message={message}
				setShowAlert={setShowAlert}
				analysisSetVariableData={analysisSetVariableData}
			/>
			<AddTreatmentType
				showAddTreatmentTypePop={showAddTreatmentTypePop}
				setShowAddTreatmentTypePop={setShowAddTreatmentTypePop}
				setShowAddTreatmentPop={setShowAddTreatmentPop}
				showAddTreatmentPop={showAddTreatmentPop}
				showAddPooledTreatmentGroupPop={showAddPooledTreatmentGroupPop}
				setShowAddPooledTreatmentGroupPop={setShowAddPooledTreatmentGroupPop}
				getTreatmentData={getTreatmentData}
				sapId={sapId}
				sapVersionId={sapVersionId}
				sapGuid={sapGuid}
				isFolder={isFolder}
				parentId={parentIdTreatment}
				parentGuid={parentGuidTreatment}
				setIsFolder={setIsFolder}
				setMessage={setMessage}
				message={message}
				setShowAlert={setShowAlert}
				analysisSetVariableData={analysisSetVariableData}
			/>
			<AddTreatmentFolder
				showAddTreatmentFolderPop={showAddTreatmentFolderPop}
				setShowAddTreatmentFolderPop={setShowAddTreatmentFolderPop}
				sapId={sapId}
				sapVersionId={sapVersionId}
				sapGuid={sapGuid}
				isFolder={isFolder}
				parentId={parentIdTreatment}
				parentGuid={parentGuidTreatment}
				setIsFolder={setIsFolder}
				setMessage={setMessage}
				message={message}
				setShowAlert={setShowAlert}
				getTreatmentData={getTreatmentData}
			/>
			{/* <AddTreatment
        showAddTreatmentPop={showAddTreatmentPop}
        setShowAddTreatmentPop={setShowAddTreatmentPop}
        getAnalysisInput={getAnalysisInput}
        sapId={sapId}
        sapVersionId={sapVersionId}
        isFolder={isFolder}
        setIsFolder={setIsFolder}
        setMessage={setMessage}
        message={message}
        setShowAlert={setShowAlert}
        analysisSetVariableData={analysisSetVariableData}
      /> */}
			{/* <AddPooledTreatmentGroup
        showAddPooledTreatmentGroupPop={showAddPooledTreatmentGroupPop}
        setShowAddPooledTreatmentGroupPop={setShowAddPooledTreatmentGroupPop}
        getAnalysisInput={getAnalysisInput}
        sapId={sapId}
        sapVersionId={sapVersionId}
        isFolder={isFolder}
        setIsFolder={setIsFolder}
        setMessage={setMessage}
        message={message}
        setShowAlert={setShowAlert}
        selectedTreatment={selectedTreatment}
        analysisSetVariableData={analysisSetVariableData}
      /> */}
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
					setIsChangeAnalysis(false);
				}}
				focusCancelBtn
			>
				Do you want to save changes?
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
			<SweetAlert
				show={showAlertError}
				error
				title="Error"
				onConfirm={() => {
					setShowAlertError(false);
					setMessage("");
				}}
			>
				{message}
			</SweetAlert>
			{showMoveToDifferentFolderModalAnaSet && <AnaSetMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModalAnaSet} analysisSetData={analysisSet} />}
			{showMoveToDifferentFolderModalTreatment && <TreatmentMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModalTreatment} treatmentsData={treatments} />}

		</>
	);
};

export default AnalysisSet;
