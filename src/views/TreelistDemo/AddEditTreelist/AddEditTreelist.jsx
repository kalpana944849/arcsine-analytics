import * as React from 'react';
import {TreeList, createDataTree, extendDataItem, mapTree} from '@progress/kendo-react-treelist';
import {Link} from 'react-router-dom';
import employeesFlat from '../../../flat-data';
const expandField = 'expanded';
const subItemsField = 'employees';
const dataTree = createDataTree(employeesFlat, i => i.folderId, i => i.parentId, subItemsField);

// const MyCell = props => {
//   const {
//     dataItem
//   } = props;
//   const field = props.field || '';
//   const cellData = dataItem[field];
//   return <td>
//         { dataItem.parentId === null ? 
//           <span
//     > <i class='fa-solid fa-folder'></i>{ "  " + String(cellData)}
//     </span> : "hello"
//         }
//       </td>;
// };
// function iconClassName({dataTree}) {
//     if (dataTree.parentId === null) {
//         return 'fa-solid fa-folder'
//     }  else {
//         return "";
//     }
// }
// const MyItem = (props) => {
//     return (
//         <>
//             <span className={iconClassName(props.item)} key="0" /> {props.item.text}
//         </>
//     );
// };
let datas = [];
dataTree.forEach((x)=>{
    let obj = {};
    
    if(x.parentId == null){
        obj = {
            ...x,
            folderNameShort: x.folderNameShort}
    } 
    datas.push(obj);
})

const AddEditTreelist = () => {
    const[addOpen, setAddOpen] = React.useState(false)
    const[folderNameShort, setFolderNameShort] = React.useState('')
    const data = [...datas];
    const [employ, setEmploy] = React.useState(data);

    console.log(folderNameShort)
    const [expanded, setExpanded] = React.useState([1, 2, 32]);
    console.log(employ)

    const handleAddOpen = () => {
        setAddOpen(true)
    }
    const onExpandChange = e => {
        setExpanded(e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId]);
    };
    const callback = item => expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
        [expandField]: true
    }) : item;

    const AddCommandCell = () => {
        return (
            <td >
                <button 
                    //variant="outlined" 
                    style={{border: 'none', marginLeft:'10px'}}
                    onClick={handleAddOpen}
                >Add</button>
            </td>
        );
    
    };
    const EditCommandCell = () => {
        return (
            <td>
                <button 
                    // variant="outlined" 
                    style={{border: 'none', marginLeft:'10px'}}
                    onClick={handleAddOpen}
                >
                    <i  style={{border: 'none', marginRight:'5px', backgroundColor:'white'}} className='fa-solid fa-pencil'></i>
                    <i className='fa-solid fa-trash'></i>
                </button>
            </td>
        );
  
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(folderNameShort);
        setFolderNameShort('');

    }
    const addTask = (userInput) => {
        let copy = [...employ];
        copy = [...copy, {folderId: employ.length + 1, folderNameShort: userInput}];
        setEmploy(copy);
    }
    const handleChange = (e) => {
        setFolderNameShort(e.currentTarget.value)
    }
    const columns = [
    
        {
            field: 'folderNameShort',
            title: 'Short Name',
            expandable: true,
            width: '150px'

        },  
        {   
            headerCell:  AddCommandCell,
            cell: EditCommandCell,
            width: '20px',
            marginLeft: "20px"
        }

    ];
    return(
        <>
            <div className="main">
                <div className="main_menu sidebar" id="sidebar">
                    <div className="main_menu_child">
                        <div className="sidebar_top">
                            <h4>
                                <Link to="/">Arcsine Analytics</Link>
                            </h4>
                            <Link to="#" class="sidebar_btn">
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
                            <li className="active" >
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
                            <li  >
                                <Link to="/reorder-column-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Reorder Column Treelist</span></Link>
                            </li>
                            <li >
                                <Link to="/column-menu-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Column Menu Treelist</span></Link>
                            </li> 
                            <li   >
                                <Link to="/excel-export-treelist">
                                    <i className="fa-solid fa-chart-simple"></i>                      
                                    <span>Excel Export Treelist</span></Link>
                            </li>
                        </ul>
   
                    </div>
                </div>
            </div>
            <div className="main_section">
                <header className="header"></header>
                <section className="main_content">
                    {addOpen && 
 
 <div>
     <input value={folderNameShort} type="text" onChange={handleChange} placeholder="Enter task..."/>
     <button type='submit' onSubmit={handleSubmit}>Submit</button>
 </div>} 
                    {<TreeList style={{
                        maxHeight: '510px',
                        width: '700px',
                        overflow: 'auto'
                    }} data={mapTree(data, subItemsField, callback)}  expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columns} />
                    }
                </section>
            </div>
  
        </>

    )
}
export default AddEditTreelist