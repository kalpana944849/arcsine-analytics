import { ContextMenu, MenuItem, Splitter } from '@progress/kendo-react-layout';
import React, { useEffect, useState } from 'react'
import DynamicTreeList from '../../../../../components/common/DynamicTreeList';
import commonSchema from '../../../../../utils/validationSchema/common-schema';
import { useFormik } from 'formik';
import { deleteSubGroup, getSubGroups, subGroupVariableView, updateSubGroup } from '../../../../../services/statistical-analysis-plan-service';
import { AddSubGroup, AddSubGroupFolder } from './Forms';
import SubGroupsMoveToDifferentFolderModal from './SubGroupsMoveToDifferentFolderModal';
import SweetAlert from 'react-bootstrap-sweetalert';
import { getParsedFromLocalStorage } from '../../../../../utils/common-helper';
import CustomDropDownTreeSubgroup from '../../../../../components/common/CustomDropDownTree/CustomDropDownTreeSubgroup';

const SubGroups = () => {
  const [showSelected, setShowSelected] = useState(false);
  const [selectedRow, setSelectedRow] = useState({})
  const [parentId, setParentId] = useState(0);
  const [parentGuid, setParentGuid] = useState('');
  const [showAddSubGroup, setShowSubGroup] = useState(false);
  const [isFolder, setIsFolder] = useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const [showMoveToDifferentFolderModalSubgroup, setShowMoveToDifferentFolderModalSubgroup] = useState(false);

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
    },
  ]);

  const offset = React.useRef({
    left: 0,
    top: 0
  });

  const [subGroupsData, setSubGroupsData] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);


  const subGroups = async () => {
    const response = await getSubGroups()
    if (response.status == 200) {
      let data = [];
      let resData = response.data.data;
      resData.forEach((x)=>{
         data.push({...x, colKey: `${x.sapSubgroupFolderName == null ? x.sapSubgroupLabel : x.sapSubgroupFolderName}`})
      })
      setSubGroupsData(data);
      return data
    }
  }
  const handleCloseMenu = () => {
    setShowContextMenu(false);
  };
  const openContextMenuSubgroups = (dataItem) => {
    console.log("dataItem", dataItem);
    setSelectedRow(dataItem);
    setShowContextMenu(true);
  };
  const handleDeleteFolder = async () => {
     setMessage('Subgroup has been deleted successfully.')
    const response = await deleteSubGroup(selectedRow.sapSubgroupGuid);
    if(response.status === 200){
      subGroups();
      setShowAlert(true)
    }

  }
  const handleAddFolder = () => {
    // alert(1)
    setParentId(selectedRow.sapSubgroupId);
    setParentGuid(selectedRow.sapSubgroupGuid);
    setIsFolder(true);
    setShowSubGroup(false);
  }
  const handleAddItem = () => {
    setParentId(selectedRow.sapSubgroupId);
    setParentGuid(selectedRow.sapSubgroupGuid);
    setIsFolder(false)
    setShowSubGroup(true)
  }
  const handleEditFolder = () => {
    console.log("delete")
  }
  const setShowMoveToDifferentFolderModal = () => {
    console.log("delete")
  }
  const handleOnSelect = (e) => {
    switch (e.item.data.action) {
      case "addFolder":
        handleAddFolder();
        break;
      case "addItem":
        handleAddItem();
        break;
      case "editFolder":
        handleEditFolder();
        break;
      case "deleteFolder":
        setShowDeleteConfirm(true);
        break;
      case "moveToDifferentFolder":
        setShowMoveToDifferentFolderModalSubgroup(true)
        break;
      default:
    }
    setShowContextMenu(false);
  };
  useEffect(() => {
    subGroups();
  }, []);

  // const endpointData = JSON.parse(localStorage.getItem("dataEndpoint"));
  const formikSubGroupSave = useFormik({
    initialValues: {
      subgroupVariable: selectedRow?.sapDataVariableId || '',
      refrencevalue: selectedRow?.sapSubgroupReferenceValue || '',
      subgrouplabel: selectedRow?.sapSubgroupLabel || '',
      covariance: selectedRow?.sapCovariateVariableId || ''
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log("val", values);
      const reqBody = {
        "sapSubgroupId": selectedRow?.sapSubgroupId,
        "sapSubgroupGuid": selectedRow.sapSubgroupGuid,
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 25,
        "parentId": selectedRow.parentId,
        "parentGuid": selectedRow.parentGuid,
        "isFolder": selectedRow.isFolder,
        "sapSubgroupFolderName": null,
        "sapDataVariableId": values.subgroupVariable,
        "sapSubgroupLabel": values.subgrouplabel,
        "sapSubgroupReferenceValue": values?.refrencevalue,
        "sapCovariateVariableId": values.covariance,
        "displayOrder": selectedRow.displayOrder
    }
    setMessage('Subgroup has been updated successfully.')
    const response = await updateSubGroup(reqBody)
    if(response.status == 200){
      const data = await subGroups()
      const updatedData = data.find((s)=>s.sapSubgroupId == selectedRow.sapSubgroupId);
      setSelectedRow(updatedData)
      setShowAlert(true)
    }
    },
  });
  const formikSubGroupSaveFolder = useFormik({
    initialValues: {
      folderName: selectedRow?.sapSubgroupFolderName || '',
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      console.log("val", values);
      const reqBody = {
        "sapSubgroupId": selectedRow?.sapSubgroupId,
        "sapSubgroupGuid": selectedRow.sapSubgroupGuid,
        "companyId": 1,
        "sapId": 43,
        "sapVersionId": 25,
        "parentId": selectedRow.parentId,
        "parentGuid": selectedRow.parentGuid,
        "isFolder": selectedRow.isFolder,
        "sapSubgroupFolderName": values.folderName,
        "sapDataVariableId": 2345,
        "sapSubgroupLabel": null,
        "sapSubgroupReferenceValue": selectedRow?.refrencevalue,
        "sapCovariateVariableId": selectedRow.covariance,
        "displayOrder": selectedRow.displayOrder
    }
    setMessage('Subgroup has been updated successfully.')
    const response = await updateSubGroup(reqBody)
    if(response.status == 200){
      const data = await subGroups()
      const updatedData = data.find((s)=>s.sapSubgroupId == selectedRow.sapSubgroupId);
      setSelectedRow(updatedData)
      setShowAlert(true)
    }
    },
  });
  const [rowId, setRowId] = useState('')
  const onRowClickSubgroup = (event, param) => {
    if (rowId == param.id) {
      return false
    }
    setRowId(param.id)
    setShowSelected(true)
    param.selectionChange(event);
    setSelectedRow(param.dataItem);
    localStorage.setItem("subGroupSelectedRow", JSON.stringify(param.dataItem));
    console.log("subgroup", param.dataItem);
  };
  const subGroupSelectedRow = getParsedFromLocalStorage('subGroupSelectedRow', {});
	useEffect(() => {
		if (Object.keys(subGroupSelectedRow).length > 0) {
			setSelectedRow(subGroupSelectedRow)
			setShowSelected(true);
		}
	}, []);
  const [varView, setVarView] = useState([])
  const [varViewData, setVarViewData] = useState([])
  const getSubGroupDropDown = async () => {
     const response = await subGroupVariableView()
     setVarView(response.data.data)
     const Data = response.data.data; 
     const treeData = [];
     Data.forEach(element => {
       if (element.isFolder) {
         treeData.push({
           id: element.sapDataVariableId,
           text: element.sapDataDatasetVariableName,
           sapDataVariableGuid: element.sapDataVariableGuid,
           items: []
         });
       }
     });

     Data.forEach(element => {
       treeData.forEach(item => {
         if (element.parentId === item.id) {
           item.items.push({
             id: element.sapDataVariableId,
             text: element.sapDataDatasetVariableName,
             sapDataVariableGuid: element.sapDataVariableGuid
           });
         }
       });
     });
     setVarViewData(treeData)
  }
	useEffect(() => {
    getSubGroupDropDown()
	}, []);

  const onFolderClick = () => {
    setParentId(0);
    setParentGuid('');
    setIsFolder(true)
    setShowSubGroup(false)
  }

  const onItemClick = () => {
    setParentId(0);
    setParentGuid('');
    setIsFolder(false)
    setShowSubGroup(true)
  }
