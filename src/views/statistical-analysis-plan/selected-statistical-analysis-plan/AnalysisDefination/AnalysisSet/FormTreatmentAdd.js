import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { AddSapTreatmentPooling, addAnalysisSet, addTreatmentInput, getSapTreatmentInput } from "../../../../../services/statistical-analysis-plan-service";
import Select from "react-select";
import commonSchema from "../../../../../utils/validationSchema/common-schema";

export const FormTreatmentAdd = ({
  showGridHeaderAddFile,
  setShowGridHeaderAddFile,
  selectedTreatment,
  setMessage,
  setShowAlert,
  setShowAlertError,
  getPoolingData
}) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState([]);
  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      desc: "",
      label: "",
      treatmentsToPool: ""
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "sapTreatmentPoolingId": 0,
        "sapTreatmentPoolingGuid": "",
        "companyId": 1,
        "sapId": selectedTreatment?.sapId,
        "sapVersionId": selectedTreatment?.sapVersionId,
        "sapTreatmentTypeId": selectedTreatment?.sapTreatmentTypeId,
        "parentId": 0,
        "parentGuid": "",
        "isFolder": false,
        "treatmentPoolingNameShort": values.shortName,
        "treatmentPoolingNameLong": values.longName,
        "treatmentPoolingDescription": values.desc,
        "isDisplay": true,
        "isReference": false,
        "displayOrder": 1,
        "treatmentId": selectedOptions.map((x)=>x.value)
      }
      setBtnLoading(true)
      const response = await AddSapTreatmentPooling(reqBody);
      if (response.status == 200) {
        setMessage('Pool has been added successfully.')
        setShowGridHeaderAddFile(false)
        resetForm();
        setBtnLoading(false)
        setTimeout(() => {
          setShowAlert(true)
          getPoolingData(selectedTreatment?.sapTreatmentTypeId)
        }, 3000)
      } else {
        setMessage('Something went wrong');
        setShowAlertError(true);
        setBtnLoading(false)
      }
    },
  });


  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const [treatments, setTreatments] = useState([])
  const getTreatmentIds = async () => {
    const response = await getSapTreatmentInput();
    if (response.status == 200) {
      let data = [];
      const uniqueArray = response.data.data.filter((obj, index, self) =>
        index === self.findIndex((o) => o.sapTreatmentTypeId === obj.sapTreatmentTypeId)
      );

      uniqueArray.forEach((treatment) => {
        data.push({value: treatment.sapTreatmentId, label: treatment.treatmentNameShort});
      });

      setTreatments(data);
    }
  }

  useEffect(() => {
    getTreatmentIds();
  }, []);
  return (
    <>
      <div
        class={`modal fade  ${showGridHeaderAddFile ? "show d-block" : ""} `}
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
                  setShowGridHeaderAddFile(false);
                  formik.resetForm()
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
                      onClick={formik.resetForm}
                      disabled={
                        formik.values.shortName == "" &&
                        formik.values.longName == "" &&
                        formik.values.desc == "" &&
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
    </>
  );
};

export const TreatmentInput = ({
  showAddPooledTreatment,
  setShowAddPooledTreatment,
  selectedTreatment,
  setMessage,
  setShowAlert,
  setShowAlertError,
  getTreatmentTableData,
  displayOrder
}) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      shortName: "",
      longName: "",
      // desc: "",
      label: "",
    },
    enableReinitialize: true,
    validationSchema: commonSchema,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "sapTreatmentId": 0,
        "sapTreatmentGuid": "",
        "companyId": 1,
        "sapId": selectedTreatment?.sapId,
        "sapVersionId": selectedTreatment?.sapVersionId,
        "sapTreatmentTypeId": selectedTreatment?.sapTreatmentTypeId,
        "parentId": 0,
        "parentGuid": "",
        "isFolder": true,
        "treatmentNameShort": values.shortName,
        "treatmentNameLong": values.longName,
        "treatmentLabel": values.label,
        "isDisplay": true,
        "isReference": false,
        "displayOrder": displayOrder
      }
      setBtnLoading(true)
      const response = await addTreatmentInput(reqBody);
      if (response.status == 200) {
        setMessage('Treatment has been added successfully.')
        setShowAddPooledTreatment(false)
        resetForm();
        setTimeout(() => {
          getTreatmentTableData(selectedTreatment?.sapTreatmentTypeId);
          setShowAlert(true);
          setBtnLoading(false);
        }, 3000)
      } else {
        setMessage('Something went wrong');
        setShowAlertError(true);
      }
    },
  });
  return (
    <div
      class={`modal fade  ${showAddPooledTreatment ? "show d-block" : ""} `}
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
                setShowAddPooledTreatment(false);
                formik.resetForm()
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
  )
}