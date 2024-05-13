import {
    ContextMenu,
    MenuItem,
    Splitter,
    TabStrip,
    TabStripTab,
} from "@progress/kendo-react-layout";
import React, { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { useFormik } from "formik";
import AnalysisFlagMoveToDifferentFolderModal from "../../statistical-analysis-plan/selected-statistical-analysis-plan/AnalysisDefination/EndpointAnalysisFlag/AnalysisFlagMoveToDifferentFolderModal";
import EndpointMoveToDifferentFolderModal from "../../statistical-analysis-plan/selected-statistical-analysis-plan/AnalysisDefination/EndpointAnalysisFlag/EndpointMoveToDifferentFolderModal";
import EndPointForm from "../../statistical-analysis-plan/selected-statistical-analysis-plan/AnalysisDefination/EndpointAnalysisFlag/EndPointForm";
import CustomLoader from "../../../utils/Loaders/CustomLoader";
import AnalysisFlagForm from "../../statistical-analysis-plan/selected-statistical-analysis-plan/AnalysisDefination/EndpointAnalysisFlag/AnalysisFlagForm";
import DynamicTreeList from "../../../components/common/DynamicTreeList";
import {
    getAnalysisFlagInput,
    addAnalysisFlag,
    getSapEndpointInput,
    getSapAnalysisFlag,
    updateEndPoint,
    updateAnalysisFlag,
    addEndpoint,
    deleteEndpoint,
    deleteAnalysisFlag,
} from "../../../services/statistical-analysis-plan-service";
import { getIdFromString, getParsedFromLocalStorage, onChange } from "../../../utils/common-helper";
import { Link, useLocation } from "react-router-dom";
import Version from "../../../components/layout/Version";
import CategoryForm from "./StandardComponentForm/CategoryForm.jsx";
import { addStandardComponent, deleteStandardCategory, getAllStandardCategories, getStandardCategoryParamter, updateStandardComponent, updateStandardComponents } from "../../../services/global-standard-service";
import ParamterForm from "./StandardComponentForm/ParamterForm";

const StandardComponents = () => {

    const [panes, setPanes] = React.useState([
        {
            size: "50%",
            min: "20%",
            collapsible: true,
            scrollable: false,
        },
        {
            min: "20%",
            collapsible: true,
            scrollable: false,
        },
    ]);

    // ALL State Declaration ..
    const [tab, setTab] = useState("category");
    const [addType, setAddType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFolder, setIsFolder] = useState(false);
    const [selected, setSelected] = React.useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [isActive, setActive] = React.useState(false);
    const [showAnalysis, setShowAnalysis] = useState("");
    const [showEndPoint, setShowEndPoint] = useState("");
    const [showParameter, setShowParameter] = useState("");
    const [parameterData, setParameterData] = useState([]);
    const [updateLoader, setUpdateLoader] = useState(false)
    const [categoryRowData, setCategoryRowData] = useState();
    const [parameterRowData, setParameterRowData] = useState();
    const [addCategoryType, setAddCategoryType] = useState("");
    const [addParameterType, setAddParameterType] = useState("");
    const [selectedEndpoint, setSelectedEndpoint] = useState({});
    const [selectedAnalysis, setSelectedAnalysis] = useState({});
    const [parentIdEndpoint, setParentIdEndpoint] = useState(null);
    const [showAnalysisForm, setShowAnalysisForm] = useState(false);
    const [showEndPointForm, setShowEndPointForm] = useState(false);
    const [showAddAnalysisPop, setShowAnalysisPop] = useState(false);
    const [analysisFlagRowData, setAnalysisFlagRowData] = useState();
    const [showAddEndPointPop, setShowEndPointPop] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [standardCategoryData, setStandardCategoryData] = useState([]);
    const [parentIdAnalysisFlag, setParentIdAnalysisFlag] = useState(null);
    const [isFolderAnalysisFlag, setIsFolderAnalysisFlag] = useState(false);
    const [isFolderStandardComp, setIsFolderStandardComp] = useState(false);
    const [showEndpointContextMenu, setShowEndpointContextMenu] = useState(false);
    const [showMoveToDifferentFolderModal, setShowMoveToDifferentFolderModal] = useState(false);
    const [showMoveToDifferentFolderModalAnaFlag, setShowMoveToDifferentFolderModalAnaFlag] = useState(false);


    const allStandardParameterData = JSON.parse(localStorage.getItem("allStandardParameterData"));
    const allStandardCategoryData = JSON.parse(localStorage.getItem("allStandardCategoryData")) || [];

    const sapIdAnalysis = allStandardParameterData?.sapId || 43;
    const sapIdEndpoint = allStandardCategoryData?.sapId || 43;
    const sapVersionIdAnalysis = allStandardParameterData?.sapVersionId || 24;
    const sapVersionIdEndpoint = allStandardCategoryData?.sapVersionId || 24;


    const location = useLocation();
    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const version = process.env.REACT_APP_VERSION;


    const handleSelect = (e) => {
        setSelected(e.selected);
        if (e.selected == 0) {
            setTab("category");
            setLoading(false);
            setShowAnalysis(false)
        } else {
            setTab("parameter");
            setLoading(false);
        }
    };


    const handleToggle = () => {
        setActive(!isActive);
    };


    const handleShowParameter = (isTrue, rowData, type) => {
        setShowParameter(isTrue);
        setParameterRowData(rowData);
        setAddParameterType(type);
    };

    const handleShowEndPoint = (isTrue, rowData, type) => {
        setShowEndPoint(isTrue);
        setCategoryRowData(rowData);
        setAddCategoryType(type);
    };


    /**
     * Get All Standard Category ...
     */
    const getStandardCategory = async (id, sapVersionId) => {
        setLoading(true);
        const response = await getAllStandardCategories(id, sapVersionId);
        if (response.status == 200) {
            setStandardCategoryData(response.data.data);
            localStorage.setItem("allStandardCategoryData", JSON.stringify(response.data.data));
            setLoading(false);
        }
    };


    /**
     * Add Standard Category ...
     */
    const addStandardComponentInput = async (reqBody, resetForm) => {
        setMessage("Standard category has been added successfully.");
        try {
            const response = await addStandardComponent(reqBody);
            if (response.data.status === "OK") {
                setShowAlert(true);
                setShowEndPointPop(false);
                resetForm();
                getStandardCategory(43, 24);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false)
            resetForm()
        }
    };

    /**
     *  Analysis Flag Add
     */

    const addAnalysisInputFlag = async (reqBody, resetForm) => {
        setMessage("Analysis Flag has been added successfully.");
        try {
            const response = await addAnalysisFlag(reqBody);
            if (response.data.status === "OK") {
                setShowAlert(true);
                setShowAnalysisPop(false);
                resetForm()
                getAllStandardParameter(43, 24);
            }
        } catch (error) {
            console.log(error);
        }
    };

    /**
     *  Analysis Flag Update
     */
    const updateAnalysisInputFlag = async (reqBody, resetForm) => {
        try {
            setMessage("Analysis Flag has been updated successfully.");
            const response = await updateAnalysisFlag(reqBody);
            if (response.data.status === "OK") {
                setSelectedAnalysis(reqBody)
                resetForm()
                setShowAlert(true);
            }
            getAllStandardParameter(43, 24);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Standard Category Update ..
     */

    const updateStandardComponent = async (reqBody, resetForm) => {
        try {
            setUpdateLoader(true)
            setMessage("Standard category has been updated successfully.");
            const response = await updateStandardComponents(reqBody);
            console.log('calleda edit', response)
            if (response.data.status === "OK") {
                setCategoryRowData(reqBody)
            }
            getStandardCategory(43, 24);
        } catch (error) {
            console.log(error);
        }
        finally {
            resetForm()
            setUpdateLoader(false)
        }
    };

    /**
     * Get All Paramter  ..
     */
    const getAllStandardParameter = async (id, sapVersionId) => {
        setLoading(true);
        const response = await getStandardCategoryParamter(id, sapVersionId);
        console.log("all parametyer",response)
        if (response.status == 200) {
            setParameterData(response.data.data);
            let tempData = JSON.stringify(response.data.data);
            localStorage.setItem("allStandardParameterData", tempData);
            setLoading(false);
        }
    };


    //Parameter Function ...
    const onSubmitParameterComponent = (data, resetForm,updateEditData) => {
        console.log("datadata datadata", data);
        // const updateEditData = analysisFlagRowData;
        // if (updateEditData) {
            // if (isEdit) {
            //     let updateReqBody = {
            //         "standardComponentParameterId": selectedEndpoint?.standardComponentCategoryId,
            //         "standardComponentCategoryGuid": selectedEndpoint?.standardComponentCategoryGuid,
            //         "parentId": selectedEndpoint?.parentId,
            //         "isFolder": selectedEndpoint.isFolder,
            //         "companyId": 1,
            //         "standardComponentCategoryNameShort": data?.shortName,
            //         "standardComponentCategoryNameLong": data?.longName,
            //         "standardComponentCategoryDescription": data?.desc,
            //         "standardComponentCategoryLabel": data?.label,
            //         "displayOrder": 1,
            //         "createdDate": null,
            //         "updatedDate": null,
            //         "updatedBy": "test",
            //         "createdBy": "test",
            //     }
        //     updateAnalysisInputFlag(updateReqBody, resetForm);
        // } else {
        //     if (addType === "file") {
        //         let reqBody = {
        //             sapAnalysisFlagId: 0,
        //             SapAnalysisFlagGuid: "",
        //             companyId: 1,
        //             sapId: 43,
        //             sapVersionId: 24,
        //             parentId: null,
        //             parentGuid: "",
        //             isFolder: false,
        //             analysisFlagNameShort: data.shortName,
        //             analysisFlagNameLong: data.longName,
        //             analysisFlagDescription: data.desc,
        //             analysisFlagVariable: data.variable,
        //             analysisFlagValueInclusion: data.valueForInc,
        //             analysisFlagLabel: data.label,
        //             displayOrder: 1,
        //             createdBy: "test_user",
        //             updatedBy: "test_user",
        //             createdDate: null,
        //             updatedDate: null,
        //             deleted: null,
        //         };
        //         addAnalysisInputFlag(reqBody, resetForm);
        //         setShowAnalysis("");
        //     } else {
        //         let reqBody = {
        //             sapAnalysisFlagId: 0,
        //             SapAnalysisFlagGuid: "",
        //             companyId: 1,
        //             sapId: 43,
        //             sapVersionId: 24,
        //             parentId: null,
        //             parentGuid: "",
        //             isFolder: true,
        //             analysisFlagNameShort: data.shortName,
        //             analysisFlagNameLong: data.longName,
        //             analysisFlagDescription: data.desc,
        //             displayOrder: 1,
        //             createdBy: "test_user",
        //             updatedBy: "test_user",
        //             createdDate: null,
        //             updatedDate: null,
        //             deleted: null,
        //         };
        //         addAnalysisInputFlag(reqBody, resetForm);
        //         setShowAnalysis("");
        //     }
        // }
    };


    //Standard Category Function ...
    const onSubmitCategoryComponent = (data, resetForm, isEdit) => {
        setLoading(true)
        console.log('called function', isEdit)
        console.log("selectedEndpoint", selectedEndpoint);
        console.log('datasadsad', data);
       if (isEdit) { 
            let updateReqBody = {
                "standardComponentCategoryId": selectedEndpoint?.standardComponentCategoryId,
                "standardComponentCategoryGuid": selectedEndpoint?.standardComponentCategoryGuid,
                "parentId": selectedEndpoint?.parentId,
                "isFolder": selectedEndpoint.isFolder,
                "companyId": 1,
                "standardComponentCategoryNameShort": data?.shortName,
                "standardComponentCategoryNameLong": data?.longName,
                "standardComponentCategoryDescription": data?.desc,
                "standardComponentCategoryLabel": data?.label,
                "displayOrder": 1,
                "createdDate": null,
                "updatedDate": null,
                "updatedBy": "test",
                "createdBy": "test",
            }
            updateStandardComponent(updateReqBody, resetForm);
        } else {
            if (addCategoryType === "file") {
                let reqBody = {
                    standardComponentCategoryId: 0,
                    standardComponentCategoryGuid: "",
                    companyId: 1,
                    parentId: parentIdEndpoint,
                    isFolder: false,
                    standardComponentCategoryNameShort: data.shortName,
                    standardComponentCategoryNameLong: data.longName,
                    standardComponentCategoryDescription: data.desc,
                    standardComponentCategoryLabel: data.label,
                    displayOrder: 1,
                    createdBy: "test",
                    updatedBy: "test",
                    createdDate: null,
                    updatedDate: null,
                }
                setLoading(true)
                addStandardComponentInput(reqBody, resetForm);
            } else {
                let reqBody = {
                    standardComponentCategoryId: 0,
                    standardComponentCategoryGuid: "",
                    companyId: 1,
                    parentId: 0,
                    isFolder: true,
                    standardComponentCategoryNameShort: data.shortName,
                    standardComponentCategoryNameLong: data.longName,
                    standardComponentCategoryDescription: data.desc,
                    standardComponentCategoryLabel: data.label,
                    displayOrder: 1,
                    createdBy: "test",
                    updatedBy: "test",
                    createdDate: null,
                    updatedDate: null,
                };
                addStandardComponentInput(reqBody, resetForm);
            }

            setTimeout(() => {
                setLoading(false)
            }, 1000)


        }
    };

    

    useEffect(() => {
        getAllStandardParameter(43, 24);
        getStandardCategory(43, 24);
        setShowAnalysis("");
    }, []);


    const offset = React.useRef({
        left: 0,
        top: 0,
    });

    const [rowIdEnd, setRowIdEnd] = useState('')
    let categoryRowId = localStorage.getItem('categoryRowId') ? localStorage.getItem('categoryRowId') : ''

    const onRowClickCategory = (event, param) => {

        const current_id = param
        if ((current_id.dataItem.standardComponentCategoryId == categoryRowId)) {
            return false;
        }
        setRowIdEnd(param.id)
        setShowEndPoint(true, param, "");
        setSelectedEndpoint(param.dataItem);
        param.selectionChange(event);
        setCategoryRowData(param.dataItem)
        localStorage.setItem('categoryRowId', param.dataItem.standardComponentCategoryId);
        localStorage.setItem("categorySelectedRow", JSON.stringify(param.dataItem));

    };

    const categorySelectedRow = getParsedFromLocalStorage('categorySelectedRow', {});


    useEffect(() => {
        if (Object.keys(categorySelectedRow).length > 0) {
            setCategoryRowData(categorySelectedRow)
            setShowEndPoint(true, {}, "");
            setSelectedEndpoint(categorySelectedRow)
        }
    }, []);


    // const onRowClickParameter = (event, param) => {

    //     const current_id = param
    //     if ((current_id.dataItem.standardComponentParameterId == parameterRowId)) {
    //         return false;
    //     }
    //     setRowIdEnd(param.id)
    //     setShowParameter(true, param, "");
    //     setSelectedEndpoint(param.dataItem);
    //     param.selectionChange(event);
    //     setParameterRowData(param.dataItem)
    //     localStorage.setItem('parameterRowId', param.dataItem.standardComponentParameterId);
    //     localStorage.setItem("parameterSelectedRow", JSON.stringify(param.dataItem));

    // };

    // const parameterSelectedRow = getParsedFromLocalStorage('parameterSelectedRow', {});


    // useEffect(() => {
    //     if (Object.keys(parameterSelectedRow).length > 0) {
    //         setCategoryRowData(parameterSelectedRow)
    //         setShowParameter(true, {}, "");
    //         setSelectedEndpoint(parameterSelectedRow)
    //     }
    // }, []);

    const categoryFolderClick = () => {
        setAddCategoryType('folder');
        setShowEndPointPop(true);

    };

    const categoryItemClick = () => {
        setAddCategoryType('file');
        setShowEndPointPop(true);
    };



    const handleCloseMenuEndpoint = () => {
        setShowEndpointContextMenu(false);
    };


    const handleDetailFolderEndpoint = () => { };

    const handleAddFolderEndpoint = () => {
        setShowEndPointPop(true);
        setAddCategoryType('folder')
        setParentIdEndpoint(categoryRowData.standardComponentCategoryId);

    };
    const handleAddItemEndpoint = () => {
        setShowEndPointPop(true);
        setAddCategoryType('file');
        setParentIdEndpoint(categoryRowData.standardComponentCategoryId);
    };
    const handleEditFolderEndpoint = () => { };


    /**
     * Delete Standard Category ...
     */
    const handleDeleteStandardCategory = async () => {
        try {
            const response = await deleteStandardCategory(
                categoryRowData.standardComponentCategoryId,
                "test"
            );
            if (response.status == 200) {
                getStandardCategory(sapIdEndpoint, sapVersionIdEndpoint);
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    const openContextMenuEndpoint = (dataItem) => {
        if (dataItem.isFolder) {
            setIsFolderStandardComp(true);
        } else {
            setIsFolderStandardComp(false);
        }
        setShowEndpointContextMenu(true);
    };



    const handleOnSelectStandardComponent = (e) => {
        switch (e.item.data.action) {
            case "detailStandardComponentFolder":
                handleDetailFolderEndpoint();
                break;
            case "addStandardComponentFolder":
                handleAddFolderEndpoint();
                break;
            case "addStandardComponentItem":
                handleAddItemEndpoint();
                break;
            case "editStandardComponentFolder":
                handleEditFolderEndpoint();
                break;
            case "deleteStandardComponentFolder":
                setShowDeleteConfirm(true);
                break;
            case "moveToDifferentFolder":
                setShowMoveToDifferentFolderModal(true);
                break;
            default:
        }
        setShowEndpointContextMenu(false);
    };


    // flag
    const [showAnalysisFlagContextMenu, setShowAnalysisFlagContextMenu] =
        useState(false);
    const handleCloseMenu = () => {
        setShowAnalysisFlagContextMenu(false);
    };
    const handleDetailFolder = () => { };
    const handleAddFolder = () => {
        setShowAnalysisPop(true);
        setAddType('folder')
        setParentIdAnalysisFlag(analysisFlagRowData.sapAnalysisFlagId);
    };
    const handleAddItem = () => {
        setShowAnalysisPop(true);
        setAddType('file');
        setParentIdAnalysisFlag(analysisFlagRowData.sapAnalysisFlagId);
    };
    const handleEditFolder = () => {

    };
    const handleDeleteFolder = async () => {
        const response = await deleteAnalysisFlag(
            analysisFlagRowData.sapAnalysisFlagGuid,
            "test"
        );
        if (response.status == 200) {
            getAllStandardParameter(sapIdAnalysis, sapVersionIdAnalysis);
        }
    };

    const handleOnSelect = (e) => {
        switch (e.item.data.action) {
            case "detailFolder":
                handleDetailFolder();
                break;
            case "addFolder":
                handleAddFolder();
                break;
            case "addItem":
                handleAddItem();
                break;
            case "editFolder":
                handleEditFolder();
                break;
            case "deleteFolder":
                handleDeleteFolder();
                break;
            case "moveToDifferentFolder":
                setShowMoveToDifferentFolderModalAnaFlag(true);
                break;
            default:
        }
        setShowAnalysisFlagContextMenu(false);
    };
    const [rowId, setRowId] = useState('')
    let analysisRowId = localStorage.getItem('analysisRowId') ? localStorage.getItem('analysisRowId') : ''
    const onRowClickFlag = (event, param) => {
        const current_id = param
        if ((current_id.dataItem.sapAnalysisFlagId == analysisRowId)) {
            return false;
        }
        setRowId(param.id)
        setShowAnalysis(true, param, "");
        setSelectedAnalysis(param.dataItem);
        param.selectionChange(event);
        setAnalysisFlagRowData(param.dataItem);
        setAddType('');
        localStorage.setItem('analysisRowId', param.dataItem.sapAnalysisFlagId);
        localStorage.setItem("analysisSelectedRow", JSON.stringify(param.dataItem));
    };

    const analysisSelectedRow = getParsedFromLocalStorage('analysisSelectedRow', {});

    useEffect(() => {
        if (Object.keys(analysisSelectedRow).length > 0) {
            setSelectedAnalysis(analysisSelectedRow)
            setShowAnalysis(true, {}, "");
        }
    }, []);

    const flagFolderClick = () => {
        setAddType('folder');
        setShowAnalysisPop(true)
    };
    const flagItemClick = () => {
        setAddType('file');
        setShowAnalysisPop(true)
    };

    const openContextMenuFlag = (dataItem) => {
        if (dataItem.isFolder) {
            setIsFolderAnalysisFlag(true);
        } else {
            setIsFolderAnalysisFlag(false);
        }
        setShowAnalysisFlagContextMenu(true);
    };


    return (
        <>
            <div className="main">

                <div className={isActive ? 'main_menu sidebar menuexpand' : 'main_menu sidebar'} id="sidebar">
                    <div className="main_menu_child">
                        <div className="sidebar_top">

                            <h4><Link to="/">Arcsine Analytics</Link></h4>
                            <Link onClick={() => handleToggle()} to="#" className="sidebar_btn">
                                <i
                                    className={
                                        isActive
                                            ? "fa-solid fa-circle-arrow-right"
                                            : "fa-solid fa-circle-arrow-left"
                                    }
                                ></i>
                            </Link>
                        </div>
                        <div className="sidebar_breadcrumb">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/"><i className="fas fa-sharp fa-light fa-house me-3"></i>
                                        <span>Home</span></Link></li>
                                    <li className="breadcrumb-item-inner link-unexpand"><Link to="/global-standards">\ Global Standards</Link></li>
                                </ol>
                            </nav>
                        </div>
                        <ul className="sidebar_list" >
                            <li className={`${splitLocation[1] === 'analysis-standards' ? 'active' : ''}`}>
                                <Link to="/analysis-standards" >
                                    <i className="fas fa-sharp fa-light fa-chart-line"></i>
                                    <span>Analysis Standards</span></Link>
                            </li>
                            <li className={`${splitLocation[1] === 'controlledterminology-global' ? 'active' : ''}`} >
                                <Link to="/controlledterminology-global" >
                                    <i className="fas fa-sharp fa-light fa-book-open"></i>
                                    <span>Controlled Terminology</span></Link>
                            </li>
                            <li className={`${splitLocation[1] === 'standard-components' ? 'active' : ''}`} >
                                <Link to="/standard-components" >
                                    <i class="fa-solid fa-puzzle-piece"></i>
                                    <span>Standard Components</span></Link>
                            </li>




                        </ul>
                        <div className="sidebar_bottom ">
                            <ul
                                className="sidebar_list_bottom position-absolute bottom-0 start-0 w-100 "
                                style={{ maxHeight: "20vh" }}
                            >
                                <li title="user-profile">
                                    <Link
                                        to="#"
                                        style={{ marginLeft: "25px", marginRight: "25px" }}
                                    >
                                        <i class="fa-solid fa-id-card"></i>
                                        <span>User Profile</span>
                                    </Link>
                                </li>
                                <li
                                //title={`Vesion (${version})`}
                                >
                                    <Link
                                        title={`Version (${version})`}
                                        to="#"
                                        style={{ marginLeft: "25px", marginRight: "25px" }}
                                    >
                                        <i class="fa-solid fa-code-compare"></i>
                                        <Version />
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>

                </div>
                <div className={isActive ? ' main_section bodyexpand' : 'main_section'} >

                    <Splitter
                        style={{
                            height: "100%",
                        }}
                        panes={panes}
                        orientation={"horizontal"}
                        onChange={(event) => onChange(event, setPanes)}
                        scrollable={false}
                    >
                        <div className="mt-4 tab_custom">
                            <TabStrip selected={selected} onSelect={handleSelect}>
                                <TabStripTab title="Category">
                                    <div style={{ position: "relative", height: "100vh" }}>
                                        {loading && <CustomLoader />}
                                        <DynamicTreeList
                                            title="Standard Categories"
                                            data={allStandardCategoryData}
                                            id="standardComponentCategoryId"
                                            guid="standardComponentCategoryGuid"
                                            col_field="standardComponentCategoryNameShort"
                                            onRowClick={onRowClickCategory}
                                            onFolderClick={categoryFolderClick}
                                            onItemClick={categoryItemClick}
                                            setSelectedRow={setCategoryRowData}
                                            offset={offset}
                                            openContextMenu={openContextMenuEndpoint}
                                            localKey="categorySelected"
                                            icon="fas fa-sharp fa-light fa-syringe"
                                        />
                                    </div>
                                </TabStripTab>
                                <TabStripTab title="Parameter">
                                    <div style={{ position: "relative", height: "100vh" }}>
                                        {loading && <CustomLoader />}
                                        <DynamicTreeList
                                            title="Parameter"
                                            data={allStandardParameterData}
                                            id="standardComponentParameterId"
                                            guid="standardComponentParameterGuid"
                                            col_field="standardComponentParameterNameShort"
                                            onRowClick={onRowClickFlag}
                                            onFolderClick={flagFolderClick}
                                            onItemClick={flagItemClick}
                                            setSelectedRow={setAnalysisFlagRowData}
                                            offset={offset}
                                            openContextMenu={openContextMenuFlag}
                                            localKey="paramterSelected"
                                            icon="fa-regular fa-flag"
                                        // icon="fa-solid fa-stethoscope"
                                        />
                                    </div>
                                </TabStripTab>
                            </TabStrip>
                        </div>
                        <pan>
                            {tab == "category" && (
                                <CategoryForm
                                    showEndpoint={showEndPoint}
                                    categoryRowData={categoryRowData}
                                    getStandardCategory={getStandardCategory}
                                    setShowEndPoint={handleShowEndPoint}
                                    setShowEndPointPop={setShowEndPointPop}
                                    showAddEndpointPop={showAddEndPointPop}
                                    selectedEndpoint={selectedEndpoint}
                                    addCategoryType={addCategoryType}
                                    onSubmitCategoryComponent={onSubmitCategoryComponent}
                                    loading={loading}
                                    updateLoader={updateLoader }
                                />
                            )}

                            {tab == "parameter" && (
                                <ParamterForm
                                    showAnalysis={showAnalysis}
                                    analysisRowData={analysisFlagRowData}
                                    getAllStandardParameter={getAllStandardParameter}
                                    setShowParameter={handleShowParameter}
                                    showAddAnalysisPop={showAddAnalysisPop}
                                    setShowAnalysisPop={setShowAnalysisPop}
                                    selectedAnalysis={selectedAnalysis}
                                    addType={addType}
                                    loading={loading}
                                    onSubmitParameterComponent={onSubmitParameterComponent}
                                />
                            )}
                        </pan>
                    </Splitter>

                    <ContextMenu
                        show={showAnalysisFlagContextMenu}
                        offset={offset.current}
                        onSelect={handleOnSelect}
                        onClose={handleCloseMenu}
                        className="context-menu"

                    >
                        <MenuItem
                            text={`Delete`}
                            data={{
                                action: "deleteFolder",
                            }}
                            icon="delete"
                        />

                        {isFolderAnalysisFlag && <MenuItem
                            text={`Add Item`}
                            data={{
                                action: "addItem",
                            }}

                        />}
                        {isFolderAnalysisFlag && <MenuItem
                            text={`Add Folder`}
                            data={{
                                action: "addFolder",
                            }}
                            cssClass="separator"

                        />}
                        <MenuItem
                            text={`Move to Different Folder`}
                            data={{
                                action: "moveToDifferentFolder",
                            }}
                        />
                        <MenuItem
                            text={`Move Up within Folder`}
                            data={{
                                action: "moveUpWithinFolder",
                            }}
                        />
                        <MenuItem
                            text={`Move Down within Folder`}
                            data={{
                                action: "moveDownWithinFolder",
                            }}
                        />
                    </ContextMenu>
                    <ContextMenu
                        show={showEndpointContextMenu}
                        offset={offset.current}
                        onSelect={handleOnSelectStandardComponent}
                        onClose={handleCloseMenuEndpoint}
                        className="context-menu"

                    >
                        <MenuItem
                            text={`Delete`}
                            data={{
                                action: "deleteStandardComponentFolder",
                            }}
                            icon="delete"
                        />
                        {isFolderStandardComp &&
                            <MenuItem
                                text={`Add Item`}
                                data={{
                                    action: "addStandardComponentItem",
                                }}
                                icon="file"
                            />
                        }
                        {isFolderStandardComp &&
                            <MenuItem
                                text={`Add Folder`}
                                data={{
                                    action: "addStandardComponentFolder",
                                }}
                                icon="folder"
                                cssClass="separator"

                            />
                        }
                        <MenuItem
                            text={`Move to Different Folder`}
                            data={{
                                action: "moveToDifferentFolder",
                            }}
                        />
                        <MenuItem
                            text={`Move Up within Folder`}
                            data={{
                                action: "moveUpWithinFolder",
                            }}
                        />
                        <MenuItem
                            text={`Move Down within Folder`}
                            data={{
                                action: "moveDownWithinFolder",
                            }}
                        />

                    </ContextMenu>

                    <SweetAlert
                        show={showAlert}
                        success
                        title="Success"
                        onConfirm={() => {
                            setShowAlert(false);
                            setMessage("");
                        }}
                    >
                        {message}
                    </SweetAlert>

                    <SweetAlert
                        show={showDeleteConfirm}
                        danger
                        showCancel
                        cancelBtnText="No"
                        confirmBtnText="Yes"
                        confirmBtnBsStyle="primary"
                        cancelBtnBsStyle="secondary"
                        title="Are you sure?"
                        onConfirm={() => {
                            handleDeleteStandardCategory();
                            setShowDeleteConfirm(false);
                        }}
                        onCancel={() => {
                            setShowDeleteConfirm(false);
                        }}
                        focusCancelBtn
                    >
                        Do you want to delete this category?
                    </SweetAlert>

                    {showMoveToDifferentFolderModal && <EndpointMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModal} />}
                    {showMoveToDifferentFolderModalAnaFlag && <AnalysisFlagMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModalAnaFlag} />}

                </div>
            </div>

        </>
    );
};

export default StandardComponents;
