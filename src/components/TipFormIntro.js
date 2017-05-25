import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Message } from 'semantic-ui-react';
import { crimeTypeOptions } from '../helpers/formOptions';

const TipFormIntro = props => (
  <Form error={props.error.crimeType || props.error.tipText}>
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
          {props.error.crimeType &&
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
          {props.error.tipText &&
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
);

TipFormIntro.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleCheckChange: PropTypes.func.isRequired,
  handleFormModuleChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
  error: PropTypes.shape({
    tipText: PropTypes.bool,
    crimeType: PropTypes.bool,
  }).isRequired,
};

export default TipFormIntro;
