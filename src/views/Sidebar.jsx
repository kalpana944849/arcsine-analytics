import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { setTreelist } from '../store/reducers/treelistReducer';
import { TreelistService } from '../services/treelist-service';
import { useDispatch } from 'react-redux';
import Version from '../components/layout/Version';
// import ProjectsModal from '../modals/ProjectsModal';

const Sidebar = () => {
    const pathName = window.location.pathname;
    const [isActive, setActive] = useState(false);

    const handleToggle = () => {
        setActive(!isActive);
    };
    const dispatch = useDispatch();
    const getTreeListDemo = async () => {
        const response = await TreelistService();
        if (response.status === 200) {
            dispatch(setTreelist({ treelist: response.data.demoTreelist }));
            localStorage.setItem('treeListDemo', JSON.stringify(response.data.demoTreelist));
        }
    };
    useEffect(() => {
        getTreeListDemo();
    }, [])
    // const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

    return (
        <React.Fragment>
            <div className="main">
                <div className={isActive ? 'main_menu sidebar menuexpand' : 'main_menu sidebar'} id="sidebar">
                    <div className="main_menu_child">
                        <div className="sidebar_top">

                            <h4><Link to="/">Arcsine Analytics</Link></h4>
                            <Link onClick={() => handleToggle()} to="#" className="sidebar_btn">
                                <i className="fa-solid fa-bars-staggered"></i>
                            </Link>
                        </div>

                        <ul className="sidebar_list">

                            <li>
                                <Link to="/treelist-demo" className={`${pathName === "/treelist-demo" ? 'active' : ''}`}>
                                    <i className="fa-solid fa-gauge-high"></i>
                                    <span>Dashboard</span></Link>
                            </li>

                            {/* <li>
                            <Link to="/study-design">
                                <i className="fa-solid fa-file-lines"></i>
                                <span>Study Design</span></Link>
                        </li> */}

                            <li>
                                <Link to="/statistical-analysis-plan">
                                    <i className="fa-solid fa-chart-line"></i>
                                    <span>Statistical Analysis</span></Link>
                            </li>
                            <li>
                                <Link to="/global-standards" >
                                    <i className="fa-solid fa-globe"></i>
                                    <span>Global Standards</span></Link>
                            </li>
                            <li>
                                <Link to="#">
                                    <i className="fa-solid fa-gear"></i>
                                    <span>Administration</span></Link>
                            </li>
                            <li>
                                <Link to="/theme-setting" className={`${pathName === '/theme-setting' ? 'active' : ''}`}>
                                    <i className="fa-solid fa-gear"></i>
                                    <span>Theme Setting</span></Link>
                            </li>

                            <li>
                                <li className="position-absolute bottom-0 start-0 w-100" title="Version (1.2.4)">
                                    <Link to="#">
                                        <i className="fas fa-yin-yang"></i>
                                        <Version/>
                                    </Link>
                                </li>
                            </li>
                            {/* <li>
                                <li className="position-absolute bottom-0 start-0 w-100" title="Version (1.2.4)">
                                    <Link to="#">
                                        <i className="fas fa-yin-yang"></i>
                                        <span  >Version ({process.env.REACT_APP_VERSION})</span></Link>
                                </li>
                            </li> */}
                        </ul>

                    </div>
                </div>
                <div className={isActive ? ' main_section bodyexpand' : 'main_section'} >
                    <header className="header" style={{ borderBottom: '1px solid #f1efef' }}>
                        <span style={{ float: 'right', marginRight: '10px' }}>
                            <img style={{ height: 25, width: 25 }} src='/images/icon/myaccount.png' alt='user-logo' title='demo-user' />

                        </span>
                    </header>
                    <section className="main_content_top"></section>
                </div>
            </div>
            {/* {isProjectsModalOpen && <ProjectsModal setIsProjectsModalOpen={setIsProjectsModalOpen} />} */}
        </React.Fragment>
    );
};

export default Sidebar;