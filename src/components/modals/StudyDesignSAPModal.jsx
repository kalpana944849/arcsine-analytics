import {Link} from 'react-router-dom';
import React from 'react';

const StudyDesignSAPModal = ({setIsStudyDesignSAPModalOpen}) => {
    return (
        <React.Fragment>
            <div className="modal-backdrop fade show"></div>
            <div className="common_modal">
                <div className="modal fade show d-block" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Select SAP</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsStudyDesignSAPModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="nested_accord">
                                    <div className="accordion" id="accordionPanelsStayOpenExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                SAP:SAP1Short
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                                <div className="accordion-body">

                                                    <div className="accordion sub_accor" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-heading_SubOne">
                                                                <ul className="modal_inner_list">
                                                                    <li><Link to="/select-SAP-study-design" >vi: Initial Version (2023-03-15 00:00:00.000)</Link></li>
                                                                </ul>
                                                                
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                                SAP:SAP2Short
                                                </button>
                                            </h2>
                                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                                <div className="accordion-body">

                                                    <div className="accordion sub_accor" id="accordionPanelsStayOpenExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="panelsStayOpen-heading_SubOne">
                                                                <ul className="modal_inner_list">
                                                                    <li><Link to="/selected-statistical-analysis">vi: Initial Version (2023-03-15 00:00:00.000)</Link></li>
                                                                </ul>
                                                            </h2>
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
            </div>
        </React.Fragment>
    );
};

export default StudyDesignSAPModal;
