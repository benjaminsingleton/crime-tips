import React, { Component } from 'react';
import { Form, Grid, Message } from 'semantic-ui-react';
import _ from 'underscore';
import { crimeTypeOptions } from '../../helpers/formOptions';

export default class Incident extends Component {
  render() {
    const { error } = this.props;
    const { tip, lang } = this.props;
    return (
      <Form error={error.crimeType || error.tipText}>
        <Grid stackable columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Form.Select
                label={lang.crimeType.label}
                name="crimeType"
                value={tip.crimeType}
                placeholder={lang.crimeType.placeholder}
                options={crimeTypeOptions}
                error={error.crimeType}
                onChange={this.props.handleChange}
              />
              {error.crimeType &&
                <Message
                  error
                  header={lang.crimeType.required}
                  content={lang.crimeType.error}
                />
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.TextArea
                label={lang.tipText.label}
                name="tipText"
                value={tip.tipText}
                placeholder={lang.tipText.placeholder}
                error={error.tipText}
                onChange={this.props.handleChange}
              />
              {error.tipText &&
                <Message
                  error
                  header={lang.tipText.required}
                  content={lang.tipText.error}
                />
              }
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Input
                label={lang.crimeLocation.label}
                name="crimeLocation"
                value={tip.crimeLocation}
                placeholder={lang.crimeLocation.placeholder}
                onChange={this.props.handleChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Input
                label={lang.crimeDate.label}
                name="crimeDate"
                value={tip.crimeDate}
                placeholder={lang.crimeDate.placeholder}
                onChange={this.props.handleChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Form.Select
                label={lang.numberOfSuspects.label}
                name="numberOfSuspects"
                value={tip.numberOfSuspects}
                placeholder={lang.numberOfSuspects.placeholder}
                options={[
                  { value: 0, text: 0 },
                  { value: 1, text: 1 },
                  { value: 2, text: 2 },
                  { value: 3, text: 3 },
                ]}
                inline
                onChange={this.props.handleChange}
              />
            </Grid.Column>
            <Grid.Column>
              <Form.Select
                label={lang.numberOfVehicles.label}
                name="numberOfVehicles"
                value={tip.numberOfVehicles}
                placeholder={lang.numberOfVehicles.placeholder}
                options={[
                  { value: 0, text: 0 },
                  { value: 1, text: 1 },
                  { value: 2, text: 2 },
                  { value: 3, text: 3 },
                ]}
                inline
                onChange={this.props.handleChange}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Checkbox
                label={lang.tipsterHasMedia.label}
                name="tipsterHasMedia"
                checked={tip.tipsterHasMedia}
                onChange={this.props.handleChange}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}
