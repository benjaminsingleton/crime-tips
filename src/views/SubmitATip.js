import React, { Component } from 'react';
import base from '../base'
import Layout from '../components/Layout'
import TipFormContainer from '../components/TipFormContainer'
import TipFormIntro from '../components/TipFormIntro'
import TipFormSuspectDescription from '../components/TipFormSuspectDescription'
import TipFormSuspectLocation from '../components/TipFormSuspectLocation'
import TipFormSuspectEmployment from '../components/TipFormSuspectEmployment'
import TipFormSuspectVehicle from '../components/TipFormSuspectVehicle'
import TipFormDrugs from '../components/TipFormDrugs'
import TipFormMedia from '../components/TipFormMedia'
import TipFormFinal from '../components/TipFormFinal'


class SubmitATip extends Component {

    constructor () {
        super()
        this.state = {
            tip: {},
            stepIndex: 0,
        }

        this.getStepContent = this.getStepContent.bind(this)
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
            stepIndex: 99
        });
    }

    resetForm() {
        this.setState({ stepIndex: 0 })
    }

    changeStep(direction){
        var stepIndex = this.state.stepIndex

        if (direction==='next') {
            stepIndex++;
        } else if (direction==='previous') {
            stepIndex--;
        };

        this.setState({ stepIndex })
    }

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <TipFormContainer title="Submit a Tip" changeStep={this.changeStep} noPreviousButton={true}>
                        <TipFormIntro 
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 1:
                return (
                    <TipFormContainer title="Suspect Description" changeStep={this.changeStep}>
                        <TipFormSuspectDescription 
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 2:
                return (
                    <TipFormContainer title="Suspect Location" changeStep={this.changeStep}>
                        <TipFormSuspectLocation 
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 3:
                return (
                    <TipFormContainer title="Suspect Employment" changeStep={this.changeStep}>
                        <TipFormSuspectEmployment 
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 4:
                return (
                    <TipFormContainer title="Suspect Vehicle" changeStep={this.changeStep}>
                        <TipFormSuspectVehicle 
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 5: // drugs
                return (
                    <TipFormContainer title="Drugs" changeStep={this.changeStep}>
                        <TipFormDrugs 
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 6:
                return (
                    <TipFormContainer title="Media Upload" changeStep={this.changeStep}>
                        <TipFormMedia
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>

                )
            case 7:
                return (
                    <TipFormContainer title="Conclusion" changeStep={this.changeStep} showSubmit={true} noNextButton={true}>
                        <TipFormFinal
                            handleInputChange={this.handleInputChange}
                            tip={this.state.tip}
                        />
                    </TipFormContainer>
                )
            case 99:
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
                        <div className="col-xs-12 col-lg-6 col-lg-offset-3">
                            {this.getStepContent(this.state.stepIndex)}
                        </div>
                    </div>
                </div>
            </Layout>
        );
  }
}

export default SubmitATip;
