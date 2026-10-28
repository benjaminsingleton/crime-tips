import React from 'react';
import PropTypes from 'prop-types';
import { Select, Checkbox, TextInput } from './ui';
import {
  tipsterAwareOfCrimeMethodOptions,
  websiteDiscoveryMethodOptions,
} from '../helpers/formOptions';

const TipFormConclusion = (props) => (
  <div className="form-grid">
    <Select
      label={props.lang.tipsterAwareOfCrimeMethod.label}
      name="tipsterAwareOfCrimeMethod"
      value={props.tip.tipsterAwareOfCrimeMethod}
      placeholder={props.lang.tipsterAwareOfCrimeMethod.placeholder}
      options={tipsterAwareOfCrimeMethodOptions}
      onChange={props.handleInputChange}
    />
    <Select
      label={props.lang.websiteDiscoveryMethod.label}
      name="tipsterWebsiteDiscoveryMethod"
      value={props.tip.websiteDiscoveryMethod}
      placeholder={props.lang.websiteDiscoveryMethod.placeholder}
      options={websiteDiscoveryMethodOptions}
      onChange={props.handleInputChange}
    />
    <div className="form-grid__full">
      <Checkbox
        label={props.lang.tipsterWantsToBeContacted.label}
        name="tipsterWantsToBeContacted"
        checked={props.tip.tipsterWantsToBeContacted}
        onChange={props.handleCheckChange}
      />
    </div>
    {props.tip.tipsterWantsToBeContacted && (
      <div className="form-grid__full">
        <TextInput
          label={props.lang.tipsterContactDetails.label}
          name="tipsterContactDetails"
          value={props.tip.tipsterContactDetails}
          placeholder={props.lang.tipsterContactDetails.placeholder}
          onChange={props.handleInputChange}
        />
      </div>
    )}
  </div>
);

TipFormConclusion.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleCheckChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
};

export default TipFormConclusion;
