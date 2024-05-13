import React, {useState} from "react";
import {Link} from "react-router-dom";
import StudyAndDataModel from "../../../../../components/modals/StatisticalAnalysisProjectModal/AnalysisDefinationModal/StudyAndDataModel";

const StudyAndData = () => {
    const [isStudyAndDataModelOpen, setIsStudyAndDataModelOpen] = useState(false);
    const [addData, setAddData] = useState(false);
    const handleAddData = () => {
        setAddData(true);
    };

    return (
        <div className="main_section">
            <header className="header"></header>
            <section className="main_content">
                <div className="col-md-12 px-4 ">
                    <div className="row g-4 ">
                        <div className="cmn_box col-md-6">
                            <div className="row g-4">
                                <div className=" mt-1 col-md-12">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">
                                                    <h4 className=" mt-4 ">
                                                        <span className="">Study</span>
                                                    </h4>
                                                </th>

                                                <th scope="col">
                                                    {" "}
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
                                        <div className="d-flex">
                                            <i
                                                className="fa-solid fa-database mt-3"
                                                style={{marginLeft: 10}}
                                            ></i>

                                            <h2
                                                style={{marginLeft: 60}}
                                                className="accordion-header"
                                                id="panelsStayOpen-headingOne"
                                            >
                                                <Link to="/manage-project">
                                                    {" "}
                                                    <button
                                                        className="accordion-button"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#panelsStayOpen-collapseOne"
                                                        aria-expanded="true"
                                                        aria-controls="panelsStayOpen-collapseOne"
                                                    >
                            Therapeutic Area: Immunology and Inflammation
                                                    </button>
                                                </Link>
                                            </h2>
                                            <i
                                                className="fa-solid fa-trash mt-3"
                                                style={{marginLeft: 155}}
                                            ></i>
                                        </div>

                                        <div
                                            style={{marginLeft: 80}}
                                            id="panelsStayOpen-collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="panelsStayOpen-headingOne"
                                        >
                                            <div className="accordion-body">
                                                <div
                                                    className="accordion sub_accor"
                                                    id="accordionPanelsStayOpenExample"
                                                >
                                                    <div className="accordion-item">
                                                        <div className="d-flex">
                                                            <h2
                                                                className="accordion-header"
                                                                id="panelsStayOpen-heading_SubOne"
                                                            >
                                                                <button
                                                                    className="accordion-button"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target="#panelsStayOpen-collapse_SubOne"
                                                                    aria-expanded="true"
                                                                    aria-controls="panelsStayOpen-collapse_SubOne"
                                                                >
                                  R1234-AD-1472
                                                                </button>
                                                            </h2>
                                                            <i
                                                                className="fa-solid fa-trash mt-3"
                                                                style={{marginLeft: 325}}
                                                            ></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className="accordion sub_accor"
                                                    id="accordionPanelsStayOpenExample"
                                                >
                                                    <div className="accordion-item">
                                                        <div className="d-flex">
                                                            <h2
                                                                className="accordion-header"
                                                                id="panelsStayOpen-heading_SubOne"
                                                            >
                                                                <button
                                                                    className="accordion-button"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target="#panelsStayOpen-collapse_SubOne"
                                                                    aria-expanded="true"
                                                                    aria-controls="panelsStayOpen-collapse_SubOne"
                                                                >
                                  R1234-AD-2583
                                                                </button>
                                                            </h2>
                                                            <i
                                                                className="fa-solid fa-trash mt-3"
                                                                style={{marginLeft: 325}}
                                                            ></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* { EditProject ? 
          <div class="cmn_box " style={{width:'49%', marginLeft:10}}>
          <form action="">
            <div class="row g-4 ">
                <div class="col-md-6" style={{marginRight:40}}>
                  <label>Project Code</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="I&I"
                  />
                </div>
              
              <div class="col-md-6">
                <div class="">
                  <label>Short Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Immunology and Inflammation"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="">
                  <label>Long Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Immunology and Inflammation"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="">
                  <label>Description</label>
                  <textarea rows="3" class="form-control" placeholder="Immunology and Inflammation"></textarea>
                </div>
              </div>

              <div class="col-md-6" style={{marginBottom:40,marginRight:40}}>
                <select
                  class="form-select col-md-6 bg-light"
                  aria-label="Default select example"
                >
                  
                  <option value="1">Therapeutic Area</option>
                  <option value="2">Compound</option>
                  <option selected value="3">Indication</option>
                </select>
              </div>
              
            </div>
          </form>
          <div class='justify-content-left mt-4'>
         
          <a class="btn btn-secondary mt-4" style={{width:150}}>
              <i class="fa-solid fa-refresh" style={{marginRight:5}}></i>                      
             <span  onClick={() => setEditProject(false)} class="">Update</span></a>
             
             <a class="btn btn-secondary mt-4" style={{width:150, marginLeft:30}}>
              <i class="fa-solid fa-times" style={{marginRight:5}}></i>                      
             <span  onClick={() => setEditProject(false)}>Cancel</span></a>
          </div>
        </div>:''} */}

                        {/* { addProject ? 
          <div class="cmn_box " style={{width:'49%', marginLeft:10}}>
          <form action="">
            <div class="row g-4 ">
                <div class="col-md-6" style={{marginRight:40}}>
                  <label>Project Code</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Project Code"
                  />
                </div>
              
              <div class="col-md-6">
                <div class="">
                  <label>Short Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Project Short Name"
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="">
                  <label>Long Name</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Project Long Name"
                  />
                </div>
              </div>
              <div class="col-md-12">
                <div class="">
                  <label>Description</label>
                  <textarea rows="3" class="form-control" placeholder="Enter Project Description"></textarea>
                </div>
              </div>

              <div class="col-md-6" style={{marginBottom:40,marginRight:40}}>
                <select
                  class="form-select col-md-6 bg-light"
                  aria-label="Default select example"
                >
                  <option selected >Select Project Level</option>
                  
                  <option value="1">Therapeutic Area</option>
                  <option value="2">Compound</option>
                  <option  value="3">Indication</option>
                </select>
              </div>
              
            </div>
          </form>
          <div class='justify-content-left mt-4'>
         
          <a  class="btn btn-secondary mt-4" style={{width:150}}>
              <i class="fa-solid fa-save" style={{marginRight:5}}></i>                      
             <span>Save</span></a>
             
             <a  class="btn btn-secondary mt-4" style={{width:150, marginLeft:30}}>
              <i class="fa-solid fa-times" style={{marginRight:5}}></i>                      
             <span >Cancel</span></a>
          </div>
        </div>:''} */}

                        {addData ? 
                            <>
            
                                <div className="cmn_box " style={{width: "49%", marginLeft: 10}}>
                                    <div className="row g-4">
                                        <div className=" mt-1 col-md-12">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">
                                                            <h4 className=" mt-4 ">
                                                                <span className="">Add Data</span>
                                                            </h4>
                                                        </th>
                       
                                                    </tr>
                                                </thead>
                                            </table>
                                            <div className="cmn_box col-md-12">
                                                <form action="">
                                                    <div className="row g-4 ">
                                                        <div className="col-md-6">
                                                            <div className="">
                                                                <label>Short Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter Data Short Name"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="">
                                                                <label>Long Name</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter Data Long Name"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12">
                                                            <div className="">
                                                                <label>Description</label>
                                                                <textarea
                                                                    rows="3"
                                                                    className="form-control"
                                                                    placeholder="Enter Data Description"
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                                <div className="justify-content-left mt-4">
                                                    <a className="btn btn-secondary mt-4" style={{width: 150}}>
                                                        <i className="fa-solid fa-save" style={{marginRight: 5}}></i>
                                                        <span>Save</span>
                                                    </a>

                                                    <a
                                                        onClick={() => setAddData(false)}
                                                        className="btn btn-secondary mt-4"
                                                        style={{width: 150, marginLeft: 30}}
                                                    >
                                                        <i className="fa-solid fa-times" style={{marginRight: 5}}></i>
                                                        <span>Cancel</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
              
                                </div>
                            </> 
                            :
                            <div className="cmn_box " style={{width: "49%", marginLeft: 10}}>
                                <div className="row g-4">
                                    <div className=" mt-1 col-md-12">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">
                                                        <h4 className=" mt-4 ">
                                                            <span className="">Data</span>
                                                        </h4>
                                                    </th>

                                                    <th scope="col">
                                                        {" "}
                                                        <a
                                                            onClick={handleAddData}
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
                                            <div className="d-flex">
                                                <i
                                                    className="fa-solid fa-database mt-3"
                                                    style={{marginLeft: 10}}
                                                ></i>
                                                <h2
                                                    style={{marginLeft: 60}}
                                                    className="accordion-header"
                                                    id="panelsStayOpen-headingOne"
                                                >
                                                    <Link to="/manage-project">
                                                        {" "}
                                                        <button
                                                            className="accordion-button"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target="#panelsStayOpen-collapseOne"
                                                            aria-expanded="true"
                                                            aria-controls="panelsStayOpen-collapseOne"
                                                        >
                            Data-R1234-AD-1472 (v3.2)
                                                        </button>
                                                    </Link>
                                                </h2>
                                                <i
                                                    className="fa-solid fa-trash mt-3"
                                                    style={{marginLeft: 300}}
                                                ></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
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

export default StudyAndData;