// const colField = 'sapSubgroupFolderName' || 'sapSubgroupLabel'
  return (
    <>
      <Splitter
        style={{
          height: "100%",
        }}
        panes={panes}
        orientation={"horizontal"}
        onChange={(event) => onChange(event, setPanes)}
        scrollable={false}
      >
        <div
          style={{ position: "relative", height: "100vh" }}
          className="tree_list_scroll"
        >
          <DynamicTreeList
            title="Subgroups"
            data={subGroupsData}
            id="sapSubgroupId"
            guid="sapSubgroupGuid"
            col_field='colKey'
            onRowClick={onRowClickSubgroup}
            onFolderClick={() => onFolderClick()}
            onItemClick={() => onItemClick()}
            setSelectedRow={setSelectedRow}
            localKey="subGroupSelectedState"
            offset={offset}
            openContextMenu={openContextMenuSubgroups}
            icon="fas fa-sharp fa-file"
          />
        </div>
        {showSelected ? (
          <div
            style={{ border: "none" }}
            className={`icon-treelist-form ${showSelected ? "" : "d-none"}`}
          >
            {selectedRow.isFolder ?
                        <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          formikSubGroupSaveFolder.handleSubmit();
                        }}
                        className="version_table"
                      >
                        <th
                          style={{
                            top: "0px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <td className="mt-2">Selected Subgroup</td>
                        </th>
                        <div
                          className="mt-3 "
                          style={{ borderTop: "1px solid gray" }}
                        >
                          <div class="mb-3">
                            <label htmlFor="exampleInputEmail1" class="form-label">
                              Folder Name
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              id="folderName"
                              name="folderName"
                              onBlur={formikSubGroupSaveFolder.handleBlur}
                              onChange={(e) => {
                                formikSubGroupSaveFolder.handleChange(e);
                              }}
                              value={formikSubGroupSaveFolder.values.folderName}
                            />
                          </div>          
                          <div className="d-flex">
                            <button
                              type="submit"
                              className="btn btn-primary w-100 mt-2 me-2"
                              disabled={
                                formikSubGroupSaveFolder.values.folderName == selectedRow?.sapSubgroupFolderName
                              }
                            >
                              {formikSubGroupSaveFolder.isSubmitting && (
                                <div
                                  className="spinner-border spinner-border-sm text-light me-2"
                                  role="status"
                                ></div>
                              )}
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-primary w-100 mt-2"
                              onClick={formikSubGroupSaveFolder.resetForm}
                              disabled={
                                formikSubGroupSaveFolder.values.folderName == selectedRow?.sapSubgroupFolderName
                              }
                            >
                              Discard
                            </button>
                          </div>
                        </div>
                      </form>:
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formikSubGroupSave.handleSubmit();
              }}
              className="version_table"
            >
              <th
                style={{
                  top: "0px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <td className="mt-2">Selected Subgroup</td>
              </th>
              <div
                className="mt-3 "
                style={{ borderTop: "1px solid gray" }}
              >
                <div
                  className='mb-3'
                >
                  {/* <label
                    htmlFor="exampleInputEmail1"
                    class="form-label"
                  >
                    Subgroup variable
                  </label>
                  <select
                    class="form-select form-control"
                    aria-label="Default select example"
                    placeholder="select dataset type"
                    onBlur={formikSubGroupSave.handleBlur}
                    onChange={(e) => {
                      formikSubGroupSave.handleChange(e);
                      formikSubGroupSave.setFieldValue('subgroupVariable', e.target.value);
                    }}
                    value={formikSubGroupSave.values.subgroupVariable}
                  >
                    {varView?.length > 0 && varView?.map((x, index)=>{
                      return(
                        <option value={x.sapDataVariableId} key={index}>
                          {x.sapDataDatasetVariableName}
                      </option>
                      )
                    })}
                  </select> */}
                  <CustomDropDownTreeSubgroup
										label="Subgroup variable"
										fieldName="subgroupVariable"
										data={varViewData}
										formik={formikSubGroupSave}
										rowData={selectedRow}
                    setTreeData={setVarViewData}
                    reload={reload}
									/>
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Refrence value
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="refrencevalue"
                    name="refrencevalue"
                    onBlur={formikSubGroupSave.handleBlur}
                    onChange={(e) => {
                      formikSubGroupSave.handleChange(e);
                    }}
                    value={formikSubGroupSave.values.refrencevalue}
                  />
                </div>
                <div class="mb-3">
                  <label htmlFor="exampleInputEmail1" class="form-label">
                    Subgroup label
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="subgrouplabel"
                    name="subgrouplabel"
                    onBlur={formikSubGroupSave.handleBlur}
                    onChange={(e) => {
                      formikSubGroupSave.handleChange(e);
                    }}
                    value={formikSubGroupSave.values.subgrouplabel}
                  />
                </div>
                <div class="mb-3">
                  {/* <label htmlFor="exampleInputEmail1" class="form-label">
                    Covariance to exclude from analysis model
                  </label>
                  <select
                    class="form-select form-control"
                    placeholder="select dataset type"
                    onBlur={formikSubGroupSave.handleBlur}
                    onChange={(e) => {
                      formikSubGroupSave.handleChange(e);
                      formikSubGroupSave.setFieldValue('covariance', e.target.value);
                    }}
                    value={formikSubGroupSave.values.covariance}
                  >
                    {varView?.length > 0 && varView?.map((x, index)=>{
                      return(
                        <option value={x.sapDataVariableId} key={index}>
                          {x.sapDataDatasetVariableName}
                      </option>
                      )
                    })}
                  </select> */}
                  <CustomDropDownTreeSubgroup
										label="Covariance to exclude from analysis model"
										fieldName="covariance"
										data={varViewData}
										formik={formikSubGroupSave}
										rowData={selectedRow}
                    setTreeData={setVarViewData}
                    reload={reload}
									/>
                </div>

                <div className="d-flex">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 me-2"
                    disabled={
                      formikSubGroupSave.values.subgroupVariable == selectedRow?.sapDataVariableId &&
                      formikSubGroupSave.values.refrencevalue == selectedRow?.sapSubgroupReferenceValue &&
                      formikSubGroupSave.values.subgrouplabel == selectedRow?.sapSubgroupLabel &&
                      formikSubGroupSave.values.covariance == selectedRow?.sapCovariateVariableId

                    }
                  >
                    {formikSubGroupSave.isSubmitting && (
                      <div
                        className="spinner-border spinner-border-sm text-light me-2"
                        role="status"
                      ></div>
                    )}
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={()=>{
                      formikSubGroupSave.resetForm();
                      setReload(!reload)
                    }}
                    disabled={
                      formikSubGroupSave.values.subgroupVariable == selectedRow?.sapDataVariableId &&
                      formikSubGroupSave.values.refrencevalue == selectedRow?.sapSubgroupReferenceValue &&
                      formikSubGroupSave.values.subgrouplabel == selectedRow?.sapSubgroupLabel &&
                      formikSubGroupSave.values.covariance == selectedRow?.sapCovariateVariableId
                    }
                  >
                    Discard
                  </button>
                </div>
              </div>
            </form>
            }
          </div>
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100%" }}
          >
            <p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
              SubGroup is not selected. Please select a SubGroup.
            </p>
          </div>
        )}
      </Splitter>
      <ContextMenu
        show={showContextMenu}
        offset={offset.current}
        onSelect={handleOnSelect}
        onClose={handleCloseMenu}
        className="context-menu"

      >
        <MenuItem
          text={`Delete`}
          data={{
            action: "deleteFolder",
          }}
          icon="delete"
        />
        <MenuItem
          data={{
            action: "addItem",
          }}
          render={() => (
            <>
              {/* <img src={fileImg} /> */}
              Add File

            </>
          )}
          icon="file"
        />
        <MenuItem
          data={{
            action: "addFolder",
          }}
          render={() => <>Add Folder</>}
          icon="folder"
          cssClass="separator"

        />
        <MenuItem
          text={`Move to Different Folder`}
          data={{
            action: "moveToDifferentFolder",
          }}
        />
        <MenuItem
          text={`Move Up within Folder`}
          data={{
            action: "moveUpWithinFolder",
          }}
        />
        <MenuItem
          text={`Move Down within Folder`}
          data={{
            action: "moveDownWithinFolder",
          }}
        />
      </ContextMenu>
      <AddSubGroup
        varView={varView}
        isFolder={isFolder}
        setIsFolder={setIsFolder}
        parentId={parentId}
        parentGuid={parentGuid}
        showAddSubGroup={showAddSubGroup}
        setShowSubGroup={setShowSubGroup}
        subGroups={subGroups}
        setShowAlert={setShowAlert}
        setMessage={setMessage}
      />
      <AddSubGroupFolder
        isFolder={isFolder}
        setIsFolder={setIsFolder}
        parentId={parentId}
        parentGuid={parentGuid}
        showAddSubGroup={showAddSubGroup}
        setShowSubGroup={setShowSubGroup}
        subGroups={subGroups}
        setShowAlert={setShowAlert}
        setMessage={setMessage}
      />
      <SweetAlert
        show={showAlert}
        success
        title="Success"
        onConfirm={() => {
          setShowAlert(false);
          setMessage("");
        }}
      >{message}</SweetAlert>
        <SweetAlert
        show={showDeleteConfirm}
        showCancel
        cancelBtnText="No"
        confirmBtnText="Yes"
        // confirmBtnBsStyle="primary"
        cancelBtnBsStyle="light"
        title="Confirm to delete"
        onConfirm={() => {
          handleDeleteFolder();
          setShowDeleteConfirm(false);
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
        }}
        // focusCancelBtn
      >
        Are you sure?
      </SweetAlert>
      {showMoveToDifferentFolderModalSubgroup && <SubGroupsMoveToDifferentFolderModal closeModal={setShowMoveToDifferentFolderModalSubgroup}
        treelistData={subGroupsData}
        id="sapSubgroupId"
        guid="sapSubgroupGuid"
        col_field="sapSubgroupFolderName"
      />}
    </>
  )
}

export default SubGroups
