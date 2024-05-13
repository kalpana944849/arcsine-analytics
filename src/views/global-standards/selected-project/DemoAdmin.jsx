// import React, { useEffect, useState } from 'react'
import TreelistDemoSideBar from '../../TreelistDemo/TreelistDemoSideBar'
// import axios from 'axios'
import { TreeList, createDataTree, extendDataItem, getSelectedState, mapTree, removeItems } from '@progress/kendo-react-treelist';

import folderImg from '../../../assets/images/folder2.svg'
import { ContextMenu, MenuItem, Splitter } from '@progress/kendo-react-layout';
// import { TerminologyCode } from '../../terminologyCode';
import { getter } from '@progress/kendo-react-common';
import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import ControlledDetailDialog from '../../TreelistDemo/AddEditTreelist/ControlledDetailDialog';
import IconAddDialog from '../../TreelistDemo/AddEditTreelist/IconAddDialog';
//import IconAddParent from '../../AddEditTreelist/IconAddParent';
import IconAddParent from '../../TreelistDemo/AddEditTreelist/IconAddParent';

import IconEditingDialog from '../../TreelistDemo/AddEditTreelist/IconEditingDialog';
import axios from 'axios';
import CustomCell from '../../../components/common/CustomCell';
import RowRender from '../../../components/common/RowRender';
import { handleContextMenu, onChange } from '../../../utils/common-helper';
import ControlledCodeDetailDialog from '../../TreelistDemo/AddEditTreelist/ControlledCodeDetailDialog';
import { Link } from 'react-router-dom';

const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "libraryControlledTerminologyCategoryId";
const DATA_ITEM_KEY1 = "libraryControlledTerminologyGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const idGetter1 = getter(DATA_ITEM_KEY1);

const extendData = (dataState, selectedState, expandedState) => {
  return mapTree(dataState, subItemsField, (item) =>
    extendDataItem(item, subItemsField, {
      selected: selectedState[idGetter(item)],
      expanded: expandedState[idGetter(item)],
    })
  );
};
const extendData1 = (dataState, selectedState, expandedState) => {
  return mapTree(dataState, subItemsField, (item) =>
    extendDataItem(item, subItemsField, {
      selected: selectedState[idGetter1(item)],
      expanded: expandedState[idGetter1(item)],
    })
  );
};


