import React, { Component } from 'react';
import base from '../base'
import Layout from '../components/Layout'
import TipFormContainer from '../components/TipFormContainer'
import TipFormIntro from '../components/TipFormIntro'
import TipFormSuspectDescription from '../components/TipFormSuspectDescription'


class SubmitATip extends Component {

    constructor () {
        super()

        // get initial state
        this.state = {
            tip: {},
            stepNumber: 0,
            title: 'Submit a Tip'
        }

        this.renderDisplay = this.renderDisplay.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createTip = this.createTip.bind(this)
        this.resetForm = this.resetForm.bind(this)
        this.changeStep = this.changeStep.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const tip = {...this.state.tip}

        tip[name] = value

        this.setState({ tip })
    }

    createTip(event) {
        event.preventDefault();
        // create object to store tip data
        var tip = {...this.state.tip}

        const tipDefaultProperties = {
            dateTime: Date.now(),
            readStatus: 'unread',
            attachment: false,
            important: false,
            archived: false,
        }
        
        tip = Object.assign(tip, tipDefaultProperties);
            
        // push tip object to firebase
        base.push('tips', {data: tip});
        // clear the form and render success
        this.setState({ 
            tip: {},
            stepNumber: 99
        });
    }

    resetForm() {
        this.setState({ stepNumber: 0 })
    }

    changeStep(direction){
        var stepNumber = this.state.stepNumber

        if (direction==='next') {
            stepNumber++;
        } else if (direction==='previous') {
            stepNumber--;
        };

        this.setState({ stepNumber })
    }

    renderDisplay() {
        switch (this.state.stepNumber) {
            case 0:
                return (
                    <TipFormIntro 
                        title={'Submit a Tip'}
                        handleInputChange={this.handleInputChange}
                        createTip={this.createTip}
                        tip={this.state.tip}
                        changeStep={this.changeStep}
                    />
                )
            case 1: // 'suspect-description'
                return (
                    <TipFormSuspectDescription
                        title={'Suspect Description'}
                        handleInputChange={this.handleInputChange}
                        createTip={this.createTip}
                        tip={this.state.tip}
                        changeStep={this.changeStep}
                    />
                )
            case 2: // suspect location
                return 'TODO'
            case 3: // suspect employment
                return 'TODO'
            case 4: // suspect vehicle
                return 'TODO'
            case 5: // drugs
                return 'TODO'
            case 6: // media upload
                return 'TODO'
            case 7: // conclusion
                return 'TODO'
            case 99: // success
                return (
                    <h3 className="text-center">
                        Thanks! <a onClick={this.resetForm}>Click here</a> to write another tip.
                    </h3>
                )
            default:
                console.error('renderDisplay failed')
        }
    }

    render() {
        return (
            <Layout>
                <div className="row">
                    <div className="col-md-8 col-md-offset-2 text-center">
                    <h1 id="headline">Gotham Crime Tips</h1>
                    <h3 id="headline2">Do you have information about a crime?</h3>
                    <h4 id="headline3">
                        Provide it anonymously and receive up to $2000 
                        for a tip that leads to an arrest and indictment.
                    </h4>
                    </div>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            <TipFormContainer title={this.state.title}>
                                { this.renderDisplay() }
                            </ TipFormContainer>
                        </div>
                    </div>
                </div>
            </Layout>
        );
  }
}

export default SubmitATip;
