import React from 'react';
import { Link } from 'react-router-dom';

const ManageProject = () => {
    return (
        <section className="main_content">
            <div className="">
                <h4 className="small_heading">Edit Project</h4>
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
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="">
                                    <label>Project Type</label>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="">
                                    <label>Project Menu</label>
                                    <input type="text" className="form-control" />
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
                        <li><Link to="/" className="btn btn-secondary">Cancel</Link></li>
                        <li><Link to="/" className="btn btn-primary">Done</Link></li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default ManageProject;