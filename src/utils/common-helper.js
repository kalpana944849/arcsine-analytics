const handleContextMenuOpen = (
  e,
  dataItem,
  callback,
  setSelectedRow,
  offset
) => {
  e.preventDefault();
  setSelectedRow(dataItem);
  offset.current = {
    left: e.pageX,
    top: e.pageY,
  };
  callback(dataItem);
};
export const handleContextMenu = (event, callback, setSelectedRow, offset) => {
  handleContextMenuOpen(
    event.syntheticEvent,
    event.dataItem,
    callback,
    setSelectedRow,
    offset
  );
};

export const onChange = (event, setPanes) => {
  if (event.newState[0].collapsed) {
    event.newState[1].collapsible = false;
    event.newState[1].size = undefined;
  } else {
    event.newState[1].collapsible = true;
  }
  if (event.newState[1].collapsed) {
    event.newState[0].collapsible = false;
  } else {
    event.newState[0].collapsible = true;
  }
  setPanes(event.newState);
};
export const printText = (str) => {
  if (str !== "" && str !== undefined && str !== null) {
    return str;
  } else {
    return "";
  }
};

export const getIdFromString = (datasetIdString) => {
  // const datasetIdString = "DatasetId_1049";
  // Using regular expression
  const match = datasetIdString.match(/\d+/);
  const dataId = match ? parseInt(match[0]) : null;

  return dataId
};
export const panesJson = [
  {
    size: "50%",
    min: "20%",
    collapsible: true,
    scrollable: false,
  },
  {
    min: "20%",
    collapsible: true,
    scrollable: true,
  },
]


export const getParsedFromLocalStorage = (key, cb) => {
  if (localStorage.getItem(key)) {
    
    try {
      // Attempt to parse the data from localStorage
      var parsedData = JSON.parse(localStorage.getItem(key));

      // Now you can use parsedData for further processing
      return parsedData
      
    } catch (error) {
      // Handle parsing error
      // console.error('Error parsing data from localStorage:', error);
      return cb
    }
  } else {
    // console.log('Item not found in localStorage');
    return cb
  }
}

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
};