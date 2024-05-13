import * as React from 'react';
import {TreeList, TreeListToolbar, createDataTree, extendDataItem, filterBy, mapTree, orderBy, treeToFlat} from '@progress/kendo-react-treelist';
import {ExcelExport} from '@progress/kendo-react-excel-export';
import {Link} from 'react-router-dom';
import employeesFlat from '../../flat-data';
import Header from '../Header';
const expandField = 'expanded';
const subItemsField = 'employees';
const dataTree = createDataTree(employeesFlat, i => i.folderId, i => i.parentId, subItemsField);
const columns = [
    {
        field: 'folderId',
        title: 'Folder Id',
        width: '15px'
    },
    {
        field: 'companyId',
        title: 'Company Id',
        width: '15px'
    },
      
    {
        field: 'folderNameShort',
        title: 'Short Name',
        expandable: true,
        width: '280px'

    }, {
        field: 'folderNameLong',
        title: 'Long Name',
        width: '230px'
    }

];

const ExcelExportTreelist = () => {
    let _export;

    const [state, setState] = React.useState({
        data : [...dataTree],
        dataState: {
            sort: [
                {
                    field: "name",
                    dir: "asc"
                }
            ],
            filter: []
        }
    
    });
    const [expanded, setExpanded] = React.useState([1, 2, 32]);
    const onExpandChange = e => {
        setExpanded(e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId]);
    };
    const callback = item => expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
        [expandField]: true
    }) : item;

    const handleDataStateChange = (event) => {
        setState({
            ...state,
            dataState: event.dataState
        });
    };

    const addExpandField = (dataTree) => {
        return mapTree(dataTree, subItemsField,callback);
    };

    const processData = () => {
        let {data, dataState} = state;
        let filteredData = filterBy(data, dataState.filter, subItemsField);
        let sortedData = orderBy(filteredData, dataState.sort, subItemsField);
        return addExpandField(sortedData);
    };
    const exportToExcel = () => {
        _export.save(
            treeToFlat(processData(), expandField, subItemsField),
            columns
        );
    };
    return(
        <>
            <div className="main">
                <div className="main_menu sidebar" id="sidebar">
                    <div className="main_menu_child">
                        <div className="sidebar_top">
                            <h4>
                                <Link to="/">Arcsine Analytics</Link>
                            </h4>
                            <Link to="#" class="sidebar_btn" onclick="toggleSidebar(this)">
                                <i className="fa-solid fa-bars-staggered"></i>
                            </Link>
                        </div>
                        <div className="sidebar_breadcrumb">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Home \</Link>
                                    </li>
                 
                                    {/* <li class="breadcrumb-item-inner2">
                    <Link to="#">Manage Project</Link>
                  </li> */}
                                </ol>
                            </nav>
                        </div>
        
                        <ul className="sidebar_list">
            
                            <li  >
                                <Link to="/external-form-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>External Form Treelist</span></Link>
                            </li>
                            <li >
                                <Link to="/icon-treelist">
                                    <i className="fa-solid fa-database"></i>
                                    <span>Icon Treelist</span></Link>
                            </li>
                            <li ><Link to="/treelist-demo">
                                <i className="fa-regular fa-square-plus"></i>
                                <span>Drag&DropTreelist</span></Link>
                            </li>
               
                            <li>
                                <Link to="/simple-treelist">
                                    <i className="fa-solid fa-book"></i>
                                    <span>Simple Data Treelist</span></Link>
                            </li>
                            <li>
                                <Link to="/custom-treelist-cell">
                                    <i className="fa-solid fa-database"></i>
                                    <span>Custom Treelist Cell</span></Link>
                            </li>
                            <li>
                                <Link to="/filter-sort-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Filter&Sort Treelist</span></Link>
                            </li>
                            <li>
                                <Link to="/resizable-column-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Resizable Column Treelist</span></Link>
                            </li>
                            <li >
                                <Link to="/locked-column-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Locked Column Treelist</span></Link>
                            </li>
                            <li >
                                <Link to="/column-menu-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Column Menu Treelist</span></Link>
                            </li> 
                            <li  >
                                <Link to="/reorder-column-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Reorder Column Treelist</span></Link>
                            </li>
                            <li  className="active" >
                                <Link to="/excel-export-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Excel Export Treelist</span></Link>
                            </li>
                        </ul>
   
                    </div>
                </div>
            </div>
            <div className="main_section">
                <Header/>
                <section className="main_content">
                    <ExcelExport ref={(exporter) => (_export = exporter)} hierarchy={true}>
                        <TreeList style={{
                            maxHeight: '510px',
                            overflow: 'auto'
                        }} 
                        sortable={{
                            mode: "multiple"
                        }}
                        {...state.dataState}
                        onDataStateChange={handleDataStateChange}
                        toolbar={
                            <TreeListToolbar                                            >
                                <button
                                    title="Excel export"
                                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                                    onClick={exportToExcel}
                                >
              Export to Excel
                                </button>
                            </TreeListToolbar>
                        }
                        data={processData()} expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columns} />
                    </ExcelExport>
                </section>
            </div>
        </>
    )
}
export default ExcelExportTreelist