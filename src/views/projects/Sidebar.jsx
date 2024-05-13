import React from 'react';
import { Link } from 'react-router-dom';
// import ProjectsModal from '../modals/ProjectsModal';

const Sidebar = () => {
    // const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

    return (
        <React.Fragment>
        <div className="main">
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4><Link to="/">Arcsine Analytics</Link></h4>
                        <Link to="#" className="sidebar_btn">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <ul className="sidebar_list">
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-gauge-high"></i>
                                <span>Dashboard</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-file-lines"></i>
                                <span>Study Design</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-chart-line"></i>
                                <span>Statistical Analysis</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-globe"></i>
                                <span>Global Standards</span></Link>
                        </li>
                        <li>
                            <Link to="/select-project" data-bs-toggle="modal" data-bs-target="#exampleModal" 
                            // onClick={() => setIsProjectsModalOpen(true)}
                            >
                                <i className="fa-solid fa-layer-group"></i>
                                <span>Projects Standards</span></Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-gear"></i>
                                <span>Administration</span></Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="main_section">
                <header className="header"></header>
                <section className="main_content"></section>
            </div>
            </div>
            {/* {isProjectsModalOpen && <ProjectsModal setIsProjectsModalOpen={setIsProjectsModalOpen} />} */}
        </React.Fragment>
    );
};

export default Sidebar;