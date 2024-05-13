import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import DatasetVariableRelationshipView from '../DatasetVariableRelationshipView';
import { addVariableRelationship, getLibraryControlledTerminologyCategoryByID } from '../../../../../../services/analysis-defination-data';
import commonSchema from '../../../../../../utils/validationSchema/common-schema';

const AddUpdateComponentModal = (props) => {
    const { showModal, setShowModal } = props;
    const [relationshipTypes, setRelationshipTypes] = useState([]);
    const [relationship, setRelationship] = useState([]);
    const sapVersionId = localStorage.getItem('sapVersionId');
    const sapDataItem = JSON.parse(localStorage.getItem('sapDataItem'));

    const formik = useFormik({
        initialValues: {
            shortName: '',
            longName: '',
            desc: '',
            variableRelationshipType: '',
            responseVariable: ''
        },
        enableReinitialize: true,
        validationSchema: commonSchema,
        onSubmit: async (values, { resetForm }) => {
            const reqBody = {
                sapDataRelationshipGuid: "",
                sapDataRelationshipId: 0,
                companyId: sapDataItem.companyId,
                sapId: sapDataItem.sapId,
                sapVersionId: Number(sapVersionId),
                sapDataCollectionId: 0,
                sapDataDatasetId: 0,
                sapDataRelationshipTypeId: 0,
                sapDataRelationshipNameShort: values.shortName,
                sapDataRelationshipNameLong: values.longName,
                sapDataRelationshipDescription: values.desc,
                displayOrder: 0,
                createdDate: "2024-03-30T05:14:10.737Z",
                updatedDate: "2024-03-30T05:14:10.737Z",
                updatedBy: "",
                createdBy: "",
                sapDataRelationshipComponentDTOs: []
            };

            const response = await addVariableRelationship(reqBody);

            if (response.status == 200) {
                console.log(response);
            }
        },
    });

    return (
        <>
            <div class={`modal fade ${showModal ? "show d-block" : ""}`} id="variableRelationshipModal" tabindex="-1" aria-labelledby="variableRelationshipModal" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Component</h5>
                            <button type="button" class="btn-close" id="close_add_parent" data-bs-dismiss="modal" aria-label="Close"
                                onClick={() => {
                                    setShowModal(false);
                                    formik.resetForm();
                                }}
                            ></button>
                        </div>
                        <div class="modal-body">
                            {/* <form onSubmit={formik.handleSubmit}> */}
                            <form>
                                <div className="mt-3">
                                    <div class="row mb-3">
                                        <div className="col">
                                            <label class="form-label">Component Type</label>
                                            <select
                                                class="form-select form-control"
                                                name="variableRelationshipType"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.variableRelationshipType}
                                            >
                                                <option value="">Select component type</option>
                                                {/* {relationshipTypes.length > 0 && relationshipTypes.map((item) => {
                                                    return <option value="1">1</option>;
                                                })} */}
                                            </select>
                                        </div>
                                        <div class="col">
                                            <label class="form-label">Variable</label>
                                            <select
                                                class="form-select form-control"
                                                name="responseVariable"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.responseVariable}
                                            >
                                                <option value="">Select variable</option>
                                                {/* {relationship.length > 0 && relationship.map((item) => {
                                                    return <option key={item.libraryControlledTerminologyCategoryGuid} value={item.libraryControlledTerminologyCategoryNameShort}>{item.libraryControlledTerminologyCategoryNameShort}</option>;
                                                })} */}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary w-100 mt-2 me-2"
                                            disabled={!formik.dirty}
                                        >Save</button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary w-100 mt-2"
                                            disabled={!formik.dirty}
                                            onClick={() => formik.resetForm()}
                                        >Discard</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class={`modal-backdrop fade ${showModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateComponentModal;