const DemoAdmin = () => {
  const pathName = window.location.pathname
  
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


  



  const columnsCategory = [
    {
      field: 'libraryControlledTerminologyCategoryNameShort',
      title: 'Controlled Terminology Category',
      expandable: true,
      width: '500px',
      cell: (props) => <CustomCell {...props} onRowClick={onCategoryRowClick} />,
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Category
            </td>
            <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
                // setOpenAddItem(true);
                // setType('folder')
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setOpenAddItem(true);
                setType('file')
              }}><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td>
          </th>
        )
      }
    }
  ];

 



 

  

 
  







  return (
    <>
      <div className="main">
        <div className='main_menu sidebar' id="sidebar">

          <div className="main_menu_child">
            <div className="sidebar_top">
              <h4><Link to="/">Arcsine Analytics</Link></h4>
              <Link onClick={() => handleToggle()} to="#" className="sidebar_btn">
                <i className="fa-solid fa-bars-staggered"></i>
              </Link>
            </div>

            <div className="sidebar_breadcrumb">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><Link to="/">Home \</Link></li>
                  <li className="breadcrumb-item-inner"><Link to="/global-standards">Global Standards</Link></li>
                </ol>
              </nav>
            </div>
            <ul className="sidebar_list">

              <li>
                <Link to="/data-standards" className={`${pathName === '/data-standards' ? 'active' : ''}`}>
                  <i className="fa-solid fa-database"></i>
                  <span>Data Standards</span></Link>
              </li>
              <li>
                <Link to="/analysis-standards" className={`${pathName === '/analysis-standards' ? 'active' : ''}`}>
                  <i className="fa-solid fa-chart-simple"></i>
                  <span>Analysis Standards</span></Link>
              </li>
              <li className={`${pathName === '/controlledterminology-global' ? 'active' : ''}`}>
                <Link to="/controlledterminology-global"  >
                  <i className="fa-solid fa-chart-simple"></i>
                  <span>Controlled Terminology</span></Link>
              </li>
               <li className={`${pathName === 'standard-components' ? 'active' : ''}`} >
              <Link to="/standard-components" >
              <i class="fa-solid fa-puzzle-piece"></i>
                <span>Standard Components</span></Link>
            </li>



            </ul>
            <div className="position-absolute bottom-0 start-0 w-100" >
              <ul className="sidebar_list">
                <li style={{ marginLeft: 25, marginRight: 25 }} title="Version (1.2.4)">
                  <Link to="#">
                    <i className="fas fa-user"></i>
                    <span   >User Profile</span></Link>
                </li>
                <li style={{ marginLeft: 25, marginRight: 25 }} title="Version (1.2.4)">
                  <Link to="#">
                    <i className="fas fa-yin-yang"></i>
                    <span   >Version (1.2.4)</span></Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

      <div className='main_section' >

        <section className="main_content">
            <Splitter
              style={{
                height: "100vh",
                backgroundColor:'yellow',
                overflow: 'auto',

              }}
              panes={panes}
              orientation={"horizontal"}
              onChange={(event) => onChange(event, setPanes)}
              scrollable={false}
            >
              <TreeList style={{
                    border: 'none',
                    height:'100vh',
                backgroundColor:'red',
                    

                    overflow: 'auto',

                  }}
                    noRecords="Please Select Controlled Terminology Category"
                  />

             
              
                  <TreeList style={{
                    border: 'none',
                    height:'100vh',
                    backgroundColor:'blue',

                    overflow: 'auto',

                  }}
                    noRecords="Please Select Controlled Terminology Category"
                  />

                
              
            </Splitter>
          {/* <ContextMenu
            show={showFolderItem}
            offset={offset.current}
            onSelect={handleOnSelect}
            onClose={handleCloseMenu}
          >
            <MenuItem
              text={`Detail ${selectedRow.libraryControlledTerminologyCategoryNameShort}`}
              data={{
                action: "detailFolder",
              }}
              icon="detail-section"
            />
            <MenuItem
              text={`Edit ${selectedRow.libraryControlledTerminologyCategoryNameShort}`}
              data={{
                action: "editFolder",
              }}
              icon="edit"
            />

            <MenuItem
              text={`Delete ${selectedRow.libraryControlledTerminologyCategoryNameShort}`}
              data={{
                action: "deleteFolder",
              }}
              icon="delete"
            />
            <MenuItem
              data={{
                action: "addFolder",
              }}
              render={() => (
                <>
                  <img src={folderImg} />
                  Add {selectedRow.libraryControlledTerminologyCategoryNameShort} Folder
                </>
              )}
            />
          </ContextMenu>
          <ContextMenu
            show={showCodeContext}
            offset={offset.current}
            onSelect={handleOnCodeSelect}
            onClose={handleCodeCloseMenu}
          >
            <MenuItem
              text={`Detail ${selectedCodeRow.libraryControlledTerminologyNameShort}`}
              data={{
                action: "detailCodeFolder",
              }}
              icon="detail-section"
            />
            <MenuItem
              text={`Edit ${selectedCodeRow.libraryControlledTerminologyNameShort}`}
              data={{
                action: "editCodeFolder",
              }}
              icon="edit"
            />
            <MenuItem
              text={`Delete ${selectedCodeRow.libraryControlledTerminologyNameShort}`}
              data={{
                action: "deleteCodeFolder",
              }}
              icon="delete"
            />
            <MenuItem
              data={{
                action: "addCodeFolder",
              }}
              render={() => (
                <>
                  <img src={folderImg} />
                  Add {selectedCodeRow.libraryControlledTerminologyNameShort} Folder
                </>
              )}
            />

          </ContextMenu> */}

          {/* {openAddItem && (
            <IconAddParent
              setFolderName={setFolderName}
              type={type}
              save={() => {
                setStateCategory({
                  ...stateCategory,
                  data: [...stateCategory.data,
                  {
                    "libraryControlledTerminologyCategoryId": 500,
                    "libraryControlledTerminologyCategoryId": "5301685A-DD05-452C-88B2-1E8FCEC97156",
                    "companyId": 1,
                    "isSystem": false,
                    "parentId": null,
                    "isFolder": false,
                    "libraryControlledTerminologyCategoryNameShort": folderName,
                    "libraryControlledTerminologyCategoryNameLong": "Covariance Matrix",
                    "libraryControlledTerminologyCategoryDescription": "Covariance Matrix",
                    "isExtendable": false,
                    "iconId": null,
                    "displayOrder": 1,

                  }
                  ]
                });
                setOpenAddItem(false);
              }}
              cancel={() => setOpenAddItem(false)}
            />
          )} */}
          {/* {openAddItemCode && (
            <IconAddParent
              setFolderName={setFolderName}
              type={type}
              save={() => {
                setStateCode({
                  ...stateCode,
                  data: [...stateCode.data,
                  {
                    "libraryControlledTerminologyId": 250,
                    "libraryControlledTerminologyGuid": "F6F7E6B4-742E-4035-A5D6-705C33AA47CD",
                    "libraryControlledTerminologyCategoryId": 1,
                    "parentId": null,
                    "isFolder": false,
                    "libraryControlledTerminologyNameShort": folderName,
                    "libraryControlledTerminologyNameLong": "Unstructured",
                    "libraryControlledTerminologyDescription": "Unstructured",
                    "isCustom": false,
                    "isHidden": false,
                    "displayOrder": 1
                  }
                  ]
                });
                setOpenAddItemCode(false);
              }}
              cancel={() => setOpenAddItemCode(false)}
            />
          )}
          {showPop && (
            <IconAddDialog
              selectedRow={selectedRow}
              setFolderName={setFolderName}
              setFileName={setFileName}
              type={type}
              save={addFolder}
              cancel={cancelPop}
              title={selectedRow.libraryControlledTerminologyCategoryNameShort}
            />
          )}
          {showCodePop && (
            <IconAddDialog
              selectedRow={selectedCodeRow}
              setFolderName={setFolderName}
              setFileName={setFileName}
              type={type}
              save={addCodeFolder}
              cancel={() => setShowCodePop(false)}
              title={selectedCodeRow.libraryControlledTerminologyNameShort}
            />
          )}
          {showEditPop && (
            <IconEditingDialog
              itemInEdit={stateCategory.itemInEdit}
              save={save}
              cancel={() => setShowEditPop(false)}
              title={selectedRow.libraryControlledTerminologyCategoryNameShort}
              id={"libraryControlledTerminologyCategoryNameShort"}

            />
          )}
          {showEditCodePop && (
            <IconEditingDialog
              itemInEdit={stateCode.itemInEdit}
              save={saveCode}
              cancel={() => setShowEditCodePop(false)}
              title={selectedCodeRow.libraryControlledTerminologyNameShort}
              id={"libraryControlledTerminologyNameShort"}

            /> */}
          {/* )}
          {(showDetail || detailFile) && (
            <ControlledDetailDialog selectedRow={selectedRow} title={selectedRow.libraryControlledTerminologyCategoryNameShort} id={selectedRow.libraryControlledTerminologyCategoryId} cancel={cancelDetail} />
          )}
          {(showCodeDetail) && (
            <ControlledCodeDetailDialog selectedRow={selectedCodeRow} cancel={cancelCodeDetail} />
          )} */}
        </section>
        {/* <div class={`modal fade  ${showAddPopup?'show d-block' : ''} `} id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Controlled Terminology Category</h5>
                <button type="button" class="btn-close" id='close_add_parent' data-bs-dismiss="modal" aria-label="Close" onClick={()=>setShowAddPopup(false)}></button>
              </div>
              <div class="modal-body">
                <form onSubmit={(e) => handleAddParent(e)}>
                  <div class="row mb-3">
                    <div class="col">
                      <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                      <input type="text" class="form-control" id='shortName' name='shortName' onChange={(e) => setShortName(e.target.value)}/>
                    </div>
                    <div class="col">
                      <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                      <input type="text" class="form-control" id='longName' name='longName' onChange={(e) => setLongName(e.target.value)} />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                    <input type="text" class="form-control" id="desc" name='desc' onChange={(e) => setDesc(e.target.value)} />
                  </div>
                  <button type="submit" class="btn btn-primary">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className={`modal fade  ${showUpdatePopup?'show d-block' : ''} `} id="exampleModalEdit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Controlled Terminology Category</h5>
                <button type="button" class="btn-close" id='close_edit_parent' data-bs-dismiss="modal" aria-label="Close" onClick={()=>setShowUpdatePopup(false)}></button>
              </div>
              <div class="modal-body">
                <form onSubmit={(e) => handleUpdateParent(e)}>
                  <div class="row mb-3">
                    <div class="col">
                      <label htmlFor="exampleInputEmail1" class="form-label">Short Name</label>
                      <input type="text" class="form-control" id='shortName' name='shortName' onChange={(e) => setShortName(e.target.value)} value={shortName}/>
                    </div>
                    <div class="col">
                      <label htmlFor="exampleInputEmail1" class="form-label">Long Name</label>
                      <input type="text" class="form-control" id='longName' name='longName' onChange={(e) => setLongName(e.target.value)} value={longName}/>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label htmlFor="exampleInputEmail1" class="form-label">Description</label>
                    <input type="text" class="form-control" id="desc" name='desc' onChange={(e) => setDesc(e.target.value)} value={desc}/>
                  </div>
                  <button type="submit" class="btn btn-primary">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div> */}
        </div>

      </div>
    </>
  )
}

export default DemoAdmin
