import React from 'react'
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import usStates from '../helpers/state_data'

const TipFormSuspectEmployment = (props) => {
    return (
        <div>
            <div className="prompt">Who is the suspect's employer?</div>
            <div>
                <TextField
                    hintText="Supermarket"
                    value={props.tip.suspectEmployer}
                    onChange={props.handleTextChange.bind(null, "suspectEmployer")}
                />
                </div>
            <br />
            <div className="prompt">What kind of work does the suspect do?</div>
            <div>
                <TextField
                    hintText="He is a cashier"
                    value={props.tip.suspectEmploymentType}
                    onChange={props.handleTextChange.bind(null, "suspectEmploymentType")}
                />
                </div>
            <br />
            <div>
                <Checkbox
                    label="I know the address where the suspect works."
                    style={{marginTop: '16px'}}
                    checked={props.tip.tipsterKnowsEmployerAddress}
                    onCheck={props.handleCheckboxChange.bind(null, "tipsterKnowsEmployerAddress")}
                />
            </div>
            <br />
            { !props.tip.tipsterKnowsEmployerAddress ? null :
                <div>
                <div className="prompt">Address Line 1</div>
                <div>
                    <TextField
                        hintText="123 Main Street"
                        fullWidth={true}
                        value={props.tip.employerAddressLine1}
                        onChange={props.handleTextChange.bind(null, "employerAddressLine1")}
                    />
                    </div>
                <br />
                <div className="prompt">Address Line 2</div>
                <div>
                    <TextField
                        hintText="Apt. 4B"
                        value={props.tip.employerAddressLine2}
                        onChange={props.handleTextChange.bind(null, "employerAddressLine2")}
                    />
                    </div>
                <br />
                <div className="prompt">City / Borough</div>
                <div>
                    <TextField
                        hintText="Brooklyn"
                        value={props.tip.employerCity}
                        onChange={props.handleTextChange.bind(null, "employerCity")}
                    />
                    </div>
                <br />
                <div className="prompt">State</div>
                <div>
                    <SelectField
                        hintText="Select a state"
                        value={props.tip.employerState}
                        onChange={props.handleSelectChange.bind(null, "employerState")}
                    >
                    {Object.keys(usStates).map(key => <MenuItem key={key} value={usStates[key].abbr} primaryText={usStates[key].state} />)}
                    </SelectField>
                </div>
                <br />
                </div>
            }
        </div>
    );
}

TipFormSuspectEmployment.propTypes = {
  handleTextChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired
}

export default TipFormSuspectEmployment