import React, { Component } from 'react'
import { vehicleMakes, vehicleModels } from '../helpers/vehicle_data'

class TipFormSuspectVehicle extends Component {
    constructor() {
        super();
        this.state = {
            showModel: false,
            vehicleModelList: [],
        }
        this.showModel = this.showModel.bind(this)
    }

    showModel(make) {
        const vehicleModelList = vehicleModels[make]
        this.setState({ showModel: true, vehicleModelList: vehicleModelList })
    }

    render() {
        return (
            <div>
            <div className="form-group">
                <label className="col-sm-6 control-label">Make</label>
                <div className="col-sm-6">
                    <select 
                        className="form-control m-b" 
                        name="suspectVehicleMake"
                        value={this.props.tip.suspectVehicleMake} 
                        defaultValue='default' 
                        onChange={(e) => {this.props.handleInputChange(e); this.showModel(e.target.value)}} 
                    >
                        <option value='default' disabled="disabled">Select a make</option>   
                        {vehicleMakes.map((make, index) => <option key={index}>{make}</option>)}
                    </select>
                </div>
            </div>
            <br />
            { this.state.showModel ? 
                <div>
                <div className="form-group">
                    <label className="col-sm-6 control-label">What is the vehicle model?</label>
                    <div className="col-sm-6">
                        <select 
                            className="form-control m-b" 
                            name="suspectVehicleModel"
                            value={this.props.tip.suspectVehicleModel} 
                            defaultValue='default' 
                            onChange={this.props.handleInputChange} 
                        >
                            <option value='default' disabled="disabled">Select a model</option>    
                            {this.state.vehicleModelList.map((model, index) => <option key={index}>{model}</option>)}
                        </select>
                    </div>
                </div>
                <br />
                </div>
            : null
            }
            <div className="form-group">
                <label className="col-sm-6 control-label">What is the vehicle's color?</label>
                <div className="col-sm-6">
                    <select 
                        className="form-control m-b" 
                        name="suspectVehicleColor"
                        value={this.props.tip.suspectVehicleColor} 
                        defaultValue='default' 
                        onChange={this.props.handleInputChange} 
                    >
                        <option value='default' disabled="disabled">Select a color</option>    
                        <option>White</option>
                        <option>Black</option>
                        <option>Silver</option>
                        <option>Gray</option>
                        <option>Red</option>
                        <option>Blue</option>
                        <option>Brown</option>
                        <option>Green</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">What is the vehicle's license plate?</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control" 
                        name="suspectVehicleYear"
                        placeholder="AB1234"
                        value={this.props.tip.suspectVehicleYear} 
                        onChange={this.props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">What is the vehicle's year?</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control" 
                        name="suspectVehicleYear"
                        placeholder="2008"
                        value={this.props.tip.suspectVehicleYear} 
                        onChange={this.props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">State</label>
                <div className="col-sm-6">
                    <select 
                        className="form-control m-b" 
                        name="suspectVehicleState"
                        value={this.props.tip.suspectVehicleState} 
                        defaultValue='default' 
                        onChange={this.props.handleInputChange} 
                    >
                        <option value='default' disabled="disabled">Select a state</option>    
                        <option value="AK">Alaska</option>
                        <option value="AL">Alabama</option>
                        <option value="AR">Arkansas</option>
                        <option value="AZ">Arizona</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DC">District of Columbia</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="IA">Iowa</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MD">Maryland</option>
                        <option value="ME">Maine</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MO">Missouri</option>
                        <option value="MS">Mississippi</option>
                        <option value="MT">Montana</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="NE">Nebraska</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NV">Nevada</option>
                        <option value="NY">New York</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="PR">Puerto Rico</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VA">Virginia</option>
                        <option value="VT">Vermont</option>
                        <option value="WA">Washington</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WV">West Virginia</option>
                        <option value="WY">Wyoming</option>
                        <option value="Unknown">Unknown</option>
                    </select>
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">Where is the vehicle usually located / parked?</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control" 
                        name="suspectVehicleLocation"
                        placeholder="2008"
                        value={this.props.tip.suspectVehicleLocation} 
                        onChange={this.props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">The suspect has a weapon in the vehicle.</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control"
                        type="checkbox"
                        name="suspectHasWeaponInVehicle"
                        value={this.props.tip.suspectHasWeaponInVehicle} 
                        onChange={this.props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">What type of weapon?</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control"
                        name="suspectVehicleWeaponType"
                        placeholder="Knife / Gun"
                        value={this.props.tip.suspectVehicleWeaponType} 
                        onChange={this.props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">Where is the weapon kept?</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control"
                        name="suspectVehicleWeaponLocation"
                        placeholder="In the glove compartment"
                        value={this.props.tip.suspectVehicleWeaponLocation} 
                        onChange={this.props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
            </div>
        )
    }
}

export default TipFormSuspectVehicle