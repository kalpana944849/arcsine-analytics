import { Route, Routes } from "react-router-dom";
import React from 'react'
import DatasetDefinitions from "../views/project-standard/selected-project/selected-project-innerview/DatasetDefinitions";
import GlobalStandards from "../views/global-standards/GlobalStandards";
import ProjectStandard from "../views/project-standard/ProjectStandard";
import SelectedProject from "../views/project-standard/selected-project/SelectedProject";
import Sidebar from "../views/Sidebar";

import StandardAnalysis from "../views/project-standard/selected-project/selected-project-innerview/StandardAnalysis";
import StudentDesignComponent from "../views/project-standard/selected-project/selected-project-innerview/StudyDesignComponent";
import StudyDesign from "../views/study-design/StudyDesign";

import AnalysisDefinitions from "../views/statistical-analysis-plan/selected-statistical-analysis-plan/selected-statistical-analysis-innerview/AnalysisDefinitions";
import AnalysisStandards from "../views/global-standards/selected-project/AnalysisStandards";
import ControlledTerminology from "../views/global-standards/selected-project/ControlledTerminology";
import DataInner from "../views/study-design/selected-project/selected-study-design-innerview/DataInner";
import DataStandards from "../views/global-standards/selected-project/DataStandards";
import ManageProjectStandard from "../views/project-standard/ManageProjectStandard";
import SelectSAPStudyDesign from "../views/study-design/selected-project/selected-study-design-innerview/SelectSAPStudyDesign";
import SelectedProjectStudyDesign from "../views/study-design/selected-project/SelectedProjectStudyDesign";
import SelectedStatisticalAnalysis from "../views/statistical-analysis-plan/selected-statistical-analysis-plan/SelectedStatisticalAnalysis";
import StatisticalAnalysisInner from "../views/statistical-analysis-plan/selected-statistical-analysis-plan/selected-statistical-analysis-innerview/StatisticalAnalysisInner";
import StatisticalAnalysisPlan from "../views/statistical-analysis-plan/StatisticalAnalysisPlan";
import StatisticalAnalysisPlanInner from "../views/study-design/selected-project/selected-study-design-innerview/StatisticalAnalysisPlanInner";
import StudyComponents from "../views/global-standards/selected-project/StudyComponents";
import StudyDesignInner from "../views/study-design/selected-project/selected-study-design-innerview/StudyDesignInner";
import StudyDesignManageProject from "../views/study-design/StudyDesignManageProject";
import StudyDesignSAPModal from "../components/modals/StudyDesignSAPModal";

import TableOfContents from "../views/statistical-analysis-plan/selected-statistical-analysis-plan/selected-statistical-analysis-innerview/TableOfContents";
import TreelistDemo from "../views/TreelistDemo/TreelistDemo";

import CustomTreelistCell from "../views/TreelistDemo/CustomTreelistCell";
import SimpleDataTreelist from "../views/TreelistDemo/SimpleDataTreelist";

import FilterSortTreelist from "../views/TreelistDemo/FilterSortTreelist";

import AddEditTreelist from "../views/TreelistDemo/AddEditTreelist/AddEditTreelist";
import ColumnMenuTreelist from "../views/TreelistDemo/ColumnMenuTreelist";
import ExcelExportTreelist from "../views/TreelistDemo/ExcelExportTreelist";
import ExternalFormTreelist from "../views/TreelistDemo/AddEditTreelist/ExternalFormTreelist";
import IconTreelist from "../views/TreelistDemo/IconTreelist";
import LockedColumnTreelist from "../views/TreelistDemo/LockedColumnTreelist";
import ReorderColumnTreelist from "../views/TreelistDemo/ReorderColumnTreelist";
import ResizableColumnTreelist from "../views/TreelistDemo/ResizableColumnTreelist";
import SelectionTreelist from "../views/TreelistDemo/SelectionTreelist";
import ThemeSetting from "../views/Administrator/Administration/ThemeSetting";
import ControlledTerminologyTreelist from "../views/TreelistDemo/ControlledTerminologyTreelist";
import DemoAdmin from "../views/global-standards/selected-project/DemoAdmin";
import Home from "../views/Home";
import Icons from "../views/Administrator/Administration/Icons";
import Administration from "../views/Administrator/Administration";
import User from "../views/Administrator/Administration/User";
import ThemeStyle from "../views/Administrator/Administration/ThemeStyle";
import SapDataPlan from "../views/statistical-analysis-plan/SapData";
import Sap from "../views/statistical-analysis-plan/Index";
import StandardComponents from "../views/global-standards/selected-project/StandardComponents";


