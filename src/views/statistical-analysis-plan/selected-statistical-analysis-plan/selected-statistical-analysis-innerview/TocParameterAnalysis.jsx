import React, { useState } from "react";

const TocParameterAnalysis = () => {
    const [isActive, setIsActive] = useState(false);

    const handleSwitchToggle = () => {
        setIsActive((prevIsActive) => !prevIsActive);
    };

    return (
        <div className="toc_parameter_analysis">
            <div className="toc_param_analysis_switcher">
                <p className="mb-0">Parameterization</p>
                <div class="form-check form-switch switch_btn_wrapper">
                    <label class="form-check-label" for="flexSwitchCheckDefault">Basic</label>
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isActive} onChange={handleSwitchToggle} />
                    <label class="form-check-label" for="flexSwitchCheckDefault">Advanced</label>
                </div>
            </div>
            {isActive &&
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">SAS Procedure</th>
                            <th scope="col">SAS Procedure</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th></th>
                            <td>
                                <select className="form-select form-control max_width_200">
                                    <option value="1">MIXED</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            }

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Covariates</th>
                        <th scope="col">Variable</th>
                        <th scope="col">Reference Value</th>
                        <th scope="col">Display</th>
                        <th scope="col">Label</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>1</th>
                        <td>
                            <select className="form-select form-control">
                                <option value="1">TRT01P / TRT01N (Categorical)</option>
                                <option value="2">STRAT1 / STRAT1N (Categorical)</option>
                                <option value="3">STRAT2 / STRAT2N (Categorical)</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" className="form-control" value={1} />
                        </td>
                        <td>
                            <select className="form-select form-control">
                                <option value="1">Y</option>
                                <option value="2">N</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" className="form-control" value="Treatment" />
                        </td>
                    </tr>
                    <tr>
                        <th>2</th>
                        <td>
                            <select className="form-select form-control">
                                <option value="1">TRT01P / TRT01N (Categorical)</option>
                                <option value="2" selected={true}>STRAT1 / STRAT1N (Categorical)</option>
                                <option value="3">STRAT2 / STRAT2N (Categorical)</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" className="form-control" value={1} />
                        </td>
                        <td>
                            <select className="form-select form-control">
                                <option value="1">Y</option>
                                <option value="2" selected={true}>N</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" className="form-control" value="Region" />
                        </td>
                    </tr>
                    <tr>
                        <th>3</th>
                        <td>
                            <select className="form-select form-control">
                                <option value="1">TRT01P / TRT01N (Categorical)</option>
                                <option value="2">STRAT1 / STRAT1N (Categorical)</option>
                                <option value="3" selected={true}>STRAT2 / STRAT2N (Categorical)</option>
                            </select>
                        </td>
                        <td>
                            <input type="number" className="form-control" value={3} />
                        </td>
                        <td>
                            <select className="form-select form-control">
                                <option value="1">Y</option>
                                <option value="2" selected={true}>N</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" className="form-control" value="Prior Medication Use" />
                        </td>
                    </tr>
                </tbody>
            </table>

            {isActive &&
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Baseline</th>
                            <th scope="col">Baseline Type</th>
                            <th scope="col">Baseline Visit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th></th>
                            <td>
                                <select className="form-select form-control max_width_200">
                                    <option value="1">Study Baseline</option>
                                </select>
                            </td>
                            <td>
                                <select className="form-select form-control max_width_200">
                                    <option value="1">Baseline (Visit 2)</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            }

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">MMRM Parameterization</th>
                        <th scope="col">Covariance Matrix</th>
                        <th scope="col">Denominator Degrees of Freedom</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <select className="form-select form-control max_width_200">
                                <option value="1">CS</option>
                            </select>
                        </td>
                        <td>
                            <select className="form-select form-control max_width_200">
                                <option value="1">KR</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>

            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Alpha Level</th>
                        <th scope="col">Alpha Level</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <input type="text" className="form-control max_width_200" value="0.5" />
                        </td>
                    </tr>
                </tbody>
            </table>

            {isActive &&
                <>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Geometric Mean</th>
                                <th scope="col">Geometric Mean</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <select className="form-select form-control max_width_200">
                                        <option value="1">N</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Additional Terms in the Model</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <label className="me-3">Random Effects</label>
                                        <select className="form-select form-control max_width_200">
                                            <option value="1">(None)</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <label className="me-3">Random Intercept</label>
                                        <select className="form-select form-control max_width_200">
                                            <option value="1">(None)</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <label className="me-3">Interaction Terms</label>
                                        <select className="form-select form-control max_width_200">
                                            <option value="1">(None)</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            }

            <div className="d-flex">
                <button type="button" className="btn btn-primary w-100 mt-2 me-2">Save</button>
                <button type="button" className="btn btn-outline-primary w-100 mt-2 invisible">Discard</button>
            </div>
        </div>
    );
};

export default TocParameterAnalysis;
