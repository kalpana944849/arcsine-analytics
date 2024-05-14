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
		toggleCheckbox,
		checkedItems
	} = props;
	const intl = useInternationalization();
	const data = dataItem[props.field];
	let [folderIcon, setFoldericon] = useState(dataItem.isFolder);
	let dataAsString = "";
	const icons = [];
	const [isChecked, setIsChecked] = useState(false);

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
						// checked={isChecked}
						checked={checkedItems && Object.keys(checkedItems).length > 0 ? checkedItems[dataItem?.sapVisitId] : false}
						onChange={() => toggleCheckbox(dataItem)}
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
