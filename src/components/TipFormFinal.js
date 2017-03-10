import React from 'react'

const TipFormFinal = (props) => {
    return (
        <div>
            <div className="form-group">
                <label className="col-sm-6 control-label">How did you find out about online crime tips? </label>
                <div className="col-sm-6">
                    <select 
                        className="form-control m-b" 
                        value={props.tip.tipsterWebsiteDiscoveryMethod} 
                        defaultValue='default'
                        name="tipsterWebsiteDiscoveryMethod"
                        onChange={props.handleInputChange} 
                    >
                        <option value='default' disabled="disabled">Select a method</option>  
                        <option>TV</option>  
                        <option>Google</option>
                        <option>Facebook</option>
                        <option>Twitter</option>
                        <option>Radio</option>
                        <option>Newspaper</option>
                        <option>Word of Mouth</option>
                        <option>Sign / Billboard</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <br/>
            <div className="form-group">
                <label className="col-sm-6 control-label">How would you like to be contacted?</label>
                <div className="col-sm-6">
                    <div><label>
                        <input checked="" value="Yes" id="optionsRadios1" name="tipsterWantsToBeContacted" type="radio" /> Yes
                    </label></div>
                    <div><label>
                        <input value="No" id="optionsRadios2" name="tipsterWantsToBeContacted" type="radio" /> No
                        </label></div>
                </div>
            </div>
            <br />
            <div className="form-group">
                <label className="col-sm-6 control-label">How would you like to be contacted?</label>
                <div className="col-sm-6">
                    <select 
                        className="form-control m-b" 
                        value={props.tip.tipsterContactMethod} 
                        defaultValue='default'
                        name="tipsterContactMethod"
                        onChange={props.handleInputChange} 
                    >
                        <option value='default' disabled="disabled">Select a method</option>  
                        <option>Phone</option>  
                        <option>Email</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-6 control-label">Please provide contact information.</label>
                <div className="col-sm-6">
                    <input 
                        className="form-control" 
                        name="tipsterContactDetails"
                        placeholder="Email / Phone / Other"
                        value={props.tip.tipsterContactDetails} 
                        onChange={props.handleInputChange} 
                    />
                </div>
            </div>
            <br />
        </div>
    );
}

export default TipFormFinal