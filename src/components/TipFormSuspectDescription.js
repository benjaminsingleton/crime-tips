import React from 'react'

const TipFormSuspectDescription = (props) => {
    return (
        <div className="ibox">
            <div className="ibox-title">
                <h5>{props.title}</h5>
            </div>
            <div className="ibox-content">
                <form onSubmit={(e) => props.createTip(e)}>
                    <p>What is the suspect's government name?</p>
                    <input 
                        className="form-control" 
                        name="suspectFirstName"
                        placeholder="First Name"
                        value={props.tip.suspectFirstName} 
                        onChange={props.handleInputChange} 
                    />
                    <input 
                        className="form-control" 
                        name="suspectLastName"
                        placeholder="Last Name"
                        value={props.tip.suspectLastName}
                        onChange={props.handleInputChange} 
                    />
                    <br />
                    <p>If the suspect has a nickname, provide it here:</p>
                    <input 
                        className="form-control" 
                        name="suspectNickname"
                        placeholder="Nickname"
                        value={props.tip.suspectNickname} 
                        onChange={props.handleInputChange} 
                    />
                    <br />
                    <p>What is the suspect's exact date of birth? 
                        Skip to the next question if you're not sure and instead provide an approximate age.</p>
                    <input 
                        className="form-control" 
                        name="suspectApproxAge"
                        placeholder="Date of Birth"
                        value={props.tip.suspectApproxAge} 
                        onChange={props.handleInputChange} 
                    />
                    <br />
                    <p>What is the suspect's approximate age?</p>
                    <input 
                        className="form-control" 
                        name="suspectApproxAge"
                        placeholder="Approximate Age"
                        value={props.tip.suspectApproxAge} 
                        onChange={props.handleInputChange} 
                    />
                    <br />
                    <p>What is the suspect's gender?</p>
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
                    <br />
                    <p>What is the suspect's race?</p>
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
                    <br />
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <div className="pull-right">
                            <button 
                                className="btn btn-prev" 
                                onClick={() => props.changeStep('previous')}
                            >
                                Previous
                            </button>
                            <button 
                                className="btn btn-primary btn-next" 
                                onClick={() => props.changeStep('next')}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TipFormSuspectDescription