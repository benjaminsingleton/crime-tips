import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'
import _ from 'underscore'
import Layout from '../components/Layout'
import TipFormContainer from '../components/TipFormContainer'
import TipFormIntro from '../components/TipFormIntro'
import TipFormSuspect from '../components/TipFormSuspect'
import TipFormVehicle from '../components/TipFormVehicle'
import TipFormDrugs from '../components/TipFormDrugs'
import TipFormMedia from '../components/TipFormMedia'
import TipFormConclusion from '../components/TipFormConclusion'
import { firebaseApp } from '../helpers/firebase'

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      tip: {
        timestampStart: Date.now(),
        tipType: 'web',
        submitted: false
      },
      formWizardPageIndex: 0,
      formWizardContent: ['intro', 'suspect', 'vehicle', 'media', 'final', 'success'],
      error: {
        crimeType: null,
        tipText: null
      },
    }
    this.baseState = this.state
    this.getFormWizardContent = this.getFormWizardContent.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleCheckChange = this.handleCheckChange.bind(this)
    this.createTip = this.createTip.bind(this)
    this.changeFormWizardIndex = this.changeFormWizardIndex.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.tipKey && this.state.tip.tipText && this.state.tip.tipText.length >= 20) {
      firebaseApp.database().ref('abandonedTips/').push({...this.state.tip})
          .then((snap) => {
            const tipKey = snap.key
            this.setState({tipKey})
          })
    } else if (this.state.tipKey && this.state.tip !== prevState.tip) {
      // create an object that is the diff between the old tip and new tip for updating
      const updated = _.omit(this.state.tip, function(v,k) { return prevState.tip[k] === v; })
      firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).update({...updated})
      // TODO: increase abandoned tip unread count by one using transactions
    }
  }
  
  handleInputChange(e, { name, value }) {
    console.log(e, name, value)
    console.log(e.target.value)
    const tip = {...this.state.tip}
    tip[name] = value
    this.setState({tip})
  }

  handleSuspectsVehicles() {
    const formWizardContent = this.state.formWizardContent
    if (name === 'numberOfSuspects') {
      if (value === 0) {
        var pos = formWizardContent.indexOf(name);
        formWizardContent.splice(pos, 1)
      } else if (value === 1) {
        
      }
      // if 0, then remove suspect from formWizardContent
    }
  }

  handleCheckChange(e, { name, value }) {
    const tip = {...this.state.tip}
    tip[name] = tip[name] ? !tip[name] : true
    this.setState({tip})
    this.addModuleToFormWizard(name)
  }

  createTip(event) {
    event.preventDefault();
    const tip = {...this.state.tip}
    tip['submitted'] = true
    tip['timestampSubmit'] = Date.now()
    tip['read'] = false
    tip['archived'] = false
    tip['important'] = false

    firebaseApp.database().ref(`tips/`).push({...this.state.tip})
      .then((snap) => {
        // TODO: increase tip unread count by one using transactions
        // delete the abandoned tip record
        firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).remove()
        // TODO: reduce abandoned tip count by one using transactions
        const tipKey = snap.key
        this.setState({tipKey}) // save new tipKey which users will use as a receipt #, for now
        this.changeFormWizardIndex('next')
      })
  }

  validateIntroModule() {
    const { formWizardPageIndex } = this.state
    const crimeTypeError = (this.state.tip.crimeType == null)
    const tipTextError = (this.state.tip.tipText == null || this.state.tip.tipText.length < 20)

    if (crimeTypeError || tipTextError) {
      const error = { ...this.state.error }
      if (crimeTypeError) {
        error['crimeType'] = true
      }
      if (tipTextError) {
        error['tipText'] = true
      }
      this.setState({ error })
    } else {
      this.setState({
        formWizardPageIndex: formWizardPageIndex + 1,
        error: { crimeType: null, tipText: null }
      })
    }
  }

  changeFormWizardIndex(direction) {
    const { formWizardPageIndex } = this.state

    if (direction === 'next') {
      if (formWizardPageIndex === 'change back to zero') {
        // if on first page, check that crime type is entered and tiptext is >20 characters
        this.validateIntroModule()
      } else {
        this.setState({ formWizardPageIndex: formWizardPageIndex + 1 })
      }
    } else if (direction === 'previous') {
      this.setState({ formWizardPageIndex: formWizardPageIndex - 1 })
    };
  }

  addModuleToFormWizard(name) {
    const formWizardModules = [
      'tipsterKnowsSuspectDescription',
      'tipsterKnowsSuspectLocation',
      'tipsterKnowsSuspectEmployment',
      'tipsterKnowsSuspectVehicle',
      'tipsterKnowsAboutDrugs',
      'tipsterHasMedia'
    ]
    if (formWizardModules.includes(name)) { 
      const formWizardContent = this.state.formWizardContent
      if (!formWizardContent.includes(name)) {
        formWizardContent.splice(-2, 0, name) // add module 3rd to last place (behind final, success)
      } else {
        var pos = formWizardContent.indexOf(name);
        formWizardContent.splice(pos, 1)
      };
      this.setState({formWizardContent})
    }
  }

  getFormWizardContent(formWizardPageIndex) {
    const contentToDisplay = this.state.formWizardContent[formWizardPageIndex]

    switch (contentToDisplay) {
      case 'intro':
        return (
          <TipFormContainer
            title="Submit a Tip"
            changeFormWizardIndex={this.changeFormWizardIndex}
            nextButton={true}>
              <TipFormIntro
                handleInputChange={this.handleInputChange}
                handleCheckChange={this.handleCheckChange}
                tip={this.state.tip}
                error={this.state.error}
              />
          </TipFormContainer>
        )
      case 'suspect':
        return (
          <TipFormContainer 
            title="Suspect Description" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            previousButton={true}
            nextButton={true}>
              <TipFormSuspect
                handleInputChange={this.handleSelectChange}
                tip={this.state.tip}
              />
          </TipFormContainer>
        )
      case 'vehicle':
        return (
          <TipFormContainer 
            title="Suspect Vehicle" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            previousButton={true}
            nextButton={true}>
            <TipFormVehicle
              handleInputChange={this.handleInputChange}
              tip={this.state.tip}/>
          </TipFormContainer>
        )
      case 'drugs':
        return (
          <TipFormContainer 
            title="Drugs" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            previousButton={true}
            nextButton={true}>
              <TipFormDrugs
                handleSelectChange={this.handleSelectChange}
                handleTextChange={this.handleTextChange}
                handleCheckboxChange={this.handleCheckboxChange}
                tip={this.state.tip}
              />
          </TipFormContainer>
        )
      case 'media':
        return (
          <TipFormContainer 
            title="Media Upload" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            previousButton={true}
            nextButton={true}>
              <TipFormMedia 
                tip={this.state.tip} 
                tipKey={this.state.tipKey} 
              />
          </TipFormContainer>
        )
      case 'final':
        return (
          <TipFormContainer
            title="Conclusion"
            changeFormWizardIndex={this.changeFormWizardIndex}
            previousButton={true}
            showSubmit={true}
            createTip={this.createTip}>
              <TipFormConclusion
                handleInputChange={this.handleInputChange}
                handleCheckChange={this.handleCheckChange}
                tip={this.state.tip}
              />
          </TipFormContainer>
        )
      case 'success':
        return (
          <TipFormContainer title="Thanks!">
            <p>You've done your community a great service!</p>
            <p>You're tip number is: <b>{this.state.tipKey}</b>. Save it as a reference.</p>
            <p><a onClick={() => this.setState(this.baseState)}>Click here</a> to write another tip.</p>
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
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
            {formWizardContent}
          </Grid.Column>
			  </Grid>
      </Layout>
    );
  }
}