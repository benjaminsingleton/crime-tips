import React from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

const TipFormFinal = (props) => {
    return (
        <div>
        <div className="prompt">How did you find out about online crime tips?</div>
        <div>
            <SelectField
                hintText="Select an option"
                value={props.tip.tipsterWebsiteDiscoveryMethod}
                onChange={props.handleSelectChange.bind(null, "tipsterWebsiteDiscoveryMethod")}
            >
                <MenuItem value="TV" primaryText="TV" />
                <MenuItem value="Google" primaryText="Google" />
                <MenuItem value="Facebook" primaryText="Facebook" />
                <MenuItem value="Twitter" primaryText="Twitter" />
                <MenuItem value="Radio" primaryText="Radio" />
                <MenuItem value="Newspaper" primaryText="Newspaper" />
                <MenuItem value="Word of Mouth" primaryText="Word of Mouth" />
                <MenuItem value="Sign / Billboard" primaryText="Sign / Billboard" />
                <MenuItem value="Other" primaryText="Other" />
            </SelectField>
        </div>
        <br />
        <div>
            <Checkbox
            label="I want to be contacted by the police."
            style={{marginTop: '16px'}}
            checked={props.tip.tipsterWantsToBeContacted}
            onCheck={props.handleCheckboxChange.bind(null, "tipsterWantsToBeContacted")}
            />
        </div>
        <br />
        { !props.tip.tipsterWantsToBeContacted ? null : 
            <div>
            <div className="prompt">Please provide contact details.</div>
            <div>
                <TextField
                    hintText="Contact information"
                    fullWidth={true}
                    value={props.tip.tipsterContactDetails}
                    onChange={props.handleTextChange.bind(null, "tipsterContactDetails")}
                />
            </div>
            <br />
            </div>
        }
        </div>
    );
}

TipFormFinal.propTypes = {
  handleTextChange: React.PropTypes.func.isRequired,
  handleSelectChange: React.PropTypes.func.isRequired,
  handleCheckboxChange: React.PropTypes.func.isRequired
}

export default TipFormFinal