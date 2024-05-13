import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addVisitPeriod, getVisitPeriodByGUID, updateVisitPeriod } from '../../../../../../services/visit-service';

const AddUpdateVisitPeriodModal = (props) => {
    const { 
        setShowSuccessAlert, 
        setSuccessMessage, 
        showAddPeriodModal, 
        setShowAddPeriodModal, 
        periodModalState,
        setPeriodModalState,
        selectedRow
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm({
        shouldUnregister: true
    });
    const [loading, setLoading] = useState(false);
    const [visitPeriod, setVisitPeriod] = useState(null);
    const { dirtyFields, errors } = formState;
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));
    const [editableOrViewable, setEditableOrViewable] = useState(false);

    useEffect(() => {
        if (periodModalState === "edit" || periodModalState === "view" ? true : false) {
            setEditableOrViewable(true);
            getVisitPeriod();
        } else {
            setEditableOrViewable(false);
        }
    }, [periodModalState]);

    const getVisitPeriod = async () => {
        try {
            if (visitPeriod === null) {
                const response = await getVisitPeriodByGUID(selectedRow.sapVisitGuid);
                if (response && response.data.status === "OK") {
                    setValue('number', response.data.data.sapVisitPeriodNumber);
                    setValue('shortName', response.data.data.sapVisitPeriodNameShort);
                    setValue('longName', response.data.data.sapVisitPeriodNameLong);
                    setVisitPeriod(response.data.data);
                }
            } else {
                setValue('number', visitPeriod.sapVisitPeriodNumber);
                setValue('shortName', visitPeriod.sapVisitPeriodNameShort);
                setValue('longName', visitPeriod.sapVisitPeriodNameLong);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            let response;
            const reqBody = {
                "sapVisitPeriodId": editableOrViewable ? visitPeriod.sapVisitPeriodId : 0,
                "sapVisitPeriodGuid": editableOrViewable ? visitPeriod.sapVisitPeriodGuid : "",
                "companyId": editableOrViewable ? visitPeriod.companyId : sapData.companyId,
                "sapId": editableOrViewable ? visitPeriod.sapId : sapData.sapId,
                "sapVersionId": editableOrViewable ? visitPeriod.sapVersionId : sapVersionId,
                "sapVisitPeriodNumber": data.number,
                "sapVisitPeriodNameShort": data.shortName,
                "sapVisitPeriodNameLong": data.longName,
                "createdBy": editableOrViewable ? visitPeriod.createdBy : "",
                "updatedBy": editableOrViewable ? visitPeriod.updatedBy : "",
                "createdDate": null,
                "updatedDate": null
            };
            
            if (editableOrViewable) {
                response = await updateVisitPeriod(reqBody);
            } else {
                response = await addVisitPeriod(reqBody);
            }
            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                reset();
                setShowAddPeriodModal(false);
                setSuccessMessage(`Visit period has been ${editableOrViewable ? "updated" : "added"} successfully.`);
                setShowSuccessAlert(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className={`visit-structure-modal modal fade  ${showAddPeriodModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{periodModalState === 'add' ? 'Add' : periodModalState === 'edit' ? 'Update' : 'View'} Period</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddPeriodModal(false);
                                    setPeriodModalState("add");
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="number" className="form-label">Number <sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            id="number"
                                            name="number"
                                            className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                                            disabled={periodModalState === 'view'}
                                            {...register('number', { required: 'This field is required.'})}
                                        />
                                        {errors.number && <div className="invalid-feedback">{errors.number.message}</div>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="shortName" className="form-label">Short Name <sup className="text-danger">*</sup></label>
                                        <input
                                            type="text"
                                            id="shortName"
                                            name="shortName"
                                            className={`form-control ${errors.shortName ? 'is-invalid' : ''}`}
                                            disabled={periodModalState === 'view'}
                                            {...register('shortName', { required: 'This field is required.'})}
                                        />
                                        {errors.shortName && <div className="invalid-feedback">{errors.shortName.message}</div>}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="longName" className="form-label">Long Name <sup className="text-danger">*</sup></label>
                                        <input
                                            type="text"
                                            id="longName"
                                            name="longName"
                                            className={`form-control ${errors.longName ? 'is-invalid' : ''}`}
                                            disabled={periodModalState === 'view'}
                                            {...register('longName', { required: 'This field is required.' })}
                                        />
                                        {errors.longName && <div className="invalid-feedback">{errors.longName.message}</div>}
                                    </div>
                                </div>
                                <div className={`d-flex ${periodModalState === 'view' && 'd-none'}`}>
                                    <button type="submit" className="btn btn-primary w-100 mt-2 me-2" disabled={loading || Object.keys(dirtyFields).length === 0}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-primary w-100 mt-2" 
                                        onClick={() => {
                                            reset();
                                            getVisitPeriod();
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
            <div class={`modal-backdrop fade ${showAddPeriodModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateVisitPeriodModal;
