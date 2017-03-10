import React from 'react'

const TipFormSuspectVehicle = (props) => {
    return (
        <div>
        <div className="form-group">
            <label className="col-sm-6 control-label">Make</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectVehicleMake"
                    value={props.tip.suspectVehicleMake} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a make</option>    
                    <option>Brown</option>
                    <option>Black</option>
                    <option>Blonde</option>
                    <option>White</option>
                    <option>Red</option>
                    <option>Gray</option>
                    <option>Sandy</option>
                    <option>Bald</option>
                    <option>Unknown</option>
                    <option>Acura</option>
                    <option>Alfa Romeo</option>
                    <option>Aston Martin</option>
                    <option>Audi</option>
                    <option>Bentley</option>
                    <option>BMW</option>
                    <option>Bugatti</option>
                    <option>Buick</option>
                    <option>Cadillac</option>
                    <option>Chevrolet</option>
                    <option>Chrysler</option>
                    <option>Citroen</option>
                    <option>Dodge</option>
                    <option>Ferrari</option>
                    <option>Fiat</option>
                    <option>Ford</option>
                    <option>GM (General Motors)</option>
                    <option>GMC</option>
                    <option>Honda</option>
                    <option>Hyundai</option>
                    <option>Infiniti</option>
                    <option>Jaguar</option>
                    <option>Jeep</option>
                    <option>Kia</option>
                    <option>Land Rover</option>
                    <option>Lexus</option>
                    <option>Maserati</option>
                    <option>Mazda</option>
                    <option>Mercedes-Benz</option>
                    <option>Mini</option>
                    <option>Mitsubishi</option>
                    <option>Nissa</option>
                    <option>Peugeot</option>
                    <option>Porsche</option>
                    <option>Ram</option>
                    <option>Renault</option>
                    <option>Saab</option>
                    <option>Subaru</option>
                    <option>Suzuki</option>
                    <option>Tesla</option>
                    <option>Toyota</option>
                    <option>Volkswagen</option>
                    <option>Volvo</option>
                </select>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the vehicle model?</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectVehicleModel"
                    value={props.tip.suspectVehicleModel} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a model</option>    
                    <option>X</option>
                    <option>X</option>
                    <option>X</option>
                    <option>X</option>
                </select>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the vehicle's color?</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectVehicleColor"
                    value={props.tip.suspectVehicleColor} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
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
                    placeholder="2008"
                    value={props.tip.suspectVehicleYear} 
                    onChange={props.handleInputChange} 
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
                    value={props.tip.suspectVehicleYear} 
                    onChange={props.handleInputChange} 
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
                    value={props.tip.suspectVehicleState} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
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
                    value={props.tip.suspectVehicleLocation} 
                    onChange={props.handleInputChange} 
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
                    value={props.tip.suspectHasWeaponInVehicle} 
                    onChange={props.handleInputChange} 
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
                    value={props.tip.suspectVehicleWeaponType} 
                    onChange={props.handleInputChange} 
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
                    value={props.tip.suspectVehicleWeaponLocation} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        </div>
    );
}

export default TipFormSuspectVehicle