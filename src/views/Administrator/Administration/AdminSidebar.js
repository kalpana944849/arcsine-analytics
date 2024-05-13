import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Version from '../../../components/layout/Version';

const AdminSidebar = ({setActive}) => {
  const pathName = window.location.pathname;
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  const version = process.env.REACT_APP_VERSION;


 const [isActive, setIsActive] = useState( JSON.parse(localStorage.getItem('sidebarActive')) || false)
  const handleToggle = (isActive) => {
    setIsActive(!isActive)
    setActive(isActive)
  }
  useEffect(() => {
 JSON.stringify(localStorage.setItem('sidebarActive',isActive))
  },[isActive])
  return (
    <>
         <div
          className={
            isActive ? "main_menu sidebar menuexpand" : "main_menu sidebar"
          }
          id="sidebar"
        >
          <div className="main_menu_child">
            <div className="sidebar_top">
              <h4>
                <Link to="/">Arcsine Analytics</Link>
              </h4>
              <Link
                onClick={() => handleToggle(isActive)}
                to="#"
                className="sidebar_btn"
                
              >
                <i  className={
            isActive ? "fa-solid fa-circle-arrow-right" : "fa-solid fa-circle-arrow-left"
          }></i>
              </Link>
            </div>
            <div className="sidebar_breadcrumb">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home \</Link>
                  </li>
                  <li className="breadcrumb-item-inner">
                    <Link to="/administration">Administration</Link>
                  </li>
                </ol>
              </nav>
            </div>

            <ul className="sidebar_list">
            <li className={`${splitLocation[1] === "user" ? "active" : ""}`}>

                <Link
                  to="/user"
                  title="user"
                  
                >
                  <i className="fa-solid fa-user"></i>
                  <span>User</span>
                </Link>
              </li>
              <li className={`${splitLocation[1] === "permissions" ? "active" : ""}`}>

                <Link
                  to="#"
                  title="permissions"
                  
                >
                <i class="fa-solid fa-user-lock"></i>
                  <span>Permissions</span>
                </Link>
              </li>

            <li className={`${splitLocation[1] === "icons" ? "active" : ""}`}>
                <Link
                  to="/icons"
                  title='icons'
                  className='active'
                 // className={`${pathname === "/icons" ? "active" : ""}`}
                >

                  {/* <img src={dataItem?.iconUrl || folderImg} alt="folder-icon" className='me-2' /> */}
      {/* <img
       style={{ height: 22, width: 25, display:'block' }}
        //className=" me-2 treelist-carrent-icon-space"
        src={folderImg}
        alt="icon"
      />  */}
      <i className="fa-solid fa-camera"></i>
                  <span>Icons</span>
                </Link>
              </li>
              <li className={`${splitLocation[1] === "theme-setting" ? "active" : ""}`}>

                <Link
                  to="/theme-setting"
                  title="theme-setting"
                >
                <i class="fa-solid fa-paint-roller"></i>
                
                  <span>Theme Style</span>
                </Link>
              </li>
              <li className={`${splitLocation[1] === "theme-style" ? "active" : ""}`}>
              
              <Link
                to="/theme-style"
                title="theme"
              >
               <i class="fa-solid fa-palette"></i>
                <span>Theme</span>
              </Link>
            </li>

            </ul>
            <div className="sidebar_bottom "  >
            <ul className="sidebar_list_bottom position-absolute bottom-0 start-0 w-100 " style={{maxHeight:'20vh'}}>
              <li
               title="user-profile"
              >
                <Link to="#" style={{ marginLeft: '25px', marginRight:'25px'}}>
                <i class="fa-solid fa-id-card"></i>
                  <span>User Profile</span>
                </Link>
              </li>
              <li
                //title={`Vesion (${version})`}
              >
                <Link title={`Version (${version})`} to="#" style={{ marginLeft: '25px', marginRight:'25px'}}>
                <i class="fa-solid fa-code-compare"></i>
                  <Version/>
                </Link>
              </li>
            </ul>
          </div>
          </div>
        </div>
        
      
    </>
  )
}

export default AdminSidebar