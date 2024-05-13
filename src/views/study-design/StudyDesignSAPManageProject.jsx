import React from 'react';
import { Link } from 'react-router-dom';

const StudyDesignSAPManageProject = () => {
    return (
        <div class="main">
        <div class="main_menu sidebar" id="sidebar">
            <div class="main_menu_child">
            <div class="sidebar_top">
                <h4><a href="index.html">Arcsine Analytics</a></h4>
                <a href="#" class="sidebar_btn" onclick="toggleSidebar(this)">
                    <i class="fa-solid fa-bars-staggered"></i>
                </a>
            </div>

            <div class="sidebar_breadcrumb">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                      <li class="breadcrumb-item"><a href="/">Home \</a></li>
                      <li  class="breadcrumb-item-inner"><a href="/project-standard">Project Standard \</a></li>
                      <li  class="breadcrumb-item-inner2"><a href="#">Manage Project</a></li>
                    </ol>
                  </nav>
              </div>

            <ul class="sidebar_list">
                <li><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i class="fa-regular fa-square-plus"></i>
                   <span>Select Project</span></a></li>
            </ul>
            </div>
        </div>

        <div class="main_section">
            <header class="header"></header>
            <section class="main_content">

                {/* <!-- <i class="fa-solid fa-pen"></i> --> */}
                <div class="">
                    <h4 class="small_heading">Edit New Project</h4>
                    <div class="cmn_box">
                        <div class="nested_accord">
                            <div class="accordion" id="accordionPanelsStayOpenExample">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Therapeutic Area: Immunology and Inflammation
                                        </button>
                                        <a href="#"><i class="fa-solid fa-pen"></i></a>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                                        <div class="accordion-body">
                                            <ul class="modal_inner_list">
                                                <li><a href="#">Indication: Atopic Dermatitis (AD)</a></li>
                                                <li><a href="#">Indication: Asthma (AS)</a></li>
                                                <li><a href="#">Indication: Nasol Polyps (NP)</a></li>
                                                <li><a href="#">Indication: Eosinophilic Esophagitis (EOE)</a></li>
                                            </ul>
                                        </div>
                                    </div>
                
                                </div>                
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                            Therapeutic Area: Oncology
                                        </button>
                                        <a href="#"><i class="fa-solid fa-pen"></i></a>
                                    </h2>
                                    <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                        <div class="accordion-body">
                                            <ul class="modal_inner_list">
                                                <li><a href="#">Indication: Atopic Dermatitis (AD)</a></li>
                                                <li><a href="#">Indication: Asthma (AS)</a></li>
                                                <li><a href="#">Indication: Nasol Polyps (NP)</a></li>
                                                <li><a href="#">Indication: Eosinophilic Esophagitis (EOE)</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                            Therapeutic Area: General Medicine
                                        </button>
                                        <a href="#"><i class="fa-solid fa-pen"></i></a>
                                    </h2>
                                    <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                                        <div class="accordion-body">
                                            <ul class="modal_inner_list">
                                                <li><a href="#">Indication: Atopic Dermatitis (AD)</a></li>
                                                <li><a href="#">Indication: Asthma (AS)</a></li>
                                                <li><a href="#">Indication: Nasol Polyps (NP)</a></li>
                                                <li><a href="#">Indication: Eosinophilic Esophagitis (EOE)</a></li>
                                            </ul>               
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="">
                    <h4 class="small_heading">Add Project</h4>
                    <div class="cmn_box">
                        <form action="">
                            <div class="row g-4">
                                <div class="col-md-4">
                                    <div class="">
                                        <label>Project Name</label>
                                        <input type="text" class="form-control"/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="">
                                        <label>Project Type</label>
                                        <input type="text" class="form-control"/>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="">
                                        <label>Project Menu</label>
                                        <input type="text" class="form-control"/>
                                    </div>
                                </div>
                                <div class="col-md-12">
                                    <div class="">
                                        <label>Project Detail</label>
                                        <textarea rows="5" class="form-control"></textarea>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <ul class="bottom_btn">
                            <li><a href="/project-standard" class="btn btn-secondary">Cancel</a></li>
                            <li><a href="/project-standard" class="btn btn-primary">Done</a></li>
                            </ul>
                        </div>
                    </div>
                    </section>
                </div>

                

            
        </div>
    );
};

export default StudyDesignSAPManageProject;