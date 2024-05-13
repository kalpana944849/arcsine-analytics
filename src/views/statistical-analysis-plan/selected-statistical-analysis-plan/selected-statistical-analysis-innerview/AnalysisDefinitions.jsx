import React, {useState} from 'react'
import AnalysisAndTreatment from './AnalysisDefination/AnalysisAndTreatment';
import DemoStudyAndData from './AnalysisDefination/DemoStudyAndData';
import {Link} from 'react-router-dom'
import StudyAndData from './AnalysisDefination/StudyAndData';

const AnalysisDefinitions = () => {
    const [study, setStudy] = useState(false);
    const handleStudy = () => {
        setStudy(true);
        setStudyFull(false)
    }
    const [studyFull, setStudyFull] = useState(false);
    const handleStudyFull = () => {
        setStudyFull(true);
        setStudy(false);
    }
    const [analysisAndTreatment, setAnalysisAndTreatment] = useState(false);
    const handleAnalysisAndTreatment = () => {
        setAnalysisAndTreatment(true)
        setStudyFull(false);
        setStudy(false)
    }
    console.log("study",study)
    return (
        <div className="main">
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4><Link to="/">Arcsine Analytics</Link></h4>
                        <Link to="#" className="sidebar_btn" onClick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home \</Link></li>
                                <li className="breadcrumb-item-inner"><Link to="/selected-statistical-analysis">Statistical Analysis Plan \</Link></li>
                                <li className="breadcrumb-item-inner2"><Link to="#">Analysis Definitions</Link></li>
                            </ol>
                        </nav>
                    </div>
                    
                    <div style={{borderTop:"2px solid gray", borderBottom:"2px solid gray", padding: "15px 0px 5px 0px"}}
                        className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">SAP \</Link></li>
                                <li className="breadcrumb-item-inner"><Link to="/#">R1234:CUREALL1</Link></li>
                                <li className="breadcrumb-item-inner2"><Link to="/#">Final CSR Analysis(v3.0)</Link></li>
                            </ol>
                        </nav>
                    </div>
                    <ul className="sidebar_list">
               
                        <li className = {study ? "active": ''}><Link to='/analysis-definitions-data'>
                            <i className="fa-solid fa-database"></i>
                            <span>Data</span></Link>
                        </li>
                        <li  onClick={handleAnalysisAndTreatment}><Link to="#">
                            <i className="fa-solid fa-book"></i>
                            <span>Analysis Set and Treatment</span></Link>
                        </li>
                        <li  onClick={()=> setStudy(false)}><Link to="#">
                            <i className="fa-solid fa-database"></i>
                            <span>Endpoints, Analysis Flags, Visits</span></Link>
                        </li>
                        <li onClick={()=> setStudy(false)}><Link to="#">
                            <i className="fa-solid fa-database"></i>
                            <span>Subgroups</span></Link>
                        </li>
                
                    </ul>
                </div>
      
            </div>
   
            {study ? <StudyAndData/> : ''}
            {studyFull ? <DemoStudyAndData/> : ''}
            {analysisAndTreatment && <AnalysisAndTreatment/>}
    
        </div>

    )
}

export default AnalysisDefinitions