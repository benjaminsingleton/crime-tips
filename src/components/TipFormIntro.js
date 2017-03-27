import React from 'react'
import {redA200} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const TipFormIntro = (props) => {
    return (
        <div>
            <div style={{color: redA200, fontSize: '12px'}}>* Required</div>
            <div className="prompt">What kind of crime was committed?<span className="requiredText">  *</span></div>
            <div>
                <SelectField
                    hintText="Select a crime type"
                    value={props.tip.crimeType}
                    errorText={props.isAdmin ? props.errorText.crimeType : null}
                    onChange={props.handleSelectChange.bind(null, "crimeType")}
                    >
                    <MenuItem value="Murder" primaryText="Murder" />
                    <MenuItem value="Shooting" primaryText="Shooting" />
                    <MenuItem value="Illegal Gun Possession / Sale" primaryText="Illegal Gun Possession / Sale" />
                    <MenuItem value="Rape / Sexual Assault" primaryText="Rape / Sexual Assault" />
                    <MenuItem value="Robbery" primaryText="Robbery" />
                    <MenuItem value="Assault" primaryText="Assault" />
                    <MenuItem value="Drug Sale / Possession" primaryText="Drug Sale / Possession" />
                    <MenuItem value="Human Trafficking / Prostitution" primaryText="Human Trafficking / Prostitution" />
                    <MenuItem value="Other" primaryText="Other" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">Please tell us the information you wanted to share.<span className="requiredText">  *</span></div>
            <div>
                <TextField
                hintText="Tip description"
                multiLine={true}
                fullWidth={true}
                value={props.tip.tipText}
                errorText={props.isAdmin ? props.errorText.crimeType : null}
                onChange={props.handleTextChange.bind(null, "tipText")}
                />
            </div>
            <br />
            <div className="prompt">How are you aware of this crime?<span className="requiredText">  *</span></div>
            <div>
                <SelectField
                hintText="Select a source"
                value={props.tip.tipsterAwareOfCrimeMethod}
                onChange={props.handleSelectChange.bind(null, "tipsterAwareOfCrimeMethod")}
                >
                <MenuItem value="I was a witness" primaryText="I was a witness" />
                <MenuItem value="It happened to me directly" primaryText="It happened to me directly" />
                <MenuItem value="Somebody told me about it" primaryText="Somebody told me about it" />
                <MenuItem value="I overheard a conversation" primaryText="I overheard a conversation" />
                <MenuItem value="I prefer not to answer" primaryText="I prefer not to answer" />
                <MenuItem value="Other" primaryText="Other" />
                </SelectField>
            </div>
            <br />
        </div>
    );
}

TipFormIntro.propTypes = {
  handleSelectChange: React.PropTypes.func.isRequired,
  handleTextChange: React.PropTypes.func.isRequired
}

export default TipFormIntro