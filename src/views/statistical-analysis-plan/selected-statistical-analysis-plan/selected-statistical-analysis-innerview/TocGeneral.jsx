import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";
import { v4 as uuidv4 } from 'uuid';

import { getSapAnalysisInput, getAutomaticCustomTitles, addSapToc } from "../../../../services/toc-service";
import AddEndpointModal from "./Modals/AddEndpointModal";

const TocGeneral = () => {
    const [isCustomProgram, setIsCustomProgram] = useState(false);
    const [analysisInput, setAnalysisInput] = useState([]);
    const [automaticOrCustomTitleOptions, setAutomaticOrCustomTitleOptions] = useState([]);
    const [customSubtitleOptions, setCustomSubtitleOptions] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showAddEndpointModal, setShowAddEndpointModal] = useState(false);
    const [selectedSubtitle, setSelectedSubtitle] = useState(false);
    const [selectedFootnote, setSelectedFootnote] = useState('');
    const [selectedAutoOrCustomTitle, setSelectedAutoOrCustomTitle] = useState('');
    const [formFields, setFormFields] = useState([
        { id: uuidv4(), variable: '', value: '' }
    ]);
    const sapDataItem = localStorage.getItem("sapDataItem");
    const formStyle = {
        overflowY: 'auto',
        height: 'calc(100vh - 258px)',
        overflowX: 'hidden',
        paddingRight: '12px'
    };
    const initialValues = {
        "companyId": 0,
        "sapId": 0,
        "sapTocNumber": "",
        "sapTocNameShort": "",
        "sapTocNameLong": "",
        "sapTocDescription": "",
        "sapAnalysisId": 0,
        "sapTocCustomProgramUrl": "",
        "sapTocCustomOutputNumber": 0,
        "sapTocCustomTitle": "",
        "sapTocCustomSubTitle": true,
        "sapTocCustomFootnote": true
    };

    const customColumnTemplate = (props) => {
        const handleVersionChange = (event) => {
            return false;
        };

        return (
            <th>
                <input
                    type="radio"
                    name="rowSelector"
                    onChange={handleVersionChange}
                /> {props.dataItem.order}
            </th>
        );
    };

    const onAnalysisChange = (event) => {
        if (event.target.value === 'customProgram') {
            setIsCustomProgram(true);
        } else {
            setIsCustomProgram(false);
        }
    };

    const fetchAutomaticCustomTitles = async (categoryID) => {
        try {
            const responseOne = await getAutomaticCustomTitles(1120);
            const responseTwo = await getAutomaticCustomTitles(1035);
            if (responseOne && responseTwo) {
                let options = [];
                const makeOptions = (data) => {
                    options = [];
                    if (data.length) {
                        data.forEach(element => {
                            options.push(
                                <option
                                    key={element.libraryControlledTerminologyId}
                                    value={element.libraryControlledTerminologyId}
                                >
                                    {element.libraryControlledTerminologyNameShort}
                                </option>)
                            if (element.libraryControlledTerminologyNameShort == 'N') {
                                setSelectedSubtitle(element.libraryControlledTerminologyId);
                                setSelectedFootnote(element.libraryControlledTerminologyId);
                            }
                            if (element.libraryControlledTerminologyNameShort == 'Automatic') {
                                setSelectedAutoOrCustomTitle(element.libraryControlledTerminologyId);
                            }
                        });
                    }
                }
                makeOptions(responseOne.data.data);
                setAutomaticOrCustomTitleOptions(options);
                makeOptions(responseTwo.data.data);
                setCustomSubtitleOptions(options);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useState(() => {
        const fetchSapAnalysisInput = async () => {
            try {
                const sapDataId = JSON.parse(localStorage.getItem("SapDataId"));
                const sapID = sapDataId && sapDataId.sapId;
                const sapVersionID = localStorage.getItem("sapVersionId");
                const response = await getSapAnalysisInput(sapID, sapVersionID);
                if (response && response.data.status === "OK") {
                    setAnalysisInput(response.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (analysisInput.length === 0) {
            fetchSapAnalysisInput();
        }
        fetchAutomaticCustomTitles();
    }, []);

    const formik = useFormik({
        initialValues: initialValues,
        // validationSchema: "",
        onSubmit: async (values, { resetForm }) => {
            values.sapId = sapDataItem.sapId;
            values.companyId = sapDataItem.companyId;
            console.log("val", values);
            const response = await addSapToc(values);
            console.log("res", response);
            if (response.status == 200) {
                setShowSuccessAlert(true);
            }
        },
    });

    const generateUniqueKey = () => {
        return Math.random().toString(36).substring(7);
    };

    const addFormField = () => {
        const newField = { id: uuidv4(), variable: '', value: '' };
        setFormFields([...formFields, newField]);
    };

    const removeFormField = (id) => {
        const updatedFields = formFields.filter((field) => field.id !== id);
        setFormFields(updatedFields);
    };

    const handleInputChange = (id, field, event) => {
        const updatedFields = formFields.map((f) =>
            f.id === id ? { ...f, [field]: event.target.value } : f
        );
        setFormFields(updatedFields);
    };

    return (
        <div>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" aria-current="page" href="#titles">Titles</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" aria-current="page" href="#analysis">Analysis Set and Treatment</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" aria-current="page" href="#endpoint">Endpoints, Analysis Flags and Visits</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" aria-current="page" href="#subgroups">Subgroups</a>
                </li>
            </ul>
            <div className="tab-content pt-4" id="tab-content">
                <div className="tab-pane active" id="titles">
                    <form onSubmit={formik.handleSubmit} style={formStyle}>
                        <div className="row">
                            <div className="col mb-3">
                                <label htmlFor="section" className="form-label">Section</label>
                                <select className="form-select form-control">
                                    <option value="">Select any section</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="sapTocNumber" className="form-label">TOC Number</label>
                                <input type="number" className="form-control" id="sapTocNumber"
                                    onChange={formik.handleChange}
                                    value={formik.values.sapTocNumber}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label htmlFor="sapAnalysisId" className="form-label">Analysis</label>
                                <select className="form-select form-control"
                                    name="sapAnalysisId"
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        onAnalysisChange(e);
                                    }}
                                    value={formik.values.sapAnalysisId}
                                >
                                    <option value="">Select any analysis</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                    <option value="customProgram">Custom Program</option>
                                </select>
                            </div>
                        </div>
                        {!isCustomProgram ?
                            <>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="title" className="form-label">Automatic or Custom Titles</label>
                                            <select className="form-select form-control"
                                                name="sapTocCustomTitle"
                                                onChange={(e) => setSelectedAutoOrCustomTitle(e.target.value)}
                                                value={selectedAutoOrCustomTitle}
                                            >
                                                <option value="">Select any title</option>
                                                {automaticOrCustomTitleOptions}
                                            </select>
                                        </div>
                                    </div>
                                    {selectedAutoOrCustomTitle == 432 &&
                                        <div className="col">
                                            <div className="mb-3">
                                                <label htmlFor="autoTitleLineOne" className="form-label invisible">Automatic Title Line 1</label>
                                                <input type="text" className="form-control" id="autoTitleLineOne" placeholder="Automatic Title Line 1" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="autoTitleLineTwo" className="form-label d-none">Automatic Title Line 2</label>
                                                <input type="text" className="form-control" id="autoTitleLineTwo" placeholder="Automatic Title Line 2" />
                                            </div>
                                        </div>
                                    }
                                    {selectedAutoOrCustomTitle == 433 &&
                                        <div className="col">
                                            <div className="mb-3">
                                                <label htmlFor="autoTitleLineOne" className="form-label invisible">Custom Title Line 1</label>
                                                <input type="text" className="form-control" id="autoTitleLineOne" placeholder="Custom Title Line 1" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="autoTitleLineTwo" className="form-label d-none">Custom Title Line 2</label>
                                                <input type="text" className="form-control" id="autoTitleLineTwo" placeholder="Custom Title Line 2" />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="customSubtitles" className="form-label">Add Custom Subtitles</label>
                                            <select className="form-select form-control"
                                                name="sapTocCustomSubTitle"
                                                onChange={(e) => setSelectedSubtitle(e.target.value)}
                                                value={selectedSubtitle}
                                            >
                                                {customSubtitleOptions}
                                            </select>
                                        </div>
                                    </div>
                                    {selectedSubtitle != 310 &&
                                        <div className="col">
                                            <div className="mb-3">
                                                <label htmlFor="customSubtitleOne" className="form-label invisible">Custom Subtitle 1</label>
                                                <input type="text" className="form-control" id="customSubtitleOne" placeholder="Custom Subtitle 1" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customeSubtitleTwo" className="form-label d-none">Custom Subtitle 2</label>
                                                <input type="text" className="form-control" id="customeSubtitleTwo" placeholder="Custom Subtitle 2" />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="customSubtitles" className="form-label">Add Custom Footnotes</label>
                                            <select className="form-select form-control"
                                                name="sapTocCustomFootnote"
                                                onChange={(e) => setSelectedFootnote(e.target.value)}
                                                value={selectedFootnote}
                                            >
                                                {customSubtitleOptions}
                                            </select>
                                        </div>
                                    </div>
                                    {selectedFootnote != 310 &&
                                        <div className="col">
                                            <div className="mb-3">
                                                <label htmlFor="customFootnotOne" className="form-label invisible">Custom Footnotes 1</label>
                                                <input type="text" className="form-control" id="customFootnotOne" placeholder="Custom Footnotes 1" />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="customFootnotTwo" className="form-label d-none">Custom Footnotes 2</label>
                                                <input type="text" className="form-control" id="customFootnotTwo" placeholder="Custom Footnotes 2" />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </> :
                            <div className="row ">
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="program" className="form-label">Program</label>
                                        <input type="text" className="form-control"
                                            name="sapTocCustomProgramUrl"
                                            onChange={formik.handleChange}
                                            value={formik.values.sapTocCustomProgramUrl}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="mb-3">
                                        <label htmlFor="sapTocCustomOutputNumber" className="form-label">Output Number</label>
                                        <input type="number" className="form-control" id="sapTocCustomOutputNumber"
                                            name="sapTocCustomOutputNumber"
                                            onChange={formik.handleChange}
                                            value={formik.values.sapTocCustomOutputNumber}
                                        />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="hello version-grid">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Variable</th>
                                                    <th scope="col">Value</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formFields.map((field) => (
                                                    <tr key={field.id} id={field.id}>
                                                        <td>
                                                            <input type="text" className="form-control" value={field.variable} onChange={(e) => handleInputChange(field.id, 'variable', e)} />
                                                        </td>
                                                        <td>
                                                            <input type="text" className="form-control" value={field.value} onChange={(e) => handleInputChange(field.id, 'value', e)} />
                                                        </td>
                                                        <td>
                                                            <button type="button" className="btn btn-outline-danger" onClick={() => removeFormField(field.id)}><span className="fa fa-trash"></span></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <a href="#" className="float-end" onClick={addFormField}>+ Add More Row</a>
                                        {/* <Grid
                                            className="version-grid2"
                                            data={[
                                                { order: 1, variableName: 'Test Variable 1', value: '10' },
                                                { order: 2, variableName: 'Test Variable 2', value: '3' },
                                                { order: 3, variableName: 'Test Variable 3', value: '7' },
                                                { order: 4, variableName: 'Test Variable 4', value: '3' },
                                                { order: 5, variableName: 'Test Variable 5', value: '90' }
                                            ]}
                                            selectable={{
                                                enabled: false,
                                                cell: false
                                            }}
                                            navigatable={true}
                                        // onSelectionChange={onSelectionChangeVer}
                                        // onContextMenu={handleContextMenuVersion}
                                        // dataItemKey={DATA_ITEM_KEY_VERSION}
                                        // selectedField={SELECTED_FIELD_VERSION}
                                        // onRowClick={(e) => {
                                        //     document
                                        //         .getElementById(e.dataItem.sapVersionGuid)
                                        //         .click();
                                        // }}
                                        >
                                            <GridColumn
                                                field="order"
                                                cell={customColumnTemplate}
                                                title=" "
                                                width="50"
                                            />
                                            <GridColumn
                                                field="variableName"
                                                title="Variable"
                                            />
                                            <GridColumn
                                                field="value"
                                                title="Value"
                                            />
                                        </Grid> */}
                                    </div>
                                </div>
                            </div>
                        }

                        <div className="d-flex mt-4">
                            <button type="submit" className="btn btn-primary w-100 mt-2 me-2">Save</button>
                            <button type="button" className="btn btn-outline-primary w-100 mt-2">Discard</button>
                        </div>
                    </form >
                </div>
                <div className="tab-pane" id="analysis">
                    <form action="#" style={formStyle}>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Analysis Set</label>
                                <select className="form-select form-control">
                                    <option value="">Select any analysis set</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label className="form-label">Subset Variable</label>
                                <select className="form-select form-control">
                                    <option value="">Select any subset variable</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="subsetValue" className="form-label">Subset Value</label>
                                <input type="number" className="form-control" id="subsetValue" />
                            </div>
                            <div className="col-12 mb-3">
                                <label htmlFor="whereClause" className="form-label">WHERE Clause</label>
                                <input type="number" className="form-control" id="whereClause" />
                            </div>
                            <div className="col-12 mb-3">
                                <label className="form-label">Treatment Type</label>
                                <select className="form-select form-control">
                                    <option value="">Select any treatment type</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex">
                            <button type="button" className="btn btn-primary w-100 mt-2 me-2">Save</button>
                            <button type="button" className="btn btn-outline-primary w-100 mt-2">Discard</button>
                        </div>
                    </form >
                </div>
                <div className="tab-pane" id="endpoint">
                    <table className="table table-hover mb-4">
                        <thead>
                            <tr>
                                <th scope="col">Display Order</th>
                                <th scope="col">Endpoint(s)</th>
                                <th scope="col">Response Variable</th>
                                <th scope="col">Baseline Type</th>
                                <th scope="col">Label</th>
                                <th scope="col">
                                    <a href="#" onClick={() => setShowAddEndpointModal(true)}><i className="fa fa-file"></i></a>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td scope="row">1</td>
                                <td>ACR20</td>
                                <td>AVAL</td>
                                <td>Study Baseline</td>
                                <td>ACR20</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <form action="#" style={formStyle}>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Analysis Flag</label>
                                <select className="form-select form-control">
                                    <option value="">Select any analysis flag</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="label-1" className="form-label">Label</label>
                                <input type="text" className="form-control" id="label-1" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Imputation Variable</label>
                                <select className="form-select form-control">
                                    <option value="">Select any imputation variable</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="value-1" className="form-label">Value</label>
                                <input type="text" className="form-control" id="value-1" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-3">
                                <label className="form-label">Visits</label>
                                <select className="form-select form-control">
                                    <option value="">Select any visit</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="col-6 mb-3">
                                <label htmlFor="lable-2" className="form-label">Lable</label>
                                <input type="text" className="form-control" id="lable-2" />
                            </div>
                        </div>
                        <div className="d-flex">
                            <button type="button" className="btn btn-primary w-100 mt-2 me-2">Save</button>
                            <button type="button" className="btn btn-outline-primary w-100 mt-2">Discard</button>
                        </div>
                    </form >
                </div>
                <div className="tab-pane" id="subgroups">
                    <h3>Subgroups</h3>
                </div>
            </div>

            <AddEndpointModal
                showAddEndpointModal={showAddEndpointModal}
                setShowAddEndpointModal={setShowAddEndpointModal}
            />

            <SweetAlert
                show={showSuccessAlert}
                success
                title="Success"
                onConfirm={() => {
                    setShowSuccessAlert(false);
                    // setReload(!reload);
                }}
            >
                TOC has been added successfully.
            </SweetAlert>

        </div >
    );
};

export default TocGeneral;
