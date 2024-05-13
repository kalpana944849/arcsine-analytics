import React, { useState, useRef, useCallback } from 'react';
import { TreeList, createDataTree, mapTree, extendDataItem, getSelectedState } from '@progress/kendo-react-treelist';
import { getter } from "@progress/kendo-react-common";

import RowRender from '../../../../../components/common/RowRender';
import CustomCell from '../../../../../components/common/CustomCell';

const expandField = "expanded";
const subItemsField = "items";
const DATA_ITEM_KEY = "sapVisitGuid";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const VisitStructureTreeList = (props) => {
    const { data, sapVisitSelectionInputs, setSapVisitSelectionInputs } = props;
    let expandObj = {};
    const [selectedState, setSelectedState] = useState({});
    const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
    const [dataLevelID, setDataLevelID] = useState(0);
    const [expandedState, setExpandedState] = useState(() => {
        return JSON.parse(localStorage.getItem("DataexpandedState")) || expandObj;
    });
    const sapVisitSelectionInputsCopy = JSON.parse(JSON.stringify(sapVisitSelectionInputs));
    const columns = [
        {
            field: "sapVisitShortName",
            title: "Icon Name Short",
            expandable: true,
            width: "500px",
            cell: (props) => (
                <CustomCell
                    {...props}
                    onRowClick={() => false}
                    expandIconClick={() => { }}
                    icon='fa-regular fa-calendar-check'
                    iconTitle="Calendar"
                    iconForThirdLevelRow="fa-regular fa-clock"
                    iconTitleForThirdLevelRow="Time"
                    tableName="visit-structure"
                    isCheckboxEnabled={true}
                    sapVisitSelectionInputsCopy={sapVisitSelectionInputsCopy}
                    setSapVisitSelectionInputs={setSapVisitSelectionInputs}
                    handleCheckbox={handleCheckbox}
                />
            ),
            headerCell: () => {
                return (
                    <th
                        style={{
                            top: "0px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <td className="p-0">
                            <input type="checkbox" />
                        </td>
                        <td style={{ borderLeft: 0 }}>Select Visits</td>
                    </th>
                );
            }
        }
    ];

    const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) => {
            let dataId = idGetter(item);
            expandObj[dataId] = true;
            return extendDataItem(item, subItemsField, {
                selected: selectedState[idGetter(item)],
                expanded: expandedState[idGetter(item)]
            });
        });
    };

    const dataTree = createDataTree(
        data,
        (i) => i.sapVisitGuid,
        (i) => i.parentGuid,
        subItemsField
    );

    const [stateCategory, setStateCategory] = useState({
        data: [...dataTree],
        itemInEdit: undefined
    });

    const onExpandChangeCategory = useCallback(
        (e) => {
            setExpandedState({
                ...expandedState,
                [idGetter(e.dataItem)]: !e.value
            });
        },
        [expandedState]
    );

    // const onRowClick = (event, props) => {
    //     const { dataItem } = props;
    //     setSelectedRow(dataItem);
    //     setDataLevelID(dataItem.sapDataLevelId);
    //     props.selectionChange(event);
    // };

    const onSelectionChange = useCallback(event => {
        const newSelectedState = getSelectedState({
            event,
            selectedState: selectedState,
            dataItemKey: DATA_ITEM_KEY
        });
        Object.keys(newSelectedState).forEach(key => {
            if (key !== event.dataItem.sapVisitGuid) {
                delete newSelectedState[key];
            }
        });
        setSelectedState(newSelectedState);
        if (!newSelectedState) setDataLevelID(0);
    }, [selectedState]);

    const handleCheckbox = (visit) => {
        const data = [...sapVisitSelectionInputs, visit];
        setSapVisitSelectionInputs(data);
    };

    return (
        <>
            <div className="visit-structure-table-wrapper">
                <TreeList
                    style={{ border: "none", maxHeight: "100%", overflow: "auto" }}
                    data={extendData(stateCategory.data, selectedState, expandedState)}
                    rowRender={RowRender}
                    navigatable={true}
                    selectedField={SELECTED_FIELD}
                    selectable={{ enabled: true }}
                    onSelectionChange={onSelectionChange}
                    expandField={expandField}
                    subItemsField={subItemsField}
                    onExpandChange={onExpandChangeCategory}
                    columns={columns}
                />
            </div>
        </>
    );
};

export default VisitStructureTreeList;
