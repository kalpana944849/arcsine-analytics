import * as React from 'react';
import {TreeList, createDataTree, extendDataItem, mapTree, removeItems} from '@progress/kendo-react-treelist';
import {Button} from '@progress/kendo-react-buttons';
import EditingDialog from './EditingDialog';
import {Link} from 'react-router-dom';
import employeesFlat from '../../../flat-data';
import TreelistDemoSideBar from '../TreelistDemoSideBar';
const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";

const dataTree = createDataTree(employeesFlat, i => i.folderId, i => i.parentId, subItemsField);

const ExternalFormTreelist = () => {
    const[setAddOpen] = React.useState(false)

    const [state, setState] = React.useState({
        data: [...dataTree],
        itemInEdit: undefined
    });
    const [expanded, setExpanded] = React.useState([1, 2, 32]);

    const handleAddOpen = () => {
        setAddOpen(true)
    }
    const edit = (dataItem) => {
        setState({
            ...state,
            itemInEdit: extendDataItem(dataItem, subItemsField)
        });
    };
    const remove = (dataItem) => {
        setState({
            ...state,
            data: removeItems(state.data, subItemsField, (i) => i.folderId === dataItem.folderId)
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
            itemInEdit: undefined
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
            width: '280px'

        }, {
            field: 'folderNameLong',
            title: 'Long Name',
            width: '230px'
        },
        {
            headerCell:  AddCommandCell,

            cell: cellWithEditing
        }

    ];
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