import React from 'react'
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react'
import { genderOptions, raceOptions, heightOptions, stateOptions } from '../helpers/formOptions'

const TipFormSuspect = (props) => {
  const { suspectNumber } = props
  return (
    <Form>
      <Form.Input
        label='Full name'
        name={`suspect${suspectNumber}FullName`}
        value={props.tip[`suspect${suspectNumber}FullName`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Nickname / alias'
        name={`suspect${suspectNumber}Nickname`}
        value={props.tip[`suspect${suspectNumber}Nickname`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Date of Birth'
        name={`suspect${suspectNumber}DateOfBirth`}
        value={props.tip[`suspect${suspectNumber}DateOfBirth`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Approximate age'
        name={`suspect${suspectNumber}Age`}
        value={props.tip[`suspect${suspectNumber}Age`]}
        onChange={props.handleInputChange}
      />
      <Form.Select
        label='Gender'
        name={`suspect${suspectNumber}Gender`}
        value={props.tip[`suspect${suspectNumber}Gender`]}
        options={genderOptions}
        onChange={props.handleInputChange}
      />
      <Form.Select
        label='Race'
        name={`suspect${suspectNumber}Race`}
        value={props.tip[`suspect${suspectNumber}Race`]}
        options={raceOptions}
        onChange={props.handleInputChange}
      />
      <Form.Select
        label='Height'
        name={`suspect${suspectNumber}Height`}
        value={props.tip[`suspect${suspectNumber}Height`]}
        options={heightOptions}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Weight'
        name={`suspect${suspectNumber}Weight`}
        value={props.tip[`suspect${suspectNumber}Weight`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Scars, Marks, Tattoos, Piercings'
        name={`suspect${suspectNumber}Markings`}
        value={props.tip[`suspect${suspectNumber}Markings`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Gang membership'
        name={`suspect${suspectNumber}Gang`}
        value={props.tip[`suspect${suspectNumber}Gang`]}
        placeholder='Gang'
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Phone number'
        name={`suspect${suspectNumber}Phone`}
        value={props.tip[`suspect${suspectNumber}Phone`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Social media accounts (e.g. Facebook, Instagram, Twitter)'
        name={`suspect${suspectNumber}SocialMedia`}
        value={props.tip[`suspect${suspectNumber}SocialMedia`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Employer'
        name={`suspect${suspectNumber}Employer`}
        value={props.tip[`suspect${suspectNumber}Employer`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Address'
        name={`suspect${suspectNumber}Address`}
        value={props.tip[`suspect${suspectNumber}Address`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='City'
        name={`suspect${suspectNumber}City`}
        value={props.tip[`suspect${suspectNumber}City`]}
        onChange={props.handleInputChange}
      />
      <Form.Select
        label='State'
        name={`suspect${suspectNumber}State`}
        value={props.tip[`suspect${suspectNumber}State`]}
        options={stateOptions}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Does the suspect carry weapons?'
        name={`suspect${suspectNumber}Weapon`}
        value={props.tip[`suspect${suspectNumber}Weapon`]}
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='Is there anything else we should know about the suspect?'
        name={`suspect${suspectNumber}Comments`}
        value={props.tip[`suspect${suspectNumber}Comments`]}
        onChange={props.handleInputChange}
      />
    </Form>
  )
}

TipFormSuspect.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired
}

export default TipFormSuspect