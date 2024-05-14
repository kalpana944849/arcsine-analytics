import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { addVisitFlagFolder, updateVisitFlagFolder } from '../../../../../../services/visit-service';
import VisitStructureTreeList from '../VisitStructureTreeList';
import commonSchema from '../../../../../../utils/validationSchema/common-schema';

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
    const [loading, setLoading] = useState(false);
    const sapData = JSON.parse(localStorage.getItem("SapDataId"));
    const sapVersionId = JSON.parse(localStorage.getItem("sapVersionId"));
    const [editableOrViewable, setEditableOrViewable] = useState(false);
    const [flagParentInfo, setFlagParentInfo] = useState({});
    const [sapVisitSelectionInputs, setSapVisitSelectionInputs] = useState([]);
    const [checkedItems, setCheckedItems] = useState({});
    const [checkedData, setCheckedData] = useState([]);
    const [changeNotDetect, setChangeNotDetect] = useState(true);

    useEffect(() => {
        if (flagModalState === "edit" || flagModalState === "view" ? true : false) {
            setEditableOrViewable(true);
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

    useEffect(() => {
        if (selectedRow) {
            setCheckedItems(selectedRow.sapVisitSelectionInputs);
            setCheckedData(selectedRow.sapVisitSelectionInputs);
        }
    }, [selectedRow]);

    // Function to toggle the checked state of a checkbox
    const toggleCheckbox = (data) => {
        setCheckedItems(prevState => ({
            ...prevState,
            [data.sapVisitId]: !prevState[data.sapVisitId]
        }));

        if (checkedData.some(obj => obj.sapVisitId === data.sapVisitId)) {
            const indexToRemove = checkedData.findIndex(obj => obj.sapVisitId === data.sapVisitId);
            if (indexToRemove !== -1) {
                checkedData.splice(indexToRemove, 1);
                setCheckedData(checkedData);
                if (JSON.stringify(checkedData) === JSON.stringify(selectedRow.sapVisitSelectionInputs)) {
                    setChangeNotDetect(true);
                } else {
                    setChangeNotDetect(false);
                }
            }
        } else {
            setCheckedData([...checkedData, data]);
            if (JSON.stringify([...checkedData, data]) === JSON.stringify(selectedRow.sapVisitSelectionInputs)) {
                setChangeNotDetect(true);
            } else {
                setChangeNotDetect(false);
            }
        }
    };

    const formik = useFormik({
        initialValues: {
            shortName: selectedRow?.visitFlagNameShort,
            longName: selectedRow?.visitFlagNameLong,
            description: selectedRow?.visitFlagDescription,
            label: selectedRow?.visitFlagLabel
        },
        enableReinitialize: true,
        validationSchema: commonSchema,
        onSubmit: async (values, { resetForm }) => {
            const selectedData = [];
            checkedData.forEach((item) => {
                selectedData.push({
                    "sapVisitSelectionId": 0,
                    "sapVisitSelectionGuid": "",
                    "companyId": item.companyId,
                    "sapId": item.sapId,
                    "sapVersionId": item.sapVersionId,
                    "sapVisitFlagId": 0,
                    "sapVisitId": Number((item.sapVisitId).split('_')[1]),
                    "sapVisitTimeId": 0,
                    "createdBy": "test",
                    "updatedBy": "test",
                    "createdDate": "",
                    "updatedDate": ""
                });
            });
            setSapVisitSelectionInputs(checkedData);

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
                    "visitFlagNameShort": values.shortName,
                    "visitFlagNameLong": values.longName,
                    "visitFlagDescription": values.description,
                    "visitFlagLabel": values.label,
                    "displayOrder": editableOrViewable ? selectedRow.displayOrder : 0,
                    "createdBy":  "test",
                    "updatedBy":  "test",
                    "createdDate": editableOrViewable ? selectedRow.createdDate : "",
                    "updatedDate": editableOrViewable ? selectedRow.updatedDate : "",
                    "sapVisitSelectionInputs": selectedData
                    // "sapVisitSelectionInputs": sapVisitSelectionInputs
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
        }
    });

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
                                    formik.resetForm();
                                    setShowAddFlagModal(false);
                                    setFlagModalState("add");
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={formik.handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="shortName" className="form-label">Short Name <sup className="text-danger">*</sup></label>
                                        <input
                                            type="text"
                                            name="shortName"
                                            className={`form-control ${formik.touched.shortName && formik.errors.shortName ? 'is-invalid' : ''}`}
                                            disabled={flagModalState === 'view'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.shortName}
                                        />
                                        {formik.touched.shortName && formik.errors.shortName ? (
                                            <small className="text-danger validationError">{formik.errors.shortName}</small>
                                        ) : null}
                                    </div>
                                    <div className="col">
                                        <label htmlFor="longName" className="form-label">Long Name</label>
                                        <input
                                            type="text"
                                            name="longName"
                                            className="form-control"
                                            disabled={flagModalState === 'view'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.longName}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <input
                                            type="description"
                                            name="description"
                                            className="form-control"
                                            disabled={flagModalState === 'view'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.description}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-5">
                                    <div className="col">
                                        <label htmlFor="label" className="form-label">Label</label>
                                        <input
                                            type="text"
                                            name="label"
                                            className="form-control"
                                            disabled={flagModalState === 'view'}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.label}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3 visit-structure-tree-data-wrapper">
                                    <VisitStructureTreeList
                                        data={visitStructureTreeData}
                                        sapVisitSelectionInputs={sapVisitSelectionInputs}
                                        setSapVisitSelectionInputs={setSapVisitSelectionInputs}
                                        toggleCheckbox={toggleCheckbox}
                                        checkedItems={checkedItems}
                                    />
                                </div>
                                <div className="d-flex">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 mt-2 me-2" 
                                        // disabled={(loading || Object.keys(dirtyFields).length === 0) && changeNotDetect}
                                        // disabled={(loading || !isDirty) && changeNotDetect}
                                        disabled={(
                                            formik.values.shortName == selectedRow?.visitFlagNameShort && 
                                            formik.values.longName == selectedRow?.visitFlagNameLong && 
                                            formik.values.description == selectedRow?.visitFlagDescription && 
                                            formik.values.label == selectedRow?.visitFlagLabel && changeNotDetect
                                        ) || loading}
                                    >
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary w-100 mt-2"
                                        onClick={() => formik.resetForm()}
                                        disabled={(
                                            formik.values.shortName == selectedRow?.visitFlagNameShort && 
                                            formik.values.longName == selectedRow?.visitFlagNameLong && 
                                            formik.values.description == selectedRow?.visitFlagDescription && 
                                            formik.values.label == selectedRow?.visitFlagLabel && changeNotDetect
                                        ) || loading}
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
