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
import RowRender from "./RowRender";
import CustomCell from "./CustomCell";
import CustomHeaderCell from "./CustomHeaderCell";
import { handleContextMenu } from "../../utils/common-helper";


const DynamicTreeList = (props) => {
    const {id, col_field, guid, onRowClick, onFolderClick, onItemClick, setSelectedRow, offset, openContextMenu, icon, iconTitle, localKey, showData} = props;
    const expandField = "expanded";
    const subItemsField = "children";
    const DATA_ITEM_KEY = guid;
    const SELECTED_FIELD = "selected";
    const idGetter = getter(DATA_ITEM_KEY);
    // const extendData = (dataState, selectedState, expandedState) => {
    //     return mapTree(dataState, subItemsField, (item) =>
    //       extendDataItem(item, subItemsField, {
    //         selected: selectedState[idGetter(item)],
    //         expanded: expandedState[idGetter(item)],
    //       })
    //     );
    //   };
      let expandObj = {}
      const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) => {
          let dataId = idGetter(item)
          expandObj[dataId] = true;
          return  extendDataItem(item, subItemsField, {
            selected: selectedState[idGetter(item)],
            expanded: expandedState[idGetter(item)],
          })
        }
        );
      };
      const treeListData = props.data;
      const dataTree = createDataTree(
        treeListData,
        (i) => i[id],
        (i) => i.parentId,
        subItemsField
      );
      const [selectedState, setSelectedState] = React.useState(() => {
        return JSON.parse(localStorage.getItem(localKey)) || {};
      });
      // const [expandedState, setExpandedState] = React.useState({
      //   1: true,
      //   2: true,
      //   32: true,
      // });
      const [expandedState, setExpandedState] = React.useState(() => {
        return JSON.parse(localStorage.getItem("DynamicExpandedState")) || expandObj;
      });
      const columns = [
        {
          field: col_field,
          title: "",
          expandable: true,
          width: "500px",
          cell: (props) => (
            <CustomCell
              {...props}
              onRowClick={onRowClick}
              expandIconClick={() => {}}
              icon={icon}
              iconTitle={iconTitle}
            />
          ),
          headerCell: () => <CustomHeaderCell title={props.title} icon={icon} onFolderClick={onFolderClick} onItemClick={onItemClick}/>,
        },
      ];

      const onExpandChange = React.useCallback(
        (e) => {
          setExpandedState({
            ...expandedState,
            [idGetter(e.dataItem)]: !e.value,
          });
        },
        [expandedState]
      );
      const onSelectionChange = React.useCallback(
        (event) => {
          const newSelectedState = getSelectedState({
            event,
            selectedState: selectedState,
            dataItemKey: DATA_ITEM_KEY,
          });
          Object.keys(newSelectedState).forEach((key) => {
            if (key !== event.dataItem[guid]) {
              delete newSelectedState[key];
            }
          });
          setSelectedState(newSelectedState);
          localKey && localStorage.setItem(localKey, JSON.stringify(newSelectedState));
        },
        [selectedState]
      );

      useEffect(() => {
        localStorage.setItem("DynamicExpandedState", JSON.stringify(expandedState));
      }, [expandedState]);
  return (
    <div className="vh-100 tree_list_scroll">
      <TreeList
      // className="tree_scroll"
        style={{
          border: "none",
          maxHeight: "100%",
          overflow: showData?"none":"auto"
        }}
        data={extendData(dataTree, selectedState, expandedState)}
        onRowContextMenu={(event) =>
          handleContextMenu(
            event,
            openContextMenu,
            setSelectedRow,
            offset
          )
        }
        rowRender={RowRender}
        onSelectionChange={onSelectionChange}
        navigatable={true}
        selectedField={SELECTED_FIELD}
        selectable={{
          enabled: true,
        }}
        expandField={expandField}
        subItemsField={subItemsField}
        onExpandChange={onExpandChange}
        columns={columns}
      />
     </div>
  );
};

export default DynamicTreeList;
