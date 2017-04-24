import React from 'react'
import PropTypes from 'prop-types';
import { Form, Grid, Segment } from 'semantic-ui-react'
import { genderOptions, raceOptions, heightOptions, stateOptions } from '../helpers/formOptions'

const SuspectInput = ({props, suspectNumber, numberOfSuspects}) => {
  return (
    <Grid stackable columns={2}>
      {numberOfSuspects > 1 && 
        <Grid.Row>
          <Grid.Column textAlign='center' width={16}>
            <Segment inverted color='grey'>Suspect {suspectNumber}</Segment>
          </Grid.Column>
        </Grid.Row>
      }
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label='Full name'
            name={`suspect${suspectNumber}FullName`}
            value={props.tip[`suspect${suspectNumber}FullName`]}
            placeholder='First and last name'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label='Nickname / alias'
            name={`suspect${suspectNumber}Nickname`}
            value={props.tip[`suspect${suspectNumber}Nickname`]}
            placeholder='Nickname'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label='Date of Birth'
            name={`suspect${suspectNumber}DateOfBirth`}
            value={props.tip[`suspect${suspectNumber}DateOfBirth`]}
            placeholder='MM/DD/YYYY'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label='Approximate age'
            name={`suspect${suspectNumber}Age`}
            value={props.tip[`suspect${suspectNumber}Age`]}
            placeholder='Age'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label='Gender'
            name={`suspect${suspectNumber}Gender`}
            value={props.tip[`suspect${suspectNumber}Gender`]}
            options={genderOptions}
            placeholder='Select a gender'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            label='Race'
            name={`suspect${suspectNumber}Race`}
            value={props.tip[`suspect${suspectNumber}Race`]}
            options={raceOptions}
            placeholder='Select a race'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label='Height'
            name={`suspect${suspectNumber}Height`}
            value={props.tip[`suspect${suspectNumber}Height`]}
            options={heightOptions}
            placeholder='Select a height'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label='Weight'
            name={`suspect${suspectNumber}Weight`}
            value={props.tip[`suspect${suspectNumber}Weight`]}
            placeholder='Weight'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label='Home Address'
            name={`suspect${suspectNumber}Address`}
            value={props.tip[`suspect${suspectNumber}Address`]}
            placeholder='Home Address'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label='City'
            name={`suspect${suspectNumber}City`}
            value={props.tip[`suspect${suspectNumber}City`]}
            placeholder='City'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            label='State'
            name={`suspect${suspectNumber}State`}
            value={props.tip[`suspect${suspectNumber}State`]}
            options={stateOptions}
            placeholder='Select a state'
            onChange={props.handleInputChange}
        />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label='Phone number'
            name={`suspect${suspectNumber}Phone`}
            value={props.tip[`suspect${suspectNumber}Phone`]}
            placeholder='XXX-XXX-XXXX'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label='Scars, Marks, Tattoos, Piercings'
            name={`suspect${suspectNumber}Markings`}
            value={props.tip[`suspect${suspectNumber}Markings`]}
            placeholder='Identifying markings'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label='Gang membership'
            name={`suspect${suspectNumber}Gang`}
            value={props.tip[`suspect${suspectNumber}Gang`]}
            placeholder='Gang name'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label='Social media accounts (e.g. Facebook, Instagram, Twitter)'
            name={`suspect${suspectNumber}SocialMedia`}
            value={props.tip[`suspect${suspectNumber}SocialMedia`]}
            placeholder='e.g. https://www.facebook.com/username'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label='Does the suspect carry weapons? What kind?'
            name={`suspect${suspectNumber}Weapon`}
            value={props.tip[`suspect${suspectNumber}Weapon`]}
            placeholder='Weapon'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
        <Form.Input
          label='Place of Employment'
          name={`suspect${suspectNumber}Employer`}
          value={props.tip[`suspect${suspectNumber}Employer`]}
          placeholder='Employer name'
          onChange={props.handleInputChange}
        />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label='Is there anything else we should know about the suspect?'
            name={`suspect${suspectNumber}Comments`}
            value={props.tip[`suspect${suspectNumber}Comments`]}
            placeholder='Additional details'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const TipFormSuspect = (props) => {
  const { numberOfSuspects } = props.tip
  const suspectInputs = []
  for (let i = 1; i < numberOfSuspects + 1; i++) {
    suspectInputs.push(<SuspectInput key={i} props={props} suspectNumber={i} numberOfSuspects={numberOfSuspects} />);
  }

  return (
    <Form>
      <Grid stackable columns={1}>
        {suspectInputs}
      </Grid>
    </Form>
  )
}

TipFormSuspect.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired
}

export default TipFormSuspect