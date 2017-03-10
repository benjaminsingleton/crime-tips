import React from 'react'

const TipFormSuspectEmployment = (props) => {
    return (
        <div>
        <div className="form-group">
            <label className="col-sm-6 control-label">Employer</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectEmployer"
                    placeholder="123 Main Street"
                    value={props.tip.suspectEmployer} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Address Line 1</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectEmployerAddressLine1"
                    placeholder="123 Main Street"
                    value={props.tip.suspectEmployerAddressLine1} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Address Line 2</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectEmployerAddressLine2"
                    placeholder="Suite 1200"
                    value={props.tip.suspectEmployerAddressLine2} 
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
                    name="suspectEmployerCity"
                    placeholder="Manhattan"
                    value={props.tip.suspectEmployerCity} 
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
                    name="suspectEmployerState"
                    value={props.tip.suspectEmployerState} 
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
            <label className="col-sm-6 control-label">What kind of work does the suspect do?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectEmploymentType"
                    placeholder="He works in a store"
                    value={props.tip.suspectEmploymentType} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        </div>
    );
}

export default TipFormSuspectEmployment