import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import { Link } from "react-router-dom";
import React from "react";

const SelectedStatisticalAnalysis = () => {
  return (
    <div className="main">
      <div className="main_menu sidebar" id="sidebar">
        <div className="main_menu_child">
          <div className="sidebar_top">
            <h4>
              <Link to="/">Arcsine Analytics</Link>
            </h4>
            <Link to="#" className="sidebar_btn" onClick="toggleSidebar(this)">
              <i className="fa-solid fa-bars-staggered"></i>
            </Link>
          </div>

          <div className="sidebar_breadcrumb">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home \</Link>
                </li>
                <li className="breadcrumb-item-inner">
                  <Link to="/statistical-analysis-plan">
                    Statistical Analysis Plan
                  </Link>
                </li>
              </ol>
            </nav>
          </div>
          <div
            style={{
              borderTop: "2px solid gray",
              borderBottom: "2px solid gray",
              padding: "15px 0px 5px 0px",
            }}
            className="sidebar_breadcrumb"
          >
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">SAP \</Link>
                </li>
                <li className="breadcrumb-item-inner">
                  <Link to="/#">R1234:CUREALL1</Link>
                </li>
                <li className="breadcrumb-item-inner2">
                  <Link to="/#">Final CSR Analysis(v3.0)</Link>
                </li>
              </ol>
            </nav>
          </div>
          <ul className="sidebar_list">
            <li className="active">
              <Link to="/analysis-definitions">
                <i className="fa-regular fa-square-plus"></i>
                <span>General</span>
              </Link>
            </li>
            <li>
              <Link to="/analysis-definitions">
                <i className="fa-solid fa-book"></i>
                <span>Analysis Definitions</span>
              </Link>
            </li>
            <li>
              <Link to="/statistical-analysis-inner">
                <i className="fa-solid fa-book"></i>
                <span>Statistical Analysis</span>
              </Link>
            </li>
            <li>
              <Link to="/table-of-contents">
                <i className="fa-solid fa-database"></i>
                <span>Table of Contents</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="main_section">
        <header className="header"></header>
        <section className="main_content">
          <div className="cmn_box col-md-12">
            <form action="">
              <div className="row g-4 ">
                <div className="col-md-12">
                  <div className="col-md-4">
                    <label>Project</label>
                    <select
                      className="form-select col-md-4 bg-light"
                      aria-label="Default select example"
                    >
                      <option selected value="1">
                        Oncology
                      </option>

                      <option value="2">General Medicine</option>
                      <option value="3">Indication</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="col-md-4">
                    <label>SAP Type</label>
                    <select
                      className="form-select col-md-6 bg-light"
                      aria-label="Default select example"
                    >
                      <option selected value="1">
                        Study(Final CSR)
                      </option>
                      <option value="2">Study(Final ASM)</option>
                      <option value="3">Study(Initial CSR)</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="">
                    <label>Short Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="R1234-AD-1472 and 2583"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="">
                    <label>Long Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="R1234-AD-1472 and 2583"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="SAP for 2 CUREALL studies"
                    ></textarea>
                  </div>
                </div>

                <div style={{ borderTop: "2px solid gray" }}> </div>
                <h5 className="mt-3">Version</h5>
                <div className="col-md-6 ">
                  <div className="col-md-5">
                    <label>Number</label>
                    <input
                      type="number"
                      min="00.00"
                      step="00.01"
                      className="form-control"
                      id="amountInput"
                      placeholder="2.0"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label>Date</label>

                  <Datetime />
                </div>
                {/* <div class='col-md-6'>
                    <input type='datetime-local' placeholder="Date"></input><span><i className="fa-square-plus"></i></span>
                    </div> */}

                <div className="col-md-5 ">
                  <label>Short Name</label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Project SAP Name"
                  />
                </div>
                <div className="col-md-4">
                  <label>Long Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Project SAP Name"
                  />
                </div>

                <div className="col-md-12">
                  <div className="">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Enter SAP Version Description"
                    ></textarea>
                  </div>
                </div>
                <div className="col-md-12">
                  <table className="table mt-4 ">
                    <thead>
                      <tr style={{ borderBottom: "2px solid gray" }}>
                        <th scope="col">#</th>
                        <th scope="col">Version</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>2.0</td>
                        <td>Updated based on xxxxx</td>
                        <td>05-03-2023, 16:04:58</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>1.2</td>
                        <td>Updated based on xxxxx</td>
                        <td>04-27-2023, 16:04:58</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>1.1</td>
                        <td>Updated based on xxxxx</td>
                        <td>03-05-2023, 16:04:58</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>1.0</td>
                        <td>Initial Version</td>
                        <td>02-26-2023, 16:04:58</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
            <div className="justify-content-left mt-4">
              <Link
                to="#"
                class="btn btn-secondary mt-4"
                style={{ width: 150 }}
              >
                <i className="fa-solid fa-save" style={{ marginRight: 5 }}></i>
                <span>Save</span>
              </Link>

              <Link
                to="#"
                class="btn btn-secondary mt-4"
                style={{ width: 150, marginLeft: 30 }}
              >
                <i className="fa-solid fa-times" style={{ marginRight: 5 }}></i>
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SelectedStatisticalAnalysis;
