import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import ProjectsModal from '../../../components/modals/ProjectsModal'

const SelectedProject = () => {
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

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
                                <li className="breadcrumb-item-inner"><Link to="/project-standard">Project Standard</Link></li>
                            </ol>
                        </nav>
                    </div>
                    <ul className="sidebar_list">
                        <li ><Link onClick={() => setIsProjectsModalOpen(true)}>
                            <i className="fa-regular fa-square-plus"></i>
                            {isProjectsModalOpen ? <span>Select Project</span>: <span>Change Project</span>}</Link>
                        </li>
                        {isProjectsModalOpen ? '' : <> <li className="active"><Link to="#">
                            <i className="fa-regular "></i>
                            <span>Immunology</span></Link>
                        </li>
                        <li>
                            <Link to="/study-design-component">
                                <i className="fa-solid fa-book"></i>
                                <span>Study Design Component</span></Link>
                        </li>
                        <li>
                            <Link to="/dataset-definitions">
                                <i className="fa-solid fa-database"></i>
                                <span>Dataset Definitions</span></Link>
                        </li>
                        <li>
                            <Link to="/standard-analysis">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Standard Analysis</span></Link>
                        </li>
                        </>
                        }
                    </ul>

                </div>
            </div>
            {isProjectsModalOpen && <ProjectsModal setIsProjectsModalOpen={setIsProjectsModalOpen}  /> }
    
        </div>

    )
}

export default SelectedProject