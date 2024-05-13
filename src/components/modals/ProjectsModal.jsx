import {Link} from 'react-router-dom';
import React from 'react';

const ProjectsModal = ({setIsProjectsModalOpen}) => {
    return (
        <React.Fragment>
            <div className="modal-backdrop fade show"></div>
            <div className="common_modal">
                <div className="modal fade show d-block" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Select Project</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsProjectsModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="nested_accord">
                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                <Link to="/manage-project"> <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                    Therapeutic Area: Immunology and Inflammation
                                                </button>
                                                </Link>
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
                                                                        <li   ><Link to="#">Indication: Atopic Dermatitis (AD)</Link></li> 
                                                                        <li ><Link to="#">Indication: Asthma (AS)</Link> </li>
                                                                        <li ><Link to="/selected-project-project-standard">Indication: Immunology</Link></li>
                                                                        <li ><Link to="#">Indication: Nasol Polyps (NP)</Link></li>
                                                                        <li  ><Link to="#">Indication: Eosinophilic Esophagitis (EOE)</Link></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-heading_SubTwo">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapse_SubTwo">
                                                                    Compound: Treatallumab (R9876)
                                                                </button>
                                                            </h2>
                                                            <div id="panelsStayOpen-collapse_SubTwo" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading_SubTwo">
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
                            <div className="modal-footer">
                                <Link to="/manage-project" className="btn btn-primary" onClick={() => setIsProjectsModalOpen(false)}>Manage Project</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProjectsModal;
