import React from 'react'
import PropTypes from 'prop-types';
import { Form, Grid } from 'semantic-ui-react'
import { vehicleMakeOptions, vehicleColorOptions } from '../helpers/formOptions'

const TipFormVehicle = (props) => {
  return (
    <Form>
       <Grid stackable columns={2}>
        <Grid.Row>
          <Grid.Column>
            <Form.Select
              label='What is the vehicle make?'
              name='vehicleMake'
              value={props.tip.vehicleMake}
              placeholder='Select a make'
              options={vehicleMakeOptions}
              onChange={props.handleInputChange}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              label='What is the vehicle model?'
              name='vehicleModel'
              value={props.tip.vehicleModel}
              placeholder='Vehicle model'
              onChange={props.handleInputChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Form.Select
              label='What is the color of the vehicle?'
              name='vehicleColor'
              value={props.tip.vehicleColor}
              placeholder='Select a color'
              options={vehicleColorOptions}
              onChange={props.handleInputChange}
            />
          </Grid.Column>
          <Grid.Column>
            <Form.Input
              label='What is the license plate number?'
              name='vehiclePlate'
              value={props.tip.vehiclePlate}
              placeholder='License plate number'
              onChange={props.handleInputChange}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Form.Input
              label='Where can the vehicle usually be found?'
              name='vehicleLocation'
              value={props.tip.vehicleLocation}
              placeholder='Vehicle location'
              onChange={props.handleInputChange}
            />
          </Grid.Column>
        </Grid.Row>
         <Grid.Row>
          <Grid.Column width={16}>
            <Form.Input
              label='Please note if the vehicle has any identifying marks, scratches, bumper stickers, etc.'
              name='vehicleMarkings'
              value={props.tip.vehicleMarkings}
              placeholder='Vehicle markings'
              onChange={props.handleInputChange}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  )
}

TipFormVehicle.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  tip: PropTypes.object.isRequired
}

export default TipFormVehicle