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

const CustomDropDownTree = (props) => {
    const {label, fieldName, data, collectionInput, setDatasetTreeData, formik, rowData} = props;
    const [value, setValue] = useState({});
    const [expanded, setExpanded] = useState([]);
    const onChange = (event) => {
        if (event.value == null) {
            setDatasetTreeData([]);
            return false;
        } else if (event.value.items) {
            return false;
        }

        if (collectionInput) {
            const treeData = [];
			collectionInput.forEach(element => {
				if (!element?.sapDataId.includes('SapDataCollectionId') && element.isFolder) {
					treeData.push({
						id: element.sapDataId,
						text: element.sapDataNameShort,
						sapDataGuid: element.sapDataGuid,
						items: []
					});
				}
			});

            collectionInput.forEach(element => {
				treeData.forEach(item => {
					if (element.parentGuid === item.sapDataGuid) {
						item.items.push({
							id: element.sapDataId,
							text: element.sapDataNameShort,
							sapDataGuid: element.sapDataGuid
						});
					}
				});
			});

            setDatasetTreeData(treeData);
        }

        setValue(event.value);
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
        }
    }, [data]);

    useEffect(() => {
        setValue({});
    }, [rowData]);

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

export default CustomDropDownTree;
