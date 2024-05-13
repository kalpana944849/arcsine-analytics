import React, {useState} from "react";

const GlobalControlledTerminology = ({setIsStudyAndDataModelOpen}) => {
    const [dataShow] = useState(false)
   
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

                            {
                                dataShow  &&            
               <>

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
                               onClick={() => setIsStudyAndDataModelOpen(false)}
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

                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default GlobalControlledTerminology