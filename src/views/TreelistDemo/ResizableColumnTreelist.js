import * as React from 'react';
import {TreeList, createDataTree, extendDataItem, mapTree} from '@progress/kendo-react-treelist';
import {Link} from 'react-router-dom';
import employeesFlat from '../../flat-data';
import TreelistDemoSideBar from './TreelistDemoSideBar';
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
        width: '280px',
        locked: true
    }, {
        field: 'folderNameLong',
        title: 'Long Name',
        width: '230px'
    }

];

const ResizableColumnTreelist = () => {
    const [state, setState] = React.useState({
    
        columns
    });
    const table = React.useRef();
    const data = [...dataTree];
    const [expanded, setExpanded] = React.useState([1, 2, 32]);
    const onExpandChange = e => {
        setExpanded(e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId]);
    };
    const callback = item => expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
        [expandField]: true
    }) : item;
    const onColumnResize = (event) => {
        if (table) {
            table.current.element.style.width = `${event.totalWidth}px`;
        }
        if (event.end) {
            setState({
                ...state,
                columns: event.columns
            });
        }
    };
 
    return(
        <>
            <div className="main">
            <TreelistDemoSideBar/>

            </div>
            <div className="main_section">
                <header className="header"></header>
                <section className="main_content">
                    <TreeList
                        ref={table}
                        tableProps={{
                            ref: table
                        }}
                        style={{
                            maxHeight: '510px',
                            width:'1200px',
                            overflow: "auto",
                            display: "inline-block"
                        }} 
                        data={mapTree(data, subItemsField, callback)} expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange}
                        columns={state.columns} 
                        resizable={true}
                        onColumnResize={onColumnResize}/>
                </section>
            </div>
        </>
    )
}
export default ResizableColumnTreelist