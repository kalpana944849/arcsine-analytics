import React from 'react'

const CustomHeaderCell = ({title, icon, onFolderClick, onItemClick}) => {
  return (
    <th
    style={{
      top: "0px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <td>{title}</td>
    <td style={{ border: "none" }}>
      <button
        className="me-2"
        style={{ border: "none" }}
        onClick={onFolderClick}
      >
        <i
          className="k-icon k-i-folder-add k-color-dark"
          title="Add Folder"
        ></i>
      </button>
      <button
        style={{ border: "none" }}
        onClick={onItemClick}
      >
        <i
          // className={`${icon ? icon : 'k-icon k-i-file-add k-color-dark'}`}
          className='k-icon k-i-file-add k-color-dark'
          title={`Add ${title}`}
        ></i>
      </button>
    </td>
  </th>
  )
}

export default CustomHeaderCell
