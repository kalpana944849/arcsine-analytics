import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import Version from '../../../components/layout/Version';
import AdminSidebar from './AdminSidebar';

const ThemeSetting = () => {
    const [indent, setIndent] = useState('5');
    const [iconMargin, setIconMargin] = useState('5');
    const [rowColor, setRowColor] = useState(localStorage.getItem('row-color') || '#d3d3d3');
    const [rowColor2, setRowColor2] = useState(localStorage.getItem('row-color2') || '#ffffff');
    const [primaryColor, setPrimaryColor] = useState('#190032');
    const pathName = window.location.pathname;
    const [isActive, setActive] = useState(false);

    const handleToggle = () => {
        setActive(!isActive);
    };
    const version = process.env.REACT_APP_VERSION;

    const changeTheme = () => {
        document.documentElement.style.setProperty('--indent-space', indent + 'px');
        document.documentElement.style.setProperty('--treelist-carrent-icon-space', iconMargin + 'px');
        document.documentElement.style.setProperty('--primary_color', primaryColor);
        localStorage.setItem('row-color', rowColor);
        localStorage.setItem('row-color2', rowColor2);
    }
    const changeTheme2 = (sName, sValue) => {
        document.documentElement.style.setProperty(sName, sValue)
    }


    return (
        <div className="main">
       <AdminSidebar setActive ={setActive}/>
      <div className={!isActive ? " main_section bodyexpand" : "main_section"}>
            {/* <header className="header" style={{ borderBottom: '1px solid #f1efef' }}>
                <span style={{ float: 'right', marginRight: '10px' }}>
                    <img style={{ height: 25, width: 25 }} src='/images/icon/myaccount.png' alt='user-logo' title='demo-user' />

                </span>
            </header> */}
            <section className="main_content_top">
                <form class="row g-3">
                    <div class="col-md-2">
                        <label for="inputState" class="form-label">Tree List Indent</label>
                        <select id="inputState" class="form-select" value={indent} onChange={(e) => setIndent(e.target.value)}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div class="col-md-2" style={{ marginLeft: 20 }}>
                        <label for="exampleColorInput" class="form-label">Even Row Color</label>
                        <input type="color" class="form-control form-control-color" id="exampleColorInput" value={rowColor} onChange={(e) => setRowColor(e.target.value)} title="Choose your color"></input>
                    </div>
                    <div class="col-md-2">
                        <label for="exampleColorInput" class="form-label">Odd Row Color</label>
                        <input type="color" class="form-control form-control-color" id="exampleColorInput" value={rowColor2} onChange={(e) => setRowColor2(e.target.value)} title="Choose your color"></input>
                    </div>
                    <div class="col-md-4">
                        <label for="inputState" class="form-label">Treelist Icon Margin</label>
                        <select id="inputState" class="form-select" value={iconMargin} onChange={(e) => setIconMargin(e.target.value)}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="exampleColorInput" class="form-label">Primary Color</label>
                        <input type="color" class="form-control form-control-color" id="exampleColorInput" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} title="Choose your color"></input>
                    </div>
                    <div class="col-12">
                        <button type="button" onClick={() => changeTheme()} class="btn btn-primary">Save</button>
                    </div>



                </form>
            </section>
        </div>
    </div>
       
    )
}

export default ThemeSetting
