import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import Version from '../../../components/layout/Version';
import { Splitter } from '@progress/kendo-react-layout';
import { TreeList, createDataTree, getSelectedState } from '@progress/kendo-react-treelist';
import { extendDataItem, getter, mapTree } from '@progress/kendo-react-common';
import CustomCell from '../../../components/common/CustomCell';
import { onChange } from '../../../utils/common-helper';
import AdminSidebar from './AdminSidebar';


const data = [
    {
        "iconId": 0,
        "iconGuid": '0',
        "companyId": 1,
        "parentId": null,
        "isFolder": true,
        "iconNameShort": 'Generals',
        "iconNameLong": 'Generals',
        "iconDescription": '',
        "iconLabel": '',
        "iconUrl": null,
        "displayOrder": 0,
        "base64Image": '',
        "fileName": ''
    },
    {
        "iconId": 1,
        "iconGuid": '1',
        "companyId": 1,
        "parentId": null,
        "isFolder": true,
        "iconNameShort": 'Treelist',
        "iconNameLong": 'Treelist',
        "iconDescription": '',
        "iconLabel": '',
        "iconUrl": null,
        "displayOrder": 0,
        "base64Image": '',
        "fileName": ''
    }
]

const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "iconGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);


const ThemeStyle = () => {
    const [indent, setIndent] = useState('5');
    const [iconMargin, setIconMargin] = useState('5');
    const [rowColor, setRowColor] = useState(localStorage.getItem('row-color') || '#d3d3d3');
    const [rowColor2, setRowColor2] = useState(localStorage.getItem('row-color2') || '#ffffff');
    const [primaryColor, setPrimaryColor] = useState('#190032');
    const pathName = window.location.pathname;
    const version = process.env.REACT_APP_VERSION;
    const [isActive, setActive] = useState(false);
    const [iconId, setIconId] = useState('');

    const changeTheme = () => {
        document.documentElement.style.setProperty('--indent-space', indent + 'px');
        document.documentElement.style.setProperty('--treelist-carrent-icon-space', iconMargin + 'px');
        document.documentElement.style.setProperty('--primary_color', primaryColor);
        localStorage.setItem('row-color', rowColor);
        localStorage.setItem('row-color2', rowColor2);
    }

    const handleToggle = () => {
        setActive(!isActive);
    };

    const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) => {
            return (
                extendDataItem(item, subItemsField, {
                    selected: selectedState[idGetter(item)],
                    expanded: expandedState[idGetter(item)],
                })
            )
        }
        );
    };
    const [selectedState, setSelectedState] = React.useState({});
    const dataTreeCate = createDataTree(data, i => i.iconId, i => i.parentId, subItemsField);
    const [stateCategory, setStateCategory] = React.useState({
        data: [...dataTreeCate],
        itemInEdit: undefined,
    });
    const onRowClick = (event, props) => {
        props.selectionChange(event);
        setIconId(props.dataItem.iconId)
    }
    const columnsCategory = [
        {
            field: 'iconNameShort',
            title: 'Icon Name Short',
            expandable: true,
            width: '500px',
            cell: (props) => <CustomCell {...props} onRowClick={onRowClick} />,
            headerCell: () => {
                return (
                    <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <td>
                            Icons
                        </td>
                        <td style={{ border: 'none' }}>

                        </td>
                    </th>
                )
            }
        }
    ];
    const [expandedState, setExpandedState] = React.useState({
        1: true,
        2: true,
        32: true,
    });
    const onExpandChangeCategory = React.useCallback(
        (e) => {
            setExpandedState({
                ...expandedState,
                [idGetter(e.dataItem)]: !e.value,
            });
        },
        [expandedState]
    );
    const onSelectionChange = React.useCallback(

        (event) => {
            const newSelectedState = getSelectedState({
                event,
                selectedState: selectedState,
                dataItemKey: DATA_ITEM_KEY,
            });
            Object.keys(newSelectedState).forEach((key) => {
                if (key !== event.dataItem.iconGuid) {
                    delete newSelectedState[key]
                }
            })
            setSelectedState(newSelectedState);
        },
        [selectedState]
    );
    const [panes, setPanes] = React.useState([
        {
            size: "50%",
            min: "20%",
            collapsible: true,
            scrollable: false,
        },
        {
            min: "20%",
            collapsible: true,
            scrollable: false,

        }
    ]);
    useEffect(()=>{
        //alert('semantic version checking')
    }, [])
    return (
        <div className="main">
            <AdminSidebar setActive ={setActive}/>
      <div className={!isActive ? " main_section bodyexpand" : "main_section"}>

                <section >

                    <div
                        className="icon-treelist"
                        style={{ height: "100%", padding: "20px" }}
                    >
                        <Splitter
                            style={{
                                height: "94vh",
                            }}
                            panes={panes}
                            orientation={"horizontal"}
                            onChange={(event) => onChange(event, setPanes)}
                            scrollable={false}
                        >
                            <TreeList
                                style={{
                                    border: "none",
                                    maxHeight: "94vh",
                                    overflow: "auto",
                                    // width: '720px'
                                }}
                                data={extendData(
                                    stateCategory.data,
                                    selectedState,
                                    expandedState
                                )}
                                onSelectionChange={onSelectionChange}
                                // rowRender={RowRender}
                                editField={editField}
                                navigatable={true}
                                selectedField={SELECTED_FIELD}
                                selectable={{
                                    enabled: true,
                                }}
                                expandField={expandField}
                                subItemsField={subItemsField}
                                onExpandChange={onExpandChangeCategory}
                                columns={columnsCategory}
                            />

                            <div
                                style={{ border: "none" }}
                                className={`icon-treelist-form`}
                            >
                                <p style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className='mt-2 fw-bold'>
                                        Component Styles
                                    </span>
                                </p>
                                <div className='mt-3 ' style={{ borderTop: '1px solid gray' }}>
                                    {iconId === 0 &&
                                        <form>
                                            <div className='row mb-2 p-2'>
                                                <div className='col-12'>
                                                    <h6>Header</h6>
                                                </div>
                                                <div className='col-3'>
                                                    <label for="exampleColorInput" className="form-label">Text Color</label>
                                                    <input type="color" className="form-control form-control-color" id="exampleColorInput" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} title="Choose your color"></input>
                                                </div>
                                                <div className='col-3'>
                                                    <label for="exampleColorInput" className="form-label">Fill</label>
                                                    <input type="color" className="form-control form-control-color" id="exampleColorInput" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} title="Choose your color"></input>
                                                </div>
                                            </div>
                                            <div className='row mb-2 border p-2'>
                                                <div className='col-12'>
                                                    <h6>Site</h6>
                                                </div>
                                                <div className='col-3'>
                                                    <label for="exampleColorInput" className="form-label">Primary Color</label>
                                                    <input type="color" className="form-control form-control-color" id="exampleColorInput" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} title="Choose your color"></input>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='mt-2'>
                                                    <button type="button" className="btn btn-primary">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    }
                                    {iconId === 1 &&
                                        <form>
                                            <div className='row mb-2 border-bottom p-2'>
                                                <div className='col-12'>
                                                    <h6>Row</h6>
                                                </div>
                                                <div className='col-4'>
                                                    <label for="exampleColorInput" class="form-label">Odd Row Color</label>
                                                    <input type="color" class="form-control form-control-color" id="exampleColorInput" title="Choose your color"></input>
                                                </div>
                                                <div className='col-4'>
                                                    <label for="exampleColorInput" class="form-label">Even Row Color</label>
                                                    <input type="color" class="form-control form-control-color" id="exampleColorInput" title="Choose your color"></input>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='mt-2'>
                                                    <button type="button" className="btn btn-primary">Save</button>
                                                </div>
                                            </div>
                                        </form>
                                    }
                                </div>
                            </div>
                        </Splitter>
                    </div>
                </section>
            </div>
        </div>

    )
}

export default ThemeStyle;
