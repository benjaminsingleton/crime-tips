import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid } from 'semantic-ui-react';
import {
  tipsterAwareOfCrimeMethodOptions,
  websiteDiscoveryMethodOptions,
} from '../helpers/formOptions';

const Final = props => (
  <Form>
    <Grid stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={8}>
          <Form.Select
            label={props.lang.tipsterAwareOfCrimeMethod.label}
            name="tipsterAwareOfCrimeMethod"
            value={props.tip.tipsterAwareOfCrimeMethod}
            placeholder={props.lang.tipsterAwareOfCrimeMethod.placeholder}
            options={tipsterAwareOfCrimeMethodOptions}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={8}>
          <Form.Select
            label={props.lang.websiteDiscoveryMethod.label}
            name="tipsterWebsiteDiscoveryMethod"
            value={props.tip.websiteDiscoveryMethod}
            placeholder={props.lang.websiteDiscoveryMethod.placeholder}
            options={websiteDiscoveryMethodOptions}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Checkbox
            label={props.lang.tipsterWantsToBeContacted.label}
            name="tipsterWantsToBeContacted"
            checked={props.tip.tipsterWantsToBeContacted}
            onChange={props.handleCheckChange}
          />
          {props.tip.tipsterWantsToBeContacted &&
          <Form.Input
            label={props.lang.tipsterContactDetails.label}
            name="tipsterContactDetails"
            value={props.tip.tipsterContactDetails}
            placeholder={props.lang.tipsterContactDetails.placeholder}
            onChange={props.handleInputChange}
          />
        }
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Form>
  );

Final.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleCheckChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
};

export default Final;
