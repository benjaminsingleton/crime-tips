import React from 'react'
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react'
import { crimeTypeOptions } from '../helpers/formOptions'

const TipFormIntro = (props) => {  
  return (
    <Form error={props.error.crimeType || props.error.tipText}>
      <Form.Select
        label='What kind of crime was committed?'
        name='crimeType'
        value={props.tip.crimeType}
        placeholder='Select a crime type'
        options={crimeTypeOptions}
        error={props.error.crimeType}
        onChange={props.handleInputChange}
      />
      {props.error.crimeType && 
        <Message
          error
          header='Required Field'
          content='Please select a crime type.'
        />
      }
      <Form.TextArea
        label="Please tell us the information you wanted to share."
        name='tipText'
        value={props.tip.tipText}
        placeholder='Tip description'
        error={props.error.tipText}
        onChange={props.handleInputChange}
      />
      {props.error.tipText && 
        <Message
          error
          header='Required Field'
          content='Your description is too brief. 20 characters minimum.'
        />
      }
      <Form.Input
        label='Where did the crime take place?'
        name='crimeLocation'
        value={props.tip.crimeLocation}
        placeholder='Crime location'
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='When did the crime occur?'
        name='crimeDate'
        value={props.tip.crimeDate}
        placeholder='Crime date'
        onChange={props.handleInputChange}
      />
      <Form.Group widths='equal'>
        <Form.Select
          label="How many suspects were involved?"
          name='numberOfSuspects'
          value={props.tip.numberOfSuspects}
          placeholder='Select a number'
          options={[{value: 1, text: 1}, {value: 2, text: 2}, {value: 3, text: 3}]}
          inline
          onChange={props.handleInputChange}
        />
        <Form.Select
          label="How many vehicles were involved?"
          name='numberOfVehicles'
          value={props.tip.numberOfVehicles}
          placeholder='Select a number'
          options={[{value: 0, text: 0}, {value: 1, text: 1}, {value: 2, text: 2}]}
          inline
          onChange={props.handleInputChange}
        />
      </Form.Group>
      <Form.Checkbox
        label="I have media (such as an image or video) to upload."
        name='tipsterHasMedia'
        checked={props.tip.tipsterHasMedia}
        onChange={props.handleCheckChange}
      />
    </Form>
  );
}

TipFormIntro.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired
}

export default TipFormIntro