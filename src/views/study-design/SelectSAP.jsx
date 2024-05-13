import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import StatisticalAnalysisPlanModal from '../../components/modals/StatisticalAnalysisPlanModal';

const SelectSAP = () => {
    const [isStatisticalAnalysisPlanModalOpen, setIsStatisticalAnalysisPlanModalOpen] = useState(false);
    return (
    
        <div className="main">
            <div className="main_menu sidebar" id="sidebar">
                <div className="main_menu_child">
                    <div className="sidebar_top">
                        <h4><Link to="/">Arcsine Analytics</Link></h4>
                        <Link to="#" className="sidebar_btn" onClick="toggleSidebar(this)">
                            <i className="fa-solid fa-bars-staggered"></i>
                        </Link>
                    </div>

                    <div className="sidebar_breadcrumb">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home \</Link></li>
                                <li className="breadcrumb-item-inner"><Link to="#">Statistical Analysis</Link></li>
                            </ol>
                        </nav>
                    </div>

                    <ul className="sidebar_list">
                        <li><Link onClick={() => setIsStatisticalAnalysisPlanModalOpen(true)}>
                            <i className="fa-square-plus"></i>
                            <span>Select SAP</span></Link></li>
                        <li><Link to = "/statistical-analysis-plan-manage-project" >
                            <i className="fa-regular fa-square-plus"></i>
                            <span>General</span></Link></li>
                    </ul>
                </div>
            </div>
    
            {isStatisticalAnalysisPlanModalOpen && <StatisticalAnalysisPlanModal setIsStatisticalAnalysisPlanModalOpen={setIsStatisticalAnalysisPlanModalOpen} />}
        </div>

    )
}

export default SelectSAP