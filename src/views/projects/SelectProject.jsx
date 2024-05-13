import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectsModal from '../../components/modals/ProjectsModal';

const SelectProject = () => {
    const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
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

            <ul className="sidebar_list">
                <li><Link onClick={() => setIsProjectsModalOpen(true)}>
                    <i className="fa-square-plus"></i>
                    <span>Select Project</span></Link></li>
            </ul>
        </div>
    </div>
    
    {isProjectsModalOpen && <ProjectsModal setIsProjectsModalOpen={setIsProjectsModalOpen} />}
</div>


  )
}

export default SelectProject