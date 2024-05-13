import React from 'react'
import Version from './Version'
import { Link } from 'react-router-dom';

const Administrator = () => {
  const pathName = window.location.pathname;
  const version = `Version ${process.env.REACT_APP_VERSION}`

  return (
    <>
      <div className="sidebar_breadcrumb">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home \</Link></li>
            <li className="breadcrumb-item-inner"><Link to="#">Administrator</Link></li>
          </ol>
        </nav>
      </div>
      <ul className="sidebar_list">
        <li>
          <Link to="/icons" className={`${pathName === '/icons' ? 'active' : ''}`}>
            <i className="fa-solid fa-database"></i>
            <span>Icons</span></Link>
        </li>
        <li>
          <Link to="/theme-setting" className={`${pathName === '/theme-setting' ? 'active' : ''}`}>
            <i className="fa-solid fa-chart-simple"></i>
            <span>Theme Style</span></Link>
        </li>
        
        <li>
          <li className="position-absolute bottom-0 start-0 w-100" title = {version}>
            <Link to="#">
              <i className="fas fa-yin-yang"></i>
              {/* <span  >Version (1.2.4)</span> */}
              <Version/>
            </Link>
          </li>
        </li>
      </ul>
    </>
  )
}

export default Administrator
