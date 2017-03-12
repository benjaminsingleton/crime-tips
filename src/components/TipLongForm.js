import React, { Component } from 'react'
import base from '../base'

import TipFormIntro from '../components/TipFormIntro'
import TipFormSuspectDescription from '../components/TipFormSuspectDescription'
import TipFormSuspectLocation from '../components/TipFormSuspectLocation'
import TipFormSuspectEmployment from '../components/TipFormSuspectEmployment'
import TipFormSuspectVehicle from '../components/TipFormSuspectVehicle'
import TipFormDrugs from '../components/TipFormDrugs'
import TipFormMedia from '../components/TipFormMedia'
import TipFormFinal from '../components/TipFormFinal'

class TipLongForm extends Component {

    constructor () {
        super()
        this.state = {
            tip: {},
            panelDisplay: {
                1: true,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false
            }
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createTip = this.createTip.bind(this)
        this.togglePanel = this.togglePanel.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const tip = {...this.state.tip}

        tip[name] = value

        this.setState({ tip })
    }

    togglePanel(panelNumber) {

        const panelDisplay = {...this.state.panelDisplay}

        panelDisplay[panelNumber] = !panelDisplay[panelNumber]

        this.setState({ panelDisplay })
    }

    createTip(event) {
        event.preventDefault();
        // create object to store tip data
        var tip = {...this.state.tip}

        const tipDefaultProperties = {
            timestamp: Date.now(),
            readStatus: 'unread',
            attachment: false,
        }
        
        tip = Object.assign(tip, tipDefaultProperties);
            
        // push tip object to firebase
        base.push('tips', {data: tip});
        // clear the form and render success
        this.setState({ 
            tip: {},
        });
    }

    render() {
        const panelDisplay = {...this.state.panelDisplay}
        return (
            <div className="col-lg-9 animated fadeInRight">
                <div className="mail-box-header">
                    <div className="pull-right tooltip-demo">
                        <a className="btn btn-white btn-sm" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Move to draft folder">
                            <i className="fa fa-pencil"></i> Draft
                        </a>
                        <a className="btn btn-danger btn-sm" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Discard email">
                            <i className="fa fa-times"></i> Discard
                        </a>
                    </div>
                    <h2>
                        New Crime Tip
                    </h2>
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
                                            <TipFormIntro handleInputChange={this.handleInputChange} tip={this.state.tip} />
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
                                            <TipFormSuspectDescription handleInputChange={this.handleInputChange} tip={this.state.tip} />
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
                                            <TipFormSuspectLocation handleInputChange={this.handleInputChange} tip={this.state.tip} />
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
                                            <TipFormSuspectEmployment handleInputChange={this.handleInputChange} tip={this.state.tip} />
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
                                            <TipFormSuspectVehicle handleInputChange={this.handleInputChange} tip={this.state.tip} />
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
                                            <TipFormDrugs handleInputChange={this.handleInputChange} tip={this.state.tip} />
                                        </div>
                                    </div>
                                </div>
                                 <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h4 className="panel-title">
                                            <a onClick={() => this.togglePanel(7)}>7. Drugs</a>
                                        </h4>
                                    </div>
                                    <div className={"panel-collapse collapse " + (panelDisplay[7] ? "in" : "")}>
                                        <div className="panel-body">
                                            <TipFormMedia handleInputChange={this.handleInputChange} tip={this.state.tip} />
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
                                            <TipFormFinal handleInputChange={this.handleInputChange} tip={this.state.tip} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mail-body text-right tooltip-demo">
                        <a 
                            className="btn btn-white btn-sm" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Discard tips">
                            <i className="fa fa-times"></i> Discard
                        </a>
                        <a 
                            className="btn btn-white btn-sm" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Move to draft folder">
                            <i className="fa fa-pencil"></i> Draft
                        </a>
                        <a 
                            className="btn btn-sm btn-primary" 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Save">
                            Save
                        </a>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        )
    }
}

export default TipLongForm