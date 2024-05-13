import React from 'react';

const ControlledOptions = () => {
    return (
        <React.Fragment>
            <div>
                <div className="btn-group">
                    <button className="btn">Action</button>
                    <button className="btn dropdown-toggle" data-toggle="dropdown">
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a tabIndex="-1" href="#">Regular link</a></li>
                        <li><a tabIndex="-1" href="#">Another link</a></li>
                    </ul>
                </div>
                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setOption(false)}></button>
                            <div className="modal-body">
                            <button>Add</button>
                        <button>Add</button>
                        <button>Add</button>
                        
      ...
    </div> */}
  
            </div>
        </React.Fragment>
    );
};

export default ControlledOptions;
