import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, Select, Button } from './ui';
import { vehicleMakeOptions, vehicleColorOptions } from '../helpers/formOptions';

const VehicleInput = (props) => (
  <div className="subpanel">
    {props.numberOfVehicles > 1 && (
      <div className="subpanel__header">Vehicle {props.vehicleNumber}</div>
    )}
    <div className="subpanel__body form-grid form-grid--2">
      <Select
        label={props.lang.vehicleMake.label}
        name={`vehicle${props.vehicleNumber}Make`}
        value={props.tip[`vehicle${props.vehicleNumber}Make`]}
        placeholder={props.lang.vehicleMake.placeholder}
        options={vehicleMakeOptions}
        onChange={props.handleInputChange}
      />
      <TextInput
        label={props.lang.vehicleModel.label}
        name={`vehicle${props.vehicleNumber}Model`}
        value={props.tip[`vehicle${props.vehicleNumber}Model`]}
        placeholder={props.lang.vehicleModel.placeholder}
        onChange={props.handleInputChange}
      />
      <Select
        label={props.lang.vehicleColor.label}
        name={`vehicle${props.vehicleNumber}Color`}
        value={props.tip[`vehicle${props.vehicleNumber}Color`]}
        placeholder={props.lang.vehicleColor.placeholder}
        options={vehicleColorOptions}
        onChange={props.handleInputChange}
      />
      <TextInput
        label={props.lang.vehiclePlate.label}
        name={`vehicle${props.vehicleNumber}Plate`}
        value={props.tip[`vehicle${props.vehicleNumber}Plate`]}
        placeholder={props.lang.vehiclePlate.placeholder}
        onChange={props.handleInputChange}
      />
      <div className="form-grid__full">
        <TextInput
          label={props.lang.vehicleLocation.label}
          name={`vehicle${props.vehicleNumber}Location`}
          value={props.tip[`vehicle${props.vehicleNumber}Location`]}
          placeholder={props.lang.vehicleLocation.placeholder}
          onChange={props.handleInputChange}
        />
      </div>
      <div className="form-grid__full">
        <TextInput
          label={props.lang.vehicleMarkings.label}
          name={`vehicle${props.vehicleNumber}Markings`}
          value={props.tip[`vehicle${props.vehicleNumber}Markings`]}
          placeholder={props.lang.vehicleMarkings.placeholder}
          onChange={props.handleInputChange}
        />
      </div>
      {props.vehicleNumber === props.numberOfVehicles && (
        <div className="form-grid__full actions-end">
          {props.numberOfVehicles > 1 && (
            <Button
              type="button"
              variant="secondary"
              content="Remove vehicle"
              onClick={() => props.addRemoveSuspectVehicle('numberOfVehicles', -1)}
            />
          )}
          {props.numberOfVehicles < 3 && (
            <Button
              type="button"
              variant="secondary"
              content="Add vehicle"
              onClick={() => props.addRemoveSuspectVehicle('numberOfVehicles', 1)}
            />
          )}
        </div>
      )}
    </div>
  </div>
);

VehicleInput.propTypes = {
  vehicleNumber: PropTypes.number.isRequired,
  numberOfVehicles: PropTypes.number.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addRemoveSuspectVehicle: PropTypes.func.isRequired,
};

const TipFormVehicle = (props) => {
  const vehicleInputs = [];
  for (let i = 1; i < props.tip.numberOfVehicles + 1; i += 1) {
    vehicleInputs.push(
      <VehicleInput
        key={i}
        vehicleNumber={i}
        numberOfVehicles={props.tip.numberOfVehicles}
        {...props}
      />,
    );
  }
  return <div>{vehicleInputs}</div>;
};

TipFormVehicle.propTypes = {
  tip: PropTypes.object.isRequired,
};

export default TipFormVehicle;
