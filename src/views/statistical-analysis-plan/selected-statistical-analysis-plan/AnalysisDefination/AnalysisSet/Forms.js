import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  addAnalysisSet,
  addTreatmentType,
  getDataSetVariableView,
  getSapTreatmentInput,
} from "../../../../../services/statistical-analysis-plan-service";
import { Grid, GridColumn, GridNoRecords } from "@progress/kendo-react-grid";
import commonSchema from "../../../../../utils/validationSchema/common-schema";
import Select from "react-select";

const data = {
  "sapTreatmentTypeId": 0,
  "sapTreatmentTypeGuid": "string",
  "companyId": 1,
  "sapId": 43,
  "sapVersionId": 24,
  "parentId": 0,
  "parentGuid": "",
  "isFolder": false,
  "treatmentTypeNameShort": "string",
  "treatmentTypeNameLong": "string",
  "treatmentTypeDescription": "string",
  "treatmentTypeLabel": "string",
  "treatmentTypeVariable": "string",
  "treatmentTypeVariableSort": "string",
  "treatmentVariableCodeId": 2014,
  "treatmentVariableDecodeId": 1966,
  "displayOrder": 0,
  "updatedBy": "string",
  "createdBy": "string",
  "updatedDate": "2024-02-17T19:07:27.425Z",
  "createdDate": "2024-02-17T19:07:27.425Z",
  "sapTreatmentInputDTO": [
    {
      "sapTreatmentId": 0,
      "sapTreatmentGuid": "",
      "companyId": 1,
      "sapId": 43,
      "sapVersionId": 24,
      "sapTreatmentTypeId": 0,
      "parentId": 0,
      "parentGuid": "",
      "isFolder": false,
      "treatmentNameShort": "string",
      "treatmentNameLong": "string",
      "treatmentLabel": "string",
      "isDisplay": true,
      "isReference": true,
      "displayOrder": 0,
      "createdDate": "2024-02-17T19:07:27.426Z",
      "updatedDate": "2024-02-17T19:07:27.426Z",
      "updatedBy": "string",
      "createdBy": "string",
      "deleted": true
    }
  ],
  "sapTreatmentPoolingInputDTO": [
    {
      "sapTreatmentPoolingId": 0,
      "sapTreatmentPoolingGuid": "string",
      "companyId": 1,
      "sapId": 43,
      "sapVersionId": 24,
      "sapTreatmentTypeId": 0,
      "parentId": 0,
      "parentGuid": "string",
      "isFolder": true,
      "treatmentPoolingNameShort": "string",
      "treatmentPoolingNameLong": "string",
      "treatmentPoolingDescription": "string",
      "isDisplay": true,
      "isReference": true,
      "displayOrder": 0,
      "treatmentId": [
        0
      ],
      "createdDate": "2024-02-17T19:07:27.426Z",
      "updatedDate": "2024-02-17T19:07:27.426Z",
      "updatedBy": "string",
      "createdBy": "string",
      "deleted": true
    }
  ]
}

