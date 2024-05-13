import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import commonSchema from "../../../../../utils/validationSchema/common-schema";
import { getControlledTerminology, getDataSetVariableView, getSapData } from "../../../../../services/statistical-analysis-plan-service";
import { getIdFromString } from "../../../../../utils/common-helper";
import CustomDropDownTree from "../../../../../components/common/CustomDropDownTree/CustomDropDownTree";

const schema = yup.object().shape({
	shortName: yup.string().required("This Field is required."),
	longName: yup.string().required("This Field is required."),
	desc: yup.string().required("This Field is required."),
	label: yup.string().required("This Field is required."),
	data: yup.string().required("This Field is required."),
	dataset: yup.string().required("This Field is required."),
	variable: yup.string().required("This Field is required."),
	responseVariable: yup.string().required("This Field is required."),
});

const schema1 = yup.object().shape({
	shortName: yup.string().required("This Field is required."),
	longName: yup.string().required("This Field is required."),
	desc: yup.string().required("This Field is required."),
	label: yup.string().required("This Field is required."),
	variable: yup.string().required("This Field is required."),
	dataset1: yup.string().required("This Field is required."),
	variable: yup.string().required("This Field is required."),
	responseVariable: yup.string().required("This Field is required."),
});

const folderSchema = yup.object().shape({
	shortNames: yup.string().required("This Field is required."),
	longNames: yup.string().required("This Field is required."),
	descs: yup.string().required("This Field is required."),
});

const folderSchema1 = yup.object().shape({
	shortNamess: yup.string().required("This Field is required."),
	longNamess: yup.string().required("This Field is required."),
	descss: yup.string().required("This Field is required."),
});

