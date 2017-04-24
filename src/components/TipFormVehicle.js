import React from 'react'
import PropTypes from 'prop-types';
import { Form, Grid, Segment } from 'semantic-ui-react'
import { vehicleMakeOptions, vehicleColorOptions } from '../helpers/formOptions'

const VehicleInput = ({ props, vehicleNumber, numberOfVehicles }) => {
  return (
    <Grid stackable columns={2}>
      {numberOfVehicles > 1 && 
        <Grid.Row>
          <Grid.Column textAlign='center' width={16}>
            <Segment inverted color='grey'>Vehicle {vehicleNumber}</Segment>
          </Grid.Column>
        </Grid.Row>
      }
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label={props.lang.vehicleMake.label}
            name={`vehicle${vehicleNumber}Make`}
            value={props.tip[`vehicle${vehicleNumber}Make`]}
            placeholder={props.lang.vehicleMake.placeholder}
            options={vehicleMakeOptions}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label={props.lang.vehicleModel.label}
            name={`vehicle${vehicleNumber}Model`}
            value={props.tip[`vehicle${vehicleNumber}Model`]}
            placeholder={props.lang.vehicleModel.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label={props.lang.vehicleColor.label}
            name={`vehicle${vehicleNumber}Color`}
            value={props.tip[`vehicle${vehicleNumber}Color`]}
            placeholder={props.lang.vehicleColor.placeholder}
            options={vehicleColorOptions}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label={props.lang.vehiclePlate.label}
            name={`vehicle${vehicleNumber}Plate`}
            value={props.tip[`vehicle${vehicleNumber}Plate`]}
            placeholder={props.lang.vehiclePlate.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label={props.lang.vehicleLocation.label}
            name={`vehicle${vehicleNumber}Location`}
            value={props.tip[`vehicle${vehicleNumber}Location`]}
            placeholder={props.lang.vehicleLocation.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
        <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label={props.lang.vehicleMarkings.label}
            name={`vehicle${vehicleNumber}Markings`}
            value={props.tip[`vehicle${vehicleNumber}Markings`]}
            placeholder={props.lang.vehicleMarkings.placeholder}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

const TipFormVehicle = (props) => {
  const { numberOfVehicles } = props.tip
  const vehicleInputs = []
  for (let i = 1; i < numberOfVehicles + 1; i++) {
    vehicleInputs.push(<VehicleInput key={i} props={props} vehicleNumber={i} numberOfVehicles={numberOfVehicles} />);
  }

  return (
    <Form>
       <Grid stackable columns={1}>
        {vehicleInputs}
      </Grid>
    </Form>
  )
}

TipFormVehicle.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired,
  lang: PropTypes.object.isRequired
}

export default TipFormVehicle