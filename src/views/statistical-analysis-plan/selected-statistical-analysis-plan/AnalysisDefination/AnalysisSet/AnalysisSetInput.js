import React from "react";
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
// import sapData from "../../flat-data";
// import CustomCell from "../../components/common/CustomCell";
import RowRender from "../../../../../components/common/RowRender";
import CustomCell from "../../../../../components/common/CustomCell";
const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapAnalysisSetId";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const AnalysisSetInput = (props) => {
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
        (i) => i.sapAnalysisSetId,
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
      const columnsCategory = [
        {
          field: "analysisSetNameShort",
          title: "Icon Name Short",
          expandable: true,
          width: "500px",
          cell: (props) => (
            <CustomCell
              {...props}
              onRowClick={() => {}}
              expandIconClick={() => {}}
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
                    //   setShowAddPopupSap(true);
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
                    //   setShowAddPopupSap(true);
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
  return (
    <>
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
    </>
  );
};

export default AnalysisSetInput;
