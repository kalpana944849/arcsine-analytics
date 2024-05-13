import React from 'react'
import Version from './Version'
import { Link } from 'react-router-dom';

const GlobalStandardSidebar = () => {
  const pathName = window.location.pathname;
  const version = `Version ${process.env.REACT_APP_VERSION}`

  return (
    <>
      <div className="sidebar_breadcrumb">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/"><i className="fas fa-sharp fa-light fa-house me-3"></i>
                    <span>Home</span></Link></li>
                <li className="breadcrumb-item-inner link-unexpand"><Link to="/global-standards">\ Global Standards</Link></li>
          </ol>
        </nav>
      </div>
      <ul className="sidebar_list">
        {/* <li>
          <Link to="/data-standards" className={`${pathName === '/data-standards' ? 'active' : ''}`}>
            <i className="fa-solid fa-database"></i>
            <span>Data Standards</span></Link>
        </li> */}
        <li>
          <Link to="/analysis-standards" className={`${pathName === '/analysis-standards' ? 'active' : ''}`}>
            <i className="fas fa-sharp fa-light fa-chart-line"></i>
            <span>Analysis Standards</span></Link>
        </li>
        <li >
          <Link to="/controlledterminology-global" className={`${pathName === '/controlledterminology-global' ? 'active' : ''}`} >
            <i className="fas fa-sharp fa-light fa-book-open"></i>
            {/* <i class="fas fa-solid fa-book-open-cover"></i> */}
            <span>Controlled Terminology</span></Link>
        </li>
        <li >
          <Link to="/standard-components" className={`${pathName === '/standard-components' ? 'active' : ''}`} >
          <i class="fa-solid fa-puzzle-piece"></i>
            {/* <i class="fas fa-solid fa-book-open-cover"></i> */}
            <span>Standard Components</span></Link>
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

export default GlobalStandardSidebar
