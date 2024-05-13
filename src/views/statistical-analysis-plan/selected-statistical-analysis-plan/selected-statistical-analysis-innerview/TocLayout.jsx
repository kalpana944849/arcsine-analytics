import React from "react";

const TocLayout = () => {
    return (
        <div>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" aria-current="page" href="#titles">Table Layout</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" aria-current="page" href="#analysis">Figure Styles</a>
                </li>
            </ul>
            <div className="tab-content pt-4" id="tab-content">
                <div className="tab-pane active" id="titles">
                    <h3>Titles</h3>
                </div>
                <div className="tab-pane" id="analysis">
                    <h3>Analysis Set and Treatment</h3>
                </div>
            </div>
        </div >
    );
};

export default TocLayout;
