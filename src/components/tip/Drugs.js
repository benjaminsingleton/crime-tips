import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { drugTypeOptions, drugSaleMethodOptions } from '../../helpers/formOptions';

const Drugs = props => (
  <Form>
    <Form.Select
      label={props.lang.drugType.label}
      name="drugType"
      value={props.tip.drugType}
      options={drugTypeOptions}
      placeholder={props.lang.drugType.placeholder}
      onChange={props.handleChange}
    />
    <Form.Select
      label={props.lang.drugSaleMethod.label}
      name="drugSaleMethod"
      value={props.tip.drugSaleMethod}
      options={drugSaleMethodOptions}
      placeholder={props.lang.drugSaleMethod.placeholder}
      onChange={props.handleChange}
    />
    <Form.Input
      label={props.lang.drugSaleTime.label}
      name="drugSaleTime"
      value={props.tip.drugSaleTime}
      placeholder={props.lang.drugSaleTime.placeholder}
      onChange={props.handleChange}
    />
    <Form.Input
      label={props.lang.drugSalePhoneNumber.label}
      name="drugSalePhoneNumber"
      value={props.tip.drugSalePhoneNumber}
      placeholder={props.lang.drugSalePhoneNumber.placeholder}
      onChange={props.handleChange}
    />
  </Form>
);

Drugs.propTypes = {
  handleChange: PropTypes.func.isRequired,
  lang: PropTypes.object.isRequired,
  tip: PropTypes.object.isRequired,
};

export default Drugs;
