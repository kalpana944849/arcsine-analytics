import React, { useState, useRef, useEffect, useCallback } from "react";
import { getter } from "@progress/kendo-react-common";
import { TreeList, createDataTree, extendDataItem, getSelectedState, mapTree, removeItems } from "@progress/kendo-react-treelist";
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import { useFormik } from "formik";
import SweetAlert from "react-bootstrap-sweetalert";

import CustomCell from "../../../../../components/common/CustomCell";
import RowRender from "../../../../../components/common/RowRender";
import CustomCellVariable from "../../../../../components/common/CustomCellVariable";
import { handleContextMenu } from './../../../../../utils/common-helper';
import { getSapDataVariableRelationship } from "../../../../../services/analysis-defination-data";
import AddUpdateVariableRelationshipModal from "./Modals/AddUpdateVariableRelationshipModal";
import data from './variableRelationshipData.json';

const expandField = "expanded";
const subItemsField = "employees";
const DATA_ITEM_KEY = "relationshipId";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);

const VariableRelationship = () => {
    const [variableRelationshipData, setVariableRelationshipData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedState, setSelectedState] = useState({});

	const getVariableRelationshipData = async () => {
		const response = await getSapDataVariableRelationship(43, 24);
		if (response.status == 200) {
			setVariableRelationshipData(response.data.data);
			console.log(response.data.data);
		}
    };

	useEffect(() => {
        getVariableRelationshipData();
    }, []);

	const dataTree = createDataTree(
        data,
        (i) => i.relationshipGuid,
        (i) => i.parentGuid,
        subItemsField
    );

	console.log(dataTree);

    const [stateCategory, setStateCategory] = useState(
		{
			data: [...dataTree],
			itemInEdit: undefined
		}
	);
    const [expandedState, setExpandedState] = useState({
		1: true,
		2: true,
		32: true
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
    const extendData = (dataState, selectedState, expandedState) => {
		return mapTree(dataState, subItemsField, (item) =>
			extendDataItem(item, subItemsField, {
				selected: selectedState[idGetter(item)],
				expanded: expandedState[idGetter(item)]
			})
		);
	};
    const columnsCategory = [
		{
			field: "Personal Information",
			headerCell: () => {
				return (
					<th
						style={{
							top: "0px",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center"
						}}
					>
						<td>Variable Relationship</td>
						<td style={{ border: "none" }}>
							<button 
                                style={{ border: "none" }} 
								onClick={() => {
                                    setShowModal(true);
									// props.setShowAddPopupVariable(true)
									// props.setIsFolder(false)
									// props.setParentIdVariable(null)
								}}
							>
								<i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
							</button>
						</td>
					</th>
				);
			},
			children: [
				{
					field: "sapDataVariableNameShort",
					title: "Variable Relationship",
					expandable: true,
					width: "300px",
					cell: (props) => (
						<CustomCell
							{...props}
							onRowClick={() => { 
								setSelectedRow(props.dataItem)
							}}
							expandIconClick={() => { }}
							isCalledFromSapVariablesTable={true}
						/>
					),
				},
				{
					field: "sapDataVariableTypeShortName",
					title: "Component",
					width: "500px",
					cell: (props) => (
						<CustomCellVariable
							{...props}
							onRowClick={() => { }}
							expandIconClick={() => { }}
							isCalledFromSapVariablesTable={true}
						/>
					)
				},
				{
					field: "sapDataVariableTypeShortName",
					title: "Variable",
					width: "500px",
					cell: (props) => (
						<CustomCellVariable
							{...props}
							onRowClick={() => { }}
							expandIconClick={() => { }}
							isCalledFromSapVariablesTable={true}
						/>
					)
				}
			]
		}
	];

    return (
        <div className="vh-100 tree_list_scroll td-hover td-icon">
            <TreeList
                style={{border: "none", maxHeight: "100%", overflow: "auto"}}
                data={extendData(stateCategory.data, selectedState, expandedState)}
                rowRender={RowRender}
                navigatable={true}
                selectedField={SELECTED_FIELD}
                selectable={{enabled: true}}
                expandField={expandField}
                subItemsField={subItemsField}
                onExpandChange={onExpandChangeCategory}
                columns={columnsCategory}
                onRowContextMenu={(event) => {
                    handleContextMenu(
                        event,
                        openContextMenu,
                        setSelectedRow,
                        offset
                    )
                }}
            />

            <AddUpdateVariableRelationshipModal 
                showModal={showModal}
                setShowModal={setShowModal}
            />
        </div>
    );
};

export default VariableRelationship;
