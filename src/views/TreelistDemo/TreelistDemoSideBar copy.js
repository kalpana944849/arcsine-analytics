import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const TreelistDemoSideBar = () => {
    const pathName = window.location.pathname;
    const [isHovering, setIsHovering] = useState(false);
    const [isActive, setActive] = useState(false);
   
    const handleToggle = () => {
        setActive(!isActive);
      };

    const handleMouseOver = () => {
        setIsHovering(true);
      };
      const handleMouseOut = () => {
        setIsHovering(false);
      };

  return (
    <>
       <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                
                        <h4>
                            <Link to="/">Arcsine Analytics</Link>
                        </h4>
                        <Link to="#" class="sidebar_btn" onClick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home \</Link>
                                </li>
                 
                         
                            </ol>
                        </nav>
                    </div>
        
                    <ul className="sidebar_list">
            
                        <li className={`${pathName === "/external-form-treelist" ? "active" : ''}`} >
                            <Link  to="/external-form-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>External Form Treelist</span></Link>
                        </li>
                        <li className={`${pathName === "/icon-treelist" ? "active" : ''}`} >
                                <Link  to="/icon-treelist">
                                    <i className="fa-solid fa-database"></i>
                                    <span>Icon Treelist</span></Link>
                            </li>
                        <li className={`${pathName === "/treelist-demo" ? "active" : ''}`}>
                        <Link to="/treelist-demo">
                            <i className="fa-regular fa-square-plus"></i>
                            <span>Drag&DropTreelist</span></Link>
                        </li>
{/*                
                        <li className={`${pathName === "/simple-treelist" ? "active" : ''}`}>
                            <Link to="/simple-treelist">
                                <i className="fa-solid fa-book"></i>
                                <span>Simple Data Treelist</span></Link>
                        </li>  */}
                         <li className={`${pathName === "/custom-treelist-cell" ? "active" : ''}`}>
                            <Link to="/custom-treelist-cell">
                                <i className="fa-solid fa-database"></i>
                                <span>Custom Treelist Cell</span></Link>
                        </li>
                        <li className={`${pathName === "/filter-sort-treelist" ? "active" : ''}`}>
                            <Link to="/filter-sort-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Filter&Sort Treelist</span></Link>
                        </li>
                        <li className={`${pathName === "/resizable-column-treelist" ? "active" : ''}`}>
                            <Link to="/resizable-column-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Resizable Column Treelist</span></Link>
                        </li>
                        <li className={`${pathName === "/locked-column-treelist" ? "active" : ''}`}>
                            <Link to="/locked-column-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Locked Column Treelist</span></Link>
                        </li>
                        <li className={`${pathName === "/reorder-column-treelist" ? "active" : ''}`}>
                            <Link to="/reorder-column-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Reorder Column Treelist</span></Link>
                        </li>
                        <li className={`${pathName === "/column-menu-treelist" ? "active" : ''}`}>
                            <Link to="/column-menu-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Column Menu Treelist</span></Link>
                        </li> 
                        {/* <li className={`${pathName === "/excel-export-treelist" ? "active" : ''}`}>
                            <Link to="/excel-export-treelist">
                                <i className="fa-solid fa-chart-simple"></i>                      
                                <span>Excel Export Treelist</span></Link>
                        </li> */}
                        
                                <li   className={isHovering ?  'versionHide' : 'versionShow start-0'}  title="Version (1.2.4)">
                                   {/* <div  onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} > */}
                                   <Link to="#">
                                        <i style={{ position:'sticky'}} className="fas fa-yin-yang"></i>
                                        <span  >Version (1.2.4)</span></Link>
                                        {/* </div> */}
                                </li>
                        
                    </ul>
            
                </div>
            </div>  
    </>
  )
}

export default TreelistDemoSideBar