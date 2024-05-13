import * as React from 'react';
import {TreeList, createDataTree, extendDataItem, mapTree} from '@progress/kendo-react-treelist';
import {Link} from 'react-router-dom';
import employeesFlat from '../../flat-data';
import TreelistDemoSideBar from './TreelistDemoSideBar';
const expandField = 'expanded';
const subItemsField = 'employees';
const dataTree = createDataTree(employeesFlat, i => i.folderId, i => i.parentId, subItemsField);
const MyCell = props => {
    const {
        dataItem
    } = props;
    const field = props.field || '';
    const cellData = dataItem[field];
    return <td>
        { dataItem.parentId === null ? 
            <span
            > <i className='fa-solid fa-folder'></i>{ "  " + String(cellData)}
            </span> : "hello"
        }
    </td>;
};
const columns = [
    {
        field: 'folderId' ,
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
        cell:MyCell 
  
    }, {
        field: 'folderNameLong',
        title: 'Long Name',
        width: '230px'
  
    }

];

const SimpleDataTreelist = () => {
    const data = [...dataTree];
    const [expanded, setExpanded] = React.useState([1, 2, 32]);
    const onExpandChange = e => {
        setExpanded(e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId]);
    };
    const callback = item => expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
        [expandField]: true
    }) : item;
    return(
        <>
            <div className="main">
            <TreelistDemoSideBar/>

            </div>
            <div className="main_section">
                <header className="header"></header>
                <section className="main_content">
                    <TreeList style={{
                        maxHeight: '510px',
                        overflow: 'auto'
                    }} data={mapTree(data, subItemsField, callback)} expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columns} />
                </section>
            </div>
        </>
    )
}
export default SimpleDataTreelist