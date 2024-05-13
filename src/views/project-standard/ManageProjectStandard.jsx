import { Splitter } from '@progress/kendo-react-layout';
import { TreeList } from '@progress/kendo-react-treelist';
import React from 'react'
import { Link } from 'react-router-dom';

const ManageProjectStandard = () => {
    const extendData = (dataState, selectedState, expandedState) => {
        return mapTree(dataState, subItemsField, (item) => {
          if (flag && item.iconId == iconId) {
            return extendDataItem(item, subItemsField, {
              selected: selectedState[idGetter(item)],
              expanded: true,
            });
          }
          return extendDataItem(item, subItemsField, {
            selected: selectedState[idGetter(item)],
            expanded: expandedState[idGetter(item)],
          });
        });
      };
    return (
        <div className='main'>
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4>
                            <Link to="/">Arcsine Analytics</Link>
                        </h4>
                        <Link to="#" class="sidebar_btn" onclick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/">Home \</Link>
                                </li>
                                <li className="breadcrumb-item-inner">
                                    <Link to="/project-standard">Project Standard </Link>
                                </li>
                                {/* <li class="breadcrumb-item-inner2">
                    <Link to="#">Manage Project</Link>
                  </li> */}
                            </ol>
                        </nav>
                    </div>

                    <ul className="sidebar_list">

                        <li className="active"><Link onClick={() => setIsProjectsModalOpen(true)}>
                            <i className="fa-regular fa-square-plus"></i>
                            <span>Select Project</span></Link>
                        </li>

                    </ul>

                </div>
            </div>
            <div className="main_section">
                <section className="main_content">
                    <div className='icon-treelist'>
                        {/* <Splitter
                            style={{
                                height: "100%",
                            }}
                            panes={panes}
                            orientation={"horizontal"}
                            onChange={(event) => onChange(event, setPanes)}
                            scrollable={false}
                        >
                            <TreeList
                                style={{
                                    border: "none",
                                    maxHeight: "100%",
                                    overflow: "auto",
                                    // width: '720px'
                                }}
                                data={extendData(
                                    stateCategory.data,
                                    selectedState,
                                    expandedState
                                )}
                                onSelectionChange={onSelectionChange}
                                onRowContextMenu={(event) =>
                                    handleContextMenu(
                                        event,
                                        openContextMenu,
                                        setSelectedRow,
                                        offset
                                    )
                                }
                                rowRender={RowRender}
                                editField={editField}
                                navigatable={true}
                                selectedField={SELECTED_FIELD}
                                selectable={{
                                    enabled: true,
                                }}
                                expandField={expandField}
                                subItemsField={subItemsField}
                                onExpandChange={onExpandChangeCategory}
                                columns={columnsCategory}
                            />
                            <div>

                            </div>
                        </Splitter> */}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ManageProjectStandard;
