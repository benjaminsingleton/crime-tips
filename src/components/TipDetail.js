import React, { Component }  from 'react'
import { tipTimeFormatLong } from '../helpers/helpers'

class TipDetail extends Component {

    constructor () {
        super()
        this.state = {
            tip: {},
            panelDisplay: {
                1: true,
                2: true,
                3: true,
                4: true,
                5: true,
                6: true,
                7: true,
                8: true
            }
        }
        this.togglePanel = this.togglePanel.bind(this)
    }

    togglePanel(panelNumber) {

        const panelDisplay = {...this.state.panelDisplay}

        panelDisplay[panelNumber] = !panelDisplay[panelNumber]

        this.setState({ panelDisplay })
    }

    renderAttachment (details) {
        return (
            <div className="mail-attachment">
                <p>
                    <span><i className="fa fa-paperclip"></i> 1 attachment</span>
                </p>
                <div className="attachment">
                    <div className="file-box">
                        <div className="file">
                            <a href="#">
                                <span className="corner"></span>
                                <div className="icon">
                                    <i className="fa fa-file"></i>
                                </div>
                                <div className="file-name">
                                    Document_2014.doc
                                    <br/>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        );    
    }

    render() {
        const { details } = this.props;
        const { panelDisplay } = this.state;    
        return (
            <div className="col-lg-9 animated fadeInRight">
                <div className="mail-box-header">
                    <h2>
                        Tip Detail
                    </h2>
                    <div className="mail-tools tooltip-demo m-t-md">
                        <h3>
                            <span className="font-normal">Crime Type: </span>{details.crimeType}
                        </h3>
                        <h5>
                            <span className="pull-right font-normal">{tipTimeFormatLong(details.dateTime)}</span>
                        </h5>
                    </div>
                </div>
                <div className="mail-box">
                    <div className="mail-body">
                        <div className="panel-body">
                            <div className="panel-group">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h5 className="panel-title">
                                            <a onClick={() => this.togglePanel(1)}>1. Tip Summary</a>
                                        </h5>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[1] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>{details.tipText}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(2)}>2. Suspect Description</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[2] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(3)}>3. Suspect Location</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[3] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(4)}>4. Suspect Employment</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[4] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(5)}>5. Suspect Vehicle</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[5] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(6)}>6. Drugs</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[6] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                                 <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(7)}>7. Media</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[7] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(8)}>8. Conclusion</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[8] ? "in" : "")}>
                                        <div className="panel-body">
                                            <p>stuff goes here</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    { details.attachment ? this.renderAttachment(details) : null }
                    <div className="mail-body text-right tooltip-demo">
                            <a className="btn btn-sm btn-white"><i className="fa fa-check-square-o"></i> Mark As Reviewed</a>
                            <a className="btn btn-sm btn-white"><i className="fa fa-arrow-right"></i> Forward</a>
                            <button type="button" className="btn btn-sm btn-white"><i className="fa fa-print"></i> Print</button>
                            <button className="btn btn-sm btn-white"><i className="fa fa-archive"></i> Archive</button>
                    </div>
                </div>
            </div>
        )
    }
}

TipDetail.propTypes = {
    details: React.PropTypes.object.isRequired
}

export default TipDetail;