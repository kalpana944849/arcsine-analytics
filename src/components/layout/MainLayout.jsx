import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HomeSidebar from './HomeSidebar'
import GlobalStandardSidebar from './GlobalStandardSidebar'

const MainLayout = (props) => {
    const [isActive, setActive] = React.useState(false);
   
    const handleToggle = () => {
        setActive(!isActive);
      };
    useEffect(()=>{
        console.log('main layout', props.page)
    })
    return (
        <div className="main">
            <div className= {isActive ? 'main_menu sidebar menuexpand'  : 'main_menu sidebar'  } id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4><Link to="/">Arcsine Analytics</Link></h4>
                        <Link to="#" onClick = {() => handleToggle()} className="sidebar_btn">
                        <i
                className={
                  isActive
                    ? "fa-solid fa-circle-arrow-right"
                    : "fa-solid fa-circle-arrow-left"
                }
              ></i>
                        </Link>
                    </div>
                    {props.page == 'home'&&<HomeSidebar />}
                    {props.page == 'global-standards'&&<GlobalStandardSidebar />}
                </div>
            </div>
            <div className='main_section'>
                    {props.children}
            </div>
        </div>
    )
}

export default MainLayout
