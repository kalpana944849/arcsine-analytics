import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addVisitPeriod, getVisitPeriodByGUID, updateVisitPeriod } from '../../../../../services/visit-service';
import { addEndpoint, updateEndPoint } from '../../../../../services/statistical-analysis-plan-service';
import DynamicTreeList from '../../../../../components/common/DynamicTreeList';

const AddUpdateDataEndpointModal = (props) => {
    const {
        setShowSuccessAlert,
        setSuccessMessage,
        showAddEndpointModal,
        setShowAddEndpointModal,
        modalState,
        setModalState,
        selectedRow,
        setTableModalShow,
        responseVariable, 
		showData
    } = props;
    const { register, handleSubmit, reset, formState, setValue } = useForm({
        shouldUnregister: true
    });
    const { dirtyFields, errors } = formState;
    const [loading, setLoading] = useState(false);
    // const [visitPeriod, setVisitPeriod] = useState(null);
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));
    const [editableOrViewable, setEditableOrViewable] = useState(false);
    const dataEndpoint = JSON.parse(localStorage.getItem("dataEndpoint")) || [];



    const offset = useRef({
        left: 0,
        top: 0,
    });

    useEffect(() => {
        if (modalState === "edit" || modalState === "view") {
            setEditableOrViewable(true);
            setValue('shortName', selectedRow.endpointNameShort);
            setValue('longName', selectedRow.endpointNameLong);
            setValue('desc', selectedRow.endpointDescription);
            // getVisitPeriod();
        } else {
            setEditableOrViewable(false);
        }
        console.log(editableOrViewable);
    }, [modalState]);

    // const getVisitPeriod = async () => {
    //     try {
    //         if (visitPeriod === null) {
    //             const response = await getVisitPeriodByGUID(selectedRow.sapVisitGuid);
    //             if (response && response.data.status === "OK") {
    //                 setValue('number', response.data.data.sapVisitPeriodNumber);
    //                 setValue('shortName', response.data.data.sapVisitPeriodNameShort);
    //                 setValue('longName', response.data.data.sapVisitPeriodNameLong);
    //                 setVisitPeriod(response.data.data);
    //             }
    //         } else {
    //             setValue('number', visitPeriod.sapVisitPeriodNumber);
    //             setValue('shortName', visitPeriod.sapVisitPeriodNameShort);
    //             setValue('longName', visitPeriod.sapVisitPeriodNameLong);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const onSubmit = async (data) => {
        console.log(data);
        // return false;
        setLoading(true);
        try {
            let response;
            // const reqBody = {
            //     "sapVisitPeriodId": editableOrViewable ? visitPeriod.sapVisitPeriodId : 0,
            //     "sapVisitPeriodGuid": editableOrViewable ? visitPeriod.sapVisitPeriodGuid : "",
            //     "companyId": editableOrViewable ? visitPeriod.companyId : sapData.companyId,
            //     "sapId": editableOrViewable ? visitPeriod.sapId : sapData.sapId,
            //     "sapVersionId": editableOrViewable ? visitPeriod.sapVersionId : sapVersionId,
            //     "sapVisitPeriodNumber": data.number,
            //     "sapVisitPeriodNameShort": data.shortName,
            //     "sapVisitPeriodNameLong": data.longName,
            //     "createdBy": editableOrViewable ? visitPeriod.createdBy : "",
            //     "updatedBy": editableOrViewable ? visitPeriod.updatedBy : "",
            //     "createdDate": null,
            //     "updatedDate": null
            // };
            const reqBody = {
                "sapEndpointId": 0,
                "sapEndpointGuid": "",
                "companyId": sapData.companyId,
                "sapId": sapData.sapId,
                "sapVersionId": sapVersionId,
                "parentId": 0,
                "parentGuid": "",
                "isFolder": true,
                "endpointNameShort": editableOrViewable ? selectedRow.endpointNameShort : data.shortName,
                "endpointNameLong": editableOrViewable ? selectedRow.endpointNameLong : data.longName,
                "endpointDescription": editableOrViewable ? selectedRow.endpointDescription : data.desc,
                "createdDate": null,
                "updatedDate": null,
                "updatedBy": "",
                "createdBy": ""
            };

            if (editableOrViewable) {
                response = await updateEndPoint(reqBody);
            } else {
                response = await addEndpoint(reqBody);
            }
            if (response && response.data.status === "OK") {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                reset();
                setShowAddEndpointModal(false);
                setSuccessMessage(`Endpoint folder has been ${editableOrViewable ? "updated" : "added"} successfully.`);
                setShowSuccessAlert(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    console.log('responseVariableresponseVariable', responseVariable)
    const filteredNames = responseVariable.filter(item => item.display || item.askEndpointType || item.customLabel);
    // const filteredNames = []

    return (
        <>
            <div
                className={`visit-structure-modal modal fade ${showAddEndpointModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" style={{ minWidth: '1450px'}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{modalState === 'add' ? 'Add' : modalState === 'edit' ? 'Update' : 'View'} Endpoint</h5>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setShowAddEndpointModal(false);
                                    setModalState("add");
                                }}
                            ></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>

                            <a
                                style={{ width: 30, float: "right", textAlign: 'center', height: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                className="btn btn-secondary"
                                onClick={() => setTableModalShow(true)}

                            >
                                <i
                                    className="fa-solid fa-plus"
                                ></i>
                            </a>

                            <div style={{ display: 'flex' }}>
                                <div style={{ maxWidth: '400px',overflow: 'auto', maxHeight: '260px'}}>
                                    <DynamicTreeList
                                    showData={showData}
                                        title="Endpoints"
                                        data={dataEndpoint}
                                        id="sapEndpointId"
                                        guid="sapEndpointGuid"
                                        col_field="endpointNameShort"
                                        onRowClick={() => { }}
                                        onFolderClick={() => { }}
                                        onItemClick={() => { }}
                                        setSelectedRow={() => { }}
                                        offset={offset}
                                        openContextMenu={() => { }}
                                        localKey="endpointSelected"
                                        icon="fas fa-sharp fa-light fa-syringe"
                                    />
                                </div>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            {filteredNames && filteredNames?.map(item => (
                                                <th key={item.id} scope="col" style={{ width: '200px' }} >{item.name}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {responseVariable.map((item) => (
                                                filteredNames.includes(item) && (
                                                    <td >
                                                        <div style={{ display: "flex", alignItems: 'center' }}>
                                                            {item.display && (
                                                                <input type="checkbox" name="display" style={{ marginRight: '5px' }} />
                                                            )}
                                                            {item.askEndpointType && (
                                                                <select className="form-select form-control" aria-placeholder='Select'
                                                                    style={{ marginRight: '5px', maxWidth: '80px', height: '30px', minHeight: '30px', fontSize: '8px' }}>
                                                                    <option value="1">AVAL</option>
                                                                    <option value="2">Two</option>
                                                                    <option value="3">Three</option>
                                                                </select>
                                                            )}
                                                            {console.log("pagal", responseVariable)}
                                                            {item.customLabel && (
                                                                <input type="text" name="customLabel" style={{ maxWidth: '80px' }} />
                                                            )}
                                                        </div>
                                                    </td>
                                                )
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="justify-content-left mt-4" style={{marginBottom:'5px'}}>
                                <a className="btn btn-secondary mt-4" style={{ width: 150 }} onClick={() => {
                                    setTableModalShow(false)
                                }}>
                                    <i className="fa-solid fa-save" style={{ marginRight: 5 }}></i>
                                    <span>Save</span>
                                </a>

                                <a
                                    onClick={() => {
                                        setTableModalShow(false); setVaribleData([
                                            { id: 1, name: "AVAL" },
                                            { id: 2, name: "CHG" },
                                            { id: 3, name: "PCHG" },
                                            { id: 4, name: "BASE" },
                                            { id: 5, name: "AVALCAT01/AVALCAT01N" },
                                            { id: 6, name: "CHGCAT01/CHGCAT01" },
                                        ])
                                    }}
                                    className="btn btn-secondary mt-4"
                                    style={{ width: 150, marginLeft: 30 }}
                                >
                                    <i className="fa-solid fa-times" style={{ marginRight: 5 }}></i>
                                    <span>Discard</span>
                                </a>
                            </div> 
                            


                        </div>
                    </div>
                </div>
            </div>
            <div class={`modal-backdrop fade ${showAddEndpointModal ? 'show' : 'd-none'}`}></div>
        </>
    );
};

export default AddUpdateDataEndpointModal;
