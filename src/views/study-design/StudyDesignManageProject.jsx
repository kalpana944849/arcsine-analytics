import {Link} from 'react-router-dom';
import React from 'react';

const StudyDesignManageProject = () => {
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
                                <li  className="breadcrumb-item-inner"><Link to="/study-design">Study Design \</Link></li>
                                <li  className="breadcrumb-item-inner2"><Link to="#">Manage Study Design</Link></li>
                            </ol>
                        </nav>
                    </div>
            
                </div>
            </div>

            <div className="main_section">
                <header className="header"></header>
                <section className="main_content">

                    {/* <!-- <i class="fa-solid fa-pen"></i> --> */}
                    <div className="">
                        <h4 className="small_heading">Add/Edit Study</h4>
                        <div className="cmn_box">
                            <div className="nested_accord">
                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                    Therapeutic Area: Immunology and Inflammation
                                            </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                            <div className="accordion-body">

                                                <div className="accordion sub_accor" id="accordionPanelsStayOpenExample">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="panelsStayOpen-heading_SubOne">
                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                    Compound: Superlibumab (R1234)
                                                            </button>
                                                        </h2>
                                                        <div id="panelsStayOpen-collapse_SubOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading_SubOne">
                                                            <div className="accordion-body">
                                                                <ul className="modal_inner_list">
                                                                    
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                Indication: Atopic Dermatitis (AD)
                                                                    </button>
                                                                        
                                                                    <li style={{marginLeft:"40px"}}><Link to="/selected-project-study-design">Study: R1234-AD-1472</Link></li>
                                                                           
                                                                    <button style={{marginLeft:"80px"}} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                study: R1234-AD-2583
                                                                    </button>
                                                                    <li style={{marginLeft:"120px"}}><Link to="#">v1: initial version (2023-03-15 00:00:00,000)</Link></li>
                                                                    <button style={{marginLeft:"80px"}} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                        study: R1234-AD-3630
                                                                    </button><button style={{marginLeft:"80px"}} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                Study: R1234-AD-4785
                                                                    </button><button style={{marginLeft:"80px"}} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                study: R1234-AD-5836
                                                                    </button>
                                                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                indication: Asthma (AS)
                                                                    </button> <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                Indication: Nasal polyps (NP)
                                                                    </button> <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                                indication: Eosinophilic esophagitis (EGE)
                                                                    </button>
                                                                </ul>
                                                                  
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                                    Therapeutic Area: Oncology
                                                            </button>
                                                        </h2>
                                                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                                            <div className="accordion-body">

                                                                <div className="accordion sub_accor" id="accordionPanelsStayOpenExample">
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="panelsStayOpen-heading_SubThree">
                                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubThree" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubThree">
                                                                    Compound: Superlibumab (R1234)
                                                                            </button>
                                                                        </h2>
                                                                        <div id="panelsStayOpen-collapse_SubThree" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading_SubThree">
                                                                            <div className="accordion-body">
                                                                                <ul className="modal_inner_list">
                                                                                    <li><Link to="#">Indication: Asthma (AS)</Link></li>
                                                                                    <li><Link to="#">Indication: Eosinophilic Esophagitis (EOE)</Link></li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="panelsStayOpen-heading_SubFour">
                                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubFour" aria-expanded="false" aria-controls="panelsStayOpen-collapse_SubFour">
                                                                    Compond: Treatallumab (R9876)
                                                                            </button>
                                                                        </h2>
                                                                        <div id="panelsStayOpen-collapse_SubFour" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading_SubFour">
                                                                            <div className="accordion-body">
                                                                                <ul className="modal_inner_list">
                                                                                    <li><Link to="#">Indication: Asthma (AS)</Link></li>
                                                                                    <li><Link to="#">Indication: Eosinophilic Esophagitis (EOE)</Link></li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                                                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                                    Therapeutic Area: General Medicine
                                                            </button>
                                                        </h2>
                                                        <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                                                            <div className="accordion-body">

                                                                <div className="accordion sub_accor" id="accordionPanelsStayOpenExample">
                                                                    <div className="accordion-item">
                                                                        <h2 className="accordion-header" id="panelsStayOpen-heading_SubFive">
                                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubFive" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubFive">
                                                                    Compound: Livelongumab (R4891)
                                                                            </button>
                                                                        </h2>
                                                                        <div id="panelsStayOpen-collapse_SubFive" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading_SubFive">
                                                                            <div className="accordion-body">
                                                                                <ul className="modal_inner_list">
                                                                                    <li><Link to="#">Indication: Cholesterolemia (CL)</Link></li>
                                                                                    <li><Link to="#">Indication: Homozygous Familial Hypercholesterolemia (HoFH)</Link></li>
                                                                                    <li><Link to="#">Indication: Diabetes(DIA)</Link></li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

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
                        <h4 className="small_heading">Add Study</h4>
                        <div className="cmn_box">
                            <form action="">
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="">
                                            <label>Study Name</label>
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="">
                                            <label>Study Type</label>
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="">
                                            <label>Study Menu</label>
                                            <input type="text" className="form-control"/>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="">
                                            <label>Study Detail</label>
                                            <textarea rows="5" className="form-control"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <ul className="bottom_btn">
                                <li><Link to="/study-design" class="btn btn-secondary">Cancel</Link></li>
                                <li><Link to="/study-design" class="btn btn-primary">Done</Link></li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
            
        </div>
    );
};

export default StudyDesignManageProject;