import {Link} from 'react-router-dom'
import React from 'react'

const StudyComponents = () => {
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
                                <li className="breadcrumb-item-inner"><Link to="/global-standards">Global Standards \</Link></li>
                                <li className="breadcrumb-item-inner2"><Link to="#">Dataset Definitions</Link></li>
                            </ol>
                        </nav>
                    </div>
                    <ul className="sidebar_list">
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-book"></i>
                                <span>Analysis Set</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-database"></i>
                                <span>Treatment</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Visit Flags</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Endpoints</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Analysis Flags</span></Link>
                        </li>
                
                    </ul>
                </div>
            </div>
    
        </div>

    )
}

export default StudyComponents