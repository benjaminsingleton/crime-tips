import React, {Component} from 'react';
import Layout from '../components/Layout'
import TipFormContainer from '../components/TipFormContainer'
import TipFormIntro from '../components/TipFormIntro'
import TipFormIntroPartTwo from '../components/TipFormIntroPartTwo'
import TipFormSuspectDescription from '../components/TipFormSuspectDescription'
import TipFormSuspectLocation from '../components/TipFormSuspectLocation'
import TipFormSuspectEmployment from '../components/TipFormSuspectEmployment'
import TipFormSuspectVehicle from '../components/TipFormSuspectVehicle'
import TipFormDrugs from '../components/TipFormDrugs'
import TipFormMedia from '../components/TipFormMedia'
import TipFormFinal from '../components/TipFormFinal'
import {ref} from '../helpers/constants'

class Home extends Component {

  constructor() {
    super()
    this.state = {
      tip: {
        timestamp: Date.now(),
        read: false,
        attachment: false,
        archived: false,
        important: false,
        tipType: 'web',
        tipsterKnowsSuspectDescription: false,
        tipsterKnowsSuspectLocation: false,
        tipsterKnowsSuspectEmployment: false,
        tipsterKnowsSuspectVehicle: false,
        tipsterKnowsAboutDrugs: false,
        tipsterHasMedia: false,
        submitted: false
      },
      stepIndex: 0,
      stepContent: ['initial', 'second', 'final', 'success'],
      errorText: {
        crimeType: null,
        tipText: null
      }
    }
    this.baseState = this.state

    this.getStepContent = this.getStepContent.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.addToStepContent = this.addToStepContent.bind(this)
    this.createTip = this.createTip.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.changeStep = this.changeStep.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this)
  }

  handleSelectChange(name, event, index, value) {
    const tip = {...this.state.tip}
    tip[name] = value
    this.setState({tip})
  }

  handleTextChange(name, event) {
    const tip = {...this.state.tip}
    tip[name] = event.target.value
    this.setState({tip})
  }

  handleCheckboxChange(name, event, isInputChecked) {
    const tip = {...this.state.tip}
    tip[name] = isInputChecked
    this.setState({tip})
  }

  handleDatePickerChange(name, nothing, date) {
    const tip = {...this.state.tip}
    console.log(name, date)
    tip[name] = date
    this.setState({tip})
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const tip = {...this.state.tip}
    tip[name] = value

    this.setState({tip})
  }

  createTip(event) {
    event.preventDefault();

    var tip = {...this.state.tip}
    tip['submitted'] = true

    ref.child('tips/').push({...tip})
    this.setState({stepIndex: this.state.stepIndex++});
  }

  resetForm() {
    this.setState(this.baseState)
  }

  changeStep(direction) {
    console.log(direction)
    var stepIndex = this.state.stepIndex

    if (direction === 'next') {
      console.log('a')
      if (stepIndex === 0) {
        console.log('b')
        const crimeTypeError = (this.state.tip.crimeType == null)
        const tipTextError = (this.state.tip.tipText == null || this.state.tip.tipText.length < 20)
        if (crimeTypeError || tipTextError) {
          console.log('c')
          const errorText = {...this.state.errorText}
          crimeTypeError && (errorText['crimeType'] = 'This field is required')
          tipTextError && (errorText['tipText'] = 'Your description is too brief. 20 characters minimum.')
          this.setState({errorText})
        } else {
          console.log('d')
          stepIndex++;
          this.setState({errorText: {crimeType: null, tipText: null}})
        }
      } else {
        console.log('e')
        stepIndex++;
      }
    } else if (direction === 'previous') {
      console.log('f')
      stepIndex--;
    };
    this.setState({stepIndex})
  }

  addToStepContent(name, event, isInputChecked) {
    const stepContent = this.state.stepContent
    const tip = {...this.state.tip}

    if (!stepContent.includes(name)) {
      stepContent.splice(-2, 0, name) // add step in 3rd to last place (behind final, success)
    } else {
      var pos = stepContent.indexOf(name);
      stepContent.splice(pos, 1)
    };

    tip[name] = isInputChecked

    this.setState({stepContent, tip})
  }

  getStepContent(stepIndex) {
    const contentToDisplay = this.state.stepContent[stepIndex]

    switch (contentToDisplay) {
      case 'initial':
        return (
          <TipFormContainer
            title="Submit a Tip"
            changeStep={this.changeStep}
            noPreviousButton={true}
            noOptionalMsg={true}>
            <TipFormIntro
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              tip={this.state.tip}
              noOptionalMsg={true}
              isAdmin={false}
              errorText={this.state.errorText}/>
          </TipFormContainer>
        )
      case 'second':
        return (
          <TipFormContainer
            title="Clarifying Questions"
            changeStep={this.changeStep}
            noOptionalMsg={true}>
            <TipFormIntroPartTwo
              tip={this.state.tip}
              addToStepContent={this.addToStepContent}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectDescription':
        return (
          <TipFormContainer title="Suspect Description" changeStep={this.changeStep}>
            <TipFormSuspectDescription
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleDatePickerChange={this.handleDatePickerChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectLocation':
        return (
          <TipFormContainer title="Suspect Location" changeStep={this.changeStep}>
            <TipFormSuspectLocation
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectEmployment':
        return (
          <TipFormContainer title="Suspect Employment" changeStep={this.changeStep}>
            <TipFormSuspectEmployment
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectVehicle':
        return (
          <TipFormContainer title="Suspect Vehicle" changeStep={this.changeStep}>
            <TipFormSuspectVehicle
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsAboutDrugs':
        return (
          <TipFormContainer title="Drugs" changeStep={this.changeStep}>
            <TipFormDrugs
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterHasMedia':
        return (
          <TipFormContainer title="Media Upload" changeStep={this.changeStep}>
            <TipFormMedia handleInputChange={this.handleInputChange} tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'final':
        return (
          <TipFormContainer
            title="Conclusion"
            changeStep={this.changeStep}
            showSubmit={true}
            noNextButton={true}
            createTip={this.createTip}>
            <TipFormFinal
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'success':
        return (
          <TipFormContainer
            title="Thanks!"
            noNextButton={true}
            noPreviousButton={true}
            noOptionalMsg={true}>
            <p>You've done your community a great service!</p>
            <br />
            <p><a style={{color: '#0000EE'}} onClick={this.resetForm}>Click here</a> to write another tip.</p>
          </TipFormContainer>
        )
      default:
        console.error('renderDisplay failed')
    }
  }

  render() {
    return (
      <Layout>
        <div className="appBarBannerAccent"></div>
        <div
          className="row"
          style={{margin: '-260px 2px 30px 2px'}}>
          <div
            className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
            {this.getStepContent(this.state.stepIndex)}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Home;