const RoutesComp = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/icons" element={<Icons />} />
                <Route exact path="/user" element={<User />} />
                <Route exact path="/administration" element={<Administration />} />
                <Route exact path="/controlledterminology-treelist" element={<ControlledTerminologyTreelist />} />
                <Route exact path="/controlledterminology-global" element={<ControlledTerminology />} />
                <Route exact path="/standard-components" element={<StandardComponents />} />
                <Route exact path="/" element={<Home />} />
                <Route
                    exact
                    path="/manage-project"
                    element={<ManageProjectStandard />}
                />

                <Route exact path="/project-standard" element={<ProjectStandard />} />
                <Route
                    exact
                    path="/dataset-definitions"
                    element={<DatasetDefinitions />}
                />
                <Route
                    exact
                    path="/study-design-component"
                    element={<StudentDesignComponent />}
                />
                <Route
                    exact
                    path="/standard-analysis"
                    element={<StandardAnalysis />}
                />
                <Route
                    exact
                    path="/selected-project-project-standard"
                    element={<SelectedProject />}
                />

                <Route exact path="/global-standards" element={<GlobalStandards />} />
                <Route
                    exact
                    path="/analysis-standards"
                    element={<AnalysisStandards />}
                />
                <Route
                    exact
                    path="/controlled-terminology"
                    element={<ControlledTerminology />}
                />
                <Route exact path="/data-standards" element={<DataStandards />} />
                <Route exact path="/study-component" element={<StudyComponents />} />

                <Route exact path="/study-design" element={<StudyDesign />} />
                <Route
                    exact
                    path="/study-design-manage-project"
                    element={<StudyDesignManageProject />}
                />

                <Route
                    exact
                    path="/study-design-sap-modal"
                    element={<StudyDesignSAPModal />}
                />
                <Route
                    exact
                    path="/selected-project-study-design"
                    element={<SelectedProjectStudyDesign />}
                />
                <Route
                    exact
                    path="/study-design-inner"
                    element={<StudyDesignInner />}
                />
                <Route exact path="/data-inner" element={<DataInner />} />
                <Route
                    exact
                    path="/statistical-analysis-plan-inner"
                    element={<StatisticalAnalysisPlanInner />}
                />
                <Route
                    exact
                    path="/select-SAP-study-design"
                    element={<SelectSAPStudyDesign />}
                />

                <Route
                    exact
                    path="/statistical-analysis-plan"
                    element={<Sap />}
                />
                {/* <Route
                            exact
                            path="/statistical-analysis-plan"
                            element={<StatisticalAnalysisPlan />}
                        /> */}

                <Route
                    exact
                    path="/selected-statistical-analysis"
                    element={<SelectedStatisticalAnalysis />}
                />
                <Route
                    exact
                    path="/analysis-definitions"
                    element={<AnalysisDefinitions />}
                />
                <Route
                    exact
                    path="/analysis-definitions-data"
                    element={<SapDataPlan />}
                />
                <Route
                    exact
                    path="/statistical-analysis-inner"
                    element={<StatisticalAnalysisInner />}
                />
                <Route
                    exact
                    path="/table-of-contents"
                    element={<TableOfContents />}
                />

                <Route exact path="/treelist-demo" element={<TreelistDemo />} />
                <Route
                    exact
                    path="/simple-treelist"
                    element={<SimpleDataTreelist />}
                />
                <Route
                    exact
                    path="/custom-treelist-cell"
                    element={<CustomTreelistCell />}
                />
                <Route
                    exact
                    path="/filter-sort-treelist"
                    element={<FilterSortTreelist />}
                />
                <Route
                    exact
                    path="/resizable-column-treelist"
                    element={<ResizableColumnTreelist />}
                />
                <Route
                    exact
                    path="/locked-column-treelist"
                    element={<LockedColumnTreelist />}
                />
                <Route
                    exact
                    path="/reorder-column-treelist"
                    element={<ReorderColumnTreelist />}
                />
                <Route
                    exact
                    path="/excel-export-treelist"
                    element={<ExcelExportTreelist />}
                />
                <Route
                    exact
                    path="/selection-treelist"
                    element={<SelectionTreelist />}
                />
                <Route
                    exact
                    path="/column-menu-treelist"
                    element={<ColumnMenuTreelist />}
                />
                <Route
                    exact
                    path="/add-edit-treelist"
                    element={<AddEditTreelist />}
                />
                <Route
                    exact
                    path="/external-form-treelist"
                    element={<ExternalFormTreelist />}
                />
                <Route exact path="/icon-treelist" element={<IconTreelist />} />
                <Route exact path="/theme-setting" element={<ThemeSetting />} />
                <Route exact path="/theme-style" element={<ThemeStyle />} />
            </Routes>
        </div>
    )
}

export default RoutesComp