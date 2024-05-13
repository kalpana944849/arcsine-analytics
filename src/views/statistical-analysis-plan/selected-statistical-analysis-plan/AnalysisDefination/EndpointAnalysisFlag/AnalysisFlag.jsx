import React, { useEffect } from "react";
// import RowRender from "../../components/common/RowRender";
import { getter } from "@progress/kendo-react-common";
import { Splitter } from "@progress/kendo-react-layout";

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
import { panesJson, onChange } from "../../../../../utils/common-helper";

// import CustomCell from "../../components/common/CustomCell";
const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapAnalysisFlagId";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const AnalysisFlag = (props) => {
  // var storedData = localStorage.getItem('dataEndpoints');
  // var tempData = JSON.parse(storedData);
  // const temo = props.data;
  // console.log('tempmm', temo)
  const [panes, setPanes] = React.useState(panesJson);
  const [selectedState, setSelectedState] = React.useState({});

  const extendData = (dataState, selectedState, expandedState) => {
    return mapTree(dataState, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        selected: selectedState[idGetter(item)],
        expanded: expandedState[idGetter(item)],
      })
    );
  };
  const demoData = props.data;
  const dataTreeCate = createDataTree(
    demoData,
    (i) => i.sapAnalysisFlagId,
    (i) => i.parentId,
    subItemsField
  );

  const onSelectionChange = React.useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: selectedState,
        dataItemKey: DATA_ITEM_KEY,
      });
      Object.keys(newSelectedState)?.forEach((key) => {
        if (key !== event.dataItem.sapDataGuid) {
          delete newSelectedState[key];
        }
      });
      setSelectedState(newSelectedState);
    },
    [selectedState]
  );

  const [selected, setSelected] = React.useState(0);

  const handleSelect = (e) => {
    setSelected(e.selected);
  };

  console.log("dataTreeCate", dataTreeCate);

  const [expandedState, setExpandedState] = React.useState({
    1: true,
    2: true,
    32: true,
  });

  const [stateCategory, setStateCategory] = React.useState({
    data: [...dataTreeCate],
    itemInEdit: undefined,
  });

  const onRowClick = (event, row) => {
    console.log("row Data ", row);
    props.setShowAnalysis(true, row, "");
    props.setSelectedAnalysis(row.dataItem);
  };

  const columnsCategory = [
    {
      field: "analysisFlagNameShort",
      title: " ",
      expandable: true,
      width: "500px",
      cell: (props) => (
        <CustomCell
          {...props}
          onRowClick={onRowClick}
          expandIconClick={() => {}}
          icon={"fa fa-flag"}
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
                  props.setShowAnalysis(false, {}, "folder");
                  props.setSelectedAnalysis({});
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
                  props.setShowAnalysis(false, {}, "file");
                  props.setSelectedAnalysis({});
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

  const openContextMenu = (dataItem) => {
    setShowAnalysisContext(true);
  };

  useEffect(() => {
    // console.log('renderTree', temo)
    // renderTree()
  }, []);

  return (
    <div className="vh-100 tree_list_scroll">
      <TreeList
        style={{
          border: "none",
          maxHeight: "100%",
          overflow: "auto",
        }}
        data={extendData(dataTreeCate, selectedState, expandedState)}
        rowRender={RowRender}
        navigatable={true}
        selectedField={SELECTED_FIELD}
        onSelectionChange={onSelectionChange}
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

export default AnalysisFlag;
