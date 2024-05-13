import React, {useState} from "react";
import {Link} from "react-router-dom";
import StudyAndDataModel from "../../../../../components/modals/StatisticalAnalysisProjectModal/AnalysisDefinationModal/StudyAndDataModel";

const DemoStudyAndData = () => {
    const [isStudyAndDataModelOpen, setIsStudyAndDataModelOpen] = useState(false);
    // const [addData, setAddData] = useState(false);
    // const handleAddData = () => {
    //     setAddData(true);
    // };

    return (
        <div className="main_section">
            <header className="header"></header>
            <section className="main_content col-md-12">
                
                <div className="col-md-12 px-4 ">
                    <div className="row g-4 ">
                        <div className="cmn_box  ">
                            <div className="row g-4">
                                <div className=" mt-1  ">
                                    <table className="table ">
                                        <thead>
                                            <tr>
                                                <th scope="col">
                                                    <h4 className=" mt-4 ">
                                                        <span className="">Study</span>
                                                    </h4>
                                                </th>

                                                <th scope="col">
                                                    <a
                                                        onClick={() => setIsStudyAndDataModelOpen(true)}
                                                        className="btn btn-secondary mt-4"
                                                        style={{width: 100, float: "right"}}
                                                    >
                                                        <i
                                                            className="fa-solid fa-plus"
                                                            style={{marginRight: 5}}
                                                        ></i>
                                                        <span className="">Add</span>
                                                    </a>
                                                </th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                            <div className="nested_accord">
                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                    <div className="accordion-item">
                   
                                        <div className="d-flex justify-content-between" style={{width:"100%"}}>
                                            <div className='d-flex flex-column  ' style={{width:"20%",marginLeft:40}}>
                                                <i className="fa-solid fa-book" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-book" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-book" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-book" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-book" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-book" style={{marginTop:40}}></i>

                                            </div>
                                            <div className="nested_accord " style={{width:"60%", marginLeft:40}}>

                                                <div className="accordion" id="accordionPanelsStayOpenExample">

                                                    <div className="accordion-item  " >
                                
                                                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                            <Link to="/manage-project"> <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                              Therapeutic Area: Immunology and Inflammation
                                                            </button>
                                                            </Link>
                                                        </h2>
                                      
                                                        <div id="panelsStayOpen-collapseOne"  className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                                            <div className="accordion-body">

                                                                <div className="accordion sub_accor" id="accordionPanelsStayOpenExample">
                                                                    <div className="accordion-item">
                                                  
                                                                        <h2 className="accordion-header" id="panelsStayOpen-heading_SubOne">
                                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse_SubOne" aria-expanded="true" aria-controls="panelsStayOpen-collapse_SubOne">
                                                          R1234
                                                                            </button>
                                                                        </h2>
                                                                        <div id="panelsStayOpen-collapse_SubOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-heading_SubOne">
                                                                            <div className="accordion-body">
                                                                                <ul className="modal_inner_list">
                                                                                    <li><Link to="#">R1234-AD-1472</Link></li>
                                                                                    <li><Link to="#">R1234-AD-1473</Link></li>
                                                                       
                                                                                </ul>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                
                                                                </div>

                                                            </div>
                                                        </div>
                                                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                            <Link to="/manage-project"> <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                              Therapeutic Area: Oncology
                                                            </button>
                                                            </Link>
                                                        </h2>
                                                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                                            <Link to="/manage-project"> <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                              Therapeutic Area: Immunology and Inflammation
                                                            </button>
                                                            </Link>
                                                        </h2>

                                                    </div>
                                 
                                                </div>
                                            </div>
                                            <div className='d-flex flex-column  ' style={{width:"10%", float: 'right', marginLeft: 300}}>
                                                <i className="fa-solid fa-trash" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-trash" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-trash" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-trash" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-trash" style={{marginTop:40}}></i>
                                                <i className="fa-solid fa-trash" style={{marginTop:40}}></i>
                                            </div>
                      
                                        </div> 
                            
                                    </div>
                                </div>
                            </div>
                        </div>
         
                    </div>
                </div>
        
            </section>
            {isStudyAndDataModelOpen && (
                <StudyAndDataModel
                    setIsStudyAndDataModelOpen={setIsStudyAndDataModelOpen}
                />
            )}
        </div>
    );
};

export default DemoStudyAndData;
