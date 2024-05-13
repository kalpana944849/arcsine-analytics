import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TreeList, createDataTree, mapTree, extendDataItem, removeItems } from '@progress/kendo-react-treelist';
import employeesFlat from '../../../flat-data';
import { Link } from 'react-router-dom';
import EditingDialog from './EditingDialog';
import { Button } from '@progress/kendo-react-buttons';
const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";

const dataTree = createDataTree(employeesFlat, i => i.folderId, i => i.parentId, subItemsField);


const ExternalFormTreelist = () => {
  const[addOpen, setAddOpen] = React.useState(false)

  const [state, setState] = React.useState({
    data: [...dataTree],
    itemInEdit: undefined,
  });
  const [expanded, setExpanded] = React.useState([1, 2, 32]);

  const handleAddOpen = () => {
    setAddOpen(true)
  }
  const edit = (dataItem) => {
    setState({
      ...state,
      itemInEdit: extendDataItem(dataItem, subItemsField),
    });
  };
  const remove = (dataItem) => {
    setState({
      ...state,
      data: removeItems(state.data, subItemsField, (i) => i.folderId === dataItem.folderId),
    });
  };
  const cellWithEditing = (props) => {
    return (
      <td>
        <Button
          className="k-grid-edit-command"
          themeColor={"primary"}
          onClick={() => {
            edit(props.dataItem);
          }}
        >
          Edit
        </Button>
        &nbsp;
        <Button
          className="k-grid-remove-command"
          onClick={() => {
            
              remove(props.dataItem);
          }}
        >
          Remove
        </Button>
      </td>
    );
  };

 
  const callback = item => expanded.includes(item.folderId) ? extendDataItem(item, subItemsField, {
    [expandField]: true
  }) : item;

  const save = (itemInEdit) => {
    setState({
      ...state,
      itemInEdit: undefined,
      data: mapTree(state.data, subItemsField, 
        (item) =>
        itemInEdit.folderId === item.folderId ? itemInEdit : item
        )
    });
  };
  const cancel = () => {
    setState({
      ...state,
      itemInEdit: undefined,
    });
  };
  const AddCommandCell = () => {
    return (
       <td>
        &nbsp;
        &nbsp;
        &nbsp;
        <Button
          className="k-grid-edit-command"
          themeColor={"primary"}
          onClick={() => {
            handleAddOpen()
          }}
        >
          Add
        </Button>
       
    
      </td>
      
    );
    
};
  const onExpandChange = e => {
    setExpanded(e.value ? expanded.filter(folderId => folderId !== e.dataItem.folderId) : [...expanded, e.dataItem.folderId]);
  };
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

}, {
  field: 'folderNameLong',
  title: 'Long Name',
  width: '230px'
},
{
  headerCell:  AddCommandCell,

  cell: cellWithEditing,
}

];
  return(
  <>
  <div class="main">
  <div class="main_menu sidebar" id="sidebar">
    <div class="main_menu_child">
      <div class="sidebar_top">
        <h4>
          <Link to="/">Arcsine Analytics</Link>
        </h4>
        <Link to="#" class="sidebar_btn" onclick="toggleSidebar(this)">
          <i class="fa-solid fa-bars-staggered"></i>
        </Link>
      </div>
      <div class="sidebar_breadcrumb">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <Link to="/">Home \</Link>
                  </li>
                 
                  {/* <li class="breadcrumb-item-inner2">
                    <Link to="#">Manage Project</Link>
                  </li> */}
                </ol>
              </nav>
            </div>
        
            <ul class="sidebar_list">
           
            <li ><Link to="/treelist-demo">
                    <i class="fa-regular fa-square-plus"></i>
                    <span>Drag&DropTreelist</span></Link>
                </li>
               
                <li class="active">
                    <Link to="/simple-treelist">
                    <i class="fa-solid fa-book"></i>
                    <span>Simple Data Treelist</span></Link>
                </li>
                <li>
                    <Link to="/custom-treelist-cell">
                    <i class="fa-solid fa-database"></i>
                    <span>Custom Treelist Cell</span></Link>
                </li>
                <li>
                    <Link to="/filter-sort-treelist">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Filter&Sort Treelist</span></Link>
                </li>
                <li>
                    <Link to="/resizable-column-treelist">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Resizable Column Treelist</span></Link>
                </li>
                <li >
                    <Link to="/locked-column-treelist">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Locked Column Treelist</span></Link>
                </li>
                <li  >
                    <Link to="/reorder-column-treelist">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Reorder Column Treelist</span></Link>
                </li>
                <li >
                    <Link to="/column-menu-treelist">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Column Menu Treelist</span></Link>
                </li> 
                <li   >
                    <Link to="/excel-export-treelist">
                    <i class="fa-solid fa-chart-simple"></i>                      
                   <span>Excel Export Treelist</span></Link>
                </li>
            </ul>
   
  </div>
  </div>
  </div>
  <div class="main_section">
          <header class="header"></header>
          <section class="main_content">
  <TreeList style={{
    maxHeight: '510px',
    overflow: 'auto'
  }} data={mapTree(state.data, subItemsField, callback)}
  editField={editField}
   expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChange} columns={columns} />
   {state.itemInEdit && (
        <EditingDialog
          itemInEdit={state.itemInEdit}
          save={save}
          cancel={cancel}
        />
      )}
 </section>
 </div>
  </>
  )
}
export default ExternalFormTreelist