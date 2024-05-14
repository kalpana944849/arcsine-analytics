import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DropDownTree } from "@progress/kendo-react-dropdowns";

import { processTreeData, expandedState } from "./tree-data-operations";
import "./overview-styles.css";

const selectField = "selected";
const expandField = "expanded";
const dataItemKey = "id";
const textField = "text";
const subItemsField = "items";
const fields = {
    selectField,
    expandField,
    dataItemKey,
    subItemsField
};
function findElementByIdInItems(id, data) {
    for (const item of data) {
        if (item.items) {
            const foundItem = item.items.find(subItem => subItem.id === id);
            if (foundItem) {
                return foundItem;
            }
        }
    }
    return {};
}
const CustomDropDownTreeSubgroup = (props) => {
    const {label, fieldName, data, setTreeData, formik, rowData, reload} = props;
    // const defaultValue = findElementByIdInItems(formik.values.subgroupVariable, data)
    // console.log('defaultValue', defaultValue);
    const [value, setValue] = useState({});
    const [expanded, setExpanded] = useState([]);
    const onChange = (event) => {
        if (event.value == null) {
            setTreeData([]);
            return false;
        } else if (event.value.items) {
            return false;
        }

        setValue(event.value);
        console.log('value', event.value)
        formik.setFieldValue(fieldName, event.value.id);
    };
    const onExpandChange = useCallback(
        (event) => {
            setExpanded(expandedState(event.item, dataItemKey, expanded));
        },
        [expanded]
    );
    const treeData = useMemo(
        () =>
            processTreeData(
                data,
                {
                    expanded,
                    value
                },
                fields
            ),
        [expanded, value]
    );

    useEffect(() => {
        if (data.length) {
            setExpanded([data[0][dataItemKey]]);
            if(fieldName == 'subgroupVariable'){
                const defaultValue = findElementByIdInItems(rowData.sapDataVariableId, data)
                setValue(defaultValue)
            } else {
                const defaultValue = findElementByIdInItems(rowData.sapCovariateVariableId, data)
                setValue(defaultValue)
            }
        }
    }, [data]);

    useEffect(() => {
        // setValue({});
        if(fieldName == 'subgroupVariable'){
            const defaultValue = findElementByIdInItems(rowData.sapDataVariableId, data)
            setValue(defaultValue)
        } else {
            const defaultValue = findElementByIdInItems(rowData.sapCovariateVariableId, data)
            setValue(defaultValue)
        }
    }, [rowData, reload]);

    return (
        <React.Fragment>
            <label class="form-label">{label}</label>
            <DropDownTree
                style={{
                    width: "390px",
                }}
                data={treeData}
                value={value}
                onChange={onChange}
                placeholder="Please select ..."
                textField={textField}
                dataItemKey={dataItemKey}
                selectField={selectField}
                expandField={expandField}
                onExpandChange={onExpandChange}
                className="form-select form-control"
            />
        </React.Fragment>
    );
};

export default CustomDropDownTreeSubgroup;
