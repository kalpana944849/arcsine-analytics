import React, { useRef, useState } from "react";
import { useEffect } from "react";
import {
    addAnalysisFlag,
    getDataSetVariableView,
    updateAnalysisFlag,
} from "../../../../services/statistical-analysis-plan-service";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import commonSchema from "../../../../utils/validationSchema/common-schema";
import { ContextMenu, MenuItem, Splitter } from "@progress/kendo-react-layout";
import { createDataTree, extendDataItem, getSelectedState, mapTree, TreeList } from "@progress/kendo-react-treelist";
import {  getter,  } from "@progress/kendo-react-common";
import RowRender from "../../../../components/common/RowRender";
import FullScreenLoader from "../../../../utils/Loaders/FullScreenLoader";
import FullScreenLoaderRight from "../../../../utils/Loaders/FullScreenLoaderRight";
import { getTerminologyCategory, terminologyCodeGetById } from "../../../../services/global-standard-service";
import CustomCell from "../../../../components/common/CustomCell";
import { getParsedFromLocalStorage } from "../../../../utils/common-helper";
import Image1 from "../../../../assets/images/character_string icon.jpeg"
import Image2 from "../../../../assets/images/number icon.jpeg"
import Image3 from "../../../../assets/images/controlled_terminology icon.jpeg"
import Image4 from "../../../../assets/images/dataset icon.jpeg"
import Image5 from "../../../../assets/images/dataset_variable icon.jpeg"



const expandField = 'expanded';
const subItemsField = 'employees';
const editField = "inEdit";
const DATA_ITEM_KEY = "libraryControlledTerminologyCategoryId";
const DATA_ITEM_KEY1 = "libraryControlledTerminologyGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const idGetter1 = getter(DATA_ITEM_KEY1);

const schema = yup.object().shape({
    shortName: yup.string().required("This Field is required."),
    longName: yup.string().required("This Field is required."),
    desc: yup.string().required("This Field is required."),
    label: yup.string().required("This Field is required."),
    //   variable: yup.string().required("This Field is required."),
    //   valueForInclusion: yup.string().required("This Field is required."),
});



const folderSchema = yup.object().shape({
    shortNames: yup.string().required("This Field is required."),
    longNames: yup.string().required("This Field is required."),
    descs: yup.string().required("This Field is required."),
});

