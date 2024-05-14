import React, { useState } from "react";
import { useEffect } from "react";
import {
    addAnalysisFlag,
    getDataSetVariableView,
    updateAnalysisFlag,
} from "../../../../services/statistical-analysis-plan-service";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import commonSchema from "../../../../utils/validationSchema/common-schema";




const schema = yup.object().shape({
    shortName: yup.string().required("This Field is required."),
    longName: yup.string().required("This Field is required."),
    desc: yup.string().required("This Field is required."),
    label: yup.string().required("This Field is required."),
    //   variable: yup.string().required("This Field is required."),
    //   valueForInclusion: yup.string().required("This Field is required."),
});

const folderSchema = yup.object().shape({
    shortNames: yup.string().required("This Field is required."),
    longNames: yup.string().required("This Field is required."),
    descs: yup.string().required("This Field is required."),
});

const ParamterForm = (props) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(props.addType === "file" ? schema : folderSchema),
    });
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState("");
    const [inputType, setInputType] = useState("");
    const [inputTypeFile, setInputTypeFile] = useState("")
    const [selected, setSelected] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    let rowData = props?.selectedAnalysis;

    console.log('asdcds', rowData)
    useEffect(() => {
        if (rowData) {
            setValue("shortName", rowData.standardComponentParameterNameShort);
            setValue("longName", rowData.standardComponentParameterNameLong);
            setValue("desc", rowData.standardComponentParameterDescription);
            setValue("label", rowData.standardComponentParameterLabel);
            //   setValue("variable", rowData.analysisFlagVariable);
            //   setValue("valueForInclusion", rowData.analysisFlagValueInclusion);
        } else {
            setValue("shortName", "");
            setValue("longName", "");
            setValue("desc", "");
            setValue("label", "");
            //   setValue("variable", "");
            //   setValue("valueForInclusion", "");
        }
    }, [props.analysisRowData, setValue]);

    const clearFields = () => {
        setValue("shortName", "");
        setValue("longName", "");
        setValue("desc", "");
        setValue("label", "");
        setValue("variable", "");
        setValue("valueForInclusion", "");
        setValue("shortNames", "");
        setValue("longNames", "");
        setValue("descs", "");
    };

    const handleAnalysisSubmit = (data) => {
        console.log("datadata datadata datadata", data);
        props.onSubmit(data);
    };

    const formik = useFormik({
        initialValues: {
            shortName: rowData?.standardComponentParameterNameShort,
            longName: rowData?.standardComponentParameterNameLong,
            desc: rowData?.standardComponentParameterDescription,
            label: rowData?.standardComponentParameterLabel,
        },

        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            props.onSubmit(values);
        },
    });

    const formikAddAnalysis = useFormik({
        initialValues: {
            shortName: "",
            longName: "",
            desc: "",
            label: "",
            variable: "",
            valueForInc: "",
        },

        enableReinitialize: true,
        validationSchema: commonSchema,
        onSubmit: async (values, { resetForm }) => {
            props.onSubmit(values, resetForm);
        },
    });
    const [analysisFlagVariable, setAnalysisFlagVariable] = useState([]);
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


    const handleSelect = (option) => {
        setSelected(option);
        if (option === 2) {
            setInputType("controlled");
            // Perform any other actions if needed
        } else if (option === 3) {
            setInputType("dataset");
            // Perform any other actions if needed
        } else if (option === 4) {
            setInputType("variable");
            // Perform any other actions if needed
        }
        else {
            setInputType("")
        }
    };


    const handleSelectFile = (option) => {
        setSelectedFile(option);
        if (option === 2) {
            setInputTypeFile("controlled");
            // Perform any other actions if needed
        } else if (option === 3) {
            setInputTypeFile("dataset");
            // Perform any other actions if needed
        } else if (option === 4) {
            setInputTypeFile("variable");
            // Perform any other actions if needed
        }
        else {
            setInputTypeFile("")
        }
    };

    useEffect(() => {
        getSapDatasetVariableView(210, 216, setAnalysisFlagVariable);
    }, []);

    return (
        <>
            {props.showAnalysis === true ? (
                <div
                    style={{ border: "none" }}
                    className={`p-2 ${props.showAnalysis ? "" : "d-none"}`}
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
                            <td className="mt-2">Selected Parameter</td>
                        </th>
                        <div className="mt-3">
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
                                        name="shortName"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.shortName}
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
                                        name="longName"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            formik.handleChange(e);
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
                                    }}
                                    value={formik.values.desc}
                                />
                            </div>
                            <div className={rowData.isFolder ? 'd-none' : ''}>
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
                                    }}
                                    value={formik.values.label}
                                />
                            </div>
                            <div>
                                <label htmlFor="exampleInputEmail1" class="form-label mt-3 mb-3">Select Input Type</label>
                                <div className="d-flex " style={{ justifyContent: "center", padding: "10px 0" }} >
                                    <div className="d-flex " style={{ flexDirection: "column", textAlign: "center" }}>
                                        <input type="radio" id="css" name="inputType1" value="CSS" className="mb-2" onChange={() => handleSelect(0)} checked={selected === 0} />
                                        <i class="fa-solid fa-puzzle-piece mb-2"></i>
                                        <label style={{ fontSize: "14px", width: "99%" }}>Character String</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <input type="radio" id="css" name="inputType1" value="CSS" className="mb-2" onChange={() => handleSelect(1)} checked={selected === 1} />
                                        <i class="fa-solid fa-puzzle-piece mb-2"></i>
                                        <label style={{ fontSize: "14px" }}>Number</label>
                                    </div>
                                    <div className="d-flex mb-1" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <input type="radio" id="controlled" name="inputType1" value="controlled" className="mb-2" onChange={() => handleSelect(2)} checked={selected === 2} />
                                        <i className="fa fa-puzzle-piece mb-2"></i>
                                        <label style={{ fontSize: "14px", width: "99%" }}>Controlled Terminology</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <input type="radio" id="dataset" name="inputType1" value="dataset" className="mb-2" onChange={() => handleSelect(3)} checked={selected === 3} />
                                        <i className="fa fa-puzzle-piece mb-2"></i>
                                        <label style={{ fontSize: "14px" }}>Dataset</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <input type="radio" id="variable" name="inputType1" value="variable" className="mb-2" onChange={() => handleSelect(4)} checked={selected === 4} />
                                        <i className="fa fa-puzzle-piece mb-2"></i>
                                        <label style={{ fontSize: "14px", width: "99%" }}>Dataset Variable</label>
                                    </div>
                                </div>
                            </div>

                            {inputType == "controlled" && (
                                <div>
                                    <label style={{ fontSize: "12px" }}>Controlled Terminology Category</label>
                                    <div style={{ border: "1px solid black", width: "fit-content", padding: "8px" }}>
                                        Select Controlled Terminology Category
                                        <span style={{ marginLeft: "5px" }}><i class="fa fa-plus"></i></span>
                                    </div>
                                </div>
                            )}
                            {inputType == "dataset" && (
                                <div>
                                    <label style={{ fontSize: "12px" }}>Dataset Type</label>
                                    <select className="d-flex p-2">
                                        <option value="adsl">ADSL</option>
                                    </select>
                                </div>
                            )}
                            {inputType == "variable" && (
                                <div>
                                    <label style={{ fontSize: "12px" }}>Variable Content Type</label>
                                    <select className="d-flex p-2">
                                        <option value="response variable">Response Variable</option>
                                    </select>
                                </div>
                            )}


                            <div className="d-flex mt-3 ">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-2 me-2"
                                    disabled={
                                        formik.values.shortName == rowData?.standardComponentParameterNameShort &&
                                        formik.values.longName == rowData?.standardComponentParameterNameLong &&
                                        formik.values.desc == rowData?.standardComponentParameterDescription &&
                                        formik.values.label == rowData?.standardComponentParameterLabel
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
                                        formik.values.shortName == rowData?.standardComponentParameterNameShort &&
                                        formik.values.longName == rowData?.standardComponentParameterNameLong &&
                                        formik.values.desc == rowData?.standardComponentParameterDescription &&
                                        formik.values.label == rowData?.standardComponentParameterLabel
                                    }
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
                class={`modal fade  ${props.showAddAnalysisPop ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                {props.addType === "file"
                                    ? "Add Parameter File"
                                    : "Add Parameter Folder"}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    props.setShowAnalysisPop(false)
                                    formikAddAnalysis.resetForm()
                                }}
                            ></button>
                        </div>
                        <div class="modal-body">
                            {props.addType === "file" ? (
                                <>
                                    <form onSubmit={formikAddAnalysis.handleSubmit}>
                                        <div className="mt-3">
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
                                                        className={`form-control ${formikAddAnalysis.touched.shortName &&
                                                            formikAddAnalysis.errors.shortName
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="shortName"
                                                        name="shortName"
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.shortName}
                                                    />
                                                    {formikAddAnalysis.touched.shortName &&
                                                        formikAddAnalysis.errors.shortName ? (
                                                        <div className="invalid-feedback">
                                                            {formikAddAnalysis.errors.shortName}
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
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.longName}
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
                                                    onBlur={formikAddAnalysis.handleBlur}
                                                    onChange={(e) => {
                                                        formikAddAnalysis.handleChange(e);
                                                        // setIsChangeAnalysis(true);
                                                    }}
                                                    value={formikAddAnalysis.values.desc}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="exampleInputEmail1" class="form-label">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="label"
                                                    onBlur={formikAddAnalysis.handleBlur}
                                                    onChange={(e) => {
                                                        formikAddAnalysis.handleChange(e);
                                                        // setIsChangeAnalysis(true);
                                                    }}
                                                    value={formikAddAnalysis.values.label}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="exampleInputEmail1" class="form-label mt-3 mb-3">Select Input Type</label>
                                                <div className="d-flex " style={{ justifyContent: "center", padding: "10px 0" }} selected={selected} >
                                                    <div className="d-flex " style={{ flexDirection: "column", textAlign: "center" }}>
                                                        <input type="radio" id="css" name="inputTypeFile" value="CSS" className="mb-2" onChange={() => handleSelectFile(0)} checked={selectedFile === 0} />
                                                        <i class="fa-solid fa-puzzle-piece mb-2"></i>
                                                        <label style={{ fontSize: "14px", width: "99%" }}>Character String</label>
                                                    </div>
                                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                                        <input type="radio" id="css" name="inputTypeFile" value="CSS" className="mb-2" onChange={() => handleSelectFile(1)} checked={selectedFile === 1} />
                                                        <i class="fa-solid fa-puzzle-piece mb-2"></i>
                                                        <label style={{ fontSize: "14px" }}>Number</label>
                                                    </div>
                                                    <div className="d-flex mb-1" style={{ flexDirection: "column", textAlign: "center" }}>
                                                        <input type="radio" id="controlled" name="inputTypeFile" value="controlled" className="mb-2" onChange={() => handleSelectFile(2)} checked={selectedFile === 2} />
                                                        <i className="fa fa-puzzle-piece mb-2"></i>
                                                        <label style={{ fontSize: "14px", width: "99%" }}>Controlled Terminology</label>
                                                    </div>
                                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                                        <input type="radio" id="dataset" name="inputTypeFile" value="dataset" className="mb-2" onChange={() => handleSelectFile(3)} checked={selectedFile === 3} />
                                                        <i className="fa fa-puzzle-piece mb-2"></i>
                                                        <label style={{ fontSize: "14px" }}>Dataset</label>
                                                    </div>
                                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                                        <input type="radio" id="variable" name="inputTypeFile" value="variable" className="mb-2" onChange={() => handleSelectFile(4)} checked={selectedFile === 4} />
                                                        <i className="fa fa-puzzle-piece mb-2"></i>
                                                        <label style={{ fontSize: "14px", width: "99%" }}>Dataset Variable</label>
                                                    </div>
                                                </div>
                                            </div>

                                            {inputTypeFile == "controlled" && (
                                                <div>
                                                    <label style={{ fontSize: "12px" }} className="mb-1 mt-4">Controlled Terminology Category</label>
                                                    <div style={{ border: "1px solid black", width: "fit-content", padding: "8px" }} className="mb-4">
                                                        Select Controlled Terminology Category
                                                        <span style={{ marginLeft: "5px" }}><i class="fa fa-plus"></i></span>
                                                    </div>
                                                </div>
                                            )}
                                            {inputTypeFile == "dataset" && (
                                                <div>
                                                    <label style={{ fontSize: "12px" }} className="mb-1 mt-4">Dataset Type</label>
                                                    <select className="d-flex p-2 mb-4" >
                                                        <option value="adsl">ADSL</option>
                                                    </select>
                                                </div>
                                            )}
                                            {inputTypeFile == "variable" && (
                                                <div>
                                                    <label style={{ fontSize: "12px" }}  className="mb-1 mt-4">Variable Content Type</label>
                                                    <select className="d-flex p-2 mb-4">
                                                        <option value="response variable">Response Variable</option>
                                                    </select>
                                                </div>
                                            )}



                                            <div className="d-flex">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 mt-2 me-2"
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == '' &&
                                                        formikAddAnalysis.values.label == ''
                                                    }
                                                >
                                                    {formikAddAnalysis.isSubmitting && (
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
                                                    onClick={formikAddAnalysis.resetForm}
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == '' &&
                                                        formikAddAnalysis.values.label == ''
                                                    }
                                                >
                                                    Discard
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={formikAddAnalysis.handleSubmit}>
                                        <div className="mt-3">
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
                                                        className={`form-control ${formikAddAnalysis.touched.shortName &&
                                                            formikAddAnalysis.errors.shortName
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="shortName"
                                                        name="shortName"
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.shortName}
                                                    />
                                                    {formikAddAnalysis.touched.shortName &&
                                                        formikAddAnalysis.errors.shortName ? (
                                                        <div className="invalid-feedback">
                                                            {formikAddAnalysis.errors.shortName}
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
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.longName}
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
                                                    onBlur={formikAddAnalysis.handleBlur}
                                                    onChange={(e) => {
                                                        formikAddAnalysis.handleChange(e);
                                                        // setIsChangeAnalysis(true);
                                                    }}
                                                    value={formikAddAnalysis.values.desc}
                                                />
                                            </div>


                                            <div className="d-flex">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 mt-2 me-2"
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == ''
                                                    }
                                                >
                                                    {formikAddAnalysis.isSubmitting && (
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
                                                    onClick={formikAddAnalysis.resetForm}
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == ''
                                                    }
                                                >
                                                    Discard
                                                </button>
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

export default ParamterForm;
