import React, { useEffect, useState } from "react";
import { useInternationalization } from "@progress/kendo-react-intl";

const CustomCell = (props) => {
	const {
		hasChildren,
		level = [0],
		expanded,
		dataItem,
		format,
		onRowClick,
		expandIconClick,
		icon,
		iconTitle,
		iconForThirdLevelRow,
		iconTitleForThirdLevelRow,
		isCalledFromSapVariablesTable,
		tableName,
		isCheckboxEnabled,
		sapVisitSelectionInputsCopy,
		setSapVisitSelectionInputs,
		handleCheckbox
	} = props;
	const intl = useInternationalization();
	const data = dataItem[props.field];
	let [folderIcon, setFoldericon] = useState(dataItem.isFolder);
	let dataAsString = "";
	const icons = [];
	const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
		// console.log(props);
		// // const isChecked = event.target.checked;
		// // return false;
		// let data = [...sapVisitSelectionInputsCopy];
		// const isRowSelected = data.find((item) => item.sapVisitId === dataItem.sapVisitId);
		// console.log(isRowSelected);
		// if (isRowSelected == undefined) {
		// 	setIsChecked(true);
		// 	console.log("data", true);
		// } else {
		// 	setIsChecked(false);
		// 	data = data.filter(item => item.sapVisitId !== dataItem.sapVisitId);
		// 	setSapVisitSelectionInputs(data);
		// 	return false;
		// }

		// const currentDateTime = new Date();
		// const visit = {
		// 	"sapVisitSelectionId": dataItem.sapVisitId,
		// 	"sapVisitSelectionGuid": dataItem.sapVisitGuid,
		// 	"companyId": dataItem.companyId,
		// 	"sapId": dataItem.sapId,
		// 	"sapVersionId": dataItem.sapVersionId,
		// 	"sapVisitFlagId": 0,
		// 	"sapVisitId": dataItem.sapVisitId,
		// 	"sapVisitTimeId": dataItem.sapVisitGuid,
		// 	"createdBy": "test",
		// 	"updatedBy": "test",
		// 	"createdDate": currentDateTime,
		// 	"updatedDate": currentDateTime
		// };
		// data.push(visit);
		// console.log("sapVisitSelectionInputsCopy", sapVisitSelectionInputsCopy);
		// console.log("data", data);
		// handleCheckbox(visit);
		// setSapVisitSelectionInputs(data);
		// debugger;
		// return true;
		setIsChecked(!isChecked);
    };

	if (data !== undefined && data !== null) {
		dataAsString = format ? intl.format(format, data) : data.toString();
	}

	if (props.expandable) {
		if (props.expandable) {
			icons.push(
				...level
					.slice(1)
					.map((_x, i) => (
						<span className="k-icon k-i-none k-indent-space" key={i} />
					))
			);
			if (hasChildren) {
				icons.push(
					<span
						className={`k-icon k-i-${expanded ? "collapse" : "expand"}`}
						key="expand-collapse"
						onClick={(event) => {
							props.onExpandChange(event, dataItem);
							event.stopPropagation();
							expandIconClick && expandIconClick(dataItem);
						}}
					/>
				);
			} else {
				icons.push(<span className="k-icon k-i-none" key={icons.length} />);
			}
		}
	}

	useEffect(() => {
		if (tableName === 'visit-structure' && folderIcon && dataItem.sapDataLevelId === 2) {
			setFoldericon(false);
		}
	}, []);

	return (
		<>
			<td
				style={props.style}
				className={props.className}
				colSpan={props.colSpan}
				onClick={(event) => onRowClick(event, props)}
			>
				{isCheckboxEnabled && 
					<input 
						type="checkbox" 
						style={{ marginRight: '12px' }}
						// checked={sapVisitSelectionInputsCopy.includes(dataItem.sapVisitId)}
						checked={isChecked}
                		onChange={handleCheckboxChange}
						value={dataItem.sapVisitId}
						id={dataItem.sapVisitId}
						name="visitFlag"
					/>
				}
				{icons}
				{folderIcon ?
						<i className={`m-1 ${expanded ? "k-icon k-i-folder-open k-color-dark" : "k-icon k-i-folder k-color-dark"}`} title="Folder"></i> :
						<>
							{dataItem.sapDataLevelId && dataItem.sapDataLevelId === 3 ?
								<i className={`m-1 ${iconForThirdLevelRow ? iconForThirdLevelRow : "k-icon k-i-file k-color-dark"}`} title={iconTitleForThirdLevelRow ? iconTitleForThirdLevelRow : "Folder"}></i> :
								<i className={`m-1 ${icon ? icon : "k-icon k-i-file k-color-dark"}`} title={iconTitle ? iconTitle : "Folder"}></i>
							}
						</>
				}
				{dataAsString}
			</td>
		</>
	);
};

export default CustomCell;
