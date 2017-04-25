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
import { language } from '../helpers/languages'

export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      tip: {
        timestampStart: Date.now(),
        tipType: 'web',
        numberOfSuspects: 1,
        numberOfVehicles: 0,
        submitted: false
      },
      moduleIndex: 0,
      formModules: ['intro', 'suspect', 'vehicle', 'drugs', 'media', 'final', 'success'],
      showFormModule: {
        'intro': true,
        'suspect': true,
        'vehicle': false,
        'drugs': false,
        'media': false,
        'final': true,
        'success': true,
      },
      error: {
        crimeType: null,
        tipText: null
      },
      language: 'english'
    }
    this.baseState = this.state
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.tipKey && 
        !this.state.gettingTipKey &&
        this.state.tip.tipText && this.state.tip.tipText.length >= 20) {
          this.setState({gettingTipKey: true})
          firebaseApp.database().ref('abandonedTips/').push({...this.state.tip})
              .then((snap) => {
                const tipKey = snap.key
                this.setState({tipKey})
              })
          firebaseApp.database().ref('metrics/unreadAbandonedTips').transaction((current_value) => current_value + 1)
    } else if (this.state.tipKey && this.state.tip !== prevState.tip) {
      // create an object that is the diff between the old tip and new tip for updating
      const updated = _.omit(this.state.tip, function(v,k) { return prevState.tip[k] === v; })
      firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).update({...updated})
    }
    
    if (this.state.tipKey && 
        this.state.tip.tipsterHasMedia && 
        (this.state.tip.tipsterHasMedia !== prevState.tip.tipsterHasMedia)) {
      // setup listener only when tipster is going to upload media
      firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}/attachments`).on('value', (snapshot) => {
          const attachments = snapshot.val()
          const tip = {...this.state.tip}
          tip['attachments'] = attachments
          this.setState({tip})
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let newModuleIndex
    switch (nextProps.match.path) {
      case '/':
        newModuleIndex = 0
        break;
      case '/suspect':
        newModuleIndex = 1
        break;
      case '/vehicle':
        newModuleIndex = 2
        break;
      case '/drugs':
        newModuleIndex = 3
        break;
      case '/media':
        newModuleIndex = 4
        break;
      case '/final':
        newModuleIndex = 5
        break;
      case '/success':
        newModuleIndex = 6
        break;
      default:
        console.error('invalid URL')
    }
    this.setState({ moduleIndex: newModuleIndex })
  }

  componentWillUnmount = () => this.state.tipKey && firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).off();
  
  handleInputChange = (e, { name, value }) => {
    const tip = {...this.state.tip}
    tip[name] = value
    this.setState({tip})
  }

  handleCheckChange = (e, { name }) => {
    const tip = {...this.state.tip}
    tip[name] = tip[name] ? !tip[name] : true
    this.setState({tip})
  }

  handleFormModuleChange = (e, { name, value }) => {
    if (name === 'crimeType' && value === 'Drugs' && this.state.showFormModule.drugs === false) {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['drugs'] = true
      this.setState({showFormModule})
    } else if (name === 'crimeType' && value !== 'Drugs' && this.state.showFormModule.drugs === true) {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['drugs'] = false
      this.setState({showFormModule})
    }

    if (name === 'numberOfSuspects' && value === 0 && this.state.showFormModule.suspect === true) {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['suspect'] = false
      this.setState({showFormModule})
    } else if (name === 'numberOfSuspects' && value > 0 && this.state.showFormModule.suspect === false) {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['suspect'] = true
      this.setState({showFormModule})
    }

    if (name === 'numberOfVehicles' && value > 0 && this.state.showFormModule.vehicle === false) {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['vehicle'] = true
      this.setState({showFormModule})
    } else if (name === 'numberOfVehicles' && value === 0 && this.state.showFormModule.suspect === true) {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['vehicle'] = false
      this.setState({showFormModule})
    }

    if (name === 'tipsterHasMedia') {
      const showFormModule = {...this.state.showFormModule}
      showFormModule['media'] = !showFormModule['media']
      this.setState({showFormModule})
    }
  }

  createTip = (event) => {
    event.preventDefault();
    const tip = {...this.state.tip}
    tip['submitted'] = true
    tip['timestampSubmit'] = Date.now()
    tip['read'] = false
    tip['archived'] = false
    tip['important'] = false

    firebaseApp.database().ref(`tips/`).push({...this.state.tip})
      .then((snap) => {
        // increase tip unread count by one using transactions
        firebaseApp.database().ref('metrics/unreadTips').transaction((current_value) => current_value + 1)
        // delete the abandoned tip record
        firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).remove()
        // Reduce abandoned tip count by one using transactions
        firebaseApp.database().ref('metrics/unreadAbandonedTips').transaction((current_value) => current_value - 1)
        const tipKey = snap.key
        this.setState({tipKey}) // save new tipKey which users will use as a receipt #, for now
        this.changeFormWizardIndex('next')
      })
  }

  validateIntroModule = () => {
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
      const newModuleIndex = this.checkModuleIndex('next')
      this.setState({ 
        moduleIndex: newModuleIndex,
         error: { crimeType: null, tipText: null }
      })
      this.navigateTo(newModuleIndex)
    }
  }

  checkModuleIndex = (direction) => {
    const { moduleIndex } = this.state
    let changeIndex = true
    let i = 1
    let newModuleIndex
    do {
      if (direction === 'next') {
        newModuleIndex = moduleIndex + i;
      } else {
        newModuleIndex = moduleIndex - i;
      };
      (this.state.showFormModule[this.state.formModules[newModuleIndex]] === false) ? i++ : changeIndex = false;
    }
    while (changeIndex);
    return newModuleIndex
  }

  navigateTo = (newModuleIndex) => {
    const formModule = this.state.formModules[newModuleIndex]
    if (formModule === 'intro') {
      this.props.history.push('/')
    } else {
      this.props.history.push(`/${formModule}`)
    }    
  }

  changeFormWizardIndex = (direction) => {
    let { moduleIndex } = this.state
    let newModuleIndex

    if (direction === 'next') {
      if (moduleIndex === 'change back to zero') {
        // if on first page, check that crime type is entered and tiptext is >20 characters
        this.validateIntroModule()
      } else {
        newModuleIndex = this.checkModuleIndex(direction)
        this.setState({ moduleIndex: newModuleIndex })
        this.navigateTo(newModuleIndex)
      }
    } else if (direction === 'previous') {
      newModuleIndex = this.checkModuleIndex(direction)
      this.setState({ moduleIndex: newModuleIndex })
      this.navigateTo(newModuleIndex)
    };
  }

  displayFormModule = (moduleIndex) => {
    const contentToDisplay = this.state.formModules[moduleIndex]

    switch (contentToDisplay) {
      case 'intro':
        return (
          <TipFormContainer
            title="Submit a Tip"
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule='intro'
            nextButton={true}>
              <TipFormIntro
                handleInputChange={this.handleInputChange}
                handleCheckChange={this.handleCheckChange}
                handleFormModuleChange={this.handleFormModuleChange}
                tip={this.state.tip}
                error={this.state.error}
                lang={language[this.state.language]}
              />
          </TipFormContainer>
        )
      case 'suspect':
        return (
          <TipFormContainer 
            title="Suspect" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule='suspect'
            previousButton={true}
            nextButton={true}>
              <TipFormSuspect
                handleInputChange={this.handleInputChange}
                tip={this.state.tip}
                lang={language[this.state.language]}
              />
          </TipFormContainer>
        )
      case 'vehicle':
        return (
          <TipFormContainer 
            title="Suspect Vehicle" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule='vehicle'
            previousButton={true}
            nextButton={true}>
            <TipFormVehicle
              handleInputChange={this.handleInputChange}
              tip={this.state.tip}
              lang={language[this.state.language]}
            />
          </TipFormContainer>
        )
      case 'drugs':
        return (
          <TipFormContainer 
            title="Drugs" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule='drugs'
            previousButton={true}
            nextButton={true}>
              <TipFormDrugs
                handleInputChange={this.handleInputChange}
                tip={this.state.tip}
                lang={language[this.state.language]}
              />
          </TipFormContainer>
        )
      case 'media':
        return (
          <TipFormContainer
            title="Upload Media" 
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule='media'
            previousButton={true}
            nextButton={true}>
              <TipFormMedia 
                tip={this.state.tip} 
                tipKey={this.state.tipKey} 
                lang={language[this.state.language]}
              />
          </TipFormContainer>
        )
      case 'final':
        return (
          <TipFormContainer
            title="Conclusion"
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule='final'
            previousButton={true}
            showSubmit={true}
            createTip={this.createTip}>
              <TipFormConclusion
                handleInputChange={this.handleInputChange}
                handleCheckChange={this.handleCheckChange}
                tip={this.state.tip}
                lang={language[this.state.language]}
              />
          </TipFormContainer>
        )
      case 'success':
        return (
          <TipFormContainer title="Thank you!" showFormModule={this.state.showFormModule}>
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
    const formModule = this.displayFormModule(this.state.moduleIndex)
    
    return (
      <Layout>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
            {formModule}
          </Grid.Column>
			  </Grid>
      </Layout>
    );
  }
}