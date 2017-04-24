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
            label={props.lang.suspectFullName.label}
            name={`suspect${suspectNumber}FullName`}
            value={props.tip[`suspect${suspectNumber}FullName`]}
            placeholder={props.lang.suspectFullName.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectNickname.label}
            name={`suspect${suspectNumber}Nickname`}
            value={props.tip[`suspect${suspectNumber}Nickname`]}
            placeholder={props.lang.suspectNickname.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectDateOfBirth.label}
            name={`suspect${suspectNumber}DateOfBirth`}
            value={props.tip[`suspect${suspectNumber}DateOfBirth`]}
            placeholder={props.lang.suspectDateOfBirth.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectAge.label}
            name={`suspect${suspectNumber}Age`}
            value={props.tip[`suspect${suspectNumber}Age`]}
            placeholder={props.lang.suspectAge.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label={props.lang.suspectGender.label}
            name={`suspect${suspectNumber}Gender`}
            value={props.tip[`suspect${suspectNumber}Gender`]}
            options={genderOptions}
            placeholder={props.lang.suspectGender.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            label={props.lang.suspectRace.label}
            name={`suspect${suspectNumber}Race`}
            value={props.tip[`suspect${suspectNumber}Race`]}
            options={raceOptions}
            placeholder={props.lang.suspectRace.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label={props.lang.suspectHeight.label}
            name={`suspect${suspectNumber}Height`}
            value={props.tip[`suspect${suspectNumber}Height`]}
            options={heightOptions}
            placeholder={props.lang.suspectHeight.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectWeight.label}
            name={`suspect${suspectNumber}Weight`}
            value={props.tip[`suspect${suspectNumber}Weight`]}
            placeholder={props.lang.suspectWeight.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label={props.lang.suspectAddress.label}
            name={`suspect${suspectNumber}Address`}
            value={props.tip[`suspect${suspectNumber}Address`]}
            placeholder={props.lang.suspectAddress.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectCity.label}
            name={`suspect${suspectNumber}City`}
            value={props.tip[`suspect${suspectNumber}City`]}
            placeholder={props.lang.suspectCity.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Select
            label={props.lang.suspectState.label}
            name={`suspect${suspectNumber}State`}
            value={props.tip[`suspect${suspectNumber}State`]}
            options={stateOptions}
            placeholder={props.lang.suspectState.placeholder}
            onChange={props.handleInputChange}
        />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectPhone.label}
            name={`suspect${suspectNumber}Phone`}
            value={props.tip[`suspect${suspectNumber}Phone`]}
            placeholder={props.lang.suspectPhone.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectMarkings.label}
            name={`suspect${suspectNumber}Markings`}
            value={props.tip[`suspect${suspectNumber}Markings`]}
            placeholder={props.lang.suspectMarkings.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label={props.lang.suspectGang.label}
            name={`suspect${suspectNumber}Gang`}
            value={props.tip[`suspect${suspectNumber}Gang`]}
            placeholder={props.lang.suspectGang.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label={props.lang.suspectSocialMedia.label}
            name={`suspect${suspectNumber}SocialMedia`}
            value={props.tip[`suspect${suspectNumber}SocialMedia`]}
            placeholder={props.lang.suspectSocialMedia.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label={props.lang.suspectWeapon.label}
            name={`suspect${suspectNumber}Weapon`}
            value={props.tip[`suspect${suspectNumber}Weapon`]}
            placeholder={props.lang.suspectWeapon.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
        <Form.Input
          label={props.lang.suspectEmployer.label}
          name={`suspect${suspectNumber}Employer`}
          value={props.tip[`suspect${suspectNumber}Employer`]}
          placeholder={props.lang.suspectEmployer.placeholder}
          onChange={props.handleInputChange}
        />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label={props.lang.suspectComments.label}
            name={`suspect${suspectNumber}Comments`}
            value={props.tip[`suspect${suspectNumber}Comments`]}
            placeholder={props.lang.suspectComments.placeholder}
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
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired
}

export default TipFormSuspect