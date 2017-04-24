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
            label='What is the vehicle make?'
            name={`vehicle${vehicleNumber}Make`}
            value={props.tip[`vehicle${vehicleNumber}Make`]}
            placeholder='Select a make'
            options={vehicleMakeOptions}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label='What is the vehicle model?'
            name={`vehicle${vehicleNumber}Model`}
            value={props.tip[`vehicle${vehicleNumber}Model`]}
            placeholder='Vehicle model'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Form.Select
            label='What is the color of the vehicle?'
            name={`vehicle${vehicleNumber}Color`}
            value={props.tip[`vehicle${vehicleNumber}Color`]}
            placeholder='Select a color'
            options={vehicleColorOptions}
            onChange={props.handleInputChange}
          />
        </Grid.Column>
        <Grid.Column>
          <Form.Input
            label='What is the license plate number?'
            name={`vehicle${vehicleNumber}Plate`}
            value={props.tip[`vehicle${vehicleNumber}Plate`]}
            placeholder='License plate number'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label='Where can the vehicle usually be found?'
            name={`vehicle${vehicleNumber}Location`}
            value={props.tip[`vehicle${vehicleNumber}Location`]}
            placeholder='Vehicle location'
            onChange={props.handleInputChange}
          />
        </Grid.Column>
      </Grid.Row>
        <Grid.Row>
        <Grid.Column width={16}>
          <Form.Input
            label='Please note if the vehicle has any identifying marks, scratches, bumper stickers, etc.'
            name={`vehicle${vehicleNumber}Markings`}
            value={props.tip[`vehicle${vehicleNumber}Markings`]}
            placeholder='Vehicle markings'
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
  tip: PropTypes.object.isRequired
}

export default TipFormVehicle