import * as React from 'react';
import {TreeList, TreeListTextFilter, createDataTree, extendDataItem, filterBy, mapTree, orderBy} from '@progress/kendo-react-treelist';
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
        filterCell: TreeListTextFilter
  
    }, {
        field: 'folderNameLong',
        title: 'Long Name',
        width: '230px'
  
    }

];

const FilterSortTreelist = () => {
    const [state, setState] = React.useState({
        filter: [],
        sort: [
            {
                field: "name",
                dir: "asc"
            }
        ]
    })
    const data = [...dataTree];
    const [expanded, setExpanded] = React.useState([1, 2, 32]);
    const onExpandChange = e => {
        setExpanded(e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId]);
    };
    const callback = item => expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
        [expandField]: true
    }) : item;

    const handleSortChange = (event) => {
        setState({
            ...state,
            sort: event.sort
        });
    };

    const handleFilterChange = (event) => {
        setState({
            ...state,
            filter: event.filter
        });
    };
    const addExpandField = (data) => {
    
        return mapTree(data, subItemsField, callback
      
        );
    };
    const processData = () => {
    
        let filteredData = filterBy(data, state.filter, subItemsField);
        return addExpandField(orderBy(filteredData, state.sort, subItemsField ));
    };
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
                    }}  data={processData()} expandField={expandField} subItemsField={subItemsField}
                    sortable={true} onSortChange={handleSortChange}  sort={state.sort}
                    onFilterChange={handleFilterChange} onExpandChange={onExpandChange}  filter={state.filter} columns={columns} />
                </section>
            </div>
        </>
    )
}
export default FilterSortTreelist