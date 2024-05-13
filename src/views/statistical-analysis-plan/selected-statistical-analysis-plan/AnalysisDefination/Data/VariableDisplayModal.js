import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addVisitPeriod, getVisitPeriodByGUID, updateVisitPeriod } from '../../../../../services/visit-service';
import { addEndpoint, updateEndPoint } from '../../../../../services/statistical-analysis-plan-service';

const VariableDisplayModal = (props) => {
    const {
        setShowSuccessAlert,
        setSuccessMessage,
        showAddEndpointModal,
        setShowAddEndpointModal,
        modalState,
        setModalState,
        selectedRow,
        setTableModalShow,
        tableModalShow,
        setResponseVariable
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
    const [varibleData, setVaribleData] = useState([
        { id: 1, name: "AVAL" },
        { id: 2, name: "CHG" },
        { id: 3, name: "PCHG" },
        { id: 4, name: "BASE" },
        { id: 5, name: "AVALCAT01/AVALCAT01N" },
        { id: 6, name: "CHGCAT01/CHGCAT01" },
    ])



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




    const handleCheckboxChange = (id, field, checked) => {

        console.log('called called')
      

        setVaribleData(prevVaribleData => {
            return prevVaribleData.map(item => {
                if (item.id === id) {
                    return { ...item, [field]: checked };
                }
                return item;
            });
        });
       
    };


    useEffect(()=>{
        setResponseVariable(varibleData);
    },[varibleData])


    console.log('varrrrr', varibleData)

    return (
        <>
            <div
                className={`visit-structure-modal modal fade ${tableModalShow ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog" style={{ minWidth: '1450px' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title" id="exampleModalLabel">Add Response Variables to Display</h6>
                            <button
                                type="button"
                                className="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    reset();
                                    setTableModalShow(false);
                                    setModalState("add");
                                }}
                            ></button>
                        </div>
                        <div className="modal-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>

                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            Variable
                                        </th>
                                        <th scope="col">
                                            Display
                                        </th>
                                        <th scope="col">
                                            Ask Endpoint Type
                                        </th>
                                        <th scope="col">
                                            Custom Label
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        varibleData.map((item) => (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td><input type="checkbox" name='display' onChange={(e) => handleCheckboxChange(item.id, 'display', e.target.checked)} /></td>
                                                <td><input type="checkbox" name='askEndpointType' onChange={(e) => handleCheckboxChange(item.id, 'askEndpointType', e.target.checked)} /></td>
                                                <td><input type="checkbox" name='customLabel' onChange={(e) => handleCheckboxChange(item.id, 'customLabel', e.target.checked)} /></td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                            <div className="justify-content-left mt-4">
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

export default VariableDisplayModal;
