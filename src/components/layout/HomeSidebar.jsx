import React from 'react'
import { Link } from 'react-router-dom'
import Version from './Version';

const HomeSidebar = () => {
    const pathName = window.location.pathname;
  const version = process.env.REACT_APP_VERSION;

    return (
        <>
        <ul className="sidebar_list" style={{overflowY:'hidden'}}>

            <li>
                <Link to="/treelist-demo" className={`${pathName === "/treelist-demo" ? 'active' : ''}`}>
                    <i className="fa-solid fa-gauge-high"></i>
                    <span>Dashboard</span></Link>
            </li>

            <li>
                <Link to="/statistical-analysis-plan">
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Statistical Analysis</span></Link>
            </li>
            <li>
                <Link to="/controlledterminology-global" >
                    <i className="fa-solid fa-globe"></i>
                    <span>Global Standards</span></Link>
            </li>
            <li>
                <Link to="/administration">
                    <i className="fa-solid fa-gear"></i>
                    <span>Administration</span></Link>
            </li>
           

        </ul>
        <div className="sidebar_bottom ">
            <ul
              className="sidebar_list_bottom position-absolute bottom-0 start-0 w-100 "
              style={{ maxHeight: "20vh" }}
            >
              <li title="user-profile">
                <Link
                  to="#"
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                >
                  <i class="fa-solid fa-id-card"></i>
                  <span>User Profile</span>
                </Link>
              </li>
              <li
              //title={`Vesion (${version})`}
              >
                <Link
                  title={`Version (${version})`}
                  to="#"
                  style={{ marginLeft: "25px", marginRight: "25px" }}
                >
                  <i class="fa-solid fa-code-compare"></i>
                  <Version />
                </Link>
              </li>
            </ul>
          </div>
            </>
    )
}

export default HomeSidebar
