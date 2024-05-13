import {
  ContextMenu,
  MenuItem,
  Splitter,
  TabStrip,
  TabStripTab,
} from "@progress/kendo-react-layout";
import React, { useEffect, useState } from "react";
import {getIdFromString, getParsedFromLocalStorage, onChange } from "../../../../../utils/common-helper";
import CustomLoader from "../../../../../utils/Loaders/CustomLoader";
import SapTreeList from "../../../SapTreeList";
import {
  EndpointsData,
  VariablesData,
  analysisSet,
  treatments,
} from "../../../../../flat-data";
import {
  getAnalysisFlagInput,
  addAnalysisFlag,
  getSapEndpointInput,
  getSapAnalysisFlag,
  addEndPoint,
  updateEndPoint,
  updateAnalysisFlag,
  addEndpoint,
  deleteEndpoint,
  deleteAnalysisFlag,
} from "../../../../../services/statistical-analysis-plan-service";
import AnalysisFlag from "./AnalysisFlag";
import EndPointForm from "./EndPointForm";
import AnalysisFlagForm from "./AnalysisFlagForm";
import EndPointInput from "../Data/EndPointInput";
import EndPoint from "./EndPoint";
import SweetAlert from "react-bootstrap-sweetalert";
import DynamicTreeList from "../../../../../components/common/DynamicTreeList";
import { useFormik } from "formik";
import MoveToDifferentFolder from "../Data/MoveToDifferentFolderModal";
import EndpointMoveToDifferentFolderModal from "./EndpointMoveToDifferentFolderModal";
import AnalysisFlagMoveToDifferentFolderModal from "./AnalysisFlagMoveToDifferentFolderModal";

