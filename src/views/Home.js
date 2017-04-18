import React, {Component} from 'react';
import _ from 'underscore'
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

export default class Home extends Component {

  constructor() {
    super()
    this.state = {
      tip: {
        timestampStart: Date.now(),
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
      },
    }
    this.baseState = this.state
    this.getFormWizardContent = this.getFormWizardContent.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.createTip = this.createTip.bind(this)
    this.changeFormWizardIndex = this.changeFormWizardIndex.bind(this)
    this.addFormWizardContent = this.addFormWizardContent.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.tipKey && this.state.tip.tipText && this.state.tip.tipText.length >= 20) {
      databaseRef.child('abandonedTips/').push({...this.state.tip})
          .then((snap) => {
            const tipKey = snap.key
            this.setState({tipKey})
          })
    } else if (this.state.tipKey && this.state.tip !== prevState.tip) {
      // create an object that is the diff between the old tip and new tip for updating
      const updated = _.omit(this.state.tip, function(v,k) { return prevState.tip[k] === v; })
      databaseRef.child(`abandonedTips/${this.state.tipKey}`).update({...updated})
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
    tip['timestampSubmit'] = Date.now()

    databaseRef.child(`tips/`).push({...this.state.tip})
      .then((snap) => {
        // if tip is successfully submitted, delete the abandoned tip record
        databaseRef.child(`abandonedTips/${this.state.tipKey}`).remove()
        const tipKey = snap.key
        this.setState({tipKey}) // save new tipKey which users will use as a receipt #, for now
        this.changeFormWizardIndex('next')
      })
  }

  resetForm = () => this.setState(this.baseState)

  changeFormWizardIndex(direction) {
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
    const contentToDisplay = this.state.formWizardContent[formWizardPageIndex]

    switch (contentToDisplay) {
      case 'initial':
        return (
          <TipFormContainer
            title="Submit a Tip"
            changeFormWizardIndex={this.changeFormWizardIndex}
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
            changeFormWizardIndex={this.changeFormWizardIndex}
            noOptionalMsg={true}>
            <TipFormIntroPartTwo
              tip={this.state.tip}
              addFormWizardContent={this.addFormWizardContent}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectDescription':
        return (
          <TipFormContainer title="Suspect Description" changeFormWizardIndex={this.changeFormWizardIndex}>
            <TipFormSuspectDescription
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleDatePickerChange={this.handleDatePickerChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectLocation':
        return (
          <TipFormContainer title="Suspect Location" changeFormWizardIndex={this.changeFormWizardIndex}>
            <TipFormSuspectLocation
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectEmployment':
        return (
          <TipFormContainer title="Suspect Employment" changeFormWizardIndex={this.changeFormWizardIndex}>
            <TipFormSuspectEmployment
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsSuspectVehicle':
        return (
          <TipFormContainer title="Suspect Vehicle" changeFormWizardIndex={this.changeFormWizardIndex}>
            <TipFormSuspectVehicle
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterKnowsAboutDrugs':
        return (
          <TipFormContainer title="Drugs" changeFormWizardIndex={this.changeFormWizardIndex}>
            <TipFormDrugs
              handleSelectChange={this.handleSelectChange}
              handleTextChange={this.handleTextChange}
              handleCheckboxChange={this.handleCheckboxChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'tipsterHasMedia':
        return (
          <TipFormContainer title="Media Upload" changeFormWizardIndex={this.changeFormWizardIndex}>
            <TipFormMedia tip={this.state.tip} tipKey={this.state.tipKey} />
          </TipFormContainer>
        )
      case 'final':
        return (
          <TipFormContainer
            title="Conclusion"
            changeFormWizardIndex={this.changeFormWizardIndex}
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
    const formWizardContent = this.getFormWizardContent(this.state.formWizardPageIndex)
    
    return (
      <Layout>
        <div className="row" style={{margin: '50px 2px 30px 2px'}}>
          <div className="col-xs-12 col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
            {formWizardContent}
          </div>
        </div>
      </Layout>
    );
  }
}