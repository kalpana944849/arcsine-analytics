import React, { useState } from "react";
import { useInternationalization } from "@progress/kendo-react-intl";
import folderImg from "../../assets/images/folder2.svg";

const CustomCell = (props) => {
  const intl = useInternationalization();
  const {
    hasChildren,
    level = [0],
    expanded,
    dataItem,
    format,
    onRowClick,
    expandIconClick,
  } = props;
  const data = dataItem[props.field];
  let dataAsString = "";

  if (data !== undefined && data !== null) {
    dataAsString = format ? intl.format(format, data) : data.toString();
  }
  const folderIcon = dataItem.isFolder;

  const icons = [];
  if (props.expandable)
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

  return (
    <td
      style={props.style}
      className={props.className}
      colSpan={props.colSpan}
      //selected works heres
      onClick={(event) => {
        onRowClick(event, props);
      }}
    >
      {icons}
      {/* <img src={dataItem?.iconUrl || folderImg} alt="folder-icon" className='me-2' /> */}
      {folderIcon ? (
        <i
          className={`k-icon k-i-${
            expanded ? "folder-open k-color-dark" : "folder k-color-dark"
          }`}
          title="Folder"
        ></i>
      ) : (
        <i className="file k-color-dark" title="Folder"></i>
      )}
      {/*--- Show Image before the filed Name ----*/}
      {/* <img className=' me-2 treelist-carrent-icon-space' height={20} width={20} src={`http://${dataItem?.s3bucket}/${dataItem?.iconUrl}` || folderImg} alt='folder-icon' /> */}
      {dataAsString}
    </td>
  );
};

export default CustomCell;