const EndpointAnalysisFlag = () => {
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
  const [selected, setSelected] = React.useState(0);
  const [tab, setTab] = useState("endpoint");
  const [selectedEndpoint, setSelectedEndpoint] = useState({});
  const [selectedAnalysis, setSelectedAnalysis] = useState({});
  const [showAnalysis, setShowAnalysis] = useState("");
  const [showAnalysisForm, setShowAnalysisForm] = useState(false);
  const [showEndPoint, setShowEndPoint] = useState("");
  const [isFolderEndpoint, setIsFolderEndpoint] = useState(false);
  const [isFolderAnalysisFlag, setIsFolderAnalysisFlag] = useState(false);
  const [showEndPointForm, setShowEndPointForm] = useState(false);
  const [showAddAnalysisPop, setShowAnalysisPop] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [parentIdEndpoint, setParentIdEndpoint] = useState(null);
  const [parentIdAnalysisFlag, setParentIdAnalysisFlag] = useState(null);


  
  const [addType, setAddType] = useState("");
  const [addEndType, setAddEndType] = useState("");
  const [endpointData, setEndpointData] = React.useState([]);
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [analysisFlagRowData, setAnalysisFlagRowData] = useState();
  const [endpointRowData, setEndpointRowData] = useState();
  const [loading, setLoading] = useState(false);
  const [showAddEndPointPop, setShowEndPointPop] = useState(false);
  const dataEndpoint = JSON.parse(localStorage.getItem("dataEndpoint")) || [];
  const sapIdEndpoint = dataEndpoint?.sapId || 43;
  const sapVersionIdEndpoint = dataEndpoint?.sapVersionId || 24;
  const dataAnalysisFlag = JSON.parse(localStorage.getItem("dataAnalysisFlag"));
  const sapIdAnalysis = dataAnalysisFlag?.sapId || 43;
  const sapVersionIdAnalysis = dataAnalysisFlag?.sapVersionId || 24;
  const handleSelect = (e) => {
    setSelected(e.selected);
    if (e.selected == 0) {
      setTab("endpoint");
      setLoading(false);
      setShowAnalysis(false)
    } else {
      setTab("analysisFlag");
      setLoading(false);
    }
  };

  const handleShowAnalysis = (isTrue, rowData, type) => {
    setShowAnalysis(isTrue);
    setAnalysisFlagRowData(rowData);
    setAddType(type);
  };

  const handleShowEndPoint = (isTrue, rowData, type) => {
    setShowEndPoint(isTrue);
    setEndpointRowData(rowData);
    setAddEndType(type);
  };

  const [analysisFlag, setAnalysisFlag] = useState([]);
  const getEndpoint = async (id, sapVersionId) => {
    setLoading(true);
    const response = await getSapEndpointInput(id, sapVersionId);
    if (response.status == 200) {
      localStorage.setItem("dataEndpoint", JSON.stringify(response.data.data));
      setEndpointData(response.data.data);
      setLoading(false);
    }
  };
  const addEndPointInput = async (reqBody, resetForm) => {
    setMessage("Endpoint has been added successfully.");
    try {
      const response = await addEndpoint(reqBody);
      if (response.data.status === "OK") {
        setShowAlert(true);
        setShowEndPointPop(false);
        resetForm();
        getEndpoint(43, 24)
        // getSapEndpointInput(43, 24);
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
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
        getAnalysisFlag(43, 24);
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
      // alert(1)
      setMessage("Analysis Flag has been updated successfully.");
      const response = await updateAnalysisFlag(reqBody);
      if (response.data.status === "OK") {
        setSelectedAnalysis(reqBody)
        resetForm()
        setShowAlert(true);
      }
      getAnalysisFlag(43, 24);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * End Point Update ..
   */

  const updateEndPointInput = async (reqBody) => {
    try {
      const response = await updateEndPoint(reqBody);
      if (response.data.status === "OK") {
        setMessage("Analysis Flag has been updated successfully.");
      }
      getEndpoint(43, 24);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (data, resetForm) => {
    console.log("datadata datadata", data);
    const updateEditData = analysisFlagRowData;

    if (updateEditData) {
      let updateReqBody = {
        sapAnalysisFlagId: updateEditData?.sapAnalysisFlagId,
        SapAnalysisFlagGuid: updateEditData?.sapAnalysisFlagGuid,
        companyId: 1,
        sapId: 43,
        sapVersionId: 24,
        parentId: updateEditData?.parentId,
        parentGuid: updateEditData?.parentGuid,
        isFolder: updateEditData?.isFolder,
        analysisFlagNameShort:
          data.shortName || updateEditData?.analysisFlagNameShort,
        analysisFlagNameLong:
          data.longName || updateEditData?.analysisFlagNameLong,
        analysisFlagDescription:
          data.desc || updateEditData?.analysisFlagDescription,
        analysisFlagVariable:
          data.variable || updateEditData?.analysisFlagVariable,
        analysisFlagValueInclusion:
          data.valueForInc || updateEditData?.analysisFlagValueInclusion,
        analysisFlagLabel: data.label || updateEditData?.analysisFlagLabel,
        displayOrder: 1,
        createdBy: "test_user",
        updatedBy: "test_user",
        createdDate: null,
        updatedDate: null,
        deleted: false,
      };
      updateAnalysisInputFlag(updateReqBody, resetForm);
    } else {
      if (addType === "file") {
        let reqBody = {
          sapAnalysisFlagId: 0,
          SapAnalysisFlagGuid: "",
          companyId: 1,
          sapId: 43,
          sapVersionId: 24,
          parentId: null,
          parentGuid: "",
          isFolder: false,
          analysisFlagNameShort: data.shortName,
          analysisFlagNameLong: data.longName,
          analysisFlagDescription: data.desc,
          analysisFlagVariable: data.variable,
          analysisFlagValueInclusion: data.valueForInc,
          analysisFlagLabel: data.label,
          displayOrder: 1,
          createdBy: "test_user",
          updatedBy: "test_user",
          createdDate: null,
          updatedDate: null,
          deleted: null,
        };
        addAnalysisInputFlag(reqBody, resetForm);
        setShowAnalysis("");
      } else {
        let reqBody = {
          sapAnalysisFlagId: 0,
          SapAnalysisFlagGuid: "",
          companyId: 1,
          sapId: 43,
          sapVersionId: 24,
          parentId: null,
          parentGuid: "",
          isFolder: true,
          analysisFlagNameShort: data.shortName,
          analysisFlagNameLong: data.longName,
          analysisFlagDescription: data.desc,
          displayOrder: 1,
          createdBy: "test_user",
          updatedBy: "test_user",
          createdDate: null,
          updatedDate: null,
          deleted: null,
        };
        addAnalysisInputFlag(reqBody, resetForm);
        setShowAnalysis("");
      }
    }
  };

  const onSubmitEndPoint = (data, resetForm, setLoading, isEdit) => {
    console.log("selectedEndpoint", selectedEndpoint);
    console.log('data', data);    
    if (isEdit) {
      let updateReqBody = {
        "sapEndpointId": selectedEndpoint?.sapEndpointId,
        "sapEndpointGuid": selectedEndpoint?.sapEndpointGuid,
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 24,
        "parentId": selectedEndpoint?.parentId,
        "parentGuid": selectedEndpoint?.parentGuid,
        "isFolder": selectedEndpoint.isFolder,
        "endpointNameShort": data?.shortName,
        "endpointNameLong": data?.longName,
        "endpointDescription": data?.desc,
        "endpointLabel": data?.label,
        "endpointResponseVariableId": data?.responseVariable,
        "endpointResponseVariableIdOld": null,
        "endpointBaselineType": selectedEndpoint.endpointResponseVariableIdOld,
        "dataTypeId": data?.endpointType,
        "displayOrder": 1,
        "createdDate": "2024-03-07T05:07:02.681Z",
        "updatedDate": "2024-03-07T05:07:02.681Z",
        "updatedBy": "string",
        "createdBy": "string",
        "deleted": true,
        "sapDataDatasetEndpointInputDTOs": [
          {
            "sapDataDatasetEndpointId": 0,
            "sapDataDatasetEndpointGuid": "",
            "companyId": 1,
            "sapId": 43,
            "sapVersionId": 24,
            // "sapDataCollectionId": getIdFromString(data?.dataCollection),
            "sapDataCollectionId": getIdFromString(data?.dataCollection),
            "sapDataDatasetId":  getIdFromString(data?.dataSet),
            // "sapDataDatasetId":  getIdFromString(data?.dataSet),
            "sapDataEndpointId": 0,
            "createdBy": "string",
            "updatedBy": "string",
            "createdDate": "2024-03-07T05:07:02.681Z",
            "updatedDate": "2024-03-07T05:07:02.681Z",
            "deleted": false,
            "displayOrder": 1
          }
        ]
      }
      updateEndPointInput(updateReqBody, resetForm);
    } else {
      if (addEndType === "file") {
        let reqBody = {
          "sapEndpointId": 0,
          "sapEndpointGuid": "",
          "companyId": 1,
          "sapId": 43,
          "sapVersionId": 24,
          "parentId": null,
          "parentGuid": "string",
          "isFolder": false,
          "endpointNameShort": data?.shortName,
          "endpointNameLong": data?.longName,
          "endpointDescription": data?.desc,
          "endpointLabel": data?.label,
          "endpointResponseVariableId": data?.responseVariable,
          "endpointResponseVariableIdOld": null,
          "endpointBaselineType": data?.baseLineType,
          "dataTypeId": data?.endpointType,
          "displayOrder": 1,
          "createdDate": null,
          "updatedDate": null,
          "updatedBy": null,
          "createdBy": null,
          "deleted": null,
          "sapDataDatasetEndpointInputDTOs": [
            {
              "sapDataDatasetEndpointId": 0,
              "sapDataDatasetEndpointGuid": "",
              "companyId": 1,
              "sapId": 43,
              "sapVersionId": 24,
              "sapDataCollectionId": getIdFromString(data?.dataCollection),
              "sapDataDatasetId": getIdFromString(data?.dataSet),
              "sapDataEndpointId": 0,
              "createdBy": "test",
              "updatedBy": "test",
              "createdDate": "2024-03-06T19:32:10.552Z",
              "updatedDate": "2024-03-06T19:32:10.552Z",
              "deleted": null,
              "displayOrder": 1
            }
          ]
        }
        setLoading(true)
        addEndPointInput(reqBody, setLoading);
        setShowEndPoint("");
      } else {
        let reqBody = {
          sapEndpointId: 0,
          sapEndpointGuid: "",
          companyId: 1,
          sapId: 43,
          sapVersionId: 24,
          parentId: null,
          parentGuid: "",
          isFolder: true,
          endpointNameShort: data.shortName,
          endpointNameLong: data.longName,
          endpointDescription: data.desc,
          endpointVariable: "",
          endpointBaselineType: data.baseLineType,
          endpointResponseVariableId: data.responseVariable,
          endpointLabel: "",
          dataTypeId: 50,
          sapDataDatasetId: 0,
          sapDataCollectionId: 0,
          displayOrder: 21,
          createdBy: "test",
          updatedBy: "test",
          createdDate: null,
          updatedDate: null,
        };
        addEndPointInput(reqBody, resetForm);
        setShowEndPoint("");
      }
    }
    
  
    setTimeout(() => {
      getEndpoint(43, 24);
    }, 2000);
  };

  /**
   * Get Analysis Flag ..
   */
  const getAnalysisFlag = async (id, sapVersionId) => {
    setLoading(true);
    const response = await getSapAnalysisFlag(id, sapVersionId);
    if (response.status == 200) {
      setAnalysisFlag(response.data.data);
      setLoading(false);
      let tempData = JSON.stringify(response.data.data);
      localStorage.setItem("dataAnalysisFlag", tempData);
    }
  };

  useEffect(() => {
    getAnalysisFlag(43, 24);
    getEndpoint(43, 24);
    setShowAnalysis("");
  }, []);

  const offset = React.useRef({
    left: 0,
    top: 0,
  });

  const [rowIdEnd, setRowIdEnd] = useState('')
  let endRowId = localStorage.getItem('endRowId') ? localStorage.getItem('endRowId') : ''
  const onRowClickEndpoint = (event, param) => {
    const current_id = param
    if ((current_id.dataItem.sapEndpointId == endRowId)) {
      return false;
    }
    setRowIdEnd(param.id)
    setShowEndPoint(true, param, "");
    setSelectedEndpoint(param.dataItem);
    param.selectionChange(event);
    setEndpointRowData(param.dataItem)
    localStorage.setItem('endRowId', param.dataItem.sapEndpointId);
    localStorage.setItem("endpointSelectedRow", JSON.stringify(param.dataItem));
  };

  const endpointSelectedRow = getParsedFromLocalStorage('endpointSelectedRow', {});
  useEffect(() => {
    if (Object.keys(endpointSelectedRow).length > 0) {
      setEndpointRowData(endpointSelectedRow)
      setShowEndPoint(true, {}, "");
      setSelectedEndpoint(endpointSelectedRow)
    }
  }, []);

  const endpointFolderClick = () => {
    setAddEndType('folder');
    setShowEndPointPop(true);

  };
  const endpointItemClick = () => {
    setAddEndType('file');
    setShowEndPointPop(true);
  };

  const [showEndpointContextMenu, setShowEndpointContextMenu] =
  useState(false);
const handleCloseMenuEndpoint = () => {
  setShowEndpointContextMenu(false);
};
const handleDetailFolderEndpoint = () => {};
const handleAddFolderEndpoint = () => {
    setShowEndPointPop(true);
    setAddEndType('folder')
    setParentIdEndpoint(endpointRowData.sapEndpointId);
  
};
const handleAddItemEndpoint = () => {
  setShowEndPointPop(true);
  setAddEndType('file');
  setParentIdEndpoint(endpointRowData.sapEndpointId);
};
const handleEditFolderEndpoint = () => {};

const handleDeleteFolderEndpoint = async () => {
  const response = await deleteEndpoint(
    endpointRowData.sapEndpointGuid,
    "test"
  );
  if (response.status == 200) {
    getEndpoint(sapIdEndpoint,sapVersionIdEndpoint);
  }
};
const openContextMenuEndpoint = (dataItem) => {
  if (dataItem.isFolder) {
    setIsFolderEndpoint(true);
  } else {
    setIsFolderEndpoint(false);
  }
  setShowEndpointContextMenu(true);
};
const [showMoveToDifferentFolderModal, setShowMoveToDifferentFolderModal] = useState(false);
const [showMoveToDifferentFolderModalAnaFlag, setShowMoveToDifferentFolderModalAnaFlag] = useState(false);

const handleOnSelectEndpoint = (e) => {
  switch (e.item.data.action) {
    case "detailEndpointFolder":
      handleDetailFolderEndpoint();
      break;
    case "addEndpointFolder":
      handleAddFolderEndpoint();
      break;
    case "addEndpointItem":
      handleAddItemEndpoint();
      break;
    case "editEndpointFolder":
      handleEditFolderEndpoint();
      break;
    case "deleteEndpointFolder":
      handleDeleteFolderEndpoint();
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
  const handleDetailFolder = () => {};
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
      getAnalysisFlag(sapIdAnalysis,sapVersionIdAnalysis);
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
            <TabStripTab title="Endpoints">
              <div style={{ position: "relative", height: "100vh" }}>
                {loading && <CustomLoader />}
                <DynamicTreeList
                  title="Endpoints"
                  data={dataEndpoint}
                  id="sapEndpointId"
                  guid="sapEndpointGuid"
                  col_field="endpointNameShort"
                  onRowClick={onRowClickEndpoint}
                  onFolderClick={endpointFolderClick}
                  onItemClick={endpointItemClick}
                  setSelectedRow={setEndpointRowData}
                  offset={offset}
                  openContextMenu={openContextMenuEndpoint}
                  localKey="endpointSelected"
                  icon="fas fa-sharp fa-light fa-syringe"
                />
              </div>
            </TabStripTab>
            <TabStripTab title="Analysis Flag">
              <div style={{ position: "relative", height: "100vh" }}>
                {loading && <CustomLoader />}
                <DynamicTreeList
                  title="Analysis Flag"
                  data={analysisFlag}
                  id="sapAnalysisFlagId"
                  guid="sapAnalysisFlagGuid"
                  col_field="analysisFlagNameShort"
                  onRowClick={onRowClickFlag}
                  onFolderClick={flagFolderClick}
                  onItemClick={flagItemClick}
                  setSelectedRow={setAnalysisFlagRowData}
                  offset={offset}
                  openContextMenu={openContextMenuFlag}
                  localKey="analysisSelected"
                  icon="fa-regular fa-flag"
                  // icon="fa-solid fa-stethoscope"
                />
              </div>
            </TabStripTab>
          </TabStrip>
        </div>
        <pan>
          {tab == "endpoint" && (
            <EndPointForm
              showEndpoint={showEndPoint}
              endpointRowData={endpointRowData}
              getEndpoint={getEndpoint}
              setShowEndPoint={handleShowEndPoint}
              setShowEndPointPop={setShowEndPointPop}
              showAddEndpointPop={showAddEndPointPop}
              selectedEndpoint={selectedEndpoint}
              addEndType={addEndType}
              onSubmitEndPoint={onSubmitEndPoint}
            />
          )}

          {tab == "analysisFlag" && (
            <AnalysisFlagForm
              showAnalysis={showAnalysis}
              analysisRowData={analysisFlagRowData}
              getAnalysisFlag={getAnalysisFlag}
              setShowAnalysis={handleShowAnalysis}
              showAddAnalysisPop={showAddAnalysisPop}
              setShowAnalysisPop={setShowAnalysisPop}
              selectedAnalysis={selectedAnalysis}
              addType={addType}
              onSubmit={onSubmit}
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
        onSelect={handleOnSelectEndpoint}
        onClose={handleCloseMenuEndpoint}
        className="context-menu"

      >
        <MenuItem
          text={`Delete`}
          data={{
            action: "deleteEndpointFolder",
          }}
          icon="delete"
        />
        {isFolderEndpoint && 
        <MenuItem
         text={`Add Item`}
          data={{
            action: "addEndpointItem",
          }}
          icon="file"
        /> 
        }
        {isFolderEndpoint && 
        <MenuItem
         text={`Add Folder`}
          data={{
            action: "addEndpointFolder",
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
      {showMoveToDifferentFolderModal && <EndpointMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModal} />}
      {showMoveToDifferentFolderModalAnaFlag && <AnalysisFlagMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModalAnaFlag} />}

    </>
  );
};

export default EndpointAnalysisFlag;
