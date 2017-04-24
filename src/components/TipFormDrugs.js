import React from 'react'
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react'
import { drugTypeOptions, drugSaleMethodOptions } from '../helpers/formOptions'

const TipFormDrugs = (props) => {
  return (
    <Form>
      <Form.Select
        label='What drug is possessed / being sold?'
        name='drugType'
        value={props.tip.drugType}
        options={drugTypeOptions}
        placeholder='Select a drug type'
        onChange={props.handleInputChange}
      />
      <Form.Select
        label='How are the drugs being sold?'
        name='drugSaleMethod'
        value={props.tip.drugSaleMethod}
        options={drugSaleMethodOptions}
        placeholder='Select a method'
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='What time of day are drugs sold?'
        name='drugSaleTime'
        value={props.tip.drugSaleTime}
        placeholder='e.g., 10am-4pm on weekdays'
        onChange={props.handleInputChange}
      />
      <Form.Input
        label='What is the phone number used to buy drugs'
        name='drugSalePhoneNumber'
        value={props.tip.drugSalePhoneNumber}
        placeholder='XXX-XXX-XXXX'
        onChange={props.handleInputChange}
      />
    </Form>
  );
}

TipFormDrugs.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired
}

export default TipFormDrugs