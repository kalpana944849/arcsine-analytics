import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getVisitUnits, addVisit, getVisitByGUID, updateVisit } from '../../../../../../services/visit-service';

const AddUpdateVisitModal = (props) => {
    const { 
        setShowSuccessAlert, 
        setSuccessMessage, 
        showAddVisitModal, 
        setShowAddVisitModal,
        visitModalState,
        setVisitModalState,
        selectedRow
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm();
    const { dirtyFields, errors } = formState;
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editableOrViewable, setEditableOrViewable] = useState(false);
    const [visit, setVisit] = useState(null);
    const [sapVisitPeriodId, setSapVisitPeriodId] = useState(null);
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));
    
    useEffect(() => {
        fetchUnits();
    }, []);

    useEffect(() => {
        if (visitModalState === "edit" || visitModalState === "view" ? true : false) {
            setEditableOrViewable(true);
            getVisit();
        } else {
            setEditableOrViewable(false);
        }
    }, [visitModalState]);

    useEffect(() => {
        if (selectedRow && selectedRow.sapVisitId && selectedRow.parentId === null) {
            const parts = (selectedRow.sapVisitId).split('_');
            setSapVisitPeriodId(parts[1]);
        } else {
            if (selectedRow && selectedRow.parentId) {
                const parts = (selectedRow.parentId).split('_');
                setSapVisitPeriodId(parts[1]);
            }
        }
    }, [selectedRow]);

    const fetchUnits = async () => {
        try {
            const response = await getVisitUnits();
            if (response && response.data.status === "OK") {
                setUnits(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getVisit = async () => {
        try {
            if (visit === null) {
                const response = await getVisitByGUID(selectedRow.sapVisitGuid);
                if (response && response.data.status === "OK") {
                    const data = response.data.data;
                    setValue('number', data.sapVisitNumber);
                    setValue('targetNumeric', data.sapVisitTargetNumeric);
                    setValue('unit', data.sapVisitTargetUnitId);
                    setValue('shortName', data.sapVisitNameShort);
                    setValue('longName', data.sapVisitNameLong);
                    setVisit(data);
                }
            } else {
                if (selectedRow && visitModalState !== "add") {
                    setValue('number', visit.sapVisitNumber);
                    setValue('targetNumeric', visit.sapVisitTargetNumeric);
                    setValue('unit', visit.sapVisitTargetUnitId);
                    setValue('shortName', visit.sapVisitNameShort);
                    setValue('longName', visit.sapVisitNameLong);
                }
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
                "sapVisitId": editableOrViewable ? visit.sapVisitId : 0,
                "sapVisitGuid": editableOrViewable ? visit.sapVisitGuid : "",
                "companyId": editableOrViewable ? visit.companyId : sapData.companyId,
                "sapId": editableOrViewable ? visit.sapId : sapData.sapId,
                "sapVersionId": editableOrViewable ? visit.sapVersionId : sapVersionId,
                "sapVisitPeriodId": editableOrViewable ? visit.sapVisitPeriodId : parseInt(sapVisitPeriodId),
                "sapVisitNumber": data.number,
                "sapVisitNameShort": data.shortName,
                "sapVisitNameLong": data.longName,
                "sapVisitTargetNumeric": data.targetNumeric,
                "sapVisitTargetUnitId": data.unit,
                "sapVisitTypeId": editableOrViewable ? visit.sapVisitTypeId : 0,
                "createdDate": null,
                "updatedDate": null,
                "updatedBy": "test",
                "createdBy": "test"
            };

            if (editableOrViewable) {
                response = await updateVisit(reqBody);
            } else {
                response = await addVisit(reqBody);
            }
            
            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setSuccessMessage(`Visit has been ${editableOrViewable ? "updated" : "added"} successfully.`);
                setShowSuccessAlert(true);
                reset();
                setShowAddVisitModal(false);
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
                className={`visit-structure-modal modal fade  ${showAddVisitModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{visitModalState === 'add' ? 'Add' : visitModalState === 'edit' ? 'Update' : 'View'} Visit</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddVisitModal(false);
                                    setVisitModalState("add");
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
                                            disabled={visitModalState === 'view'}
                                            {...register('number', { required: 'This field is required.' })}
                                        />
                                        {errors.number && <div className="invalid-feedback">{errors.number.message}</div>}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="targetNumeric" className="form-label">Target (Numeric) <sup className="text-danger">*</sup></label>
                                        <input
                                            type="number"
                                            id="targetNumeric"
                                            name="targetNumeric"
                                            className={`form-control ${errors.targetNumeric ? 'is-invalid' : ''}`}
                                            disabled={visitModalState === 'view'}
                                            {...register('targetNumeric', { required: 'This field is required.' })}
                                        />
                                        {errors.targetNumeric && <div className="invalid-feedback">{errors.targetNumeric.message}</div>}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="unit" className="form-label">Unit <sup className="text-danger">*</sup></label>
                                        <select 
                                            id="unit"
                                            name="unit"
                                            className={`form-select form-control ${errors.unit ? 'is-invalid' : ''}`}
                                            disabled={visitModalState === 'view'}
                                            {...register('unit', { required: 'This field is required.' })}
                                        >
                                            <option value="">Select unit</option>
                                            {units.length && units.map((unit, index) => (
                                                <option key={unit.libraryControlledTerminologyId} value={unit.libraryControlledTerminologyId}>{unit.libraryControlledTerminologyNameShort}</option>
                                            ))}
                                        </select>
                                        {errors.unit && <div className="invalid-feedback">{errors.unit.message}</div>}
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
                                            disabled={visitModalState === 'view'}
                                            {...register('shortName', { required: 'This field is required.' })}
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
                                            disabled={visitModalState === 'view'}
                                            {...register('longName', { required: 'This field is required.' })}
                                        />
                                        {errors.longName && <div className="invalid-feedback">{errors.longName.message}</div>}
                                    </div>
                                </div>
                                <div className={`d-flex ${visitModalState === 'view' && 'd-none'}`}>
                                    <button type="submit" className="btn btn-primary w-100 mt-2 me-2" disabled={loading || Object.keys(dirtyFields).length === 0}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-primary w-100 mt-2" 
                                        onClick={() => {
                                            reset();
                                            getVisit();
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
            <div class={`modal-backdrop fade ${showAddVisitModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateVisitModal;
