import React, { useState, useEffect } from "react";
import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";

import { getVisitStructureTreeData, getVisitFlagTreeData } from "../../../../../services/visit-service";
import CustomLoader from "../../../../../utils/Loaders/CustomLoader";
import VisitStructureTree from "./VisitStructure";
import VisitFlag from "./VisitFlag";

const Visits = () => {
	const [selected, setSelected] = useState(0);
	const [visitStructureAPICalled, setVisitStructureAPICalled] = useState(false);
	const [visitStructureTreeData, setVisitStructureTreeData] = useState([]);
	const [visitFlagAPICalled, setVisitFlagAPICalled] = useState(false);
	const [visitFlagTreeData, setVisitFlagTreeData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	const sapDataId = JSON.parse(localStorage.getItem("SapDataId"));
	const sapID = sapDataId && sapDataId.sapId;
	const sapVersionID = localStorage.getItem("sapVersionId");

	useEffect(() => {
        fetchVisitStructureTreeData();
		fetchVisitFlagTreeData();
    }, [reload]);

	const handleSelect = (e) => {
		setSelected(e.selected);
	};

	const fetchVisitStructureTreeData = async () => {
		setLoading(true);
		try {
            const response = await getVisitStructureTreeData(sapID, sapVersionID);
            if (response && response.data.status === "OK") {
				setVisitStructureAPICalled(true);
				setVisitStructureTreeData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
			setTimeout(() => setLoading(false), 500);
		}
	};

	const fetchVisitFlagTreeData = async () => {
		setLoading(true);
		try {
            const response = await getVisitFlagTreeData(sapID, sapVersionID);
            if (response && response.data.status === "OK") {
				setVisitFlagAPICalled(true);
				setVisitFlagTreeData(response.data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
			setTimeout(() => setLoading(false), 500);
		}
	};

	return (
		<>
			<div className="row">
				<div className="visitsTablesWrapper">
					<TabStrip selected={selected} onSelect={handleSelect} >
						<TabStripTab title="Visits Structure">
							<div>
								{loading ? <CustomLoader /> :
									(visitStructureAPICalled && 
									<VisitStructureTree 
										data={visitStructureTreeData}
										reload={reload}
                						setReload={setReload} 
									/>)
								}
							</div>
						</TabStripTab>
						<TabStripTab title="Visit Flag">
							<div>
								{loading ? <CustomLoader /> :
									(visitFlagAPICalled && 
									<VisitFlag
										data={visitFlagTreeData}
										visitStructureTreeData={visitStructureTreeData}
										reload={reload}
                						setReload={setReload} 
									/>)
								}
							</div>
						</TabStripTab>
					</TabStrip>
				</div>
				<div style={{ border: "none" }} className='p-2 d-none'>
					<form onSubmit={(e) => { }}>
						<th
							style={{
								top: "0px",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<td className="mt-2">Selected Endpoint</td>
						</th>
						<div className="mt-3 " style={{ borderTop: "1px solid gray" }}>
							<div class="row mb-3">
								<div class="col">
									<label htmlFor="exampleInputEmail1" class="form-label">
										Data
										<sup className="text-danger">*</sup>
									</label>
									<input
										type="text"
										class="form-control"
										id="shortName"
										name="shortName"
									/>
								</div>
								<div class="col">
									<label htmlFor="exampleInputEmail1" class="form-label">
										Dataset
									</label>
									<input
										type="text"
										class="form-control"
										id="longName"
										name="longName"

									/>
								</div>
							</div>
							<div class="mb-3">
								<label htmlFor="exampleInputEmail1" class="form-label">
									PARAMCD : PARAM
								</label>
								<input
									type="text"
									class="form-control"
									id="desc"
								/>
							</div>
							<div class="mb-3">
								<label htmlFor="exampleInputEmail1" class="form-label">
									Description
								</label>
								<input
									type="text"
									class="form-control"
									id="desc"
								/>
							</div>
							<div class="mb-3">
								<label htmlFor="exampleInputEmail1" class="form-label">
									Label
								</label>
								<input
									type="text"
									class="form-control"
									id="desc"
								/>
							</div>
							<div class="row mb-3">
								<div class="col">
									<label htmlFor="exampleInputEmail1" class="form-label">
										Response Variable
									</label>
									<input
										type="text"
										class="form-control"
										id="shortName"
										name="shortName"
									/>
								</div>
								<div class="col">
									<label htmlFor="exampleInputEmail1" class="form-label">
										Endpoint Type
									</label>
									<input
										type="text"
										class="form-control"
										id="longName"
										name="longName"

									/>
								</div>
							</div>
							<div className="d-flex">
								<button
									type="submit"
									className="btn btn-primary w-100 mt-2 me-2"
								>
									Save
								</button>
								<button
									type="button"
									className="btn btn-primary w-100 mt-2"
								>
									Discard
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default Visits;
