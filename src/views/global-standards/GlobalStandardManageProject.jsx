import {Link} from 'react-router-dom';
import React from 'react';

const GlobalStandardManageProject = () => {
    return (
        <div className="main">
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4><Link to="#">Arcsine Analytics</Link></h4>
                        <Link to="#" class="sidebar_btn" onclick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home \</Link></li>
                                <li  className="breadcrumb-item-inner"><Link to="/project-standard">Project Standard \</Link></li>
                                <li  className="breadcrumb-item-inner2"><Link to="#">Manage Project</Link></li>
                            </ol>
                        </nav>
                    </div>

                    <ul className="sidebar_list">
                        <li><Link to="#" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i className="fa-regular fa-square-plus"></i>
                            <span>Select Project</span></Link></li>
                    </ul>
                </div>
            </div>

            <div className="main_section">
                <header className="header"></header>
                <section className="main_content">

                    {/* <!-- <i class="fa-solid fa-pen"></i> --> */}
                    <div className="">
                        <h4 className="small_heading">Edit New Project</h4>
                        <div className="cmn_box">
                            <div className="nested_accord">
                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Therapeutic Area: Immunology and Inflammation
                                            </button>
                                            <Link to="#"><i className="fa-solid fa-pen"></i></Link>
                                        </h2>
                                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                            <div className="accordion-body">
                                                <ul className="modal_inner_list">
                                                    <li><Link to="#">Indication: Atopic Dermatitis (AD)</Link></li>
                                                    <li><Link to="#">Indication: Asthma (AS)</Link></li>
                                                    <li><Link to="#">Indication: Nasol Polyps (NP)</Link></li>
                                                    <li><Link to="#">Indication: Eosinophilic Esophagitis (EOE)</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                
                                    </div>                
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                            Therapeutic Area: Oncology
                                            </button>
                                            <Link to="#"><i className="fa-solid fa-pen"></i></Link>
                                        </h2>
                                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                            <div className="accordion-body">
                                                <ul className="modal_inner_list">
                                                    <li><Link to="#">Indication: Atopic Dermatitis (AD)</Link></li>
                                                    <li><Link to="#">Indication: Asthma (AS)</Link></li>
                                                    <li><Link to="#">Indication: Nasol Polyps (NP)</Link></li>
                                                    <li><Link to="#">Indication: Eosinophilic Esophagitis (EOE)</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                            Therapeutic Area: General Medicine
                                            </button>
                                            <Link to="#"><i className="fa-solid fa-pen"></i></Link>
                                        </h2>
                                        <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                                            <div className="accordion-body">
                                                <ul className="modal_inner_list">
                                                    <li><Link to="#">Indication: Atopic Dermatitis (AD)</Link></li>
                                                    <li><Link to="#">Indication: Asthma (AS)</Link></li>
                                                    <li><Link to="#">Indication: Nasol Polyps (NP)</Link></li>
                                                    <li><Link to="#">Indication: Eosinophilic Esophagitis (EOE)</Link></li>
                                                </ul>               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="">
                        <h4 className="small_heading">Add Project</h4>
                        <div className="cmn_box">
                            <form action="">
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="">
                                            <label>Project Name</label>
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="">
                                            <label>Project Type</label>
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="">
                                            <label>Project Menu</label>
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="">
                                            <label>Project Detail</label>
                                            <textarea rows="5" className="form-control"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <ul className="bottom_btn">
                                <li><Link to="/project-standard" class="btn btn-secondary">Cancel</Link></li>
                                <li><Link to="/project-standard" class="btn btn-primary">Done</Link></li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
            
        </div>
    );
};

export default GlobalStandardManageProject;