export const AddAnalysisSet = (props) => {
  const {
    showAddAnalysisPop,
    setShowAnalysisPop,
    getAnalysisInput,
    setMessage,
    setShowAlert,
    isFolder,
    analysisSetVariableData,
    sapId,
    sapVersionId,
    parentId,
  } = props;

  const [btnLoading, setBtnLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      desc: "",
      label: "",
      valueForInc: "",
      variable: "",
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        sapAnalysisSetId: 0,
        sapAnalysisSetGuid: "",
        companyId: 1,
        sapId: 43,
        sapVersionId: 24,
        parentId: parentId,
        isFolder: isFolder,
        analysisSetNameShort: values.shortName,
        analysisSetNameLong: values.longName,
        analysisSetDescription: values.desc,
        analysisSetVariable: values.variable,
        analysisSetValueInclusion: values.valueForInc,
        analysisSetLabel: values.label,
        displayOrder: 1,
        createdBy: null,
        updatedBy: null,
        createdDate: null,
        updatedDate: null,
        deleted: null,
      };
      setMessage("Analysis Set has been added successfully.");
      setBtnLoading(true);
      const response = await addAnalysisSet(reqBody);
      if (response.status == 200) {
        getAnalysisInput(sapId, sapVersionId);
        setShowAnalysisPop(false);
        setShowAlert(true);
        resetForm();
        setBtnLoading(false);
      }
    },
  });
  return (
    <div
      class={`modal fade  ${showAddAnalysisPop ? "show d-block" : ""} `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {`Add Analysis Set ${isFolder ? "Folder" : "File"}`}
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowAnalysisPop(false);
                formik.resetForm();
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formik.touched.shortName && formik.errors.shortName
                        ? "is-invalid"
                        : ""
                        }`}
                      id="shortName"
                      name="shortName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shortName}
                    />
                    {formik.touched.shortName && formik.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formik.errors.shortName}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    name="desc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.desc}
                  />
                </div>
                <div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Label
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="label"
                    name="label"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.label}
                  />
                </div>
                <div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Analysis Set Variable
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
                      Select Analysis Set Variable
                    </option>
                    {analysisSetVariableData.length > 0 &&
                      analysisSetVariableData.map((x, i) => {
                        return (
                          <option key={i} value={x.sapDataVariableNameShort}>
                            {x.sapDataVariableNameShort}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className={`mb-3 ${isFolder ? "d-none" : ""}`}>
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Value For Inclusion
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="valueForInc"
                    name="valueForInc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.valueForInc}
                  />
                </div>

                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      (formik.values.shortName == "" &&
                        formik.values.longName == "" &&
                        formik.values.desc == "" &&
                        formik.values.label == "" &&
                        formik.values.valueForInc == "" &&
                        formik.values.variable == "") ||
                      (formik.touched.shortName && formik.errors.shortName)
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
                    type="submit"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={formik.resetForm}
                    disabled={
                      formik.values.shortName == "" &&
                      formik.values.longName == "" &&
                      formik.values.desc == "" &&
                      formik.values.label == "" &&
                      formik.values.valueForInc == "" &&
                      formik.values.variable == ""
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
  );
};

export const AddTreatmentType = (props) => {
  const {
    showAddTreatmentTypePop,
    setShowAddTreatmentTypePop,
    setShowAddTreatmentPop,
    showAddTreatmentPop,
    showAddPooledTreatmentGroupPop,
    setShowAddPooledTreatmentGroupPop,
    getTreatmentData,
    sapGuid,
    setMessage,
    setShowAlert,
    isFolder,
    analysisSetVariableData,
    sapId,
    sapVersionId,
    parentId,
  } = props;
  const [variableCode, setVariableCode] = useState([]);
  const [variableDecode, setVariableDecode] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [poolingTableData, setPoolingTableData] = useState([]);
  const [checkedState, setCheckedState] = useState("");
  const [sapTreatmentInputDTO, setSapTreatmentInputDTO] = useState([]);
  const [sapTreatmentPoolingInputDTO, setSapTreatmentPoolingInputDTO] = useState([]);
  const [showGridHeaderAddFile, setShowGridHeaderAddFile] = useState(false);
  const customColumnTemplate = (props) => {

    return (
      <td>
        <input
          type="radio"
          name="rowSelector"
          value={props.dataItem.refrence}
          checked={props.dataItem.refrence}
        />
      </td>
    );
  };

  const customHeaderAdd = () => {
    return (
      <button
        style={{ border: "none" }}
        onClick={() => {
          setShowAddTreatmentPop(true);
          // setShowAddTreatmentTypePop(false)
        }}
      >
        <i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
      </button>
    );
  };
  const customHeader = () => {
    return (
      <button
        style={{ border: "none" }}
        onClick={() => {
          setShowAddPooledTreatmentGroupPop(true);
          // setShowAddTreatmentTypePop(false)
        }}
      >
        <i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
      </button>
    );
  };

  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      desc: "",
      label: "",
      TreatmentVariableCode: "",
      decode: "",
    },
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        sapTreatmentTypeId: 0,
        sapTreatmentTypeGuid: "",
        companyId: 1,
        sapId: 43,
        sapVersionId: 24,
        parentId: parentId,
        isFolder: isFolder,
        treatmentTypeNameShort: values.shortName,
        treatmentTypeNameLong: values.longName,
        treatmentTypeDescription: values.desc,
        treatmentTypeLabel: values.label,
        treatmentTypeVariable: values.TreatmentVariableCode,
        treatmentTypeVariableSort: values.decode,
        treatmentVariableCodeId: 2014,
        treatmentVariableDecodeId: 1966,
        displayOrder: 1,
        updatedBy: null,
        createdBy: null,
        updatedDate: null,
        createdDate: null,
      };
      if (sapTreatmentInputDTO.length > 0) {
        reqBody.sapTreatmentInputDTO = sapTreatmentInputDTO
      }
      if (sapTreatmentPoolingInputDTO.length > 0) {
        reqBody.sapTreatmentPoolingInputDTO = sapTreatmentPoolingInputDTO
      }

      setMessage("Treatment type added successfully.");
      const response = await addTreatmentType(reqBody);
      if (response.status == 200) {
        alert(1)
        setShowAddTreatmentTypePop(false);
        setSapTreatmentInputDTO([]);
        setTableData([]);
        getTreatmentData(sapId, sapVersionId, sapGuid);
        setShowAlert(true);
        resetForm();
      } else {
        setShowAddTreatmentTypePop(false);
        setSapTreatmentInputDTO([]);
        setTableData([]);
        getTreatmentData(sapId, sapVersionId, sapGuid);
      }
    },
  });
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
    getSapDatasetVariableView(210, 430, setVariableCode);
    getSapDatasetVariableView(210, 429, setVariableDecode);
  }, []);

  const CustomNoRecordsMessage = () => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <p>No custom records available message</p>
    </div>
  );
  const customDisplayColumnTemplate = (props) => {

    return (
      <td>
        <input type="checkbox" checked={props.dataItem.check} name="rowSelector" />
      </td>
    );
  };
  return (
    <div
      class={`modal modal-xl fade  ${showAddTreatmentTypePop ? "show d-block" : ""
        } `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Add Treatment Type
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowAddTreatmentTypePop(false);
                formik.resetForm();
                setTableData([]);
                setSapTreatmentInputDTO([]);
                setPoolingTableData([]);
                formik.setFieldValue("TreatmentVariableCode", "");
                formik.setFieldValue("TreatmentVariableDeCode", "");
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formik.touched.shortName && formik.errors.shortName
                        ? "is-invalid"
                        : ""
                        }`}
                      id="shortName"
                      name="shortName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shortName}
                    />
                    {formik.touched.shortName && formik.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formik.errors.shortName}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    name="desc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.desc}
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Label
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="label"
                    name="label"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.label}
                  />
                </div>
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Treatment Variable Code
                    </label>
                    <select
                      class="form-select form-control"
                      aria-label="Default select example"
                      placeholder="select dataset type"
                      name="TreatmentVariableCode"
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue(
                          "TreatmentVariableCode",
                          e.target.value
                        );
                      }}
                      value={formik.values.TreatmentVariableCode}
                    >
                      <option selected value="">
                        Select Treatment Code
                      </option>
                      {variableCode.length > 0 &&
                        variableCode.map((x, i) => {
                          return (
                            <option key={i} value={x.sapDataVariableId}>
                              {x.sapDataDatasetVariableName}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  <div class="col">
                    <label htmlFor="decode">Treatment Variable Decode</label>
                    <select
                      id="decode"
                      name="decode"
                      class="form-select form-control"
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue(
                          "decode",
                          e.target.value
                        );
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.decode}
                    >
                      <option selected value="">
                        Select Treatment Decode
                      </option>
                      {variableDecode.length > 0 &&
                        variableDecode.map((x, i) => {
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
                </div>

                <Grid
                  className="mt-4"
                  data={poolingTableData}
                  selectable={{
                    enabled: true,
                    drag: false,
                    cell: false,
                    mode: "single",
                  }}
                  noRecords={<CustomNoRecordsMessage />}
                  navigatable={true}
                >
                  <GridNoRecords>
                    <p style={{ background: "yellow", fontSize: "20px" }} className="p-2">Add</p>
                  </GridNoRecords>
                  {/* <GridColumn
                    field="selection"
                    cell={customColumnTemplate}
                    width="50"
                    title=" "
                  /> */}
                  <GridColumn field="displayOrder" title="Display Order" width="200" />
                  <GridColumn
                    field="treatmentPoolingGroup"
                    title="Pooled Treatment Groups"
                  />
                  <GridColumn
                    field="treatmentsPool"
                    title="Treatments to Pool"
                  />
                  <GridColumn field="treatmentsLevel" title="Label" />
                  <GridColumn headerCell={customHeader} width="80" />
                </Grid>

                <Grid
                  className="mt-4"
                  data={tableData}
                  selectable={{
                    enabled: true,
                    drag: false,
                    cell: false,
                    mode: "single",
                  }}
                  navigatable={true}
                >
                  <GridNoRecords>
                    <p style={{ background: "yellow", fontSize: "20px" }} className="p-2">Add</p>
                  </GridNoRecords>
                  <GridColumn field="displayOrder" title="Display Order" />
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
                  <GridColumn headerCell={customHeaderAdd} width="80" />
                </Grid>
                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      (formik.values.shortName == "" &&
                        formik.values.longName == "" &&
                        formik.values.desc == "" &&
                        formik.values.label == "" &&
                        formik.values.TreatmentVariableCode == "" &&
                        formik.values.decode == ""
                      ) ||
                      // formik.values.TreatmentVariableDeCode == ""
                      (formik.touched.shortName && formik.errors.shortName)
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
                    onClick={() => {
                      formik.resetForm();
                      formik.setFieldValue("TreatmentVariableCode", "");
                      formik.setFieldValue("decode", "");
                    }}
                    disabled={
                      formik.values.shortName == "" &&
                      formik.values.longName == "" &&
                      formik.values.desc == "" &&
                      formik.values.label == "" &&
                      formik.values.TreatmentVariableCode == "" &&
                      formik.values.decode == ""
                      // formik.values.TreatmentVariableDeCode == ""
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
      <AddTreatment
        setTableData={setTableData}
        showAddTreatmentPop={showAddTreatmentPop}
        setShowAddTreatmentPop={setShowAddTreatmentPop}
        setSapTreatmentInputDTO={setSapTreatmentInputDTO}
      />
      <AddPooledTreatmentGroup
        setPoolingTableData={setPoolingTableData}
        setSapTreatmentPoolingInputDTO={setSapTreatmentPoolingInputDTO}
        showAddPooledTreatmentGroupPop={showAddPooledTreatmentGroupPop}
        setShowAddPooledTreatmentGroupPop={setShowAddPooledTreatmentGroupPop}
      />
    </div>
  );
};

export const AddTreatmentFolder = (props) => {
  const {
    showAddTreatmentFolderPop,
    setShowAddTreatmentFolderPop,
    setMessage,
    setShowAlert,
    sapId,
    sapVersionId,
    sapGuid,
    getTreatmentData,
    parentId,
  } = props;

  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      desc: "",
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        sapTreatmentTypeId: 0,
        sapTreatmentTypeGuid: "",
        companyId: 1,
        sapId: 43,
        sapVersionId: 24,
        parentId: parentId,
        isFolder: true,
        treatmentTypeNameShort: values.shortName,
        treatmentTypeNameLong: values.longName,
        treatmentTypeDescription: values.desc,
        treatmentTypeLabel: "",
        treatmentTypeVariable: "",
        treatmentTypeVariableSort: "",
        displayOrder: 1,
        updatedBy: null,
        createdBy: null,
        updatedDate: null,
        createdDate: null,
      };
      setMessage("Treatment type added successfully.");
      const response = await addTreatmentType(reqBody);
      if (response.status == 200) {
        setShowAddTreatmentFolderPop(false);
        getTreatmentData(sapId, sapVersionId, sapGuid);
        setShowAlert(true);
        resetForm();
      }
    },
  });
  return (
    <div
      class={`modal fade  ${showAddTreatmentFolderPop ? "show d-block" : ""} `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Add Folder
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowAddTreatmentFolderPop(false);
                formik.resetForm();
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formik.touched.shortName && formik.errors.shortName
                        ? "is-invalid"
                        : ""
                        }`}
                      id="shortName"
                      name="shortName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shortName}
                    />
                    {formik.touched.shortName && formik.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formik.errors.shortName}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    name="desc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.desc}
                  />
                </div>
                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      (formik.values.shortName == "" &&
                        formik.values.longName == "" &&
                        formik.values.desc == "") ||
                      // formik.values.TreatmentVariableDeCode == ""
                      (formik.touched.shortName && formik.errors.shortName)
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
                      formik.values.shortName == "" &&
                      formik.values.longName == "" &&
                      formik.values.desc == ""
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
  );
};

export const AddTreatment = (props) => {
  const {
    showAddTreatmentPop,
    setShowAddTreatmentPop,
    setTableData,
    setSapTreatmentInputDTO
  } = props;

  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      label: "",
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "sapTreatmentId": 0,
        "sapTreatmentGuid": "",
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 24,
        "sapTreatmentTypeId": 0,
        "parentId": 0,
        "parentGuid": "",
        "isFolder": true,
        "treatmentNameShort": values.shortName,
        "treatmentNameLong": values.longName,
        "treatmentLabel": values.label,
        "isDisplay": true,
        "isReference": false,
        "displayOrder": 1
      }

      const data = {
        "displayOrder": 1,
        "check": true,
        "treatment": values.shortName,
        "refrence": false,
        "label": values.label
      }

      setTableData((prevState) => {
        let maxDisplayOrderElement = 0
        if (prevState.length > 0) {
          maxDisplayOrderElement = prevState.reduce((maxElement, currentElement) => {
            return currentElement.displayOrder > maxElement.displayOrder ? currentElement : maxElement;
          }, prevState[0]);
          data.displayOrder = maxDisplayOrderElement.displayOrder + 1;
        }
        return [...prevState, data]
      });

      setSapTreatmentInputDTO((prevState) => {
        let maxDisplayOrderElement = 0
        if (prevState.length > 0) {
          maxDisplayOrderElement = prevState.reduce((maxElement, currentElement) => {
            return currentElement.displayOrder > maxElement.displayOrder ? currentElement : maxElement;
          }, prevState[0]);
          reqBody.displayOrder = maxDisplayOrderElement.displayOrder + 1;
        }
        return [...prevState, reqBody]
      });

      setShowAddTreatmentPop(false)
      resetForm();
    }
  });
  return (
    <div
      class={`modal fade  ${showAddTreatmentPop ? "show d-block" : ""} `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Add Treatment
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowAddTreatmentPop(false);
                formik.resetForm();
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formik.touched.shortName && formik.errors.shortName
                        ? "is-invalid"
                        : ""
                        }`}
                      id="shortName"
                      name="shortName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shortName}
                    />
                    {formik.touched.shortName && formik.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formik.errors.shortName}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.longName}
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Label
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="label"
                    name="label"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.label}
                  />
                </div>
                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      (formik.values.shortName == "" &&
                        formik.values.longName == "" &&
                        formik.values.label == "") ||
                      (formik.touched.shortName && formik.errors.shortName)
                    }
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={formik.resetForm}
                    disabled={
                      formik.values.shortName == "" &&
                      formik.values.longName == "" &&
                      formik.values.label == ""
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
  );
};

