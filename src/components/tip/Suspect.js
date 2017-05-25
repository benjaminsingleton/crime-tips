import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Segment, Button } from 'semantic-ui-react';
import { genderOptions, raceOptions, heightOptions, stateOptions } from '../../helpers/formOptions';

const SuspectInput = props => (
  <Grid stackable columns={2}>
    {props.numberOfSuspects > 1 &&
      <Grid.Row>
        <Grid.Column textAlign="center" width={16}>
          <Segment inverted color="grey">Suspect {props.suspectNumber}</Segment>
        </Grid.Column>
      </Grid.Row>
    }
    <Grid.Row>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectFullName.label}
          name={`suspect${props.suspectNumber}FullName`}
          value={props.tip[`suspect${props.suspectNumber}FullName`]}
          placeholder={props.lang.suspectFullName.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectNickname.label}
          name={`suspect${props.suspectNumber}Nickname`}
          value={props.tip[`suspect${props.suspectNumber}Nickname`]}
          placeholder={props.lang.suspectNickname.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectDateOfBirth.label}
          name={`suspect${props.suspectNumber}DateOfBirth`}
          value={props.tip[`suspect${props.suspectNumber}DateOfBirth`]}
          placeholder={props.lang.suspectDateOfBirth.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectAge.label}
          name={`suspect${props.suspectNumber}Age`}
          value={props.tip[`suspect${props.suspectNumber}Age`]}
          placeholder={props.lang.suspectAge.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Select
          label={props.lang.suspectGender.label}
          name={`suspect${props.suspectNumber}Gender`}
          value={props.tip[`suspect${props.suspectNumber}Gender`]}
          options={genderOptions}
          placeholder={props.lang.suspectGender.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Select
          label={props.lang.suspectRace.label}
          name={`suspect${props.suspectNumber}Race`}
          value={props.tip[`suspect${props.suspectNumber}Race`]}
          options={raceOptions}
          placeholder={props.lang.suspectRace.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Select
          label={props.lang.suspectHeight.label}
          name={`suspect${props.suspectNumber}Height`}
          value={props.tip[`suspect${props.suspectNumber}Height`]}
          options={heightOptions}
          placeholder={props.lang.suspectHeight.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectWeight.label}
          name={`suspect${props.suspectNumber}Weight`}
          value={props.tip[`suspect${props.suspectNumber}Weight`]}
          placeholder={props.lang.suspectWeight.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.suspectAddress.label}
          name={`suspect${props.suspectNumber}Address`}
          value={props.tip[`suspect${props.suspectNumber}Address`]}
          placeholder={props.lang.suspectAddress.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectCity.label}
          name={`suspect${props.suspectNumber}City`}
          value={props.tip[`suspect${props.suspectNumber}City`]}
          placeholder={props.lang.suspectCity.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Select
          label={props.lang.suspectState.label}
          name={`suspect${props.suspectNumber}State`}
          value={props.tip[`suspect${props.suspectNumber}State`]}
          options={stateOptions}
          placeholder={props.lang.suspectState.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectPhone.label}
          name={`suspect${props.suspectNumber}Phone`}
          value={props.tip[`suspect${props.suspectNumber}Phone`]}
          placeholder={props.lang.suspectPhone.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectMarkings.label}
          name={`suspect${props.suspectNumber}Markings`}
          value={props.tip[`suspect${props.suspectNumber}Markings`]}
          placeholder={props.lang.suspectMarkings.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Input
          label={props.lang.suspectGang.label}
          name={`suspect${props.suspectNumber}Gang`}
          value={props.tip[`suspect${props.suspectNumber}Gang`]}
          placeholder={props.lang.suspectGang.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.suspectSocialMedia.label}
          name={`suspect${props.suspectNumber}SocialMedia`}
          value={props.tip[`suspect${props.suspectNumber}SocialMedia`]}
          placeholder={props.lang.suspectSocialMedia.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.suspectWeapon.label}
          name={`suspect${props.suspectNumber}Weapon`}
          value={props.tip[`suspect${props.suspectNumber}Weapon`]}
          placeholder={props.lang.suspectWeapon.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.suspectEmployer.label}
          name={`suspect${props.suspectNumber}Employer`}
          value={props.tip[`suspect${props.suspectNumber}Employer`]}
          placeholder={props.lang.suspectEmployer.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.suspectComments.label}
          name={`suspect${props.suspectNumber}Comments`}
          value={props.tip[`suspect${props.suspectNumber}Comments`]}
          placeholder={props.lang.suspectComments.placeholder}
          onChange={props.handleChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column floated="right" textAlign="right">
        {(props.suspectNumber === props.numberOfSuspects && props.numberOfSuspects > 1) &&
          <Button
            type="button"
            content="— Remove Suspect"
            onClick={() => props.addRemoveSuspectVehicle('numberOfSuspects', -1)}
          />
        }
        {(props.suspectNumber === props.numberOfSuspects && props.numberOfSuspects < 3) &&
          <Button
            type="button"
            content="+ Add Suspect"
            onClick={() => props.addRemoveSuspectVehicle('numberOfSuspects', 1)}
          />
        }
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

SuspectInput.propTypes = {
  suspectNumber: PropTypes.number.isRequired,
  numberOfSuspects: PropTypes.number.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  addRemoveSuspectVehicle: PropTypes.func.isRequired,
};

const Suspect = (props) => {
  const suspectInputs = [];
  for (let i = 1; i < props.tip.numberOfSuspects + 1; i++) {
    suspectInputs.push(
      <SuspectInput
        key={i}
        suspectNumber={i}
        numberOfSuspects={props.tip.numberOfSuspects}
        {...props}
      />,
    );
  }

  return (
    <Form>
      <Grid stackable columns={1}>
        {suspectInputs}
      </Grid>
    </Form>
  );
};

Suspect.propTypes = {
  tip: PropTypes.object.isRequired,
};

export default Suspect;
