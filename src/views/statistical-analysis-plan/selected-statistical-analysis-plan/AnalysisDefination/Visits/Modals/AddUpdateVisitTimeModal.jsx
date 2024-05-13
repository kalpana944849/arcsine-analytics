import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getVisitUnits, addVisitTime, updateVisitTime, getVisitTimeByGUID } from '../../../../../../services/visit-service';

const AddUpdateVisitTimeModal = (props) => {
    const { 
        setShowSuccessAlert, 
        setSuccessMessage, 
        showAddVisitTimeModal, 
        setShowAddVisitTimeModal,
        visitTimeModalState,
        setVisitTimeModalState,
        selectedRow,
        dataLevelID,
        data
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm();
    const { dirtyFields, errors } = formState;
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editableOrViewable, setEditableOrViewable] = useState(false);
    const [visitTime, setVisitTime] = useState(null);
    const [sapVisitId, setSapVisitId] = useState(null);
    const [sapVisitPeriodId, setSapVisitPeriodId] = useState(null);
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));

    useEffect(() => {
        fetchUnits();
    }, []);

    useEffect(() => {
        if (visitTimeModalState === "edit" || visitTimeModalState === "view" ? true : false) {
            setEditableOrViewable(true);
            getVisitTime();
        } else {
            setEditableOrViewable(false);
        }
    }, [visitTimeModalState]);

    useEffect(() => {
        if (selectedRow && selectedRow.sapVisitId && selectedRow.parentId === null) {
            const parts = (selectedRow.sapVisitId).split('_');
            setSapVisitId(parts[1]);
        } else {
            if (selectedRow && selectedRow.parentId) {
                // const parts = (selectedRow.parentId).split('_');
                const parts = (selectedRow.sapVisitId).split('_');
                setSapVisitId(parts[1]);
                // const parts2 = (selectedRow.parentId).split('_');
                // setSapVisitPeriodId(parts2[1]);
            }
        }

        // if (dataLevelID === 3 && selectedRow) {
        //     const visit = data.find((item) => item.sapVisitId == selectedRow.parentId);
        //     const parts = (visit.parentId).split('_');
        //     setSapVisitPeriodId(parts[1]);
        //     console.log(visit.parentId)
        // }
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

    const getVisitTime = async () => {
        try {
            if (visitTime === null) {
                // const parts = (selectedRow.sapVisitId).split('_');
                const response = await getVisitTimeByGUID(selectedRow.sapVisitGuid);
                if (response && response.data.status === "OK") {
                    const data = response.data.data;
                    setValue('number', data.sapVisitTimeNumber);
                    setValue('targetNumeric', data.sapVisitTimeTargetNumeric);
                    setValue('unit', data.sapVisitTimeTargetUnitId);
                    setValue('shortName', data.sapVisitTimeNameShort);
                    setValue('longName', data.sapVisitTimeNameLong);
                    setVisitTime(data);
                }
            } else {
                setValue('number', visitTime.sapVisitTimeNumber);
                setValue('targetNumeric', visitTime.sapVisitTimeTargetNumeric);
                setValue('unit', visitTime.sapVisitTimeTargetUnitId);
                setValue('shortName', visitTime.sapVisitTimeNameShort);
                setValue('longName', visitTime.sapVisitTimeNameLong);
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
                "sapVisitTimeId": editableOrViewable ? visitTime.sapVisitTimeId : 0,
                "sapVisitTimeGuid": editableOrViewable ? visitTime.sapVisitTimeGuid : "31456009-a89d-4d8f-9bfb-861393120075",
                "companyId": editableOrViewable ? visitTime.companyId : sapData.companyId,
                "sapId": editableOrViewable ? visitTime.sapId : sapData.sapId,
                "sapVersionId": editableOrViewable ? visitTime.sapVersionId : sapVersionId,
                "sapVisitPeriodId": editableOrViewable ? visitTime.sapVisitPeriodId : 1,
                // "sapVisitId": editableOrViewable ? visitTime.sapVisitId : 740,
                "sapVisitId": editableOrViewable ? visitTime.sapVisitId : parseInt(sapVisitId),
                "sapVisitTimeNumber": parseInt(data.number),
                "sapVisitTimeNameShort": data.shortName,
                "sapVisitTimeNameLong": data.longName,
                "sapVisitTimeTargetNumeric": parseInt(data.targetNumeric),
                "sapVisitTimeTargetUnitId": parseInt(data.unit),
                "createdDate": "2024-03-02T14:23:12.707Z",
                "updatedDate": "2024-03-02T14:23:12.707Z",
                "updatedBy": "test",
                "createdBy": "test"
            };

            if (editableOrViewable) {
                response = await updateVisitTime(reqBody);
            } else {
                response = await addVisitTime(reqBody);
            }

            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setSuccessMessage(`Visit time has been ${editableOrViewable ? "updated" : "added"} successfully.`);
                setShowSuccessAlert(true);
                reset();
                setShowAddVisitTimeModal(false);
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
                className={`visit-structure-modal modal fade  ${showAddVisitTimeModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{visitTimeModalState === 'add' ? 'Add' : visitTimeModalState === 'edit' ? 'Update' : 'View'} Time</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddVisitTimeModal(false);
                                    setVisitTimeModalState("add");
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
                                            disabled={visitTimeModalState === 'view'}
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
                                            disabled={visitTimeModalState === 'view'}
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
                                            disabled={visitTimeModalState === 'view'}
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
                                            disabled={visitTimeModalState === 'view'}
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
                                            disabled={visitTimeModalState === 'view'}
                                            {...register('longName', { required: 'This field is required.' })}
                                        />
                                        {errors.longName && <div className="invalid-feedback">{errors.longName.message}</div>}
                                    </div>
                                </div>
                                <div className={`d-flex ${visitTimeModalState === 'view' && 'd-none'}`}>
                                    <button type="submit" className="btn btn-primary w-100 mt-2 me-2" disabled={loading || Object.keys(dirtyFields).length === 0}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-primary w-100 mt-2" 
                                        onClick={() => { 
                                            reset();
                                            getVisitTime();
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
            <div class={`modal-backdrop fade ${showAddVisitTimeModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateVisitTimeModal;
