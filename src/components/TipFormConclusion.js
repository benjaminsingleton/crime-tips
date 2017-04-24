import React from 'react'
import PropTypes from 'prop-types';
import { Form, Grid } from 'semantic-ui-react'
import {
  tipsterAwareOfCrimeMethodOptions, 
  websiteDiscoveryMethodOptions 
} from '../helpers/formOptions'

const TipFormConclusion = (props) => {
  return (
    <Form>
      <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Select 
              label='How are you aware of this crime?'
              name='tipsterAwareOfCrimeMethod'
              value={props.tip.tipsterAwareOfCrimeMethod}
              placeholder='Select a source'
              options={tipsterAwareOfCrimeMethodOptions} 
              onChange={props.handleInputChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Form.Select
              label='How did you find out about online crime tips?'
              name='tipsterWebsiteDiscoveryMethod'
              value={props.tip.websiteDiscoveryMethod}
              placeholder='Select an option'
              options={websiteDiscoveryMethodOptions}
              onChange={props.handleInputChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
          <Form.Checkbox
            label="I know my tip is anonymous, but now I want to be contacted by the police."
            name='tipsterWantsToBeContacted'
            checked={props.tip.tipsterWantsToBeContacted}
            onChange={props.handleCheckChange}
          />
          {props.tip.tipsterWantsToBeContacted &&
            <Form.Input
              label='Please provide your contact details.'
              name='tipsterContactDetails'
              value={props.tip.tipsterContactDetails}
              placeholder='Contact information'
              onChange={props.handleInputChange}
            />
          }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
}

TipFormConclusion.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired
}

export default TipFormConclusion