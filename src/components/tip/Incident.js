import React, { Component } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import _ from 'underscore';
import { crimeTypeOptions } from '../../helpers/formOptions';
import { firebaseApp, incrementUnreadAbandonedTipsCount } from '../../helpers/firebase';

export default class Incident extends Component {
  state = {
    tip: {
      timestampStart: Date.now(),
      tipType: 'web',
      tipText: '',
      numberOfSuspects: 1,
      numberOfVehicles: 0,
      submitted: false,
    },
    error: {},
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.tipKey) {
      _.debounce(this.updateTip(this.state.tip, prevState.tip), 200);
    } else if (this.state.tip.tipText.length >= 20) {
      _.once(this.createTip());
    }
  }

  createTip = () => {
    firebaseApp.database().ref('abandonedTips/').push({ ...this.state.tip })
      .then((snap) => {
        const tipKey = snap.key;
        this.setState({ tipKey });
        incrementUnreadAbandonedTipsCount();
      });
  }

  updateTip = (tipNow, tipPrev) => {
    //  diff between the old tip and new tip
    const updated = _.omit(tipNow, (v, k) => tipPrev[k] === v);
    firebaseApp.database().ref(`abandonedTips/${this.state.tipKey}`).update({ ...updated });
  }

  handleInputChange = (e, { name, value }) => {
    const tip = { ...this.state.tip };
    tip[name] = value;
    this.setState({ tip });
  }

  handleCheckChange = (e, { name }) => {
    const tip = { ...this.state.tip };
    tip[name] = tip[name] ? !tip[name] : true;
    this.setState({ tip });
  }

  render() {
    const { error } = this.state;
    return (
      <TipContainer
        title={lang.submitATip}
        changeFormWizardIndex={this.changeFormWizardIndex}
        showFormModule={this.state.showFormModule}
        activeModule="incident"
        nextButton
        lang={lang}
      >
        <Form error={error.crimeType || error.tipText}>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Form.Select
                  label={props.lang.crimeType.label}
                  name="crimeType"
                  value={props.tip.crimeType}
                  placeholder={props.lang.crimeType.placeholder}
                  options={crimeTypeOptions}
                  error={props.error.crimeType}
                  onChange={(e, p) => {
                    props.handleInputChange(e, p);
                    props.handleFormModuleChange(e, p);
                  }}
                />
                {error.crimeType &&
                  <Message
                    error
                    header={props.lang.crimeType.required}
                    content={props.lang.crimeType.error}
                  />
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.TextArea
                  label={props.lang.tipText.label}
                  name="tipText"
                  value={props.tip.tipText}
                  placeholder={props.lang.tipText.placeholder}
                  error={props.error.tipText}
                  onChange={props.handleInputChange}
                />
                {error.tipText &&
                  <Message
                    error
                    header={props.lang.tipText.required}
                    content={props.lang.tipText.error}
                  />
                }
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label={props.lang.crimeLocation.label}
                  name="crimeLocation"
                  value={props.tip.crimeLocation}
                  placeholder={props.lang.crimeLocation.placeholder}
                  onChange={props.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label={props.lang.crimeDate.label}
                  name="crimeDate"
                  value={props.tip.crimeDate}
                  placeholder={props.lang.crimeDate.placeholder}
                  onChange={props.handleInputChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Select
                  label={props.lang.numberOfSuspects.label}
                  name="numberOfSuspects"
                  value={props.tip.numberOfSuspects}
                  placeholder={props.lang.numberOfSuspects.placeholder}
                  options={[
                    { value: 0, text: 0 },
                    { value: 1, text: 1 },
                    { value: 2, text: 2 },
                    { value: 3, text: 3 },
                  ]}
                  inline
                  onChange={(e, p) => {
                    props.handleInputChange(e, p);
                    props.handleFormModuleChange(e, p);
                  }}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Select
                  label={props.lang.numberOfVehicles.label}
                  name="numberOfVehicles"
                  value={props.tip.numberOfVehicles}
                  placeholder={props.lang.numberOfVehicles.placeholder}
                  options={[
                    { value: 0, text: 0 },
                    { value: 1, text: 1 },
                    { value: 2, text: 2 },
                    { value: 3, text: 3 },
                  ]}
                  inline
                  onChange={(e, p) => {
                    props.handleInputChange(e, p);
                    props.handleFormModuleChange(e, p);
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Checkbox
                  label={props.lang.tipsterHasMedia.label}
                  name="tipsterHasMedia"
                  checked={props.tip.tipsterHasMedia}
                  onChange={(e, p) => {
                    props.handleCheckChange(e, p);
                    props.handleFormModuleChange(e, p);
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </TipContainer>
    );
  }
}
