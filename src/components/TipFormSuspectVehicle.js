import React from 'react'
import { vehicleMakes, vehicleModels } from '../helpers/vehicle_data'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import usStates from '../helpers/state_data'

const TipFormSuspectVehicle = (props) => {
    return (
        <div>
            <div className="prompt">What is the vehicle's make?</div>
            <div>
                <SelectField
                    hintText="Select a make"
                    value={props.tip.suspectVehicleMake}
                    onChange={props.handleSelectChange.bind(null, "suspectVehicleMake")}
                    >
                    {vehicleMakes.map((make, index) => <MenuItem key={index} value={make} primaryText={make} />)}
                </SelectField>
            </div>
            <br />
            { !props.tip.suspectVehicleMake ? null :
                <div>
                <div className="prompt">What is the vehicle's model?</div>
                <div>
                    <SelectField
                        hintText="Select a make"
                        value={props.tip.suspectVehicleModel}
                        onChange={props.handleSelectChange.bind(null, "suspectVehicleModel")}
                        >
                        {vehicleModels[props.tip.suspectVehicleMake].map((model, index) => <MenuItem key={index} value={model} primaryText={model} />)}
                    </SelectField>
                </div>
                <br />
                </div>
            }
            <div className="prompt">What is the color of the vehicle?</div>
            <div>
                <SelectField
                    hintText="Select a color"
                    value={props.tip.suspectVehicleColor}
                    onChange={props.handleSelectChange.bind(null, "suspectVehicleColor")}
                    >
                    <MenuItem value="White" primaryText="White" />
                    <MenuItem value="Black" primaryText="Black" />
                    <MenuItem value="Silver" primaryText="Silver" />
                    <MenuItem value="Gray" primaryText="Gray" />
                    <MenuItem value="Red" primaryText="Red" />
                    <MenuItem value="Blue" primaryText="Blue" />
                    <MenuItem value="Brown" primaryText="Brown" />
                    <MenuItem value="Green" primaryText="Green" />
                    <MenuItem value="Other" primaryText="Other" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">What is the vehicle's license plate number?</div>
            <div>
                <TextField
                    hintText="AB1234"
                    value={props.tip.suspectVehiclePlateNumber}
                    onChange={props.handleTextChange.bind(null, "suspectVehiclePlateNumber")}
                />
                </div>
            <br />
            <div className="prompt">What state is on the license plate?</div>
            <div>
                <SelectField
                    hintText="Select a state"
                    value={props.tip.suspectVehicleState}
                    onChange={props.handleSelectChange.bind(null, "suspectVehicleState")}
                >
                {Object.keys(usStates).map(key => <MenuItem key={key} value={usStates[key].abbr} primaryText={usStates[key].state} />)}
                </SelectField>
            </div>
            <br />
            <div className="prompt">What year was the car made?</div>
            <div>
                <TextField
                    hintText="2008"
                    value={props.tip.suspectVehicleYear}
                    onChange={props.handleTextChange.bind(null, "suspectVehicleYear")}
                />
                </div>
            <br />
            <div className="prompt">Where is the vehicle usually located / parked?</div>
            <div>
                <TextField
                    hintText="The corner of 1st and Main Street"
                    fullWidth={true}
                    value={props.tip.suspectVehicleLocation}
                    onChange={props.handleTextChange.bind(null, "suspectVehicleLocation")}
                />
                </div>
            <br />
            <div>
                <Checkbox
                label="The suspect keeps a weapon in the vehicle."
                style={{marginTop: '16px'}}
                checked={props.tip.suspectHasWeaponInVehicle}
                onCheck={props.handleCheckboxChange.bind(null, "suspectHasWeaponInVehicle")}
                />
            </div>
            <br />
            { !props.tip.suspectHasWeaponInVehicle ? null : 
                <div>
                <div className="prompt">What type of weapon?</div>
                <div>
                    <TextField
                        hintText="Knife"
                        value={props.tip.suspectVehicleWeaponType}
                        onChange={props.handleTextChange.bind(null, "suspectVehicleWeaponType")}
                    />
                    </div>
                <br />
                <div className="prompt">Where is the weapon kept?</div>
                <div>
                    <TextField
                        hintText="Glove compartment"
                        value={props.tip.suspectVehicleWeaponLocation}
                        onChange={props.handleTextChange.bind(null, "suspectVehicleWeaponLocation")}
                    />
                    </div>
                <br />
                </div>
            }
        </div>
    )
}

TipFormSuspectVehicle.propTypes = {
  handleTextChange: React.PropTypes.func.isRequired,
  handleSelectChange: React.PropTypes.func.isRequired,
  handleCheckboxChange: React.PropTypes.func.isRequired
}

export default TipFormSuspectVehicle