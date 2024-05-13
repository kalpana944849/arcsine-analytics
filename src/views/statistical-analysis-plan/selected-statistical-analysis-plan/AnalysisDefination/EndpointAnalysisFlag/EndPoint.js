import React, { useEffect } from "react";
// import RowRender from "../../components/common/RowRender";
import { getter } from "@progress/kendo-react-common";
import {
  TreeList,
  createDataTree,
  extendDataItem,
  getSelectedState,
  mapTree,
  removeItems,
} from "@progress/kendo-react-treelist";
import CustomCell from "../../../../../components/common/CustomCell";
import RowRender from "../../../../../components/common/RowRender";
import { getSapEndpointInput } from "../../../../../services/statistical-analysis-plan-service";
// import CustomCell from "../../components/common/CustomCell";
const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapEndpointGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const EndPoint = (props) => {
  const extendData = (dataState, selectedState, expandedState) => {
    return mapTree(dataState, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        selected: selectedState[idGetter(item)],
        expanded: expandedState[idGetter(item)],
      })
    );
  };
  const demoData =  JSON.parse(localStorage.getItem("dataEndpoint")) || [];
  console.log('demoData', demoData)
  // const demoData =  JSON.parse(localStorage.getItem("dataEndpoint")) || [];;
  const dataTreeCate = createDataTree(
    demoData,
    (i) => i.sapEndpointId,
    (i) => i.parentId,
    subItemsField
  );
  const [selectedState, setSelectedState] = React.useState({});
  const [selected, setSelected] = React.useState(0);
  const handleSelect = (e) => {
    setSelected(e.selected);
  };
  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });
  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCate],
    itemInEdit: undefined,
  });
  const onRowClick = (event, param) => {
    props.setShowEndpoint(true, param , '');
    props.setSelectedEndpoint(param.dataItem)
    console.log('endpoint', param.dataItem)
  };
  const columnsCategory = [
    {
      field: "endpointNameShort",
      title: " ",
      expandable: true,
      width: "500px",
      cell: (props) => (
        <CustomCell
          {...props}
          onRowClick={onRowClick}
          expandIconClick={() => {}}
          icon={"fa fa-stethoscope"}
          iconTitle="Endpoint"
        />
      ),
      headerCell: () => {
        return (
          <th
            style={{
              top: "0px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <td>{props.title}</td>
            <td style={{ border: "none" }}>
              <button
                className="me-2"
                style={{ border: "none" }}
                onClick={() => {
                  props.setShowEndpoint(false, {}, 'folder');
                  props.setSelectedEndpoint({})
                }}
              >
                <i
                  className="k-icon k-i-folder-add k-color-dark"
                  title="Add Folder"
                ></i>
              </button>
              <button
                style={{ border: "none" }}
                onClick={() => {
                  props.setShowEndpoint(false, {}, 'file');
                  props.setSelectedEndpoint({})
                }}
              >
                <i
                  className="k-icon k-i-file-add k-color-dark"
                  title="Add File"
                ></i>
              </button>
            </td>
          </th>
        );
      },
    },
  ];
  const onExpandChangeCategory = React.useCallback(
    (e) => {
      setExpandedState({
        ...expandedState,
        [idGetter(e.dataItem)]: !e.value,
      });
    },
    [expandedState]
  );
  const getEndpoint = async (id,sapVersionId) => {
    // alert('jjj')
      const response = await getSapEndpointInput(id, sapVersionId);
      // console.log('endpointData', response.data);
    if (response.status == 200) {
      localStorage.setItem("dataEndpoint", JSON.stringify(response.data.data));
      const dataTreeCategory = createDataTree(
        response.data.data,
        (i) => i.sapEndpointId,
        (i) => i.parentId,
        subItemsField
      );
      setStateCategory({
        ...stateCategory,
        data: dataTreeCategory,
      });
    }
    // console.log('varResponse', response.data)
  };

  useEffect(()=>{
    getEndpoint(43,24)
  }, [])
  return (
    <div className="vh-100 tree_list_scroll">
      <TreeList
        style={{
          border: "none",
          maxHeight: "100%",
          overflow: "auto",
        }}
        data={extendData(stateCategory.data, selectedState, expandedState)}
        rowRender={RowRender}
        navigatable={true}
        selectedField={SELECTED_FIELD}
        selectable={{
          enabled: true,
        }}
        expandField={expandField}
        subItemsField={subItemsField}
        onExpandChange={onExpandChangeCategory}
        columns={columnsCategory}
      />
    </div>
  );
};

export default EndPoint;
