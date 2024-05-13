import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Version from "../../components/layout/Version";
import StatisticalAnalysisPlan from "./StatisticalAnalysisPlan";
import AnalysisDefination from "./selected-statistical-analysis-plan/AnalysisDefination/Index";
import { printText } from "../../utils/common-helper";
import EndpointAnalysisFlag from "./selected-statistical-analysis-plan/AnalysisDefination/EndpointAnalysisFlag/Index";

const Sap = () => {
  const version = process.env.REACT_APP_VERSION;

  const [isActive, setActive] = React.useState(false);
  const [sapItem, setSapItem] = React.useState(
    JSON.parse(localStorage.getItem("sapDataItem")) || {}
  );
  const roleName =  JSON.parse(localStorage.getItem("SapDataId")) || {};
  console.log("14", roleName.roleName)
  const [showSap, setShowSap] = useState(true);
  const [showAnDef, setShowAnDef] = useState(false);
  const [showEndpointAnalysisFlag, setShowEndpointAnalysisFlag] =
    useState(false);
  const [showData, setShowData] = useState(false);
  const [showGeneral, setShowGeneral] = useState(false);
  const [showAnSet, setAnSet] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [showSubGroups, setShowSubGroups] = useState(false);
  const [checkedVersion, setCheckedVersion] = useState("");
  const [sapVersionNameShort, setSapVersionNameShort] = useState("");
  const handleToggle = () => {
    setActive(!isActive);
  };

  useEffect(() => {
    // localStorage.removeItem("sapDataItem");
    const sapVersionNumber = localStorage.getItem("sapVersionNumber");
    if (typeof sapVersionNumber === "undefined" || sapVersionNumber == null) {
      setCheckedVersion("");
      // alert(1)
    } else {
      setCheckedVersion(sapVersionNumber);
      // alert(1)
    }
    console.log("sapVersionNumber", sapVersionNumber);
    return () => {
      // localStorage.removeItem("sapDataItem");
    };
  }, []);
  const render = (setState) => {
    setState(true);
  };
  return (
    <div className="main">
      <div
        className={
          isActive ? "main_menu sidebar menuexpand" : "main_menu sidebar"
        }
        id="sidebar"
      >
        <div className="main_menu_child">
          <div className="sidebar_top">
            <h4>
              <Link to="/">Arcsine Analytics</Link>
            </h4>
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
                <li className="breadcrumb-item">
                  <Link to="/">
                    <i className="fas fa-sharp fa-light fa-house me-3"></i>
                    <span>Home</span>
                  </Link>
                </li>
                <li
                  className="breadcrumb-item-inner link-unexpand"
                  onClick={() => {
                    setShowAnDef(false);
                    setShowEndpointAnalysisFlag(false);
                    setShowData(false);
                    setShowGeneral(false);
                    setAnSet(false);
                    setShowVisit(false);
                    setShowSap(true);
                  }}
                >
                  {(showSap || showAnDef) && (
                    <Link>\ Statistical Analysis</Link>
                  )}
                </li>
                {showAnDef ? (
                  <li
                    className="breadcrumb-item-inner2"
                    onClick={() => {
                      setShowData(true);
                      setAnSet(false);
                      setShowEndpointAnalysisFlag(false);
                      setShowVisit(false);
                    }}
                  >
                    {" "}
                    <Link>\ Analysis Defination</Link>
                  </li>
                ) : (
                  ""
                )}
                {/* {showAnSet && (!showSap || !showAnDef || showEndpointAnalysisFlag || showVisit) ? <li 
                  className="breadcrumb-item-inner2"
                  onClick={()=>{
                  setAnSet(true)
                  setShowData(false)
                  setShowEndpointAnalysisFlag(false)
                  setShowVisit(false)
                  }}>
                   <Link >\ Analysis Set and Treatment</Link></li>: ''} */}
                {/* {showVisit && (!showSap || !showAnDef || showAnSet || showEndpointAnalysisFlag) ? <li 
                  className="breadcrumb-item-inner2"
                  onClick={()=>{
                  setAnSet(false)
                  setShowData(false)
                  setShowEndpointAnalysisFlag(false)
                  setShowVisit(true)
                  }}>
                   <Link >\ Visits</Link></li>: ''} */}
                {/* {showEndpointAnalysisFlag && (!showSap || !showAnDef || showAnSet || showVisit) ? <li 
                  className="breadcrumb-item-inner2"
                  onClick={()=>{
                  setAnSet(false)
                  setShowData(false)
                  setShowEndpointAnalysisFlag(true)
                  setShowVisit(false)
                  }}>
                   <Link >\ Endpoint, Analysis Flag</Link></li>: ''} */}
              </ol>
            </nav>
          </div>
          {Object.keys(sapItem).length === 0 && (
            <div
              style={{
                borderTop: "2px solid gray",
                borderBottom: "2px solid gray",
                padding: "15px 0px 5px 0px",
              }}
              className="sidebar_breadcrumb"
            >
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item-inner">
                    <Link to="#">{sapItem.sapNameShort}</Link>
                  </li>
                  <li className="breadcrumb-item-inner ">
                    <Link to="#">
                      <i className="fa-solid fa-folder-tree"></i>
                      <span className="ms-3">SAP not selected.</span>
                      <br />
                      <span >Please select SAP on the right.</span>
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
          )}
          {Object.keys(sapItem).length > 0 && (
            <div
              style={{
                borderTop: "2px solid gray",
                borderBottom: "2px solid gray",
                padding: "15px 0px 5px 0px",
              }}
              className={`sidebar_breadcrumb ${ showSap  && "sap_selected" }`}
              onClick={() => {
                    setShowAnDef(false);
                    setShowEndpointAnalysisFlag(false);
                    setShowData(false);
                    setShowGeneral(false);
                    setAnSet(false);
                    setShowVisit(false);
                    setShowSap(true);
                    setShowSubGroups(false);
                  }}
            >
              <nav aria-label="breadcrumb" >
                <ol className="breadcrumb">
                  <li  
                   className='breadcrumb-item-inner'>
                    <Link to="#">
                      <i className="fa-solid fa-folder-tree"></i>
                      <span className="ms-3">{sapItem.sapNameShort}</span>
                      <br />
                    </Link>
                  </li>
                  <li className="breadcrumb-item-inner2">
                    <Link to="#">
                      {" "}
                      {`V(${printText(checkedVersion)})`} :{" "}
                      {`${printText(sapVersionNameShort)}`}{" "}
                    </Link>
                  </li>
                  <li className="breadcrumb-item-inner2">
                    <Link to="#">
                      {" "}
                      {"Role"} : {`${printText(roleName.roleName)}`}
                    </Link>
                  </li>
                </ol>
              </nav>
            </div>
          )}
          <ul
            className={`sidebar_list ${!checkedVersion ? "sap_sub_list" : ""}`}
          >
            {Object.keys(sapItem).length == 0 && (
              <>
                <li
                  className={`${showGeneral && "active"}`}
                  title="Please select SAP on the right"
                  onClick={() => {
                    // return
                    if (!checkedVersion) {
                      return false;
                    } else {
                      setShowGeneral(true);
                    }
                  }}
                >
                  <Link to="#" aria-disabled>
                    {/* <i className="fas fa-sharp fa-thin fa-file-lines faDisabled"></i> */}
                    <i className="fas fa-sharp fa-thin fa-file-lines"></i>
                    <span>General</span>
                  </Link>
                </li>
                <li
                  className={showAnDef && "active"}
                  title="Please Select SAP on the right"
                  onClick={() => {
                    if (!checkedVersion) {
                      return false;
                    } else {
                      setShowSap(false);
                      setShowAnDef(true);
                      setShowData(true);
                    }
                  }}
                >
                  <Link to="#">
                    <i className="fas fa-sharp fa-light fa-clipboard-list"></i>
                    <span>Analysis Defination</span>
                  </Link>
                </li>
                <li title="Please select SAP on the right">
                  <Link to="#">
                    <i className="fas fa-sharp fa-thin fa-calculator"></i>
                    <span>Statistical Analysis</span>
                  </Link>
                </li>
                <li title="Please select SAP on the right">
                  <Link to="/table-of-contents">
                    <i className="fas fa-sharp fa-light fa-list-ol"></i>
                    <span>Table of Contents</span>
                  </Link>
                </li>
              </>
            )}
            {Object.keys(sapItem).length > 0 && !showAnDef && (
              <>
                <li
                  className={showGeneral && "active"}
                  title={`${!checkedVersion ? "Select a sap with version" : "general"
                    }`}
                  onClick={() => {
                    // return
                    if (!checkedVersion) {
                      return false;
                    } else {
                      setShowGeneral(true);
                    }
                  }}
                >
                  <Link to="#">
                    {/* <i className={`fas fa-sharp fa-thin fa-file-lines ${!checkedVersion ? 'faDisabled' : ''}`}></i> */}
                    <i className="fas fa-sharp fa-thin fa-file-lines"></i>
                    <span>General</span>
                  </Link>
                </li>
                <li
                  className={showAnDef && "active"}
                  title={`${!checkedVersion
                      ? "Select a sap with version"
                      : "analysis-defination"
                    }`}
                  onClick={() => {
                    if (!checkedVersion) {
                      return false;
                    } else {
                      setShowSap(false);
                      setShowAnDef(true);
                      setShowData(true);
                    }
                  }}
                >
                  <Link to="#">
                    <i className="fas fa-sharp fa-light fa-clipboard-list"></i>
                    <span>Analysis Defination</span>
                  </Link>
                </li>
                <li
                  title={`${!checkedVersion
                      ? "Select a sap with version"
                      : "Statistical Analysis"
                    }`}
                >
                  <Link to="#">
                    <i className="fas fa-sharp fa-thin fa-calculator"></i>
                    <span>Statistical Analysis</span>
                  </Link>
                </li>
                <li
                  title={`${!checkedVersion
                      ? "Select a sap with version"
                      : "Table of Contents"
                    }`}
                >
                  <Link to="/table-of-contents">
                    <i className="fas fa-sharp fa-light fa-list-ol"></i>
                    <span>Table of Contents</span>
                  </Link>
                </li>
              </>
            )}
            {showAnDef && (
              <>
                <li
                  className={showData && "active"}
                  title="Data"
                  onClick={() => {
                    setShowData(true);
                    setAnSet(false);
                    setShowEndpointAnalysisFlag(false);
                    setShowVisit(false);
                    setShowSubGroups(false);
                  }}
                >
                  <Link to="#">
                    {/* <i className="fas fa-data"></i> */}
                    <i class="fa-solid fa-database"></i>
                    <span>Data</span>
                  </Link>
                </li>
                <li
                  className={showAnSet && "active"}
                  title="Analysis Set and Treatment"
                  onClick={() => {
                    setAnSet(true);
                    setShowData(false);
                    setShowEndpointAnalysisFlag(false);
                    setShowVisit(false);
                    setShowSubGroups(false);
                  }}
                >
                  <Link to="#">
                    <i className="fas fa-sharp fa-light fa-syringe"></i>
                    {/* <i className="fas fa-file"></i> */}
                    <span>Analysis Set and Treatment</span>
                  </Link>
                </li>
                <li
                  className={showEndpointAnalysisFlag && "active"}
                  title="Endpoint, Analysis flag"
                  onClick={() => {
                    setAnSet(false);
                    setShowData(false);
                    setShowEndpointAnalysisFlag(true);
                    setShowVisit(false);
                    setShowSubGroups(false);
                  }}
                >
                  <Link to="#">
                    <i class="fa-solid fa-stethoscope"></i>
                    {/* <i className="fas fa-file"></i> */}
                    <span>Endpoint, Analysis flag</span>
                  </Link>
                </li>
                <li
                  className={showVisit && "active"}
                  title="Visits"
                  onClick={() => {
                    setAnSet(false);
                    setShowData(false);
                    setShowEndpointAnalysisFlag(false);
                    setShowVisit(true);
                    setShowSubGroups(false);
                  }}
                >
                  <Link to="#">
                    {/* <i className="fas fa-file"></i> */}
                    {/* <i class="fa-regular fa-flag"></i> */}
                    <i class="fa-regular fa-calendar-check"></i>
                    <span>Visits</span>
                  </Link>
                </li>
                <li title="subgroups"
                className={showSubGroups && "active"}
                 onClick={() => {
                  setAnSet(false);
                  setShowData(false);
                  setShowEndpointAnalysisFlag(false);
                  setShowVisit(false);
                  setShowSubGroups(true);
                }}>
                  <Link to="#">
                    <i class="fa-solid fa-users-viewfinder"></i>
                    {/* <i className="fas fa-file"></i> */}
                    <span>Subgroups</span>
                  </Link>
                </li>
              </>
            )}
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
      <div className={isActive ? " main_section bodyexpand" : "main_section"}>
        {showSap ? (
          <StatisticalAnalysisPlan
            setSapItem={setSapItem}
            checkedVersion={checkedVersion}
            setSapVersionNameShort={setSapVersionNameShort}
            setCheckedVersion={setCheckedVersion}
            showGeneral={showGeneral}
            setShowGeneral={setShowGeneral}
            setShowSap={setShowSap}
            setShowAnDef={setShowAnDef}
            setShowSubGroups={setShowSubGroups}
          />
        ) : (
          ""
        )}
        {showAnDef ? (
          <AnalysisDefination
            showData={showData}
            setShowData={setShowData}
            showEndpointAnalysisFlag={showEndpointAnalysisFlag}
            showAnSet={showAnSet}
            showVisit={showVisit}
            showSubGroups={showSubGroups}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Sap;
