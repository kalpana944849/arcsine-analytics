import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { addVisitFlagFolder, updateVisitFlagFolder } from '../../../../../../services/visit-service';
import VisitStructureTreeList from '../VisitStructureTreeList';

const AddUpdateVisitFlagModal = (props) => {
    const {
        setShowSuccessAlert,
        setSuccessMessage,
        showAddFlagModal,
        setShowAddFlagModal,
        flagModalState,
        setFlagModalState,
        selectedRow,
        visitStructureTreeData
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm({
        shouldUnregister: true
    });
    const [loading, setLoading] = useState(false);
    const { dirtyFields, errors } = formState;
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));
    const [editableOrViewable, setEditableOrViewable] = useState(false);
    const [flagParentInfo, setFlagParentInfo] = useState({});
    const [sapVisitSelectionInputs, setSapVisitSelectionInputs] = useState([]);

    useEffect(() => {
        if (flagModalState === "edit" || flagModalState === "view" ? true : false) {
            setEditableOrViewable(true);
            setValue('shortName', selectedRow.visitFlagNameShort);
            setValue('longName', selectedRow.visitFlagNameLong);
            setValue('description', selectedRow.visitFlagDescription);
        } else {
            let info;
            if (selectedRow && selectedRow.isFolder) {
                info = {
                    parentId: selectedRow.sapVisitFlagId,
                    parentGuid: selectedRow.sapVisitFlagGuid
                };
            } else {
                info = {
                    parentId: selectedRow.parentId,
                    parentGuid: selectedRow.parentGuid
                };
            }
            setFlagParentInfo(info);
            setEditableOrViewable(false);
        }
    }, [flagModalState]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            const reqBody = {
                "sapVisitFlagId": editableOrViewable ? selectedRow.sapVisitFlagId : 0,
                "sapVisitFlagGuid": editableOrViewable ? selectedRow.sapVisitFlagGuid : "",
                "companyId": editableOrViewable ? selectedRow.companyId : sapData.companyId,
                "sapId": editableOrViewable ? selectedRow.sapId : sapData.sapId,
                "sapVersionId": editableOrViewable ? selectedRow.sapVersionId : sapVersionId,
                "parentId": editableOrViewable ? selectedRow.parentId : flagParentInfo.parentId,
                "parentGuid": editableOrViewable ? selectedRow.parentGuid : flagParentInfo.parentGuid,
                "isFolder": editableOrViewable ? selectedRow.isFolder : false,
                "visitFlagNameShort": data.shortName,
                "visitFlagNameLong": data.longName,
                "visitFlagDescription": data.description,
                "displayOrder": editableOrViewable ? selectedRow.displayOrder : 0,
                "createdBy": editableOrViewable ? selectedRow.createdBy : "",
                "updatedBy": editableOrViewable ? selectedRow.updatedBy : "",
                "createdDate": editableOrViewable ? selectedRow.createdDate : "2024-03-03T05:01:38.926Z",
                "updatedDate": editableOrViewable ? selectedRow.updatedDate : "2024-03-03T05:01:38.926Z",
                "sapVisitSelectionInputs": sapVisitSelectionInputs
            };

            if (editableOrViewable) {
                response = await updateVisitFlagFolder(reqBody);
            } else {
                response = await addVisitFlagFolder(reqBody);
            }
            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                reset();
                setShowAddFlagModal(false);
                setSuccessMessage(`Visit flag has been ${editableOrViewable ? "updated" : "added"} successfully.`);
                setShowSuccessAlert(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className={`visit-structure-modal modal fade  ${showAddFlagModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{flagModalState === 'add' ? 'Add' : flagModalState === 'edit' ? 'Update' : 'View'} Visit Flag</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddFlagModal(false);
                                    setFlagModalState("add");
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="shortName" className="form-label">Short Name <sup className="text-danger">*</sup></label>
                                        <input
                                            type="text"
                                            id="shortName"
                                            name="shortName"
                                            className={`form-control ${errors.shortName ? 'is-invalid' : ''}`}
                                            disabled={flagModalState === 'view'}
                                            {...register('shortName', { required: 'This field is required.' })}
                                        />
                                        {errors.shortName && <div className="invalid-feedback">{errors.shortName.message}</div>}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="longName" className="form-label">Long Name</label>
                                        <input
                                            type="text"
                                            id="longName"
                                            name="longName"
                                            className={`form-control ${errors.longName ? 'is-invalid' : ''}`}
                                            disabled={flagModalState === 'view'}
                                            {...register('longName')}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <input
                                            type="description"
                                            id="description"
                                            name="description"
                                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                            disabled={flagModalState === 'view'}
                                            {...register('description')}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-5">
                                    <div className="col">
                                        <label htmlFor="label" className="form-label">Label</label>
                                        <input
                                            type="text"
                                            id="label"
                                            name="label"
                                            className={`form-control ${errors.label ? 'is-invalid' : ''}`}
                                            disabled={flagModalState === 'view'}
                                            {...register('label')}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 visit-structure-tree-data-wrapper">
                                    <VisitStructureTreeList 
                                        data={visitStructureTreeData}
                                        sapVisitSelectionInputs={sapVisitSelectionInputs}
                                        setSapVisitSelectionInputs={setSapVisitSelectionInputs}
                                    />
                                </div>
                                <div className="d-flex">
                                    <button type="submit" className="btn btn-primary w-100 mt-2 me-2" disabled={loading || Object.keys(dirtyFields).length === 0}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100 mt-2"
                                        onClick={() => reset()}
                                        disabled={loading || Object.keys(dirtyFields).length === 0}
                                    >
                                        Discard
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class={`modal-backdrop fade ${showAddFlagModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateVisitFlagModal;
