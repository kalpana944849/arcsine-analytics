import {Link} from 'react-router-dom'
import React from 'react'

const StandardAnalysis = () => {
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
                                <li className="breadcrumb-item-inner"><Link to="//project-standard">Project Standard \</Link></li>
                                <li className="breadcrumb-item-inner2"><Link to="#">Standard Analysis</Link></li>
                            </ol>
                        </nav>
                    </div>
                    <ul className="sidebar_list">
                        <li className="active"><Link to="#">
                            <i className="fa-regular fa-square-plus"></i>
                            <span>Asthma (AS)</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-book"></i>
                                <span>Efficacy</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-database"></i>
                                <span>Safety</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Disposition</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Demographics</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Exposure</span></Link>
                        </li>
                        <li>
                            <a to="#">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Compiliance</span></a>
                        </li>
                    </ul>
                </div>
            </div>
    
        </div>

    )
}

export default StandardAnalysis