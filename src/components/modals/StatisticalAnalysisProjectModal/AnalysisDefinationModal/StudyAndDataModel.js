import React, {useState} from "react";
import {Link} from "react-router-dom";

const StudyAndDataModel = ({setIsStudyAndDataModelOpen}) => {
    const [studyShow, setStudyShow] = useState(false)
    const [dataShow, setDataShow] = useState(false)
    // const handleStudyShow = () => {
    //     setStudyShow(true)
    // }
    // const handleDataShow = () => {
    //     setDataShow(true)
        
    // }
    return (
        <React.Fragment>
            <div className="modal-backdrop fade show"></div>
            <div className="common_modal">
                <div
                    className="modal fade show d-block"
                    id="exampleModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            { studyShow  ?
                                dataShow === false &&
              <>
               
                  <table className="table">
                      <thead>
                          <tr>
                              <th scope="col">
                                  <h4 className=" mt-4 ">
                                      <span style={{marginLeft: 20}} className="">
                          Add Study
                                      </span>
                                  </h4>
                              </th>

                              <th scope="col">
                                  {" "}
                                  <a
                                      style={{marginRight: 40, width: 100, float: "right"}}
                                      onClick={() => setDataShow(true)}
                                      className="btn btn-secondary mt-4"
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

                  <div className="modal-body d-flex" style={{width:"90%"}}>
                      <div className='d-flex flex-column  ' style={{width:"5%"}}>
                          <input className="form-check-input mt-3"  type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input  " style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input   " style={{marginTop:50}} type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input   " style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input " style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input" style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input" style={{marginTop:50}} type="checkbox" value="" id="flexCheckDefault"/>
                          <input className="form-check-input" style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
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
                                                              <li><Link to="#">R1234-AD-1474</Link></li>
                                                              <li><Link to="#">R1234-AS-1572</Link></li>
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
                      <div className='col-md-2 mt-2' style={{marginLeft:50}}>
                      </div>
                  </div> 
                  <div className="justify-content-left mt-4" style={{marginLeft:40, marginBottom:40}}>
                      <a className="btn btn-secondary mt-4" style={{width: 150}}>
                          <i className="fa-solid fa-save" style={{marginRight: 5}}></i>
                          <span>Save</span>
                      </a>

                      <a
                          onClick={() => setStudyShow(false)}
                          className="btn btn-secondary mt-4"
                          style={{width: 150, marginLeft: 30}}
                      >
                          <i className="fa-solid fa-times" style={{marginRight: 5}}></i>
                          <span >Cancel</span>
                      </a>
                  </div>
                            
              </>
                            
                                :
                                dataShow === false &&
                              <>
                                  <table className="table">
                                      <thead>
                                          <tr>
                                              <th scope="col">
                                                  <h4 className=" mt-4 ">
                                                      <span style={{marginLeft: 20}} className="">
                        Controlled Terminology Category
                                                      </span>
                                                  </h4>
                                              </th>

                                              <th scope="col">
                                                  <a
                                                      style={{marginRight: 40, width: 100, float: "right"}}
                                                      onClick={() => setIsStudyAndDataModelOpen(false)}
                                                      className="btn btn-secondary mt-4"
                                                  >
                                                      <i
                          
                                                          style={{marginRight: 5}}
                                                      ></i>
                                                      <span className="">x</span>
                                                  </a>
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
                                                          placeholder="Enter Folder Short Name"
                                                      />
                                                  </div>
                                              </div>
                                              <div className="col-md-6">
                                                  <div className="">
                                                      <label>Long Name</label>
                                                      <input
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Enter Folder Long Name"
                                                      />
                                                  </div>
                                              </div>
                                              <div className="col-md-12">
                                                  <div className="">
                                                      <label>Description</label>
                                                      <textarea
                                                          rows="3"
                                                          className="form-control"
                                                          placeholder="Enter Folder Description"
                                                      ></textarea>
                                                  </div>
                                              </div>
   
                                          </div>
                 
                                          <label className='mt-4'>Extandable</label>
                                          <div className="form-check form-switch w-100">
                                              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked/>
                                              <label className="form-check-label" htmlFor="flexSwitchCheckChecked"></label>
                                          </div>
                                      </form>
                                      <div className="justify-content-left mt-4">
                                          <a className="btn btn-secondary mt-4" style={{width: 150}}>
                                              <i className="fa-solid fa-save" style={{marginRight: 5}}></i>
                                              <span>Save</span>
                                          </a>
             
                                      </div>
                                  </div>
                              </> 
                            }

                            {
                                dataShow  &&            
               <>
                   <table className="table">
                       <thead>
                           <tr>
                               <th scope="col">
                                   <h4 className=" mt-4 ">
                                       <span style={{marginLeft: 20}} className="">
                          Add Data
                                       </span>
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
                               onClick={() => setDataShow(false)}
                               className="btn btn-secondary mt-4"
                               style={{width: 150, marginLeft: 30}}
                           >
                               <i className="fa-solid fa-times" style={{marginRight: 5}}></i>
                               <span>Cancel</span>
                           </a>
                       </div>
                   </div>
               </>
              
                            }

                            {/* { studyShow ?
              <>
              <div
                className="header  w-80 mt-4 "
                style={{
                  width: "90%",
                  marginLeft: 20,
                  borderTop: "2px solid gray",
                }}
              >
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Study
                </h5>
              </div>

              <div className="modal-body d-flex" style={{width:"90%"}}>
                            <div class='d-flex flex-column  ' style={{width:"5%"}}>
                            <input class="form-check-input mt-3"  type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input  " style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input   " style={{marginTop:50}} type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input   " style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input " style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input" style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input" style={{marginTop:50}} type="checkbox" value="" id="flexCheckDefault"/>
                            <input class="form-check-input" style={{marginTop:40}} type="checkbox" value="" id="flexCheckDefault"/>
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
                                                                        <li><Link to="#">R1234-AD-1474</Link></li>
                                                                        <li><Link to="#">R1234-AS-1572</Link></li>
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
                          <div class='col-md-2 mt-2' style={{marginLeft:50}}>
                            </div>
                            </div> 
                            </>
                            : ''} */}

                            {/* <div class="justify-content-left mt-4" style={{marginLeft:40, marginBottom:50}}>
                  <a class="btn btn-secondary mt-4" style={{ width: 150 }}>
                    <i class="fa-solid fa-save" style={{ marginRight: 5 }}></i>
                    <span>Save</span>
                  </a>

                  <a
                    class="btn btn-secondary mt-4"
                    style={{ width: 150, marginLeft: 30 }}
                  >
                    <i class="fa-solid fa-times" style={{ marginRight: 5 }}></i>
                    <span>Cancel</span>
                  </a>
                </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default StudyAndDataModel;
