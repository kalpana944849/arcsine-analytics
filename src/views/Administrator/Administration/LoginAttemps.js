import React from "react";
import RowRender from "../../../components/common/RowRender";
import { getter } from "@progress/kendo-react-common";
import {
    TreeList,
    createDataTree,
    extendDataItem,
    getSelectedState,
    mapTree,
    removeItems,
  } from "@progress/kendo-react-treelist";
import sapData from "../../../flat-data";
import CustomCell from "../../../components/common/CustomCell";
const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "sapId";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const LoginAttemps = (props) => {
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
        (i) => i.sapId,
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
          field: "loginAttemps",
          title: "Login Attemps Date/Time",
          expandable: true,
          width: "350px",
          cell: (props) => (
            <CustomCell
              {...props}
              onRowClick={() => {}}
              expandIconClick={() => {}}
            />
          ),
         

          
        },
        {
          field: "success",
          title: "Success",
          width: "50px",
        },
        {
          field: "IP",
          title: "IP",
          width: "100px",
          
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
          borderTop: '2px solid gray',
          marginBottom: "20px"
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

export default LoginAttemps;
