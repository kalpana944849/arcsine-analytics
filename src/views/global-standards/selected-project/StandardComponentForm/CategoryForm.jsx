import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import { getControlledTerminology, getDataSetVariableView, getSapData } from "../../../../services/statistical-analysis-plan-service";
import { getIdFromString } from "../../../../utils/common-helper";
import CustomDropDownTree from "../../../../components/common/CustomDropDownTree/CustomDropDownTree";
import commonSchema from "../../../../utils/validationSchema/common-schema";


const CategoryForm = (props) => {
	const { loading, updateLoader } = props;

	const [dataCollectionsTreeData, setDataCollectionsTreeData] = useState([]);
	const [responseVariable, setResponseVariable] = useState([]);
	const [CollectionInput, setCollectionInput] = useState([]);
	const [datasetTreeData, setDatasetTreeData] = useState([]);
	const [dataCollection, setDataCollection] = useState([]);
	const [endpointType, setEndpointType] = useState([]);
	const [loader, setLoader] = useState(false)
	const [showAlert, setShowAlert] = useState(false);
	const [dataSet, setDataSet] = useState([]);
	const [message, setMessage] = useState("");


	let rowData = props?.categoryRowData;

	console.log('rowData', rowData)


	const coldemo = dataCollection.map(item => {
		return getIdFromString(item.sapDataId)
	})



	const formik = useFormik({
		initialValues: {
			shortName: rowData?.standardComponentCategoryNameShort,
			longName: rowData?.standardComponentCategoryNameLong,
			desc: rowData?.standardComponentCategoryDescription,
			label: rowData?.standardComponentCategoryLabel,

		},
		enableReinitialize: true,
		onSubmit: async (values, { resetForm }) => {
			console.log('called add 1', values, formikAddStandardCategory)
			props.onSubmitStandardComponent(values, resetForm, true);
		},
	});



	const formikAddStandardCategory = useFormik({
		initialValues: {
			shortName: "",
			longName: "",
			desc: "",
			label: "",
		},

		enableReinitialize: true,
		validationSchema: commonSchema,
		onSubmit: async (values, { resetForm }) => {
			console.log('called add 2', values, formikAddStandardCategory)
			props.onSubmitStandardComponent(values, resetForm, false);

		},
	});

	// setLoader(formikAddStandardCategory.isSubmitting)

	console.log('formillasdnalsk', formikAddStandardCategory, loading)

	const getEndPointType = async () => {
		const response = await getControlledTerminology(10);
		if (response.status == 200) {
			setEndpointType(response.data.data);
		}
	}

	const getResponseVariable = async () => {
		const response = await getDataSetVariableView(211, 221);
		if (response.status == 200) {
			setResponseVariable(response.data.data);
		}
	}


	useEffect(() => {
		formikAddStandardCategory.resetForm()
	}, [props.addCategoryType])

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
					<form onSubmit={formik.handleSubmit}>
						<th
							style={{
								top: "0px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<td className="mt-2">Category Details</td>
						</th>
						<div className="mt-3">
							<div
								className={`row mb-3 ${props.selectedEndpoint?.isFolder ? "d-none" : ""
									}`}
							>

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

								</div>

								<div className="d-flex">
									<button
										type="submit"
										className="btn btn-primary w-100 mt-2 me-2"
										disabled={
											(formik.values.shortName == rowData?.standardComponentCategoryNameShort &&
												formik.values.longName == rowData?.standardComponentCategoryNameLong &&
												formik.values.desc == rowData?.standardComponentCategoryDescription &&
												formik.values.label == rowData?.standardComponentCategoryLabel)
											|| (formik.touched.shortName &&
												formik.errors.shortName)
										}
									>
										{updateLoader && (
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
											formik.values.shortName == rowData?.standardComponentCategoryNameShort &&
											formik.values.longName == rowData?.standardComponentCategoryNameLong &&
											formik.values.desc == rowData?.standardComponentCategoryDescription &&
											formik.values.label == rowData?.standardComponentCategoryLabel
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
						Standard Category is not selected. Please select a Standard Category.
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
								{props.addCategoryType === "file"
									? "Add Category Item"
									: "Add Category Folder"}
							</h5>
							<button
								type="button"
								class="btn-close"
								id="close_add_parent"
								data-bs-dismiss="modal"
								aria-label="Close"
								onClick={() => {
									props.setShowEndPointPop(false)
									formikAddStandardCategory.resetForm()
								}
								}
							></button>
						</div>
						<div class="modal-body">
							{props.addCategoryType === "file" ? (
								<>
									<form onSubmit={formikAddStandardCategory.handleSubmit}>
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
														className={`form-control ${formikAddStandardCategory.touched.shortName &&
															formikAddStandardCategory.errors.shortName
															? "is-invalid"
															: ""
															}`}
														id="shortName"
														name="shortName"
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.shortName}
													/>
													{formikAddStandardCategory.touched.shortName &&
														formikAddStandardCategory.errors.shortName ? (
														<div className="invalid-feedback">
															{formikAddStandardCategory.errors.shortName}
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
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.longName}
													/>

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
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.desc}
													/>

												</div>
												<div
													className={`mb-3`}
												>
													<label htmlFor="exampleInputEmail1" class="form-label">
														Label
													</label>
													<input
														type="text"
														class="form-control"
														id="label"
														name="label"
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
														}}
														value={formikAddStandardCategory.values.label}
													/>

												</div>

												<div className="d-flex">
													<button
														type="submit"
														className="btn btn-primary w-100 mt-2 me-2"
														disabled={
															(formikAddStandardCategory.values.shortName == '' &&
																formikAddStandardCategory.values.longName == '' &&
																formikAddStandardCategory.values.desc == '' &&
																formikAddStandardCategory.values.label == ''

															) ||
															(formikAddStandardCategory.touched.shortName &&
																formikAddStandardCategory.errors.shortName)
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
														onClick={formikAddStandardCategory.resetForm}
														disabled={
															formikAddStandardCategory.values.shortName == '' &&
															formikAddStandardCategory.values.longName == '' &&
															formikAddStandardCategory.values.desc == '' &&
															formikAddStandardCategory.values.label == ''

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
									<form onSubmit={formikAddStandardCategory.handleSubmit}>
										<div className="mt-3">
											<div class="row mb-3">
												<div class="col">
													<label htmlFor="shortName" class="form-label">
														Short Name
														<sup className="text-danger">*</sup>
													</label>
													<input
														type="text"
														className={`form-control ${formikAddStandardCategory.touched.shortName &&
															formikAddStandardCategory.errors.shortName
															? "is-invalid"
															: ""
															}`}
														id="shortName"
														name="shortName"
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.shortName}
													/>
													{formikAddStandardCategory.touched.shortName &&
														formikAddStandardCategory.errors.shortName ? (
														<div className="invalid-feedback">
															{formikAddStandardCategory.errors.shortName}
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
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.longName}
													/>

												</div>
												<div className="mb-3">
													<label htmlFor="exampleInputEmail1" class="form-label">
														Description
													</label>
													<input
														type="text"
														class="form-control"
														id="desc"
														name="desc"
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.desc}
													/>

												</div>
												<div
													className={`mb-3`}
												>
													<label htmlFor="exampleInputEmail1" class="form-label">
														Label
													</label>
													<input
														type="text"
														class="form-control"
														id="label"
														name="label"
														onBlur={formikAddStandardCategory.handleBlur}
														onChange={(e) => {
															formikAddStandardCategory.handleChange(e);
															// setIsChangeAnalysis(true);
														}}
														value={formikAddStandardCategory.values.label}
													/>

												</div>
												<div className="d-flex">
													<button
														type="submit"
														className="btn btn-primary w-100 mt-2 me-2"
														disabled={
															formikAddStandardCategory.values.shortName == '' &&
															formikAddStandardCategory.values.longName == '' &&
															formikAddStandardCategory.values.desc == '' &&
															formikAddStandardCategory.values.label == ''
															// formikAddStandardCategory.values.responseVariable == ''
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
														onClick={formikAddStandardCategory.resetForm}
														disabled={
															formikAddStandardCategory.values.shortName == '' &&
															formikAddStandardCategory.values.longName == '' &&
															formikAddStandardCategory.values.desc == '' &&
															formikAddStandardCategory.values.label == ''
															// formikAddStandardCategory.values.responseVariable == ''
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

export default CategoryForm;