const ParamterForm = (props) => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(props.addType === "file" ? schema : folderSchema),
    });
    const [showAlert, setShowAlert] = useState(false);
  const [Loader, showLoader] = React.useState(false);
  const [rowId, setRowId] = React.useState('');
  const [message, setMessage] = useState("");
  const [showFolderItem, setShowFolderItem] = React.useState(false);
  const [selectedCodeRow, setSelectedCodeRow] = React.useState([{ parentId: null }]);
  const [showPop, setShowPop] = React.useState(false);

  const offset = useRef({
    left: 0,
    top: 0,
  });
  const [LoaderRight, showLoaderRight] = React.useState(false);
  const [itemSelectedState, setItemSelectedState] = React.useState('');
  const [showCode, setShowCode] = React.useState(false);
  const [showCodeContext, setShowCodeContext] = React.useState(false);
  const [openAddItem, setOpenAddItem] = React.useState(false);
  const [openAddItemCode, setOpenAddItemCode] = React.useState(false);
  const [newData, setNewData] = React.useState({});
  const [standardName, setStandardName] = React.useState('');
  const [showSelected, setShowSelected] = React.useState(false);
  const [uniqueId, setUniqueId] = React.useState('');
  const [stateCode, setStateCode] = React.useState({
    data: [],
    itemInEdit: undefined,
  });
  const [selectedCodeState, setSelectedCodeState] = React.useState({});




  const columnsCodes = [
    {
      headerCell: () => {
        return (
          <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <td>
              Controlled Terminology Code
            </td>
            <td style={{ border: 'none' }}>

              <button className='me-2' style={{ border: 'none' }} disabled><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} disabled><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td>
          </th>
        )
      }
    }

  ];
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

  const addCodeFolder = () => {
    if (!selectedCodeRow.hasOwnProperty('employees')) {
      selectedCodeRow.employees = []
    }
    selectedCodeRow.employees.push(
      {
        "libraryControlledTerminologyId": selectedCodeRow.libraryControlledTerminologyCategoryId,
        "libraryControlledTerminologyGuid": "F6F7E6B4-742E-4035-A5D6-705C33AA47CF",
        "libraryControlledTerminologyCategoryId": 1,
        "parentId": selectedCodeRow.libraryControlledTerminologyGuid,
        "parentGuid": selectedCodeRow.parentGuid,
        "isFolder": false,
        "libraryControlledTerminologyNameShort": folderName,
        "libraryControlledTerminologyNameLong": "Unstructured",
        "libraryControlledTerminologyDescription": "Unstructured",
        "isCustom": isCustom,
        "isHidden": isHidden,
        "displayOrder": 1
      }
    )

    setStateCode({
      ...stateCode,
      itemInEdit: undefined,
      data: mapTree(stateCode.data, subItemsField,
        (item) =>
          item.libraryControlledTerminologyGuid === selectedCodeRow.libraryControlledTerminologyGuid ? selectedCodeRow : item
      )
    });
    setShowCodePop(false);
  };

  const save = (itemInEdit) => {

    setShowEditPop(false);

    setStateCategory({
      ...stateCategory,
      itemInEdit: undefined,
      data: mapTree(stateCategory.data, subItemsField,
        (item) =>
          itemInEdit.libraryControlledTerminologyCategoryId === item.libraryControlledTerminologyCategoryId ? itemInEdit : item
      )
    });
  };
  const saveCode = (itemInEdit) => {
    setShowEditCodePop(false);
    setStateCode({
      ...stateCode,
      itemInEdit: undefined,
      data: mapTree(stateCode.data, subItemsField,
        (item) =>
          itemInEdit.libraryControlledTerminologyGuid === item.libraryControlledTerminologyGuid ? itemInEdit : item
      )
    });
  };

  const getCategaory = async () => {
    showLoader(true)
    const response = await getTerminologyCategory();
    if (response.status == 200) {
      const DisplayOrder = [...response.data.data].sort((a, b) => a.displayOrder - b.displayOrder);

      localStorage.setItem('categoryData', JSON.stringify(DisplayOrder));
      const dataTreeCategory = createDataTree(DisplayOrder, i => i.libraryControlledTerminologyCategoryId, i => i.parentId, subItemsField);
      showLoader(false)
      setStateCategory({
        ...stateCategory,
        data: dataTreeCategory,
      });
    }
  }

  const handleCloseMenu = () => {
    setShowFolderItem(false);
  };
  const getTerminologyCode = async (Guid) => {
    showLoaderRight(true)
    const response = await terminologyCodeGetById(Guid);
    if (response.status == 200) {
      const DisplayOrder = [...response.data.data].sort((a, b) => a.displayOrder - b.displayOrder);
      const dataTreeCode = createDataTree(DisplayOrder, i => i.libraryControlledTerminologyId, i => i.parentId, subItemsField);
      showLoaderRight(false);
      setStateCode({
        ...stateCode,
        data: dataTreeCode,
      });
    }
  }
  const [selectedRow, setSelectedRow] = React.useState([{ parentId: null }]);

  const [selectedState, setSelectedState] = React.useState(
    () => {
      return JSON.parse(localStorage.getItem('terminologySelectedState')) || {}
    }
  );



  const handleCodeCloseMenu = () => {
    setShowCodeContext(false);
  };

  const [expandedState, setExpandedState] = React.useState(
    () => {
      return JSON.parse(localStorage.getItem('expandedState')) || {}
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
      const onExpandChangeCode = React.useCallback(
        (e) => {
          setExpandedState({
            ...expandedState,
            [idGetter1(e.dataItem)]: !e.value,
          });
        },
        [expandedState]
      );
      const onCodeSelectionChange = React.useCallback(
        (event) => {
          const newSelectedState = getSelectedState({
            event,
            selectedState: selectedCodeState,
            dataItemKey: DATA_ITEM_KEY1,
          });
          Object.keys(newSelectedState).forEach((key) => {
            if (key != event.dataItem.libraryControlledTerminologyGuid) {
              delete newSelectedState[key]
            }
          })
          setSelectedCodeState(newSelectedState);
        },
        [selectedCodeState]
      );
      

      const onCategoryRowClick = (event, props) => {
        if (rowId === props.id) {
          return false
        }
        setShowCode(true);
        setRowId(props.id);
        props.selectionChange(event);
        setNewData(props.dataItem);
        setShowSelected(true);
        setStandardName(props.dataItem.libraryControlledTerminologyCategoryNameShort);
        setSelectedRow(props.dataItem);
        setUniqueId(props.dataItem.libraryControlledTerminologyCategoryId);
        getTerminologyCode(props.dataItem.libraryControlledTerminologyCategoryGuid);
        localStorage.setItem("terminologySelectedRow", JSON.stringify(props.dataItem));
      }

      const handleOnCodeSelect = (e) => {
        switch (e.item.data.action) {
          case "detailCodeFolder":
            handleDetailCodeFolder();
            break;
          case "addCodeFolder":
            handleAddCodeFolder();
            break;
          case "addCodeItem":
            handleAddCodeItem();
            break;
          case "editCodeFolder":
            handleEditCodeFolder();
            break;
          case "deleteCodeFolder":
            handleDeleteCodeFolder();
            break;
          default:
        }
        setShowCodeContext(false);
      };
      
      const terminologySelectedRow = getParsedFromLocalStorage('terminologySelectedRow', {});
      useEffect(() => {
		if (Object.keys(terminologySelectedRow).length > 0) {
			setSelectedRow(terminologySelectedRow)
      setStandardName(terminologySelectedRow.libraryControlledTerminologyCategoryNameShort);
      setUniqueId(terminologySelectedRow.libraryControlledTerminologyCategoryId);
      getTerminologyCode(terminologySelectedRow.libraryControlledTerminologyCategoryGuid);
      setNewData(terminologySelectedRow);
			setShowSelected(true);
      setShowCode(true);
		}
	}, []);

      useEffect(() => {
        getCategaory();
        localStorage.setItem('expandedState', JSON.stringify(expandedState));
        localStorage.setItem('selectedState', JSON.stringify(selectedState));
        localStorage.setItem('itemSelectedState', JSON.stringify(itemSelectedState));
    
      }, [expandedState])

      const handleOnSelect = (e) => {
        switch (e.item.data.action) {
          case "detailFolder":
            handleDetailFolder();
            break;
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
            handleDeleteFolder();
            break;
          default:
        }
        setShowFolderItem(false);
      };
  
  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      Object.keys(newSelectedState).forEach((key) => {
        if (key != event.dataItem.libraryControlledTerminologyCategoryId) {
          delete newSelectedState[key]
        }
      })
      setSelectedState(newSelectedState);
      setItemSelectedState(newSelectedState);
      localStorage.setItem(
				"terminologySelectedState",
				JSON.stringify(newSelectedState)
			);
    },
    [selectedState]
  );

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
            {/* <td style={{ border: 'none' }}>
              <button className='me-2' style={{ border: 'none' }} onClick={() => {
                setCode(false);
                setShowAddPopup(true);
                setParentId(null)
                setIsFolder(true)
                // setOpenAddItem(true);
                // setType('folder');
              }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
              <button style={{ border: 'none' }} onClick={() => {
                setCode(false);
                setShowAddPopup(true);
                setParentId(null)
                setIsFolder(false)
              }}><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
            </td> */}
          </th>
        )
      }
    }
  ];

  const [stateCategory, setStateCategory] = React.useState({
    data: [],
    itemInEdit: undefined,
  });
    const [inputType, setInputType] = useState("");
    const [inputTypeFile, setInputTypeFile] = useState("")
    const [selected, setSelected] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [controlledTerminologyModal, setControlledTerminologyModal] = useState(false);
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
    let rowData = props?.selectedAnalysis;

    console.log('asdcds', rowData)
    useEffect(() => {
        if (rowData) {
            setValue("shortName", rowData.standardComponentParameterNameShort);
            setValue("longName", rowData.standardComponentParameterNameLong);
            setValue("desc", rowData.standardComponentParameterDescription);
            setValue("label", rowData.standardComponentParameterLabel);
            //   setValue("variable", rowData.analysisFlagVariable);
            //   setValue("valueForInclusion", rowData.analysisFlagValueInclusion);
        } else {
            setValue("shortName", "");
            setValue("longName", "");
            setValue("desc", "");
            setValue("label", "");
            //   setValue("variable", "");
            //   setValue("valueForInclusion", "");
        }
    }, [props.analysisRowData, setValue]);

    const clearFields = () => {
        setValue("shortName", "");
        setValue("longName", "");
        setValue("desc", "");
        setValue("label", "");
        setValue("variable", "");
        setValue("valueForInclusion", "");
        setValue("shortNames", "");
        setValue("longNames", "");
        setValue("descs", "");
    };

    const onCodeRowClick = (event, props) => {
        props.selectionChange(event);
        setSelectedCodeRow(props.dataItem);
      }
    

    const columnsCode = [
        {
          field: 'libraryControlledTerminologyNameShort',
          title: 'Controlled Terminology Code',
          expandable: true,
          width: '500px',
          cell: (props) => <CustomCell {...props} onRowClick={onCodeRowClick} />,
          headerCell: () => {
            return (
              <th style={{ top: '0px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <td>
                  Controlled Terminology Code
                </td>
                {/* <td style={{ border: 'none' }}>
                  <button className='me-2' style={{ border: 'none' }} onClick={() => {
                    setShowAddPopupCode(true);
                    setCode(true)
                    setParentId(null)
                    // setIsFolder(true)
                    setIsFolderCode(true)
                    // setType('folder')
                  }}><i className='k-icon k-i-folder-add k-color-dark' title='Add Folder'></i></button>
                  <button style={{ border: 'none' }} onClick={() => {
                    setShowAddPopupCode(true);
                    setCode(true)
                    setParentId(null)
                    // setIsFolder(false)
                    setIsFolderCode(false)
                  }}><i className='k-icon k-i-file-add k-color-dark' title='Add File'></i></button>
                </td> */}
              </th>
            )
          }
        }
    
      ];

    const handleAnalysisSubmit = (data) => {
        console.log("datadata datadata datadata", data);
        props.onSubmit(data);
    };

    const formik = useFormik({
        initialValues: {
            shortName: rowData?.standardComponentParameterNameShort,
            longName: rowData?.standardComponentParameterNameLong,
            desc: rowData?.standardComponentParameterDescription,
            label: rowData?.standardComponentParameterLabel,
        },

        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            props.onSubmit(values);
        },
    });

    const formikAddAnalysis = useFormik({
        initialValues: {
            shortName: "",
            longName: "",
            desc: "",
            label: "",
            variable: "",
            valueForInc: "",
        },

        enableReinitialize: true,
        validationSchema: commonSchema,
        onSubmit: async (values, { resetForm }) => {
            props.onSubmit(values, resetForm);
        },
    });
    const [analysisFlagVariable, setAnalysisFlagVariable] = useState([]);
    const getSapDatasetVariableView = async (
        sapDataDatasetTypeId,
        sapDataVariableTypeId,
        setState
    ) => {
        const response = await getDataSetVariableView(
            sapDataDatasetTypeId,
            sapDataVariableTypeId
        );
        setState(response.data.data);
    };


    const handleSelect = (option) => {
        setSelected(option);
        if (option === 2) {
            setInputType("controlled");
            // Perform any other actions if needed
        } else if (option === 3) {
            setInputType("dataset");
            // Perform any other actions if needed
        } else if (option === 4) {
            setInputType("variable");
            // Perform any other actions if needed
        }
        else {
            setInputType("")
        }
    };


    const handleSelectFile = (option) => {
        setSelectedFile(option);
        if (option === 2) {
            setInputTypeFile("controlled");
            // Perform any other actions if needed
        } else if (option === 3) {
            setInputTypeFile("dataset");
            // Perform any other actions if needed
        } else if (option === 4) {
            setInputTypeFile("variable");
            // Perform any other actions if needed
        }
        else {
            setInputTypeFile("")
        }
    };

    useEffect(() => {
        getSapDatasetVariableView(210, 216, setAnalysisFlagVariable);
    }, []);

    return (
        <>
            {props.showAnalysis === true ? (
                <div
                    style={{ border: "none" }}
                    className={`p-2 ${props.showAnalysis ? "" : "d-none"}`}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <th
                            style={{
                                top: "0px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <td className="mt-2">Selected Parameter</td>
                        </th>
                        <div className="mt-3">
                            <div class="row mb-3">
                                <div class="col">
                                    <label htmlFor="exampleInputEmail1" class="form-label">
                                        Short Name
                                        <sup className="text-danger">*</sup>
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="shortName"
                                        name="shortName"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.shortName}
                                    />
                                </div>
                                <div class="col">
                                    <label htmlFor="exampleInputEmail1" class="form-label">
                                        Long Name
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="longName"
                                        name="longName"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            formik.handleChange(e);
                                        }}
                                        value={formik.values.longName}
                                    />
                                </div>
                            </div>
                            <div class="mb-3">
                                <label htmlFor="exampleInputEmail1" class="form-label">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="desc"
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                    }}
                                    value={formik.values.desc}
                                />
                            </div>
                            <div className={(rowData?.isFolder ? 'd-none' : '')}>
                                <label htmlFor="exampleInputEmail1" class="form-label">
                                    Label
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="label"
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                    }}
                                    value={formik.values.label}
                                />
                            </div>
                            <div>
                                <label htmlFor="exampleInputEmail1" class="form-label mt-3 mb-3">Select Input Type</label>
                                <div className="d-flex " style={{ justifyContent: "space-between", padding: "10px 0" }} >
                                    <div className="d-flex " style={{ flexDirection: "column", textAlign: "center" }}>
                                    <img src={Image1} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="css" name="inputType1" value="CSS" className="mb-2" onChange={() => handleSelect(0)} checked={selected === 0} />
                                        <label style={{ fontSize: "12px", width: "99%" }}>Character String</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image2} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="css" name="inputType1" value="CSS" className="mb-2" onChange={() => handleSelect(1)} checked={selected === 1} />
                                        <label style={{ fontSize: "12px" }}>Number</label>
                                    </div>
                                    <div className="d-flex mb-1" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image3} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="controlled" name="inputType1" value="controlled" className="mb-2" onChange={() => handleSelect(2)} checked={selected === 2} />
                                        <label style={{ fontSize: "12px", width: "99%" }}>Controlled Terminology</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image4} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="dataset" name="inputType1" value="dataset" className="mb-2" onChange={() => handleSelect(3)} checked={selected === 3} />
                                        <label style={{ fontSize: "12px" }}>Dataset</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image5} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="variable" name="inputType1" value="variable" className="mb-2" onChange={() => handleSelect(4)} checked={selected === 4} />
                                        <label style={{ fontSize: "12px", width: "99%" }}>Dataset Variable</label>
                                    </div>
                                </div>
                            </div>

                            {inputType == "controlled" && (
                                <div onClick={() => { setControlledTerminologyModal(true) }} >

                                    <label style={{ fontSize: "12px" }}>Controlled Terminology Category</label>
                                    <div style={{ border: "1px solid black", width: "fit-content", padding: "8px" ,cursor:"pointer"}}>
                                        Select Controlled Terminology Category
                                        <span style={{ marginLeft: "5px" }}><i class="fa fa-plus"></i></span>
                                    </div>
                                </div>
                            )}
                            {inputType == "dataset" && (
                                <div>
                                    <label style={{ fontSize: "12px" }}>Dataset Type</label>
                                    <select className="d-flex p-2">
                                        <option value="adsl">ADSL</option>
                                    </select>
                                </div>
                            )}
                            {inputType == "variable" && (
                                <div>
                                    <label style={{ fontSize: "12px" }}>Variable Content Type</label>
                                    <select className="d-flex p-2">
                                        <option value="response variable">Response Variable</option>
                                    </select>
                                </div>
                            )}


                            <div className="d-flex mt-3 ">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-2 me-2"
                                    disabled={
                                        formik.values.shortName == rowData?.standardComponentParameterNameShort &&
                                        formik.values.longName == rowData?.standardComponentParameterNameLong &&
                                        formik.values.desc == rowData?.standardComponentParameterDescription &&
                                        formik.values.label == rowData?.standardComponentParameterLabel
                                    }
                                >
                                    {formik.isSubmitting && (
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
                                    onClick={formik.resetForm}
                                    disabled={
                                        formik.values.shortName == rowData?.standardComponentParameterNameShort &&
                                        formik.values.longName == rowData?.standardComponentParameterNameLong &&
                                        formik.values.desc == rowData?.standardComponentParameterDescription &&
                                        formik.values.label == rowData?.standardComponentParameterLabel
                                    }
                                >
                                    Discard
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            ) : (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "100%" }}
                >
                    <p className="border w-100 d-flex justify-content-center align-items-center p-4 bg-secondary text-white">
                        Parameter is not selected. Please select a Parameter.
                    </p>
                </div>
            )}
            <SweetAlert
                show={showAlert}
                success
                title="Success"
                onConfirm={() => {
                    setShowAlert(false);
                    setMessage("");
                }}
            >
                {message}
            </SweetAlert>

            <div
                class={`modal fade  ${props.showAddAnalysisPop ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                {props.addType === "file"
                                    ? "Add Parameter File"
                                    : "Add Parameter Folder"}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    props.setShowAnalysisPop(false)
                                    formikAddAnalysis.resetForm()
                                }}
                            ></button>
                        </div>
                        <div class="modal-body">
                            {props.addType === "file" ? (
                                <>
                                    <form onSubmit={formikAddAnalysis.handleSubmit}>
                                        <div className="mt-3">
                                            <div class="row mb-3">
                                                <div class="col">
                                                    <label
                                                        htmlFor="exampleInputEmail1"
                                                        class="form-label"
                                                    >
                                                        Short Name
                                                        <sup className="text-danger">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formikAddAnalysis.touched.shortName &&
                                                            formikAddAnalysis.errors.shortName
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="shortName"
                                                        name="shortName"
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.shortName}
                                                    />
                                                    {formikAddAnalysis.touched.shortName &&
                                                        formikAddAnalysis.errors.shortName ? (
                                                        <div className="invalid-feedback">
                                                            {formikAddAnalysis.errors.shortName}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div class="col">
                                                    <label
                                                        htmlFor="exampleInputEmail1"
                                                        class="form-label"
                                                    >
                                                        Long Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        id="longName"
                                                        name="longName"
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.longName}
                                                    />
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label htmlFor="exampleInputEmail1" class="form-label">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="desc"
                                                    onBlur={formikAddAnalysis.handleBlur}
                                                    onChange={(e) => {
                                                        formikAddAnalysis.handleChange(e);
                                                        // setIsChangeAnalysis(true);
                                                    }}
                                                    value={formikAddAnalysis.values.desc}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="exampleInputEmail1" class="form-label">
                                                    Label
                                                </label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="label"
                                                    onBlur={formikAddAnalysis.handleBlur}
                                                    onChange={(e) => {
                                                        formikAddAnalysis.handleChange(e);
                                                        // setIsChangeAnalysis(true);
                                                    }}
                                                    value={formikAddAnalysis.values.label}
                                                />
                                            </div>
                                            <div>
                                <label htmlFor="exampleInputEmail1" class="form-label mt-3 mb-3">Select Input Type</label>
                                <div className="d-flex " style={{ justifyContent: "space-between", padding: "10px 0" }} >
                                    <div className="d-flex " style={{ flexDirection: "column", textAlign: "center" }}>
                                    <img src={Image1} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="css" name="inputType1" value="CSS" className="mb-2" onChange={() => handleSelectFile(0)} checked={selected === 0} />
                                        <label style={{ fontSize: "12px", width: "99%" }}>Character String</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image2} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="css" name="inputType1" value="CSS" className="mb-2" onChange={() => handleSelectFile(1)} checked={selected === 1} />
                                        <label style={{ fontSize: "12px" }}>Number</label>
                                    </div>
                                    <div className="d-flex mb-1" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image3} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="controlled" name="inputType1" value="controlled" className="mb-2" onChange={() => handleSelectFile(2)} checked={selected === 2} />
                                        <label style={{ fontSize: "12px", width: "99%" }}>Controlled Terminology</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image4} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="dataset" name="inputType1" value="dataset" className="mb-2" onChange={() => handleSelectFile(3)} checked={selected === 3} />
                                        <label style={{ fontSize: "12px" }}>Dataset</label>
                                    </div>
                                    <div className="d-flex" style={{ flexDirection: "column", textAlign: "center" }}>
                                        <img src={Image5} style={{ width: "20px", height: "20px",margin:"auto",marginBottom:"10px" }} />
                                        <input type="radio" id="variable" name="inputType1" value="variable" className="mb-2" onChange={() => handleSelectFile(4)} checked={selected === 4} />
                                        <label style={{ fontSize: "12px", width: "99%" }}>Dataset Variable</label>
                                    </div>
                                </div>
                            </div>

                                            {inputTypeFile == "controlled" && (
                                                <div>
                                                    <label style={{ fontSize: "12px" }} className="mb-1 mt-4">Controlled Terminology Category</label>
                                                    <div style={{ border: "1px solid black", width: "fit-content", padding: "8px" }} className="mb-4">
                                                        Select Controlled Terminology Category
                                                        <span style={{ marginLeft: "5px" }}><i class="fa fa-plus"></i></span>
                                                    </div>
                                                </div>
                                            )}
                                            {inputTypeFile == "dataset" && (
                                                <div>
                                                    <label style={{ fontSize: "12px" }} className="mb-1 mt-4">Dataset Type</label>
                                                    <select className="d-flex p-2 mb-4" >
                                                        <option value="adsl">ADSL</option>
                                                    </select>
                                                </div>
                                            )}
                                            {inputTypeFile == "variable" && (
                                                <div>
                                                    <label style={{ fontSize: "12px" }} className="mb-1 mt-4">Variable Content Type</label>
                                                    <select className="d-flex p-2 mb-4">
                                                        <option value="response variable">Response Variable</option>
                                                    </select>
                                                </div>
                                            )}



                                            <div className="d-flex">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 mt-2 me-2"
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == '' &&
                                                        formikAddAnalysis.values.label == ''
                                                    }
                                                >
                                                    {formikAddAnalysis.isSubmitting && (
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
                                                    onClick={formikAddAnalysis.resetForm}
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == '' &&
                                                        formikAddAnalysis.values.label == ''
                                                    }
                                                >
                                                    Discard
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={formikAddAnalysis.handleSubmit}>
                                        <div className="mt-3">
                                            <div class="row mb-3">
                                                <div class="col">
                                                    <label
                                                        htmlFor="exampleInputEmail1"
                                                        class="form-label"
                                                    >
                                                        Short Name
                                                        <sup className="text-danger">*</sup>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={`form-control ${formikAddAnalysis.touched.shortName &&
                                                            formikAddAnalysis.errors.shortName
                                                            ? "is-invalid"
                                                            : ""
                                                            }`}
                                                        id="shortName"
                                                        name="shortName"
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.shortName}
                                                    />
                                                    {formikAddAnalysis.touched.shortName &&
                                                        formikAddAnalysis.errors.shortName ? (
                                                        <div className="invalid-feedback">
                                                            {formikAddAnalysis.errors.shortName}
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div class="col">
                                                    <label
                                                        htmlFor="exampleInputEmail1"
                                                        class="form-label"
                                                    >
                                                        Long Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        id="longName"
                                                        name="longName"
                                                        onBlur={formikAddAnalysis.handleBlur}
                                                        onChange={(e) => {
                                                            formikAddAnalysis.handleChange(e);
                                                            // setIsChangeAnalysis(true);
                                                        }}
                                                        value={formikAddAnalysis.values.longName}
                                                    />
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label htmlFor="exampleInputEmail1" class="form-label">
                                                    Description
                                                </label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="desc"
                                                    onBlur={formikAddAnalysis.handleBlur}
                                                    onChange={(e) => {
                                                        formikAddAnalysis.handleChange(e);
                                                        // setIsChangeAnalysis(true);
                                                    }}
                                                    value={formikAddAnalysis.values.desc}
                                                />
                                            </div>


                                            <div className="d-flex">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary w-100 mt-2 me-2"
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == ''
                                                    }
                                                >
                                                    {formikAddAnalysis.isSubmitting && (
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
                                                    onClick={formikAddAnalysis.resetForm}
                                                    disabled={
                                                        formikAddAnalysis.values.shortName == '' &&
                                                        formikAddAnalysis.values.longName == '' &&
                                                        formikAddAnalysis.values.desc == ''
                                                    }
                                                >
                                                    Discard
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div
                class={`modal fade  ${controlledTerminologyModal ? "show d-block" : ""} `}
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div style={{ width: "745px" }} class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">
                                Select Controlled Terminology Category
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                id="close_add_parent"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    setControlledTerminologyModal(false)
                                }}
                            ></button>
                        </div>
                        <div class="modal-body d-flex" style={{padding:"0px" }}>
                            <section style={{backgroundColor:'white' ,  padding:'0px'}} className="main_content" >
                                {Loader === true ? <FullScreenLoader /> : ''}
                                {LoaderRight === true ? <FullScreenLoaderRight /> : ''}
                                <div  className='icon-treelist' >
                                    {/* <Splitter
                                        style={{
                                            height: "100%",
                                        }}
                                        panes={panes}
                                        orientation={"horizontal"}
                                        onChange={(event) => onChange(event, setPanes)}
                                        scrollable={false}
                                    > */}
                                        <TreeList style={{
                                            border: 'none',
                                            maxHeight: '70vh',
                                            overflowY: 'auto',
                                            marginRight:"20px"
                                            // width: '720px'
                                        }} data={extendData(stateCategory.data, selectedState, expandedState)}

                                            onSelectionChange={onSelectionChange}
                                            onRowContextMenu={(event) => handleContextMenu(event, openContextMenu, setSelectedRow, offset)}

                                            rowRender={RowRender}
                                            editField={editField}
                                            navigatable={true}
                                            selectedField={SELECTED_FIELD}
                                            selectable={{
                                                enabled: true,
                                            }}
                                            expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChangeCategory} columns={columnsCategory}
                                        />

                                        {showCode ?
                                            <TreeList style={{
                                                border: 'none',
                                                maxHeight: '70vh',
                                                overflow: 'auto',
                                            }}
                                                data={extendData1(stateCode.data, selectedCodeState, expandedState)}
                                                onSelectionChange={onCodeSelectionChange}
                                                rowRender={RowRender}
                                                onRowContextMenu={(event) => handleContextMenu(event, openCodeContextMenu, setSelectedCodeRow, offset)}
                                                editField={editField}
                                                navigatable={true}
                                                selectedField={SELECTED_FIELD}
                                                selectable={{
                                                    enabled: true,
                                                }}
                                                expandField={expandField} subItemsField={subItemsField} onExpandChange={onExpandChangeCode} 
                                                columns={columnsCode}
                                            />
                                            :
                                            <>
                                                <TreeList style={{
                                                    border: 'none',

                                                    overflow: 'auto',

                                                }}
                                                    noRecords="Please Select Controlled Terminology Category"
                                                    columns={columnsCodes}
                                                />

                                            </>
                                        }
                                    {/* </Splitter> */}
                                </div>
                                <ContextMenu
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
                                    <MenuItem
                                        data={{
                                            action: "addItem",
                                        }}
                                        render={() => (
                                            <>
                                                <img src={fileImg} />
                                                Add {selectedRow.libraryControlledTerminologyCategoryNameShort} Item
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
                                    <MenuItem
                                        data={{
                                            action: "addCodeItem",
                                        }}
                                        render={() => (
                                            <>
                                                <img src={fileImg} />
                                                Add {selectedCodeRow.libraryControlledTerminologyNameShort} Item
                                            </>
                                        )}
                                    />

                                </ContextMenu>

                                {openAddItem && (
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
                                                    "parentGuid": "",
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
                                )}
                                {openAddItemCode && (
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
                                                    "parentGuid": "",
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
                                {/* {showPop && (
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

                                    />
                                )} */}
                              
                            </section>
                            
                        </div>
                        <div className="d-flex mt-3 ">
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-2 me-2"
                                    // disabled={
                                    //     formik.values.shortName == rowData?.standardComponentParameterNameShort &&
                                    //     formik.values.longName == rowData?.standardComponentParameterNameLong &&
                                    //     formik.values.desc == rowData?.standardComponentParameterDescription &&
                                    //     formik.values.label == rowData?.standardComponentParameterLabel
                                    // }
                                >
                                    {/* {formik.isSubmitting && (
                                        <div
                                            className="spinner-border spinner-border-sm text-light me-2"
                                            role="status"
                                        ></div>
                                    )} */}
                                    Update
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary w-100 mt-2"
                                    onClick={formik.resetForm}
                                    // disabled={
                                    //     formik.values.shortName == rowData?.standardComponentParameterNameShort &&
                                    //     formik.values.longName == rowData?.standardComponentParameterNameLong &&
                                    //     formik.values.desc == rowData?.standardComponentParameterDescription &&
                                    //     formik.values.label == rowData?.standardComponentParameterLabel
                                    // }
                                >
                                    Discard
                                </button>
                            </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ParamterForm;