export const AddPooledTreatmentGroup = (props) => {
  const {
    showAddPooledTreatmentGroupPop,
    setShowAddPooledTreatmentGroupPop,
    setSapTreatmentPoolingInputDTO,
    setPoolingTableData,
    getAnalysisInput,
    setMessage,
    setShowAlert,
    isFolder,
    analysisSetVariableData,
    sapId,
    sapVersionId,
  } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selectedOptions) => {
    console.log(selectedOptions);
    setSelectedOptions(selectedOptions);
  };
  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      desc: "",
      label: "",
      treatmentsToPool: "",
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "sapTreatmentPoolingId": 0,
        "sapTreatmentPoolingGuid": "",
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 24,
        "sapTreatmentTypeId": 0,
        "parentId": 0,
        "parentGuid": "",
        "isFolder": false,
        "treatmentPoolingNameShort": values.shortName,
        "treatmentPoolingNameLong": values.longName,
        "treatmentPoolingDescription": values.desc,
        "isDisplay": true,
        "isReference": false,
        "displayOrder": 1,
        "treatmentId": selectedOptions.map((x) => x.value),
        "createdDate": "2024-02-20T04:20:58.111Z",
        "updatedDate": "2024-02-20T04:20:58.111Z",
        "updatedBy": "string",
        "createdBy": "string",
        "deleted": false

      }
      const data = {
        "displayOrder": 1,
        "treatmentPoolingId": 0,
        "treatmentPoolingGuid": "",
        "treatmentPoolingGroup": values.shortName,
        "treatmentsPool": selectedOptions.map(treatment => treatment.value).join(','),
        "treatmentsLevel": values.label
      }
      console.log('reqBody', reqBody);
      setPoolingTableData((prevState) => {
        let maxDisplayOrderElement = 0
        if (prevState.length > 0) {
          maxDisplayOrderElement = prevState.reduce((maxElement, currentElement) => {
            return currentElement.displayOrder > maxElement.displayOrder ? currentElement : maxElement;
          }, prevState[0]);
          data.displayOrder = maxDisplayOrderElement.displayOrder + 1;
        }
        return [...prevState, data]
      });
      setSapTreatmentPoolingInputDTO((prevState) => {
        let maxDisplayOrderElement = 0
        if (prevState.length > 0) {
          maxDisplayOrderElement = prevState.reduce((maxElement, currentElement) => {
            return currentElement.displayOrder > maxElement.displayOrder ? currentElement : maxElement;
          }, prevState[0]);
          reqBody.displayOrder = maxDisplayOrderElement.displayOrder + 1;
        }
        return [...prevState, reqBody]
      });
      resetForm();
      setShowAddPooledTreatmentGroupPop(false);
    },
  });
  const [treatments, setTreatments] = useState([])
  const getTreatmentIds = async () => {
    const response = await getSapTreatmentInput();
    console.log('treatIds', response.data.data)
    if (response.status == 200) {
      let data = [];
      response.data.data.forEach((treatment) => {
        data.push({ value: treatment.sapTreatmentId, label: treatment.treatmentNameShort })
      });
      setTreatments(data);
    }
  }
  useEffect(() => {
    getTreatmentIds();
  }, []);
  return (
    <div
      class={`modal fade  ${showAddPooledTreatmentGroupPop ? "show d-block" : ""
        } `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Add Pooled Treatment Group
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowAddPooledTreatmentGroupPop(false);
                setSelectedOptions([])
                formik.resetForm();
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div class="col">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Short Name <sup className="text-danger">*</sup>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formik.touched.shortName && formik.errors.shortName
                        ? "is-invalid"
                        : ""
                        }`}
                      id="shortName"
                      name="shortName"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shortName}
                    />
                    {formik.touched.shortName && formik.errors.shortName ? (
                      <div className="invalid-feedback">
                        {formik.errors.shortName}
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
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                    name="desc"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.desc}
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Label
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="label"
                    name="label"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.label}
                  />
                </div>
                <div class="mb-3">
                  <label>Treatments to Pool</label>
                  <Select
                    isMulti
                    options={treatments}
                    // options={[
                    //   { value: "Treatment1", label: "Treatment1" },
                    //   { value: "Treatment2", label: "Treatment2" },
                    //   { value: "Treatment3", label: "Treatment3" },
                    // ]}
                    value={selectedOptions}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      (formik.values.shortName == "" &&
                        formik.values.longName == "" &&
                        formik.values.desc == "" &&
                        formik.values.label == "") ||
                      (formik.touched.shortName && formik.errors.shortName)
                    }
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={() => {
                      formik.resetForm()
                      setSelectedOptions([])
                    }}
                    disabled={
                      formik.values.shortName == "" &&
                      formik.values.longName == "" &&
                      formik.values.desc == "" &&
                      formik.values.label == "" &&
                      selectedOptions.length == 0
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
  );
};
