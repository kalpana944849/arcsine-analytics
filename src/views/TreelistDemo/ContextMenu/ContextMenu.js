import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ContextMenu, MenuItem } from '@progress/kendo-react-layout';
import { sampleProducts } from './sample-products';
const App = () => {
  const [gridData, setGridData] = React.useState(sampleProducts);
  const [dataItemIndex, setDataItemIndex] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState();
  const [editID, setEditID] = React.useState(null);
  const offset = React.useRef({
    left: 0,
    top: 0
  });
  const handleContextMenuOpen = (e, dataItem) => {
    e.preventDefault();
    setDataItemIndex(gridData.findIndex(p => p.ProductID === dataItem.ProductID));
    setSelectedRow(dataItem);
    offset.current = {
      left: e.pageX,
      top: e.pageY
    };
    setShow(true);
  };
  const handleCloseMenu = () => {
    setShow(false);
  };
  const handleDeleteRow = () => {
    let data = [...gridData];
    data.splice(dataItemIndex, 1);
    setGridData(data);
  };
  const handleAddRow = () => {
    const newRow = {
      ProductID: gridData.length + 1
    };
    setGridData([newRow, ...gridData]);
    setEditID(newRow.ProductID);
  };
  const handleEditRow = () => {
    setEditID(selectedRow.ProductID);
  };
  const handleMoveUp = () => {
    let data = [...gridData];
    if (dataItemIndex !== 0) {
      data.splice(dataItemIndex, 1);
      data.splice(dataItemIndex - 1, 0, selectedRow);
      setGridData(data);
    }
  };
  const handleMoveDown = () => {
    let data = [...gridData];
    if (dataItemIndex < gridData.length) {
      data.splice(dataItemIndex, 1);
      data.splice(dataItemIndex + 1, 0, selectedRow);
      setGridData(data);
    }
  };
  const onItemChange = event => {
    const inEditID = event.dataItem.ProductID;
    const field = event.field || '';
    const newData = gridData.map(item => item.ProductID === inEditID ? {
      ...item,
      [field]: event.value
    } : item);
    setGridData(newData);
  };
  const handleOnSelect = e => {
    switch (e.item.data.action) {
      case 'addRow':
        handleAddRow();
        break;
      case 'editRow':
        handleEditRow();
        break;
      case 'deleteRow':
        handleDeleteRow();
        break;
      case 'moveUp':
        handleMoveUp();
        break;
      case 'moveDown':
        handleMoveDown();
        break;
      default:
    }
    setShow(false);
  };
  const handleContextMenu = event => {
    handleContextMenuOpen(event.syntheticEvent, event.dataItem);
  };
  return <>
        <Grid data={gridData.map(item => ({
      ...item,
      inEdit: item.ProductID === editID
    }))} editField="inEdit" onItemChange={onItemChange} onContextMenu={handleContextMenu}>
          <GridColumn field="ProductID" title="ID" editable={false} />
          <GridColumn field="ProductName" title="Name" editor="text" />
          <GridColumn field="UnitPrice" title="Price" editor="numeric" />
          <GridColumn field="UnitsInStock" title="In stock" editor="numeric" />
          <GridColumn field="Discontinued" title="Discontinued" editor="boolean" />
        </Grid>
        <ContextMenu show={show} offset={offset.current} onSelect={handleOnSelect} onClose={handleCloseMenu}>
          <MenuItem text="Add row" data={{
        action: 'addRow'
      }} icon='plus' />
          <MenuItem text="Edit row" data={{
        action: 'editRow'
      }} icon='edit' />
          <MenuItem text="Delete row" data={{
        action: 'deleteRow'
      }} icon='delete' />
          <MenuItem text="Move row up" data={{
        action: 'moveUp'
      }} icon='arrow-up' />
          <MenuItem text="Move row down" data={{
        action: 'moveDown'
      }} icon='arrow-down' />
        </ContextMenu>
      </>;
};
ReactDOM.render(<App />, document.querySelector('my-app'));