const EndPointForm = (props) => {
	const [dataCollection, setDataCollection] = useState([]);
	const [dataSet, setDataSet] = useState([]);
	const [CollectionInput, setCollectionInput] = useState([]);
	const [dataCollectionsTreeData, setDataCollectionsTreeData] = useState([]);
	const [datasetTreeData, setDatasetTreeData] = useState([]);
	let rowData = props?.endpointRowData;
	const {
		handleSubmit,
		control,
		setValue,
		register,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(
			props.addEndType === "file"
				? schema
				: props.addEndType === "folder"
					? folderSchema
					: props.selectedEndpoint?.isFolder
						? folderSchema1
						: schema1
		), // Use Yup resolver
	});

	const coldemo = dataCollection.map(item => {
		return getIdFromString(item.sapDataId)
	})

	const onError = (errors, e) => console.log(errors, e);
	const [showAlert, setShowAlert] = React.useState(false);
	const [message, setMessage] = React.useState("");

	useEffect(() => {
		if (rowData) {
			setValue("shortName", rowData?.endpointNameShort);
			setValue("longName", rowData?.endpointNameLong);
			setValue("desc", rowData?.endpointDescription);
			setValue("label", rowData?.endpointLabel);
			setValue("variable", rowData?.endpointVariable);
			setValue("responseVariable", rowData?.endpointResponseVariableId);
		} else {
			setValue("shortName", "");
			setValue("longName", "");
			setValue("desc", "");
			setValue("label", "");
			setValue("variable", "");
			setValue("responseVariable", "");
		}
	}, [props.endpointRowData, setValue]);

	const formik = useFormik({
		initialValues: {
			shortName: rowData?.endpointNameShort,
			longName: rowData?.endpointNameLong,
			desc: rowData?.endpointDescription,
			label: rowData?.endpointLabel,
			endpointType: rowData?.dataTypeId,
			responseVariable: rowData?.endpointResponseVariableId,
			baseLineType: rowData?.endpointBaselineType,
			dataCollection: '',
			dataSet: ''
		},
		enableReinitialize: true,
		onSubmit: async (values, { resetForm }) => {
			console.log('values', values);
			// return false;
			props.onSubmitEndPoint(values, resetForm, setLoading, true);
		},
	});
	const [loading, setLoading] = useState(false);
	
	const formikAddEndpoint = useFormik({
		initialValues: {
			shortName: "",
			longName: "",
			desc: "",
			label: "",
			endpointType: "",
			responseVariable: "",
			baseLineType: "",
			dataCollection: '',
			dataSet: '',
		},

		enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			props.onSubmitEndPoint(values, resetForm, setLoading, false);
		},
	});
	const [endpointType, setEndpointType] = useState([]);
	const [responseVariable, setResponseVariable] = useState([]);

	const getEndPointType = async () => {
		const response = await getControlledTerminology(10);
		if (response.status == 200) {
			setEndpointType(response.data.data);
		}
	}

	const getResponseVariable = async () => {
		const response = await getDataSetVariableView(211, 221);
		// console.log('getResponseVariable', response.data.data);
		if (response.status == 200) {
			setResponseVariable(response.data.data);
		}
	}

	const getData = async () => {
		const response = await getSapData();
		if (response.status == 200) {
			const Data = response.data.data;
			const treeData = [];
			Data.forEach(element => {
				if (element?.sapDataId.includes('SapDataCollectionId') && element.isFolder) {
					treeData.push({
						id: element.sapDataId,
						text: element.sapDataNameShort,
						sapDataGuid: element.sapDataGuid,
						items: []
					});
				}
			});

			Data.forEach(element => {
				treeData.forEach(item => {
					if (element?.sapDataId.includes('SapDataCollectionId') && element.parentId === item.id) {
						item.items.push({
							id: element.sapDataId,
							text: element.sapDataNameShort,
							sapDataGuid: element.sapDataGuid
						});
					}
				});
			});
			setDataCollectionsTreeData(treeData);
			setCollectionInput(Data);
			let CollectionData = Data.filter((x) => x?.sapDataId.includes('SapDataCollectionId') && x.isFolder == false)
			setDataCollection(CollectionData);
		}
	};
	
	useEffect(() => {
		getData();
		getEndPointType();
		getResponseVariable();
	}, [])

	useEffect(() => {
		let data = CollectionInput.filter((x) => x.parentId == 'SapDataCollectionId_2')
		setDataSet(data)
	}, [rowData])

	return (
		<>
			{props.showEndpoint === true ? (
				<div
					style={{ border: "none" }}
					className={`p-2 ${props.showEndpoint ? "" : "d-none"}`}
				>
					{/* !props.selectedEndpoint?.isFolder ?  */}
					{/* <form onSubmit={handleSubmit(onSubmit, onError)}> */}
					<form onSubmit={formik.handleSubmit}>
						{/* ... (your existing code) */}
						<th
							style={{
								top: "0px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<td className="mt-2">Selected Endpoint</td>
						</th>
						<div className="mt-3">
							<div
								className={`row mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
									}`}
							>
								<div class="col">
									<CustomDropDownTree
										label="Data Collection"
										data={dataCollectionsTreeData}
										collectionInput={CollectionInput}
										setDatasetTreeData={setDatasetTreeData}
										formik={formik}
										fieldName="dataCollection"
										rowData={rowData}
									/>
									{/* <select
										class="form-select form-control"
										placeholder="select dataset type"
										id="dataCollection"
										name="dataCollection"
										onBlur={formik.handleBlur}
										onChange={(e) => {
										formik.handleChange(e);
										// setAnaSetVariable(e.target.value);
										// setIsChangeAnalysis(true);
										let data = CollectionInput.filter((x)=>x.parentId == e.target.value)
										setDataSet(data)
										console.log('e.target.value', e.target.value)
										formik.setFieldValue(
											"dataCollection",
											e.target.value
										);
										}}
										// value={2}
										value={formik.values.dataCollection}
									>
										<option selected value="">
										Select
										</option>
										{dataCollection.length > 0 &&
										dataCollection.map((x, i) => {
											return (
											<option
												key={i}
												value={getIdFromString(x.sapDataId)}
											>
												{x.sapDataNameShort}
											</option>
											);
										})}
									</select> */}
														{/* <input
										type="text"
										class="form-control"
										id="responseVariable"
										name="responseVariable"
										onBlur={formik.handleBlur}
										onChange={(e) => {
										formik.handleChange(e);
										// setIsChangeAnalysis(true);
										}}
										value={formik.values.responseVariable}
									/>
										{errors.responseVariable && (
										<div className="invalid-feedback">
											{errors.responseVariable.message}
										</div>
										)} */}
								</div>
								<div class="col">
									{/* <label htmlFor="exampleInputEmail1" class="form-label">
										Dataset
									</label>
									<select
										class="form-select form-control"
										placeholder="select dataset type"
										id="dataSet"
										name="dataSet"
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.handleChange(e);
											// setAnaSetVariable(e.target.value);
											// setIsChangeAnalysis(true);
											// let data = CollectionInput.filter((x)=>x.parentId == e.target.value)
											formik.setFieldValue(
												"dataSet",
												e.target.value
											);
										}}
										value={formik.values.dataSet}
									>
										<option selected value="">
											Select
										</option>
										{dataSet.length > 0 &&
											dataSet.map((x, i) => {
												return (
													<option
														key={i}
														value={getIdFromString(x.sapDataId)}
													>
														{x.sapDataNameShort}
													</option>
												);
											})}
									</select> */}
									<CustomDropDownTree
										label="Dataset"
										fieldName="dataSet"
										data={datasetTreeData}
										formik={formik}
										rowData={rowData}
									/>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col">
									<label id="shortName" class="form-label">
										Short Name
										<sup className="text-danger">*</sup>
									</label>
									<input
										type="text"
										class="form-control"
										id="shortName"
										name="shortName"
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.handleChange(e);
											// setIsChangeAnalysis(true);
										}}
										value={formik.values.shortName}
									/>
									{/* <input
										type="text"
										class={`form-control ${
										errors.shortName ? "is-invalid" : ""
										}`}
										id="shortName"
										name="shortName"
										{...register("shortName")}
									/> */}
									{errors.shortName && (
										<div className="invalid-feedback">
											{errors.shortName.message}
										</div>
									)}
								</div>
								<div class="col">
									<label htmlFor="longName" class="form-label">
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
											// setIsChangeAnalysis(true);
										}}
										value={formik.values.longName}
									/>
									{errors.longName && (
										<div className="invalid-feedback">
											{errors.longName.message}
										</div>
									)}
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
											// setIsChangeAnalysis(true);
										}}
										value={formik.values.desc}
									/>
									{errors.desc && (
										<div className="invalid-feedback">
											{errors.desc.message}
										</div>
									)}
								</div>
								<div
									className={`mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
										}`}
								>
									<label htmlFor="exampleInputEmail1" class="form-label">
										Label
									</label>
									<input
										type="text"
										class="form-control"
										id="label"
										name="label"
										onBlur={formik.handleBlur}
										onChange={(e) => {
											formik.handleChange(e);
											// setIsChangeAnalysis(true);
										}}
										value={formik.values.label}
									/>
									{errors.label && (
										<div className="invalid-feedback">
											{errors.label.message}
										</div>
									)}
								</div>
								<div
									className={`row mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
										}`}
								>
									<div class="col">
										<label htmlFor="exampleInputEmail1" class="form-label">
											Response Variable
										</label>
										<select
											class="form-select form-control"
											placeholder="select dataset type"
											id="responseVariable"
											name="responseVariable"
											onBlur={formik.handleBlur}
											onChange={(e) => {
												formik.handleChange(e);
												// setAnaSetVariable(e.target.value);
												// setIsChangeAnalysis(true);
												formik.setFieldValue(
													"responseVariable",
													e.target.value
												);
											}}
											value={formik.values.responseVariable}
										>
											<option selected value="">
												Select
											</option>
											{responseVariable.length > 0 &&
												responseVariable.map((x, i) => {
													return (
														<option
															key={i}
															value={x.sapDataVariableId}
														>
															{x.sapDataVariableNameShort}
														</option>
													);
												})}
										</select>
									</div>

									<div class="col">
										<div
											className={`mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
												}`}
										>
											<label htmlFor="exampleInputEmail1" class="form-label">
												Baseline Type
											</label>
											<input
												type="text"
												class="form-control"
												id="baseLineType"
												name="baseLineType"
												onBlur={formik.handleBlur}
												onChange={(e) => {
													formik.handleChange(e);
													// setIsChangeAnalysis(true);
												}}
												value={formik.values.baseLineType}
											/>
											{errors.label && (
												<div className="invalid-feedback">
													{errors.label.message}
												</div>
											)}
										</div>
									</div>
									<div  >
										<label htmlFor="exampleInputEmail1" class="form-label">
											Endpoint Type
										</label>
										<select
											class="form-select form-control"
											placeholder="select dataset type"
											id="endpointType"
											name="endpointType"
											onBlur={formik.handleBlur}
											onChange={(e) => {
												formik.handleChange(e);
												// setAnaSetVariable(e.target.value);
												// setIsChangeAnalysis(true);
												formik.setFieldValue(
													"endpointType",
													e.target.value
												);
											}}
											value={formik.values.endpointType}
										>
											<option selected value="">
												Select
											</option>
											{endpointType.length > 0 &&
												endpointType.map((x, i) => {
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
								<div className="d-flex">
									<button
										type="submit"
										className="btn btn-primary w-100 mt-2 me-2"
										disabled={
											formik.values.shortName == rowData?.endpointNameShort &&
											formik.values.longName == rowData?.endpointNameLong &&
											formik.values.desc == rowData?.endpointDescription &&
											formik.values.label == rowData?.endpointLabel &&
											formik.values.responseVariable == rowData?.endpointResponseVariableId &&
											formik.values.endpointType == rowData?.dataTypeId &&
											formik.values.dataCollection == '' &&
											formik.values.dataSet == ''
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
										onClick={formik.resetForm}
										disabled={
											formik.values.shortName == rowData?.endpointNameShort &&
											formik.values.longName == rowData?.endpointNameLong &&
											formik.values.desc == rowData?.endpointDescription &&
											formik.values.label == rowData?.endpointLabel &&
											formik.values.responseVariable == rowData?.endpointResponseVariableId &&
											formik.values.endpointType == rowData?.dataTypeId &&
											formik.values.dataCollection == '' &&
											formik.values.dataSet == ''
										}
									>
										Discard
									</button>
								</div>
							</div>
						</div>
					</form>
					{/* } */}
				</div>
			) : (
				<div
					className="d-flex justify-content-center align-items-center"
					style={{ height: "100%" }}
				>
					<p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
						Endpoint is not selected. Please select a Endpoint.
					</p>
				</div>
			)}
			<SweetAlert
				show={showAlert}
				success
				title="Success"
				onConfirm={() => {
					setShowAlert(false);
					setMessage("");
				}}
				onCancel={() => {
					formik.resetForm();
					setShowDialog(false);
					setIsChange(false);
				}}
			>
				{message}
			</SweetAlert>

			<div
				class={`modal fade  ${props.showAddEndpointPop ? "show d-block" : ""} `}
				id="exampleModal"
				tabindex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
				style={{ zIndex: 50 }}
			>
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">
								{props.addEndType === "file"
									? "Add Endpoint File"
									: "Add Endpoint Folder"}
							</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									props.setShowEndPointPop(false)
									formikAddEndpoint.resetForm()
								}
								}
							></button>
						</div>
						<div class="modal-body">
							{props.addEndType === "file" ? (
								<>
									<form onSubmit={formikAddEndpoint.handleSubmit}>
										{/* ... (your existing code) */}
										<div className="mt-3">
											<div class="row mb-3">
												<div class="col">
													{/* <label htmlFor="exampleInputEmail1" class="form-label">Data Collection</label> */}
													<CustomDropDownTree
														label="Data Collection"
														data={dataCollectionsTreeData}
														collectionInput={CollectionInput}
														setDatasetTreeData={setDatasetTreeData}
													/>

													{/* <select
                            class="form-select form-control"
                            placeholder="select dataset type"
                            id="dataCollection"
                            name="dataCollection"
                            onBlur={formikAddEndpoint.handleBlur}
                            onChange={(e) => {
                              formikAddEndpoint.handleChange(e);
                              // setAnaSetVariable(e.target.value);
                              // setIsChangeAnalysis(true);
                              let data = CollectionInput.filter((x)=>x.parentId == e.target.value)
                              setDataSet(data)
                              console.log('e.target.value', e.target.value)
                              formikAddEndpoint.setFieldValue(
                                "dataCollection",
                                e.target.value
                              );
                            }}
                            value={formikAddEndpoint.values.dataCollection}
                          >
                            <option selected value="">
                              Select
                            </option>
                            {dataCollection.length > 0 &&
                              dataCollection.map((x, i) => {
                                return (
                                  <option
                                    key={i}
                                    value={x.sapDataId}
                                  >
                                    {x.sapDataNameShort}
                                  </option>
                                );
                              })}
                          </select> */}
												</div>
											</div>
											<div class="row mb-3">
												<div class="col">
													{/* <label htmlFor="exampleInputEmail1" class="form-label">
														Dataset
													</label>
													<select
														class="form-select form-control"
														placeholder="select dataset type"
														id="dataSet"
														name="dataSet"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setAnaSetVariable(e.target.value);
															// setIsChangeAnalysis(true);
															formikAddEndpoint.setFieldValue(
																"dataSet",
																e.target.value
															);
														}}
														value={formikAddEndpoint.values.dataSet}
													>
														<option selected value="">
															Select
														</option>
														{dataSet.length > 0 &&
															dataSet.map((x, i) => {
																return (
																	<option
																		key={i}
																		value={x.sapDataId}
																	>
																		{x.sapDataNameShort}
																	</option>
																);
															})}
													</select> */}
													<CustomDropDownTree
														label="Dataset"
														data={datasetTreeData}
													/>
												</div>
											</div>
											<div class="row mb-3">
												<div class="col">
													<label htmlFor="shortName" class="form-label">
														Short Name
														<sup className="text-danger">*</sup>
													</label>
													<input
														type="text"
														className={`form-control ${formikAddEndpoint.touched.shortName &&
															formikAddEndpoint.errors.shortName
															? "is-invalid"
															: ""
															}`}
														id="shortName"
														name="shortName"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.shortName}
													/>
													{formikAddEndpoint.touched.shortName &&
														formikAddEndpoint.errors.shortName ? (
														<div className="invalid-feedback">
															{formikAddEndpoint.errors.shortName}
														</div>
													) : (
														""
													)}
												</div>
												<div class="col">
													<label htmlFor="longName" class="form-label">
														Long Name
													</label>
													<input
														type="text"
														class="form-control"
														id="longName"
														name="longName"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.longName}
													/>
													{errors.longName && (
														<div className="invalid-feedback">
															{errors.longName.message}
														</div>
													)}
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
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.desc}
													/>
													{errors.desc && (
														<div className="invalid-feedback">
															{errors.desc.message}
														</div>
													)}
												</div>
												<div
													className={`mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
														}`}
												>
													<label htmlFor="exampleInputEmail1" class="form-label">
														Label
													</label>
													<input
														type="text"
														class="form-control"
														id="label"
														name="label"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.label}
													/>
													{errors.label && (
														<div className="invalid-feedback">
															{errors.label.message}
														</div>
													)}
												</div>
												<div
													className={`row mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
														}`}
												>
													<div class="col">
														<label htmlFor="exampleInputEmail1" class="form-label">
															Response Variable
														</label>
														<select
															class="form-select form-control"
															placeholder="select dataset type"
															id="responseVariable"
															name="responseVariable"
															onBlur={formikAddEndpoint.handleBlur}
															onChange={(e) => {
																formikAddEndpoint.handleChange(e);
																// setAnaSetVariable(e.target.value);
																// setIsChangeAnalysis(true);
																formikAddEndpoint.setFieldValue(
																	"responseVariable",
																	e.target.value
																);
															}}
															value={formikAddEndpoint.values.responseVariable}
														>
															<option selected value="">
																Select
															</option>
															{responseVariable.length > 0 &&
																responseVariable.map((x, i) => {
																	return (
																		<option
																			key={i}
																			value={x.sapDataVariableId}
																		>
																			{x.sapDataVariableNameShort}
																		</option>
																	);
																})}
														</select>
													</div>
													<div class="col">
														<label htmlFor="exampleInputEmail1" class="form-label">
															Endpoint Type
														</label>
														<select
															class="form-select form-control"
															placeholder="select dataset type"
															id="endpointType"
															name="endpointType"
															onBlur={formikAddEndpoint.handleBlur}
															onChange={(e) => {
																formikAddEndpoint.handleChange(e);
																// setAnaSetVariable(e.target.value);
																// setIsChangeAnalysis(true);
																formikAddEndpoint.setFieldValue(
																	"endpointType",
																	e.target.value
																);
															}}
															value={formikAddEndpoint.values.endpointType}
														>
															<option selected value="">
																Select
															</option>
															{endpointType.length > 0 &&
																endpointType.map((x, i) => {
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
												<div class="mb-3">
													<label htmlFor="exampleInputEmail1" class="form-label">
														Baseline Type
													</label>
													<input
														type="text"
														class="form-control"
														id="baseLineType"
														name="baseLineType"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.baseLineType}
													/>
												</div>
												<div className="d-flex">
													<button
														type="submit"
														className="btn btn-primary w-100 mt-2 me-2"
														disabled={
															(formikAddEndpoint.values.shortName == '' &&
																formikAddEndpoint.values.longName == '' &&
																formikAddEndpoint.values.desc == '' &&
																formikAddEndpoint.values.label == '' &&
																formikAddEndpoint.values.responseVariable == '' &&
																formikAddEndpoint.values.endpointType == '' &&
																formikAddEndpoint.values.baseLineType == '' &&
																formikAddEndpoint.values.dataCollection == '' &&
																formikAddEndpoint.values.dataSet == ''
															) ||
															(formikAddEndpoint.touched.shortName &&
																formikAddEndpoint.errors.shortName)
														}
													>
														{loading && (
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
														onClick={formikAddEndpoint.resetForm}
														disabled={
															formikAddEndpoint.values.shortName == '' &&
															formikAddEndpoint.values.longName == '' &&
															formikAddEndpoint.values.desc == '' &&
															formikAddEndpoint.values.label == '' &&
															formikAddEndpoint.values.responseVariable == '' &&
															formikAddEndpoint.values.endpointType == '' &&
															formikAddEndpoint.values.baseLineType == '' &&
															formikAddEndpoint.values.dataCollection == '' &&
															formikAddEndpoint.values.dataSet == ''
														}
													>
														Discard
													</button>
												</div>
											</div>
										</div>
									</form>
								</>
							) : (
								<>
									<form onSubmit={formikAddEndpoint.handleSubmit}>
										{/* ... (your existing code) */}
										<div className="mt-3">
											<div class="row mb-3">
												<div class="col">
													<label htmlFor="shortName" class="form-label">
														Short Name
														<sup className="text-danger">*</sup>
													</label>
													<input
														type="text"
														className={`form-control ${formikAddEndpoint.touched.shortName &&
															formikAddEndpoint.errors.shortName
															? "is-invalid"
															: ""
															}`}
														id="shortName"
														name="shortName"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.shortName}
													/>
													{formikAddEndpoint.touched.shortName &&
														formikAddEndpoint.errors.shortName ? (
														<div className="invalid-feedback">
															{formikAddEndpoint.errors.shortName}
														</div>
													) : (
														""
													)}
												</div>
												<div class="col">
													<label htmlFor="longName" class="form-label">
														Long Name
													</label>
													<input
														type="text"
														class="form-control"
														id="longName"
														name="longName"
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.longName}
													/>
													{errors.longName && (
														<div className="invalid-feedback">
															{errors.longName.message}
														</div>
													)}
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
														onBlur={formikAddEndpoint.handleBlur}
														onChange={(e) => {
															formikAddEndpoint.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddEndpoint.values.desc}
													/>
													{errors.desc && (
														<div className="invalid-feedback">
															{errors.desc.message}
														</div>
													)}
												</div>
												<div className="d-flex">
													<button
														type="submit"
														className="btn btn-primary w-100 mt-2 me-2"
														disabled={
															formikAddEndpoint.values.shortName == '' &&
															formikAddEndpoint.values.longName == '' &&
															formikAddEndpoint.values.desc == '' &&
															formikAddEndpoint.values.label == '' &&
															formikAddEndpoint.values.responseVariable == ''
														}
													>
														{formikAddEndpoint.isSubmitting && (
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
														onClick={formikAddEndpoint.resetForm}
														disabled={
															formikAddEndpoint.values.shortName == '' &&
															formikAddEndpoint.values.longName == '' &&
															formikAddEndpoint.values.desc == '' &&
															formikAddEndpoint.values.label == '' &&
															formikAddEndpoint.values.responseVariable == ''
														}
													>
														Discard
													</button>
												</div>
											</div>
										</div>

									</form>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default EndPointForm;
