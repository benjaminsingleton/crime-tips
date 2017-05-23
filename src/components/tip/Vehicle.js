import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Segment, Button } from 'semantic-ui-react';
import { vehicleMakeOptions, vehicleColorOptions } from '../helpers/formOptions';

const VehicleInput = props => (
  <Grid stackable columns={2}>
    {props.numberOfVehicles > 1 &&
      <Grid.Row>
        <Grid.Column textAlign="center" width={16}>
          <Segment inverted color="grey">Vehicle {props.vehicleNumber}</Segment>
        </Grid.Column>
      </Grid.Row>
    }
    <Grid.Row>
      <Grid.Column>
        <Form.Select
          label={props.lang.vehicleMake.label}
          name={`vehicle${props.vehicleNumber}Make`}
          value={props.tip[`vehicle${props.vehicleNumber}Make`]}
          placeholder={props.lang.vehicleMake.placeholder}
          options={vehicleMakeOptions}
          onChange={props.handleInputChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Input
          label={props.lang.vehicleModel.label}
          name={`vehicle${props.vehicleNumber}Model`}
          value={props.tip[`vehicle${props.vehicleNumber}Model`]}
          placeholder={props.lang.vehicleModel.placeholder}
          onChange={props.handleInputChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <Form.Select
          label={props.lang.vehicleColor.label}
          name={`vehicle${props.vehicleNumber}Color`}
          value={props.tip[`vehicle${props.vehicleNumber}Color`]}
          placeholder={props.lang.vehicleColor.placeholder}
          options={vehicleColorOptions}
          onChange={props.handleInputChange}
        />
      </Grid.Column>
      <Grid.Column>
        <Form.Input
          label={props.lang.vehiclePlate.label}
          name={`vehicle${props.vehicleNumber}Plate`}
          value={props.tip[`vehicle${props.vehicleNumber}Plate`]}
          placeholder={props.lang.vehiclePlate.placeholder}
          onChange={props.handleInputChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.vehicleLocation.label}
          name={`vehicle${props.vehicleNumber}Location`}
          value={props.tip[`vehicle${props.vehicleNumber}Location`]}
          placeholder={props.lang.vehicleLocation.placeholder}
          onChange={props.handleInputChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={16}>
        <Form.Input
          label={props.lang.vehicleMarkings.label}
          name={`vehicle${props.vehicleNumber}Markings`}
          value={props.tip[`vehicle${props.vehicleNumber}Markings`]}
          placeholder={props.lang.vehicleMarkings.placeholder}
          onChange={props.handleInputChange}
        />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column floated="right" textAlign="right">
        {(props.vehicleNumber === props.numberOfVehicles && props.numberOfVehicles > 1) &&
          <Button
            type="button"
            content="— Remove Vehicle"
            onClick={() => props.addRemoveSuspectVehicle('numberOfVehicles', -1)}
          />
        }
        {(props.vehicleNumber === props.numberOfVehicles && props.numberOfVehicles < 3) &&
          <Button
            type="button"
            content="+ Add Vehicle"
            onClick={() => props.addRemoveSuspectVehicle('numberOfVehicles', 1)}
          />
        }
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

VehicleInput.propTypes = {
  vehicleNumber: PropTypes.number.isRequired,
  numberOfVehicles: PropTypes.number.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  addRemoveSuspectVehicle: PropTypes.func.isRequired,
};

const Vehicle = (props) => {
  const vehicleInputs = [];
  for (let i = 1; i < props.tip.numberOfVehicles + 1; i++) {
    vehicleInputs.push(
      <VehicleInput
        key={i}
        vehicleNumber={i}
        numberOfVehicles={props.tip.numberOfVehicles}
        {...props}
      />);
  }

  return (
    <Form>
      <Grid stackable columns={1}>
        {vehicleInputs}
      </Grid>
    </Form>
  );
};

Vehicle.propTypes = {
  tip: PropTypes.object.isRequired,
};

export default Vehicle;
