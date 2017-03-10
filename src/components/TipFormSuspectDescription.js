import React from 'react'

const TipFormSuspectDescription = (props) => {
    return (
        <div>
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's government name?</label>
            <div className="col-sm-3">
                    <input 
                    className="form-control" 
                    name="suspectFirstName"
                    placeholder="First Name"
                    value={props.tip.suspectFirstName} 
                    onChange={props.handleInputChange} 
                />
            </div>
                <div className="col-sm-3">
                    <input 
                    className="form-control" 
                    name="suspectLastName"
                    placeholder="Last Name"
                    value={props.tip.suspectLastName}
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">If the suspect has a nickname, provide it here:</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectNickname"
                    placeholder="Nickname"
                    value={props.tip.suspectNickname} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's exact date of birth?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectApproxAge"
                    placeholder="Date of Birth"
                    value={props.tip.suspectApproxAge} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's age?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectAge"
                    placeholder="Age"
                    value={props.tip.suspectAge} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's gender?</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectGender"
                    value={props.tip.suspectGender} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a gender</option>    
                    <option>Male</option>
                    <option>Female</option>
                    <option>Trans*</option>
                </select>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's race?</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectRace"
                    value={props.tip.suspectRace} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a race</option>    
                    <option>White</option>
                    <option>Black / African American</option>
                    <option>White Hispanic</option>
                    <option>Black Hispanic</option>
                    <option>Asian</option>
                    <option>American Indian /  Alaskan Native</option>
                    <option>Native Hawaiian / Pacific Islander</option>
                </select>
            </div>
        </div>
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's height?</label>
            <div className="col-sm-3">
                    <input 
                    className="form-control" 
                    name="suspectHeightFeet"
                    placeholder="Feet"
                    value={props.tip.suspectHeightFeet} 
                    onChange={props.handleInputChange} 
                />
            </div>
                <div className="col-sm-3">
                    <input 
                    className="form-control" 
                    name="suspectHeightInches"
                    placeholder="Inches"
                    value={props.tip.suspectHeightInches}
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's weight?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectWeight"
                    placeholder="Weight"
                    value={props.tip.suspectWeight} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's hair color?</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectHairColor"
                    value={props.tip.suspectHairColor} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a color</option>    
                    <option>Brown</option>
                    <option>Black</option>
                    <option>Blonde</option>
                    <option>White</option>
                    <option>Red</option>
                    <option>Gray</option>
                    <option>Sandy</option>
                    <option>Bald</option>
                    <option>Unknown</option>
                </select>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's eye color?</label>
            <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="suspectEyeColor"
                    value={props.tip.suspectEyeColor} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a color</option>    
                    <option>Brown</option>
                    <option>Black</option>
                    <option>Blue</option>
                    <option>Green</option>
                    <option>Hazel</option>
                    <option>Amber</option>
                    <option>Unknown</option>
                </select>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">If the suspect has tattoos, piercings or markings, 
                please describe them.</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectTatoosPiercingsMarkings"
                    placeholder="Tattoo / Piercing / Marking Description"
                    value={props.tip.suspectTatoosPiercingsMarkings} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the suspect's social media account?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="suspectSocialMedia"
                    placeholder="https://www.facebook.com/username"
                    value={props.tip.suspectSocialMedia} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        </div>
    )
}

export default TipFormSuspectDescription