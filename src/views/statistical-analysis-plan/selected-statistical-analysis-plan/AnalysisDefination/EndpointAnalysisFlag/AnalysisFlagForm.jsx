import React, { useState } from "react";
import { useEffect } from "react";
import {
  addAnalysisFlag,
  getDataSetVariableView,
  updateAnalysisFlag,
} from "../../../../../services/statistical-analysis-plan-service";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import commonSchema from "../../../../../utils/validationSchema/common-schema";

const schema = yup.object().shape({
  shortName: yup.string().required("This Field is required."),
  longName: yup.string().required("This Field is required."),
  desc: yup.string().required("This Field is required."),
  label: yup.string().required("This Field is required."),
  variable: yup.string().required("This Field is required."),
  valueForInclusion: yup.string().required("This Field is required."),
});

const folderSchema = yup.object().shape({
  shortNames: yup.string().required("This Field is required."),
  longNames: yup.string().required("This Field is required."),
  descs: yup.string().required("This Field is required."),
});

const AnalysisFlagForm = (props) => {
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
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  let rowData = props?.selectedAnalysis;

  useEffect(() => {
    if (rowData) {
      setValue("shortName", rowData.analysisFlagNameShort);
      setValue("longName", rowData.analysisFlagNameLong);
      setValue("desc", rowData.analysisFlagDescription);
      setValue("label", rowData.analysisFlagLabel);
      setValue("variable", rowData.analysisFlagVariable);
      setValue("valueForInclusion", rowData.analysisFlagValueInclusion);
    } else {
      setValue("shortName", "");
      setValue("longName", "");
      setValue("desc", "");
      setValue("label", "");
      setValue("variable", "");
      setValue("valueForInclusion", "");
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
      shortName: rowData?.analysisFlagNameShort,
      longName: rowData?.analysisFlagNameLong,
      desc: rowData?.analysisFlagDescription,
      label: rowData?.analysisFlagLabel,
      variable: rowData?.analysisFlagVariable,
      valueForInc: rowData?.analysisFlagValueInclusion
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
              <td className="mt-2">Selected Analysis Flag</td>
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
              <div className={rowData.isFolder ? 'd-none' : ''}>
                <label
                  htmlFor="exampleInputEmail1"
                  class="form-label"
                >
                  Analysis Flag Variable
                </label>
                <select
                  class="form-select form-control"
                  aria-label="Default select example"
                  placeholder="select dataset type"
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("variable", e.target.value);
                  }}
                  value={formik.values.variable}
                >
                  <option selected value="">
                    Select Analysis Flag Variable
                  </option>
                  {analysisFlagVariable.length > 0 &&
                    analysisFlagVariable.map((x, i) => {
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
              <div className={rowData.isFolder ? 'd-none' : ''}>
                <div class="col">
                  <label htmlFor="exampleInputEmail1" class="form-label">
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
                    }}
                    value={formik.values.valueForInc}
                  />
                </div>
              </div>
              <div className="d-flex">
                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-2 me-2"
                  disabled={
                    formik.values.shortName == rowData?.analysisFlagNameShort &&
                    formik.values.longName == rowData?.analysisFlagNameLong &&
                    formik.values.desc == rowData?.analysisFlagDescription &&
                    formik.values.label == rowData?.analysisFlagLabel &&
                    formik.values.valueForInc ==
                    rowData?.analysisFlagValueInclusion &&
                    formik.values.variable == rowData?.analysisFlagVariable
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
                    formik.values.shortName == rowData?.analysisFlagNameShort &&
                    formik.values.longName == rowData?.analysisFlagNameLong &&
                    formik.values.desc == rowData?.analysisFlagDescription &&
                    formik.values.label == rowData?.analysisFlagLabel &&
                    formik.values.valueForInc ==
                    rowData?.analysisFlagValueInclusion &&
                    formik.values.variable == rowData?.analysisFlagVariable
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
                  ? "Add Analysis Flag File"
                  : "Add Analysis Flag Folder"}
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
                // <form onSubmit={handleSubmit(onSubmit)}>
                //   <div class="row mb-3">
                //     <div class="col">
                //       <label htmlFor="shortName" class="form-label">
                //         Short Name
                //         <sup className="text-danger">*</sup>
                //       </label>
                //       <input
                //         type="text"
                //         id="shortName"
                //         class={`form-control ${
                //           errors.shortName ? "is-invalid" : ""
                //         }`}
                //         {...register("shortName")}
                //       />
                //       {errors.shortName && (
                //         <div className="invalid-feedback">
                //           {errors.shortName.message}
                //         </div>
                //       )}
                //     </div>
                //     <div class="col">
                //       <label htmlFor="exampleInputEmail1" class="form-label">
                //         Long Name
                //       </label>
                //       <input
                //         type="text"
                //         class={`form-control ${
                //           errors.shortName ? "is-invalid" : ""
                //         }`}
                //         id="longName"
                //         name="longName"
                //         {...register("longName")}
                //       />
                //       {errors.longName && (
                //         <div className="invalid-feedback">
                //           {errors.longName.message}
                //         </div>
                //       )}
                //     </div>
                //   </div>
                //   <div class="mb-3">
                //     <label htmlFor="exampleInputEmail1" class="form-label">
                //       Description
                //     </label>
                //     <input
                //       type="text"
                //       id="desc"
                //       class={`form-control ${errors.desc ? "is-invalid" : ""}`}
                //       {...register("desc")}
                //     />
                //     {errors.desc && (
                //       <div className="invalid-feedback">
                //         {errors.desc.message}
                //       </div>
                //     )}
                //   </div>
                //   <div class="mb-3">
                //     <label htmlFor="exampleInputEmail1" class="form-label">
                //       Label
                //     </label>
                //     <input
                //       type="text"
                //       id="label"
                //       class={`form-control ${errors.label ? "is-invalid" : ""}`}
                //       {...register("label")}
                //     />
                //     {errors.label && (
                //       <div className="invalid-feedback">
                //         {errors.label.message}
                //       </div>
                //     )}
                //   </div>
                //   <div class="row mb-3">
                //     <div class="col">
                //       <label htmlFor="exampleInputEmail1" class="form-label">
                //         Variable
                //       </label>
                //       <input
                //         type="text"
                //         id="variable"
                //         name="variable"
                //         class={`form-control ${
                //           errors.variable ? "is-invalid" : ""
                //         }`}
                //         {...register("variable")}
                //       />
                //       {errors.variable && (
                //         <div className="invalid-feedback">
                //           {errors.variable.message}
                //         </div>
                //       )}
                //     </div>
                //     <div class="col">
                //       <label htmlFor="exampleInputEmail1" class="form-label">
                //         Value for inclusion
                //       </label>
                //       <input
                //         type="text"
                //         id="longName"
                //         name="valueForInclusion"
                //         class={`form-control ${
                //           errors.valueForInclusion ? "is-invalid" : ""
                //         }`}
                //         {...register("valueForInclusion")}
                //       />
                //       {errors.valueForInclusion && (
                //         <div className="invalid-feedback">
                //           {errors.valueForInclusion.message}
                //         </div>
                //       )}
                //     </div>
                //   </div>
                //   <div className="d-flex">
                //     <button
                //       type="submit"
                //       className="btn btn-primary w-100 mt-2 me-2"
                //     >
                //       Save
                //     </button>
                //     <button
                //       type="button"
                //       className="btn btn-primary w-100 mt-2"
                //     >
                //       Discard
                //     </button>
                //   </div>
                // </form>
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
                        <label
                          htmlFor="exampleInputEmail1"
                          class="form-label"
                        >
                          Analysis Flag Variable
                        </label>
                        <select
                          class="form-select form-control"
                          aria-label="Default select example"
                          placeholder="select dataset type"
                          onBlur={formik.handleBlur}
                          onChange={(e) => {
                            formik.handleChange(e);
                            // setAnaSetVariable(e.target.value);
                            formik.setFieldValue("variable", e.target.value);
                          }}
                          value={formik.values.variable}
                        >
                          <option selected value="">
                            Select Analysis Flag Variable
                          </option>
                          {analysisFlagVariable.length > 0 &&
                            analysisFlagVariable.map((x, i) => {
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
                      <div>
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
                            onBlur={formikAddAnalysis.handleBlur}
                            onChange={(e) => {
                              formikAddAnalysis.handleChange(e);
                              // setIsChangeAnalysis(true);
                            }}
                            value={formikAddAnalysis.values.valueForInc}
                          />
                        </div>
                      </div>
                      <div className="d-flex">
                        <button
                          type="submit"
                          className="btn btn-primary w-100 mt-2 me-2"
                          disabled={
                            formikAddAnalysis.values.shortName == '' &&
                            formikAddAnalysis.values.longName == '' &&
                            formikAddAnalysis.values.desc == '' &&
                            formikAddAnalysis.values.label == '' &&
                            formikAddAnalysis.values.valueForInc == '' &&
                            formikAddAnalysis.values.variable == ''
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
                            formikAddAnalysis.values.label == '' &&
                            formikAddAnalysis.values.valueForInc == '' &&
                            formikAddAnalysis.values.variable == ''
                          }
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                // <form onSubmit={handleSubmit(onSubmit)}>
                //   <div class="row mb-3">
                //     <div class="col">
                //       <label htmlFor="shortName" class="form-label">
                //         Short Name
                //         <sup className="text-danger">*</sup>
                //       </label>
                //       <input
                //         type="text"
                //         id="shortNames"
                //         class={`form-control ${
                //           errors.shortNames ? "is-invalid" : ""
                //         }`}
                //         {...register("shortNames")}
                //       />
                //       {errors.shortNames && (
                //         <div className="invalid-feedback">
                //           {errors.shortNames.message}
                //         </div>
                //       )}
                //     </div>
                //     <div class="col">
                //       <label htmlFor="exampleInputEmail1" class="form-label">
                //         Long Name
                //       </label>
                //       <input
                //         type="text"
                //         class={`form-control ${
                //           errors.longNames ? "is-invalid" : ""
                //         }`}
                //         id="longNames"
                //         name="longNames"
                //         {...register("longNames")}
                //       />
                //       {errors.longNames && (
                //         <div className="invalid-feedback">
                //           {errors.longNames.message}
                //         </div>
                //       )}
                //     </div>
                //   </div>
                //   <div class="mb-3">
                //     <label htmlFor="exampleInputEmail1" class="form-label">
                //       Description
                //     </label>
                //     <input
                //       type="text"
                //       id="descs"
                //       class={`form-control ${errors.descs ? "is-invalid" : ""}`}
                //       {...register("descs")}
                //     />
                //     {errors.descs && (
                //       <div className="invalid-feedback">
                //         {errors.descs.message}
                //       </div>
                //     )}
                //   </div>
                //   <div className="d-flex">
                //     <button
                //       type="submit"
                //       className="btn btn-primary w-100 mt-2 me-2"
                //     >
                //       Save
                //     </button>
                //     <button
                //       type="button"
                //       className="btn btn-primary w-100 mt-2"
                //     >
                //       Discard
                //     </button>
                //   </div>
                // </form>
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

export default AnalysisFlagForm;
