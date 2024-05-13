import { useFormik } from "formik";
import { addSubGroup } from "../../../../../services/statistical-analysis-plan-service";
import { useState } from "react";

export const AddSubGroup = (props) => {
  const {
    showAddSubGroup,
    setShowSubGroup,
    isFolder,
    setShowAlert,
    setMessage,
    subGroups,
    parentId,
    parentGuid,
    varView
  } = props;
  const [btnLoading, setBtnLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      subgroupVariable: '',
      refrencevalue: '',
      subgrouplabel: '',
      covariance: ''
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "sapSubgroupId": 0,
        "sapSubgroupGuid": "",
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 25,
        "parentId": parentId,
        "parentGuid": parentGuid,
        "isFolder": false,
        "sapSubgroupFolderName": null,
        "sapDataVariableId": values.subgroupVariable,
        "sapSubgroupLabel": values.subgrouplabel,
        "sapSubgroupReferenceValue": values.refrencevalue,
        "sapCovariateVariableId": values.covariance,
        "displayOrder": 0,
        "createdDate": "2024-03-30T08:16:01.267Z",
        "updatedDate": "2024-03-30T08:16:01.267Z",
        "updatedBy": "string",
        "createdBy": "string"
      }
      // const reqBody = {
      //   "sapSubgroupId": 0,
      //   "sapSubgroupGuid": "",
      //   "companyId": 1,
      //   "sapId": 43,
      //   "sapVersionId": 25,
      //   "parentId": 0,
      //   "parentGuid": "",
      //   "isFolder": false,
      //   "sapSubgroupFolderName": null,
      //   "sapDataVariableId": 2516,
      //   "sapSubgroupLabel": values.subgrouplabel,
      //   "sapSubgroupReferenceValue": values.refrencevalue,
      //   "sapCovariateVariableId": 2521,
      //   "displayOrder": 0,
      //   "createdDate": "2024-03-30T08:16:01.267Z",
      //   "updatedDate": "2024-03-30T08:16:01.267Z",
      //   "updatedBy": "string",
      //   "createdBy": "string"
      // }
      setBtnLoading(true);
      setMessage('Subgroup file has been added successfully.')
      const response = await addSubGroup(reqBody);
      if (response.status === 200) {
        subGroups();
        setShowSubGroup(false);
        setBtnLoading(false);
        resetForm();
        setShowAlert(true)
      }
    },
  });
  return (
    <div
      class={`modal fade  ${showAddSubGroup ? "show d-block" : ""} `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {`Add Subgroup ${isFolder ? "Folder" : "File"}`}
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShowSubGroup(false);
                formik.resetForm();
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div
                    className='mb-3'
                  >
                    <label
                      htmlFor="exampleInputEmail1"
                      class="form-label"
                    >
                      Subgroup variable
                    </label>
                    <select
                      class="form-select form-control"
                      aria-label="Default select example"
                      placeholder="select dataset type"
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue('subgroupVariable', e.target.value);
                      }}
                      value={formik.values.subgroupVariable}
                    >
                    <option defaultValue=''>Select Subgroup Variable</option>
                    {varView?.length > 0 && varView?.map((x, index)=>{
                      return(
                        <option value={x.sapDataVariableId} key={index}>
                          {x.sapDataDatasetVariableName}
                      </option>
                      )
                    })}
                    </select>
                  </div>
                  <div class="mb-3">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Refrence value
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="refrencevalue"
                      name="refrencevalue"
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      value={formik.values.refrencevalue}
                    />
                  </div>
                  <div class="mb-3">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Subgroup label
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="subgrouplabel"
                      name="subgrouplabel"
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      value={formik.values.subgrouplabel}
                    />
                  </div>
                  <div class="mb-3">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Covariance to exclude from analysis model
                    </label>
                    <select
                      class="form-select form-control"
                      aria-label="Default select example"
                      placeholder="select dataset type"
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue('covariance', e.target.value);
                      }}
                      value={formik.values.covariance}
                    >
                    <option defaultValue=''>Select Covariance to exclude from analysis model</option>
                    {varView?.length > 0 && varView?.map((x, index)=>{
                      return(
                        <option value={x.sapDataVariableId} key={index}>
                          {x.sapDataDatasetVariableName}
                      </option>
                      )
                    })}
                    </select>
                  </div>
                </div>

                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      formik.values.subgroupVariable == '' &&
                      formik.values.refrencevalue == '' &&
                      formik.values.subgrouplabel == '' &&
                      formik.values.covariance == ''
                    }
                  >
                  {btnLoading && (
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
                      formik.values.subgroupVariable == '' &&
                      formik.values.refrencevalue == '' &&
                      formik.values.subgrouplabel == '' &&
                      formik.values.covariance == ''
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
export const AddSubGroupFolder = (props) => {
  const {
    subGroups,
    showAddSubGroup,
    setShowSubGroup,
    isFolder,
    setIsFolder,
    setShowAlert,
    setMessage,
    parentId,
    parentGuid
  } = props;
  
  const [btnLoading, setBtnLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      folder: '',
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const reqBody = {
        "sapSubgroupId": 0,
        "sapSubgroupGuid": "",
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 25,
        "parentId": parentId,
        "parentGuid": parentGuid,
        "isFolder": true,
        "sapSubgroupFolderName": values.folder,
        "sapDataVariableId": 0,
        "sapSubgroupLabel": null,
        "sapSubgroupReferenceValue": "",
        "sapCovariateVariableId": 0,
        "displayOrder": 0,
        "createdDate": "2024-03-30T08:16:01.267Z",
        "updatedDate": "2024-03-30T08:16:01.267Z",
        "updatedBy": "string",
        "createdBy": "string"
      }
      setBtnLoading(true);
      setMessage('Subgroup folder has been added successfully.')
      const response = await addSubGroup(reqBody);
      if (response.status === 200) {
        subGroups();
        setIsFolder(false);
        setBtnLoading(false);
        resetForm();
        setShowAlert(true)
      }
    },
  });
  return (
    <div
      class={`modal fade  ${isFolder ? "show d-block" : ""} `}
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {`Add Folder`}
            </h5>
            <button
              type="button"
              class="btn-close"
              id="close_add_parent"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setIsFolder(false);
                formik.resetForm();
              }}
            ></button>
          </div>
          <div class="modal-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mt-3">
                <div class="row mb-3">
                  <div class="mb-3">
                    <label htmlFor="exampleInputEmail1" class="form-label">
                      Folder Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="folder"
                      name="folder"
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                      value={formik.values.folder}
                    />
                  </div>
                </div>

                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      formik.values.folder == '' || btnLoading
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
                      formik.values.folder == '' || btnLoading
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