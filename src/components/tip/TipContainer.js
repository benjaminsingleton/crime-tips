import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import _ from 'underscore';
import FormContainer from './FormContainer';
import Incident from './Incident';
import Suspect from './Suspect';
import Vehicle from './Vehicle';
import Drugs from './Drugs';
import Media from './Media';
import Final from './Final';
import Submitted from './Submitted';
import {
  firebaseApp,
  incrementUnreadAbandonedTipsCount,
  reduceUnreadAbandonedTipsCount,
  incrementUnreadTipsCount,
} from '../../helpers/firebase';
import { language } from '../../helpers/languages';

export default class TipContainer extends Component {
  state = {
    tipKey: null,
    tip: {
      timestampStart: Date.now(),
      tipType: 'web',
      tipText: '',
      numberOfSuspects: 1,
      numberOfVehicles: 0,
      attachment: false,
      submitted: false,
    },
    showModule: {
      incident: true,
      suspect: true,
      vehicle: false,
      drugs: false,
      media: false,
      final: true,
      submitted: true,
    },
    error: {},
  }

  componentWillMount() {
    if (this.state.tipKey && this.state.tip.tipsterHasMedia) {
      firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}/attachments`)
        .on('value', (snapshot) => {
          const attachments = snapshot.val();
          const tip = { ...this.state.tip };
          tip.attachments = attachments;
          this.setState({ tip });
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tipKey) {
      _.debounce(this.updateTip(this.state.tip, prevState.tip), 200);
    } else if (this.state.tip.tipText.length >= 20) {
      _.once(this.initializeTip());
    }
  }

  componentWillUnmount() {
    if (this.state.tipKey) {
      firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}/attachments`).off();
    }
  }

  updateTip = (tipNow, tipPrev) => {
    //  diff between the old tip and new tip
    const updated = _.omit(tipNow, (v, k) => tipPrev[k] === v);
    firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).update({ ...updated });
  }

  initializeTip = () => {
    firebaseApp.database().ref('abandonedTips/').push({ ...this.state.tip })
      .then((snap) => {
        const tipKey = snap.key;
        this.setState({ tipKey });
        incrementUnreadAbandonedTipsCount();
      });
  }

  submitTip = (e) => {
    e.preventDefault();
    const tip = { ...this.state.tip };
    tip.submitted = true;
    tip.timestampSubmit = Date.now();
    tip.read = false;
    tip.archived = false;
    tip.important = false;

    firebaseApp.database().ref('tips/').push({ ...this.state.tip })
      .then((snap) => {
        incrementUnreadTipsCount();
        firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).remove();
        reduceUnreadAbandonedTipsCount();
        this.setState({ tipKey: snap.key });
        this.changeFormWizardIndex('next');
      });
  }

  handleChange = (e, { name, value }) => {
    const tip = { ...this.state.tip };
    if (value) {
      tip[name] = value;
    } else {
      tip[name] = tip[name] ? !tip[name] : true;
    }

    this.setState({ tip });
  }

  validateIncidentModule = () => {
    const crimeTypeError = (this.state.tip.crimeType == null);
    const tipTextError = (this.state.tip.tipText == null || this.state.tip.tipText.length < 20);

    if (crimeTypeError || tipTextError) {
      const error = { ...this.state.error };
      if (crimeTypeError) {
        error.crimeType = true;
      }

      if (tipTextError) {
        error.tipText = true;
      }
      this.setState({ error });
      return false;
    }
    this.setState({
      error: {
        crimeType: null,
        tipText: null,
      },
    });
    return true;
  }

  addRemoveSuspectVehicle = (field, number) => {
    const currentCount = this.state.tip[field];
    const tip = { ...this.state.tip };
    tip[field] = currentCount + number;
    this.setState({ tip });
  }

  render() {
    const lang = language.english;
    const sharedProps = {
      lang,
      tip: this.state.tip,
      handleChange: this.handleChange,
      tipKey: this.state.tipKey,
    };
    return (
      <Grid centered container columns={1}>
        <Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
          <FormContainer
            lang={lang}
            tip={this.state.tip}
            submitTip={this.submitTip}
            currentRoute={this.props.match.path}
            history={this.props.history}
            validateIncidentModule={this.validateIncidentModule}
          >
            <Switch>
              <Route exact path="/" render={() => (
                <Incident {...sharedProps} error={this.state.error} />
              )}/>
              <Route exact path="/suspect" render={() => (
                <Suspect {...sharedProps} addRemoveSuspectVehicle={this.addRemoveSuspectVehicle} />
              )}/>
              <Route exact path="/vehicle" render={() => <Vehicle {...sharedProps} />} />
              <Route exact path="/drugs" render={() => <Drugs {...sharedProps} />} />
              <Route exact path="/media" render={() => <Media {...sharedProps} />} />
              <Route exact path="/final" render={() => <Final {...sharedProps} />} />
              <Route exact path="/submitted" render={() => <Submitted {...sharedProps} />} />
            </Switch>
          </FormContainer>
        </Grid.Column>
      </Grid>
    );
  }
}

TipContainer.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};
