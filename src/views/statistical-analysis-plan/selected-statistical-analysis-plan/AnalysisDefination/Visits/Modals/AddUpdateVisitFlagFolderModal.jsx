import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addVisitFlagFolder, updateVisitFlagFolder } from '../../../../../../services/visit-service';

const AddUpdateVisitFlagFolderModal = (props) => {
    const {
        setShowSuccessAlert,
        setSuccessMessage,
        showAddFlagFolderModal,
        setShowAddFlagFolderModal,
        flagFolderModalState,
        setFlagFolderModalState,
        selectedRow
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm({
        shouldUnregister: true
    });
    const [loading, setLoading] = useState(false);
    const { dirtyFields, errors } = formState;
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));
    const [editableOrViewable, setEditableOrViewable] = useState(false);

    const resetForm = () => {
        setValue('shortName', selectedRow.visitFlagNameShort);
        setValue('longName', selectedRow.visitFlagNameLong);
        setValue('description', selectedRow.visitFlagDescription);
    };

    useEffect(() => {
        if (flagFolderModalState === "edit" || flagFolderModalState === "view" ? true : false) {
            setEditableOrViewable(true);
            resetForm();
        } else {
            setEditableOrViewable(false);
        }
    }, [flagFolderModalState]);

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
                "parentId": editableOrViewable ? selectedRow.parentId : 0,
                "parentGuid": editableOrViewable ? selectedRow.parentGuid : "",
                "isFolder": editableOrViewable ? selectedRow.isFolder : true,
                "visitFlagNameShort": data.shortName,
                "visitFlagNameLong": data.longName,
                "visitFlagDescription": data.description,
                "displayOrder": editableOrViewable ? selectedRow.displayOrder : 0,
                "createdBy": editableOrViewable ? selectedRow.createdBy : "",
                "updatedBy": editableOrViewable ? selectedRow.updatedBy : "",
                "createdDate": editableOrViewable ? selectedRow.createdDate : "2024-03-03T05:01:38.926Z",
                "updatedDate": editableOrViewable ? selectedRow.updatedDate : "2024-03-03T05:01:38.926Z",
                "sapVisitSelectionInputs": []
            };

            if (editableOrViewable) {
                response = await updateVisitFlagFolder(reqBody);
            } else {
                response = await addVisitFlagFolder(reqBody);
            }
            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                reset();
                setShowAddFlagFolderModal(false);
                setSuccessMessage(`Visit flag folder has been ${editableOrViewable ? "updated" : "added"} successfully.`);
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
                className={`visit-structure-modal modal fade  ${showAddFlagFolderModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{flagFolderModalState === 'add' ? 'Add' : flagFolderModalState === 'edit' ? 'Update' : 'View'} Folder</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddFlagFolderModal(false);
                                    setFlagFolderModalState("add");
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
                                            disabled={flagFolderModalState === 'view'}
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
                                            disabled={flagFolderModalState === 'view'}
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
                                            disabled={flagFolderModalState === 'view'}
                                            {...register('description')}
                                        />
                                    </div>
                                </div>
                                <div className={`d-flex ${flagFolderModalState === 'view' && 'd-none'}`}>
                                    <button type="submit" className="btn btn-primary w-100 mt-2 me-2" disabled={loading || Object.keys(dirtyFields).length === 0}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100 mt-2"
                                        onClick={() => {
                                            reset();
                                            resetForm();
                                        }}
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
            <div class={`modal-backdrop fade ${showAddFlagFolderModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateVisitFlagFolderModal;
