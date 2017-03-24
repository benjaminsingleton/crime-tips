import React from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

const TipFormSuspectDescription = (props) => {
    return (
        <div>
            <div className="prompt">What is the suspect's government name?</div>
            <div>
                <TextField
                    hintText="First and last name"
                    fullWidth={true}
                    value={props.tip.suspectFullName}
                    onChange={props.handleTextChange.bind(null, "suspectFullName")}
                />
            </div>
            <br />
            <div className="prompt">If the suspect has a nickname, provide it here:</div>
            <div>
                <TextField
                    hintText="Nickname"
                    value={props.tip.suspectNickname}
                    onChange={props.handleTextChange.bind(null, "suspectNickname")}
                />
            </div>
            <br />
            <div className="prompt">What is the suspect's exact date of birth?</div>
            <div>
                <DatePicker 
                    hintText="Pick a date"
                    value={props.tip.suspectDateOfBirth}
                    onChange={props.handleTextChange.bind(null, "suspectDateOfBirth")}
                />
            </div>
            <br />
            <div className="prompt">What is the suspect's age?</div>
            <div>
                <TextField
                    hintText="Approximate age"
                    value={props.tip.suspectAge}
                    onChange={props.handleTextChange.bind(null, "suspectAge")}
                />
            </div>
            <br />
            <div className="prompt">What is the suspect's gender?</div>
            <div>
                <SelectField
                    hintText="Select a gender"
                    value={props.tip.suspectGender}
                    onChange={props.handleSelectChange.bind(null, "suspectGender")}
                    >
                    <MenuItem value="Male" primaryText="Male" />
                    <MenuItem value="Female" primaryText="Female" />
                    <MenuItem value="Trans*" primaryText="Trans*" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">What is the suspect's race?</div>
            <div>
                <SelectField
                    hintText="Select a race"
                    value={props.tip.suspectRace}
                    onChange={props.handleSelectChange.bind(null, "suspectRace")}
                    >
                    <MenuItem value="White" primaryText="White" />
                    <MenuItem value="Black / African American" primaryText="Black / African American" />
                    <MenuItem value="White Hispanic" primaryText="White Hispanic" />
                    <MenuItem value="Black Hispanic" primaryText="Black Hispanic" />
                    <MenuItem value="Asian" primaryText="Asian" />
                    <MenuItem value="American Indian /  Alaskan Native" primaryText="American Indian /  Alaskan Native" />
                    <MenuItem value="Native Hawaiian / Pacific Islander" primaryText="Native Hawaiian / Pacific Islander" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">What is the suspect's height?</div>
            <div>
                <SelectField
                    hintText="Select a height"
                    value={props.tip.suspectRace}
                    onChange={props.handleSelectChange.bind(null, "suspectRace")}
                    >
                    <MenuItem value="4' 8''" primaryText="4' 8''" />
                    <MenuItem value="4' 10''" primaryText="4' 10''" />
                    <MenuItem value="5' 0''" primaryText="5' 0''" />
                    <MenuItem value="5' 2''" primaryText="5' 2''" />
                    <MenuItem value="5' 4''" primaryText="5' 4''" />
                    <MenuItem value="5' 6''" primaryText="5' 6''" />
                    <MenuItem value="5' 8''" primaryText="5' 8''" />
                    <MenuItem value="5' 10''" primaryText="5' 10''" />
                    <MenuItem value="6' 0''" primaryText="6' 0''" />
                    <MenuItem value="6' 2''" primaryText="6' 2''" />
                    <MenuItem value="6' 4''" primaryText="6' 4''" />
                    <MenuItem value="6' 6''" primaryText="6' 6''" />
                    <MenuItem value="6' 8''" primaryText="6' 8''" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">What is the suspect's weight?</div>
            <div>
                <TextField
                    hintText="Approximate weight"
                    value={props.tip.suspectWeight}
                    onChange={props.handleTextChange.bind(null, "suspectWeight")}
                />
            </div>
            <br />
            <div className="prompt">What is the suspect's hair color?</div>
            <div>
                <SelectField
                    hintText="Select a color"
                    value={props.tip.suspectHairColor}
                    onChange={props.handleSelectChange.bind(null, "suspectHairColor")}
                >
                    <MenuItem value="Brown" primaryText="Brown" />
                    <MenuItem value="Black" primaryText="Black" />
                    <MenuItem value="Blonde" primaryText="Blonde" />
                    <MenuItem value="White" primaryText="White" />
                    <MenuItem value="Red" primaryText="Red" />
                    <MenuItem value="Gray" primaryText="Gray" />
                    <MenuItem value="Sandy" primaryText="Sandy" />
                    <MenuItem value="Bald" primaryText="Bald" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">What is the suspect's eye color?</div>
            <div>
                <SelectField
                    hintText="Select a color"
                    value={props.tip.suspectEyeColor}
                    onChange={props.handleSelectChange.bind(null, "suspectEyeColor")}
                >
                    <MenuItem value="Brown" primaryText="Brown" />
                    <MenuItem value="Black" primaryText="Black" />
                    <MenuItem value="Blue" primaryText="Blue" />
                    <MenuItem value="Green" primaryText="Green" />
                    <MenuItem value="Hazel" primaryText="Hazel" />
                    <MenuItem value="Amber" primaryText="Amber" />
                    <MenuItem value="Unknown" primaryText="Unknown" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">If the suspect has tattoos, piercings or markings, please describe them.</div>
            <div>
                <TextField
                    hintText="Description"
                    value={props.tip.suspectTatoosPiercingsMarkings}
                    onChange={props.handleTextChange.bind(null, "suspectTatoosPiercingsMarkings")}
                />
            </div>
            <br />
            <div className="prompt">What is the suspect's social media account?</div>
            <div>
                <TextField
                    hintText="https://www.facebook.com/username"
                    fullWidth={true}
                    value={props.tip.suspectSocialMedia}
                    onChange={props.handleTextChange.bind(null, "suspectSocialMedia")}
                />
            </div>
            <br />
        </div>
    )
}

TipFormSuspectDescription.propTypes = {
  handleTextChange: React.PropTypes.func.isRequired,
  handleSelectChange: React.PropTypes.func.isRequired,
}

export default TipFormSuspectDescription