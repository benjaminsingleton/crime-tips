import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TextArea, Select, Checkbox, Alert } from './ui';
import { crimeTypeOptions } from '../helpers/formOptions';

const TipFormIntro = (props) => (
  <div className="form-grid form-grid--2">
    <div className="form-grid__full">
      <Select
        label={props.lang.crimeType.label}
        name="crimeType"
        value={props.tip.crimeType}
        placeholder={props.lang.crimeType.placeholder}
        options={crimeTypeOptions}
        error={!!props.error.crimeType}
        onChange={(e, p) => {
          props.handleInputChange(e, p);
          props.handleFormModuleChange(e, p);
        }}
      />
      {props.error.crimeType && (
        <Alert
          tone="error"
          title={props.lang.crimeType.required}
          content={props.lang.crimeType.error}
        />
      )}
    </div>

    <div className="form-grid__full">
      <TextArea
        label={props.lang.tipText.label}
        name="tipText"
        value={props.tip.tipText}
        placeholder={props.lang.tipText.placeholder}
        error={!!props.error.tipText}
        onChange={props.handleInputChange}
      />
      {props.error.tipText && (
        <Alert
          tone="error"
          title={props.lang.tipText.required}
          content={props.lang.tipText.error}
        />
      )}
    </div>

    <TextInput
      label={props.lang.crimeLocation.label}
      name="crimeLocation"
      value={props.tip.crimeLocation}
      placeholder={props.lang.crimeLocation.placeholder}
      onChange={props.handleInputChange}
    />
    <TextInput
      label={props.lang.crimeDate.label}
      name="crimeDate"
      value={props.tip.crimeDate}
      placeholder={props.lang.crimeDate.placeholder}
      onChange={props.handleInputChange}
    />

    <Select
      label={props.lang.numberOfSuspects.label}
      name="numberOfSuspects"
      value={props.tip.numberOfSuspects}
      placeholder={props.lang.numberOfSuspects.placeholder}
      options={[
        { value: 0, text: '0' },
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
      ]}
      onChange={(e, p) => {
        props.handleInputChange(e, p);
        props.handleFormModuleChange(e, p);
      }}
    />
    <Select
      label={props.lang.numberOfVehicles.label}
      name="numberOfVehicles"
      value={props.tip.numberOfVehicles}
      placeholder={props.lang.numberOfVehicles.placeholder}
      options={[
        { value: 0, text: '0' },
        { value: 1, text: '1' },
        { value: 2, text: '2' },
        { value: 3, text: '3' },
      ]}
      onChange={(e, p) => {
        props.handleInputChange(e, p);
        props.handleFormModuleChange(e, p);
      }}
    />

    <div className="form-grid__full">
      <Checkbox
        label={props.lang.tipsterHasMedia.label}
        name="tipsterHasMedia"
        checked={props.tip.tipsterHasMedia}
        onChange={(e, p) => {
          props.handleCheckChange(e, p);
          props.handleFormModuleChange(e, p);
        }}
      />
    </div>
  </div>
);

TipFormIntro.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  handleCheckChange: PropTypes.func.isRequired,
  handleFormModuleChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
  error: PropTypes.shape({
    tipText: PropTypes.bool,
    crimeType: PropTypes.bool,
  }).isRequired,
};

export default TipFormIntro;
