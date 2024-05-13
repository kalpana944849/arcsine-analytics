import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import StudyDesignModal from '../../components/modals/StudyDesignModal';

const StudyDesign = () => {
    const [isStudyDesignProjectsModalOpen, setIsStudyDesignProjectsModalOpen] = useState(false);
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
                                <li className="breadcrumb-item-inner"><Link to="#">Study Design</Link></li>
                            </ol>
                        </nav>
                    </div>

                    <ul className="sidebar_list">
                        <li><Link onClick={() => setIsStudyDesignProjectsModalOpen(true)}>
                            <i className="fa-square-plus"></i>
                            <span>Select Study</span></Link></li>
                        <li><Link to = "/study-design-manage-project" >
                            <i className="fa-regular fa-square-plus"></i>
                            <span>General</span></Link></li>
                    </ul>
                </div>
            </div>
    
            {isStudyDesignProjectsModalOpen && <StudyDesignModal setIsStudyDesignProjectsModalOpen={setIsStudyDesignProjectsModalOpen} />}
        </div>

    )
}

export default StudyDesign