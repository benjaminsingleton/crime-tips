import React, { Component } from 'react'

class DashboardMetrics extends Component {
    render () {
        return (
            <div className="wrapper-content animated fadeInRight" id="dashboard-metrics">
                <div className="row">
                    <div className="col-md-3">
                        <div className="ibox float-e-margins">
                            <div className="ibox-title">
                                <span className="label label-danger pull-right">Now</span>
                                <h5>Unread Tips</h5>
                            </div>
                            <div className="ibox-content">
                                <h1 className="no-margins">4</h1>
                                <small>Need to be reviewed</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="ibox float-e-margins">
                            <div className="ibox-title">
                                <span className="label label-primary pull-right">24 Hrs</span>
                                <h5>Tips Received - 24 Hrs</h5>
                            </div>
                            <div className="ibox-content">
                                <h1 className="no-margins">43</h1>
                                <div className="stat-percent font-bold text-danger">14% <i className="fa fa-level-down"></i>
                                </div>
                                <small>Since February 15th</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="ibox float-e-margins">
                            <div className="ibox-title">
                                <span className="label label-success pull-right">YTD</span>
                                <h5>Tips Received - YTD</h5>
                            </div>
                            <div className="ibox-content">
                                <h1 className="no-margins">1,118</h1>
                                <div className="stat-percent font-bold text-info">13% <i className="fa fa-level-up"></i>
                                </div>
                                <small>Since January 1st</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="ibox float-e-margins">
                            <div className="ibox-title">
                                <span className="label label-success pull-right">YTD</span>
                                <h5>Abandoned Tips - YTD</h5>
                            </div>
                            <div className="ibox-content">
                                <h1 className="no-margins">58</h1>
                                <div className="stat-percent font-bold text-info">7% <i className="fa fa-level-up"></i>
                                </div>
                                <small>Never completed</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardMetrics