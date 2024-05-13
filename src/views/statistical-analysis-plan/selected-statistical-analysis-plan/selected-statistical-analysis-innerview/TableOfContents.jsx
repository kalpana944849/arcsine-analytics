import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { printText } from '../../../../utils/common-helper';
import Version from '../../../../components/layout/Version';
import TableOfContentsView from './TableOfContentsView';

const TableOfContents = () => {
    const version = process.env.REACT_APP_VERSION;
    const [sapItem, setSapItem] = useState(JSON.parse(localStorage.getItem("sapDataItem")) || {});
    const [checkedVersion, setCheckedVersion] = useState("");
    const [sapVersionNameShort, setSapVersionNameShort] = useState("");

    return (
        <div className="main">
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4><Link to="/">Arcsine Analytics</Link></h4>
                        <Link to="#" className="sidebar_btn" onClick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>
                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">
                                        <i className="fas fa-sharp fa-light fa-house me-3"></i>
                                        <span>Home</span>
                                    </Link>
                                </li>
                                <li className="breadcrumb-item-inner"><Link to="/statistical-analysis-plan">\ Statistical Analysis Plan</Link></li>
                                <li className="breadcrumb-item-inner2"><Link to="#">\ Table of Contents</Link></li>
                            </ol>
                        </nav>
                    </div>
                    {Object.keys(sapItem).length === 0 && (
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
                                    <li className="breadcrumb-item-inner">
                                        <Link to="#">{sapItem.sapNameShort}</Link>
                                    </li>
                                    <li className="breadcrumb-item-inner">
                                        <Link to="#">
                                            <i className="fa-solid fa-folder-tree"></i>
                                            <span className="ms-3">SAP not selected.</span>
                                            <br />
                                            Please select SAP on the right.
                                        </Link>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    )}
                    {Object.keys(sapItem).length > 0 && (
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
                                    <li className="breadcrumb-item-inner">
                                        <Link to="#">
                                            <i className="fa-solid fa-folder-tree"></i>
                                            <span className="ms-3">{sapItem.sapNameShort}</span>
                                            <br />
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item-inner2">
                                        <Link to="#">
                                            {" "}
                                            {`V(${printText(checkedVersion)})`} :{" "}
                                            {`${printText(sapVersionNameShort)}`}{" "}
                                        </Link>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    )}
                    <ul className="sidebar_list">
                        <li className="active">
                            <Link to="/table-of-contents">
                                <i className="fa-solid fa-database"></i>
                                <span>Table Of Contents</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-database"></i>
                                <span>Validation</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#">
                                <i className="fa-solid fa-database"></i>
                                <span>Publish</span>
                            </Link>
                        </li>
                    </ul>

                    <div className="sidebar_bottom ">
                        <ul
                            className="sidebar_list_bottom position-absolute bottom-0 start-0 w-100"
                            style={{ maxHeight: "20vh" }}
                        >
                            <li title="user-profile">
                                <Link
                                    to="#"
                                    style={{ marginLeft: "25px", marginRight: "25px" }}
                                >
                                    <i className="fa-solid fa-id-card"></i>
                                    <span>User Profile</span>
                                </Link>
                            </li>
                            <li
                            >
                                <Link
                                    title={`Version (${version})`}
                                    to="#"
                                    style={{ marginLeft: "25px", marginRight: "25px" }}
                                >
                                    <i className="fa-solid fa-code-compare"></i>
                                    <Version />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="main_section bodyexpand">
                <TableOfContentsView />
            </div>
        </div>
    )
};

export default TableOfContents;
