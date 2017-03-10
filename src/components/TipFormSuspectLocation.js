import React from 'react'

const TipFormSuspectLocation = (props) => {
    return (
        <div>
        <div className="form-group">
            <label className="col-sm-6 control-label">Address</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectAddressLine1"
                    placeholder="123 Main Street"
                    value={props.tip.suspectAddressLine1} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Apartment / Unit</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectAddressLine2"
                    placeholder="Apt. 4B"
                    value={props.tip.suspectAddressLine2} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">City</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    name="suspectCity"
                    placeholder="Manhattan"
                    value={props.tip.suspectCity} 
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
                    name="suspectState"
                    value={props.tip.suspectState} 
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
            <label className="col-sm-6 control-label">The suspect has a weapon in the house.</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    type="checkbox"
                    name="suspectHasWeaponInHouse"
                    value={props.tip.suspectHasWeaponInHouse} 
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
                    name="suspectWeaponType"
                    placeholder="Knife / Gun"
                    value={props.tip.suspectHomeWeaponType} 
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
                    name="suspectWeaponLocation"
                    placeholder="In a closet in the bedroom"
                    value={props.tip.suspectHomeWeaponLocation} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">The suspect has a dogs / animals in the house.</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    type="checkbox"
                    name="suspectHasWeaponInHouse"
                    value={props.tip.suspectHasAnimalInHouse} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What kind of animal(s)?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    name="suspectAnimalType"
                    placeholder="Pitbull"
                    value={props.tip.suspectAnimalType} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Where does the suspect hang out?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    name="suspectHangoutLocation"
                    placeholder="On the corner of 1st Street and Avenue X"
                    value={props.tip.suspectHangoutLocation} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">The suspect carries weapons.</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    type="checkbox"
                    name="suspectCarriesWeapon"
                    value={props.tip.suspectCarriesWeapon} 
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
                    name="suspectWeaponType"
                    placeholder="Knife / Gun"
                    value={props.tip.suspectCarryWeaponType} 
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
                    name="suspectWeaponLocation"
                    placeholder="In his/her waistband"
                    value={props.tip.suspectCarryWeaponLocation} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">The suspect is in a gang.</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    type="checkbox"
                    name="suspectInAGang"
                    value={props.tip.suspectInAGang} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Where is the name of the gang?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    name="suspectGangName"
                    placeholder="Bloods"
                    value={props.tip.suspectGangName} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Where did you last see this suspect?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    name="suspectLastKnownLocation"
                    placeholder="123 Main Street"
                    value={props.tip.suspectLastKnownLocation} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">When (date and time) did you last see this suspect?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control"
                    name="suspectLastKnownLocationDate"
                    placeholder="123 Main Street"
                    value={props.tip.suspectLastKnownLocationDate} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        </div>
    )
}

export default TipFormSuspectLocation