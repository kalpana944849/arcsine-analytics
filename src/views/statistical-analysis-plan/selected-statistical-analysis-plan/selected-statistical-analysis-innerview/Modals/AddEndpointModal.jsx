import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getVisitUnits, addVisit, getVisitByGUID, updateVisit } from '../../../../../services/visit-service';

const AddEndpointModal = (props) => {
    const {
        showAddEndpointModal,
        setShowAddEndpointModal
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm();
    const { dirtyFields, errors } = formState;
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        console.log(data);
        return false;
        try {
            let response = await updateVisit(reqBody);

            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setSuccessMessage(`Endpoint has been added successfully.`);
                // setShowSuccessAlert(true);
                reset();
                setShowAddEndpointModal(false);
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
                className={`visit-structure-modal modal fade  ${showAddEndpointModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Endpoint</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddEndpointModal(false);
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="number" className="form-label">Endpoint</label>
                                        <select className="form-select form-control">
                                            <option value="1">ACR20</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        {/* <input
                                            type="number"
                                            id="number"
                                            name="number"
                                            className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                                            disabled={visitModalState === 'view'}
                                            {...register('number', { required: 'This field is required.' })}
                                        />
                                        {errors.number && <div className="invalid-feedback">{errors.number.message}</div>} */}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="number" className="form-label">Responsive Variable</label>
                                        <select className="form-select form-control">
                                            <option value="1">AVAL</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="targetNumeric" className="form-label">Baselne Type</label>
                                        <input
                                            type="text"
                                            id="targetNumeric"
                                            name="targetNumeric"
                                            className={`form-control ${errors.targetNumeric ? 'is-invalid' : ''}`}
                                            // disabled={visitModalState === 'view'}
                                            // {...register('targetNumeric', { required: 'This field is required.' })}
                                        />
                                        {/* {errors.targetNumeric && <div className="invalid-feedback">{errors.targetNumeric.message}</div>} */}
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="shortName" className="form-label">Label</label>
                                        <input
                                            type="text"
                                            id="shortName"
                                            name="shortName"
                                            className={`form-control ${errors.shortName ? 'is-invalid' : ''}`}
                                            // disabled={visitModalState === 'view'}
                                            // {...register('shortName', { required: 'This field is required.' })}
                                        />
                                        {/* {errors.shortName && <div className="invalid-feedback">{errors.shortName.message}</div>} */}
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <button type="submit" className="btn btn-primary w-100 mt-2 me-2" disabled={loading || Object.keys(dirtyFields).length === 0}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button type="button" className="btn btn-outline-primary w-100 mt-2" onClick={() => reset()} disabled={loading || Object.keys(dirtyFields).length === 0}>Discard</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class={`modal-backdrop fade ${showAddEndpointModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddEndpointModal;
