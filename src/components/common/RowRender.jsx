const RowRender = (row, props) => {
    const rowColor = localStorage.getItem('row-color') || '#d3d3d3';
    const rowColor2 = localStorage.getItem('row-color2') || '#ffffff';
    let color = '#fff';
    let level = props.level.length;
    let rowIndexEven = props.ariaRowIndex % 2;
    switch (level) {
      case 1:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      case 2:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      case 3:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      case 4:
        color = rowIndexEven ? rowColor : rowColor2;
        break;
      default:
        color = '#fff';
    }
    let style = { ...row.props.style, backgroundColor: color };
    return <tr className='selected-row' {...row.props} style={style}></tr>;

  };

  export default RowRender