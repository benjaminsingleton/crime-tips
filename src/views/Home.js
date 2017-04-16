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
import {databaseRef} from '../helpers/constants'

class Home extends Component {

  constructor() {
    super()
    this.state = {
      tip: {
        timestampStarted: Date.now(),
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
      formWizardPageIndex: 0,
      formWizardContent: ['initial', 'second', 'final', 'success'],
      errorText: {
        crimeType: null,
        tipText: null
      }
    }
    this.baseState = this.state
    this.getStepContent = this.getStepContent.bind(this)
    this.addToStepContent = this.addToStepContent.bind(this)
    this.createTip = this.createTip.bind(this)
    this.resetForm = this.resetForm.bind(this)
    this.changeStep = this.changeStep.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    // update tip data in firebase when this.state.tip changes
    if (prevState.tip !== this.state.tip) {
      if (this.state.tipKey) {
        databaseRef.child('tips/' + this.state.tipKey).update({...this.state.tip})
      } else {
        databaseRef.child('tips/').push({...this.state.tip})
          .then((snap) => {
            this.setState({tipKey: snap.key})
          })
      }
    }
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
    tip[name] = date
    this.setState({tip})
  }

  createTip(event) {
    event.preventDefault();
    const tip = {...this.state.tip}
    tip['submitted'] = true
    tip['timestampCompleted'] = Date.now()
    databaseRef.child(`tips/${this.state.tipKey}`).update({...tip})
    this.changeStep('next')
  }

  resetForm = () => this.setState(this.baseState)

  changeFormWizardPageIndex(direction) {
    let formWizardPageIndex = this.state.formWizardPageIndex

    if (direction === 'next') {
      if (formWizardPageIndex === 0) {
        // do form validation before proceeding to next step
        const crimeTypeError = (this.state.tip.crimeType == null)
        const tipTextError = (this.state.tip.tipText == null || this.state.tip.tipText.length < 20)
        if (crimeTypeError) {
          const errorText = {...this.state.errorText}
          errorText['crimeType'] = 'This field is required'
          this.setState({errorText})
        } else if (tipTextError) {
          const errorText = {...this.state.errorText}
          errorText['tipText'] = 'Your description is too brief. 20 characters minimum.'
          this.setState({errorText})
        } else {
          formWizardPageIndex++;
          this.setState({
            errorText: {
              crimeType: null, 
              tipText: null
            }
          })
        }
      } else {
        formWizardPageIndex++;
      }
    } else if (direction === 'previous') {
      formWizardPageIndex--;
    };
    this.setState({formWizardPageIndex})
  }

  addFormWizardContent(name, event, isInputChecked) {
    const formWizardContent = this.state.formWizardContent
    const tip = {...this.state.tip}

    if (!formWizardContent.includes(name)) {
      formWizardContent.splice(-2, 0, name) // add step in 3rd to last place (behind final, success)
    } else {
      var pos = formWizardContent.indexOf(name);
      formWizardContent.splice(pos, 1)
    };

    tip[name] = isInputChecked

    this.setState({formWizardContent, tip})
  }

  getFormWizardContent(formWizardPageIndex) {
    const contentToDisplay = this.state.FormWizardContent[formWizardPageIndex]

    switch (contentToDisplay) {
      case 'initial':
        return (
          <TipFormContainer
            title="Submit a Tip"
            changeFormWizardPageIndex={this.changeFormWizardPageIndex}
            noPreviousButton={true}
            noOptionalMsg={true}>
            <TipFormIntro
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleDatePickerChange={this.handleDatePickerChange}
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
            changeFormWizardPageIndex={this.changeFormWizardPageIndex}
            noOptionalMsg={true}>
            <TipFormIntroPartTwo
              tip={this.state.tip}
              addFormWizardContent={this.addFormWizardContent}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectDescription':
        return (
          <TipFormContainer title="Suspect Description" changeFormWizardPageIndex={this.changeFormWizardPageIndex}>
            <TipFormSuspectDescription
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleDatePickerChange={this.handleDatePickerChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectLocation':
        return (
          <TipFormContainer title="Suspect Location" changeFormWizardPageIndex={this.changeFormWizardPageIndex}>
            <TipFormSuspectLocation
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectEmployment':
        return (
          <TipFormContainer title="Suspect Employment" changeFormWizardPageIndex={this.changeFormWizardPageIndex}>
            <TipFormSuspectEmployment
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectVehicle':
        return (
          <TipFormContainer title="Suspect Vehicle" changeFormWizardPageIndex={this.changeFormWizardPageIndex}>
            <TipFormSuspectVehicle
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsAboutDrugs':
        return (
          <TipFormContainer title="Drugs" changeFormWizardPageIndex={this.changeFormWizardPageIndex}>
            <TipFormDrugs
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterHasMedia':
        return (
          <TipFormContainer title="Media Upload" changeFormWizardPageIndex={this.changeFormWizardPageIndex}>
            <TipFormMedia tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'final':
        return (
          <TipFormContainer
            title="Conclusion"
            changeFormWizardPageIndex={this.changeFormWizardPageIndex}
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
        <div className="row" style={{margin: '-260px 2px 30px 2px'}}>
          <div
            className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
            {this.getFormWizardContent(this.state.formWizardPageIndex)}
          </div>
        </div>
      </Layout>
    );
  }
}

export default Home;
