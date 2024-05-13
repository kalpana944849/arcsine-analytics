import React from 'react'
import { Link } from 'react-router-dom'

const SelectedProject = () => {
  return (
    <div className="main">
    <div className="main_menu sidebar" id="sidebar">
        <div className="main_menu_child">
            <div className="sidebar_top">
                <h4><Link to="/">Arcsine Analytics</Link></h4>
                <Link href="#" className="sidebar_btn" onClick="toggleSidebar(this)">
                    <i className="fa-solid fa-bars-staggered"></i>
                </Link>
            </div>

            <div className="sidebar_breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home \</Link></li>
                        <li className="breadcrumb-item"><Link href="#">Project Standard</Link></li>
                    </ol>
                </nav>
            </div>
            <ul class="sidebar_list">
                <li class="active"><a href="#">
                    <i class="fa-regular fa-square-plus"></i>
                    <span>Asthma (AS)</span></a>
                </li>
                <li>
                    <a href="/student-design-component">
                    <i class="fa-solid fa-book"></i>
                    <span>Student Design Component</span></a>
                </li>
                <li>
                    <a href="/dataset-definitions">
                    <i class="fa-solid fa-database"></i>
                    <span>Dataset Definitions</span></a>
                </li>
                <li>
                    <a href="/standard-analysis">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Standard Analysis</span></a>
                </li>
            </ul>
        </div>
    </div>
    
</div>

  )
}

export default SelectedProject