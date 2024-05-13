import React, { useEffect, useState, useRef } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { getter } from "@progress/kendo-react-common";
import { ContextMenu, MenuItem } from "@progress/kendo-react-layout";
import { getSelectedState } from "@progress/kendo-react-treelist";

import { getSapDataVariableRelationshipView } from '../../../../../services/analysis-defination-data';
import AddUpdateComponentModal from './Modals/AddUpdateComponentModal';

const SELECTED_FIELD_VERSION = "selected";
const DATA_ITEM_KEY_VERSION = "relationshipGuid";
const idGetterVer = getter(DATA_ITEM_KEY_VERSION);

const DatasetVariableRelationshipView = () => {
	const offset = useRef({ left: 0, top: 0 });
	const [showComponentModal, setShowComponentModal] = useState(false);
	const [data, setData] = useState([]);
	const [selectedStateVer, setSelectedStateVer] = useState({});
	const [showContextMenu, setShowContextMenu] = useState(false);
	const [selectedRow, setSelectedRow] = useState([{ parentId: null }]);
	const [activeContextRowData, setActiveContextRowData] = useState(null);

	const onSelectionChangeVer = (event) => {
		const newSelectedState = getSelectedState({
			event,
			selectedState: selectedState,
			dataItemKey: DATA_ITEM_KEY_VERSION
		});
		setSelectedStateVer(newSelectedState);
	};

	const [selectedState, setSelectedState] = React.useState(() => {
		return JSON.parse(localStorage.getItem("relationshipSelectedState")) || {};
	});

	useEffect(() => {
		const getData = async () => {
			try {
                const response = await getSapDataVariableRelationshipView(1);
                if (response.status === 200) {
                    setData(response.data.data);
                } else {
                    throw new Error('Failed to fetch data.');
                }
            } catch (error) {
                console.error(error);
            }
		};

		getData();
	}, []);

	const handleOnSelect = (e) => {
        switch (e.item.data.action) {
            case "addFlag":
                setShowAddFlagModal(true);
                setFlagModalState("add");
                break;
            case "addFlagFolder":
                setShowAddFlagFolderModal(true);
                setFlagFolderModalState("add");
                break;
            case "viewFlagFolder":
                setShowAddFlagFolderModal(true);
                setFlagFolderModalState("view");
                break;
            case "editFlagFolder":
                setShowAddFlagFolderModal(true);
                setFlagFolderModalState("edit");
                break;
            case "deleteFlagFolder":
                setShowConfirmationAlert(true);
                break;
            case "deleteFlag":
                setShowConfirmationAlert(true);
                break;
            default:
        }
        setShowContextMenu(false);
    };

    const handleCloseMenu = () => {
        setShowContextMenu(false);
    };

	const handleContextMenuOpenVersion = (e) => {
		e.preventDefault();
		offset.current = {
			left: e.pageX,
			top: e.pageY,
		};
		setShowContextMenu(true);
	};

	const handleContextMenuVersion = (event) => {
		handleContextMenuOpenVersion(event.syntheticEvent);
		const { dataItem, field } = event;
		if (field) {
			// const cell = dataItem[field];
			// setSelectedCell(cell);
		}
	};

	return (
		<div className="relationshipTable mt-5">
			<Grid
				className="version-grid2"
				data={
					data?.map((item) => ({
						...item,
						[SELECTED_FIELD_VERSION]:
							selectedStateVer[idGetterVer(item)],
					})) || []
				}
				selectable={{
					enabled: true
				}}
				navigatable={true}
				onSelectionChange={onSelectionChangeVer}
				onContextMenu={handleContextMenuVersion}
				dataItemKey={DATA_ITEM_KEY_VERSION}
				selectedField={SELECTED_FIELD_VERSION}
				onRowClick={(e) => {
					document.getElementById(e.dataItem.sapVersionGuid).click();
				}}
			>
				<GridColumn
					title="Component"
					field="componentTypeName"
				/>
				{/* <GridColumn
					title="Variable"
					field="relationshipTypeName"
				/> */}
				<GridColumn
					title="Variable"
					field="relationshipTypeName"
					headerCell={() => (
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								fontWeight: 600
							}}
						>
							<span>Variable</span>
							<button
								style={{ border: "none" }}
								type="button"
								onClick={() => setShowComponentModal(true)}
							>
								<i className="k-icon k-i-file-add k-color-dark" title="Add File"></i>
							</button>
						</div>
					)}
				/>
			</Grid>

			<AddUpdateComponentModal
                showModal={showComponentModal}
                setShowModal={setShowComponentModal}
            />

			<ContextMenu
                show={showContextMenu}
                offset={offset.current}
                onSelect={handleOnSelect}
                onClose={handleCloseMenu}
                className="context-menu"
            >
                <MenuItem
                    text="View"
                    data={{ action: selectedRow?.isFolder ? "viewFlagFolder" : "viewFlag" }}
                    icon="eye"
                />
                <MenuItem
                    text="Edit"
                    data={{ action: selectedRow?.isFolder ? "editFlagFolder" : "editFlag" }}
                    icon="edit"
                />
                <MenuItem
                    text="Delete"
                    data={{ action: selectedRow?.isFolder ? "deleteFlagFolder" : "deleteFlag" }}
                    icon="delete"
                    cssClass="separator"
                />
                <MenuItem
                    text="Add Item"
                    data={{ action: "addFlag" }}
                    icon="file"
                />
            </ContextMenu>
		</div>
	);
};

export default DatasetVariableRelationshipView;
