import {Link} from 'react-router-dom'
import React from 'react'

const SelectSAPStudyDesign = () => {
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
                                <li className="breadcrumb-item-inner"><Link to="/study-design">Study Design \</Link></li>
                                <li className="breadcrumb-item-inner2"><Link to="/selected-project-study-design">Statistical Analysis Plan \</Link></li>
                            </ol>
                        </nav>
                    </div>
                    <ul className="sidebar_list">
                        <li className="active"><Link to="#">
                            <i className="fa-regular fa-square-plus"></i>
                            <span>Study: R1234-AD-1472</span></Link>
                        </li>
                        <li className="active"><Link to="/analysis-definitions">
                            <i className="fa-regular fa-square-plus"></i>
                            <span>vi: Initial Version (2023-03-15 00:00:00.000)</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-book"></i>
                                <span>Analysis Definitions</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-book"></i>
                                <span>Statistical Analysis</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-database"></i>
                                <span>Table of Contents</span></Link>
                        </li>
        
                    </ul>
                </div>
            </div>
    
        </div>

    )
}

export default SelectSAPStudyDesign