import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Version from "../../components/layout/Version";
import { TreelistService } from "../../services/treelist-service";
import { setTreelist } from "../../store/reducers/treelistReducer";
//import folderImg from "../../assets/images/icons.png";

// import ProjectsModal from '../modals/ProjectsModal';

const Administration = () => {
  const pathName = window.location.pathname;
  const version = process.env.REACT_APP_VERSION;
  const [isActive, setActive] = useState(JSON.parse(localStorage.getItem("sidebarActive"))|| false);

  const handleToggle = () => {
    setActive(!isActive);
  };
  const dispatch = useDispatch();
  const getTreeListDemo = async () => {
    const response = await TreelistService();
    if (response.status === 200) {
      dispatch(setTreelist({ treelist: response.data.demoTreelist }));
      localStorage.setItem(
        "treeListDemo",
        JSON.stringify(response.data.demoTreelist)
      );
    }
  };
  useEffect(() => {
    getTreeListDemo();
    JSON.stringify(localStorage.setItem("sidebarActive",isActive))
  }, [isActive]);
  // const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  return (
    <React.Fragment>
      <div className="main">
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
                onClick={() => handleToggle()}
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
              <li>
                <Link
                  to="/user"
                  className={`${pathName === "/user" ? "active" : ""}`}
                >
                  <i className="fa-solid fa-user"></i>
                  <span>User</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/theme-setting"
                  className={`${pathName === "/theme-setting" ? "active" : ""}`}
                >
                <i class="fa-solid fa-user-lock"></i>
                  <span>Permissions</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/icons"
                  className={`${pathName === "/icons" ? "active" : ""}`}
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
              <li>
                <Link
                  to="/theme-setting"
                  className={`${pathName === "/theme-setting" ? "active" : ""}`}
                >
                <i class="fa-solid fa-paint-roller"></i>
                
                  <span>Theme Style</span>
                </Link>
              </li>
              <li>
              <Link
                to="/theme-style"
                className={`${pathName === "/theme-style" ? "active" : ""}`}
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
                title={`Vesion (${version})`}
              >
                <Link to="#" style={{ marginLeft: '25px', marginRight:'25px'}}>
                <i class="fa-solid fa-code-compare"></i>
                  <Version />
                </Link>
              </li>
            </ul>
          </div>
          </div>
        </div>
        <div className={isActive ? " main_section bodyexpand" : "main_section"}>
          
          <section className="main_content_top"></section>
        </div>
      </div>
      
    </React.Fragment>
  );
};

export default Administration;
