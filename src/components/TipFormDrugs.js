import React from 'react'
import {gray500} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

const TipFormDrugs = (props) => {
    return (
        <div>
            <div style={{color: gray500, fontSize: '12px'}}>
                All of our questions are optional so feel free to skip any questions you can’t answer. 
                That said, the more details you can provide, the better we can do our job.
            </div>
            <div className="prompt">What drug is possessed / being sold?</div>
            <div>
                <SelectField
                    hintText="Select a drug"
                    value={props.tip.drugTypes}
                    onChange={props.handleSelectChange.bind(null, "drugTypes")}
                    >
                    <MenuItem value="Marijuana" primaryText="Marijuana" />
                    <MenuItem value="Cocaine" primaryText="Cocaine" />
                    <MenuItem value="Crack" primaryText="Crack" />
                    <MenuItem value="Methamphetamine" primaryText="Methamphetamine" />
                    <MenuItem value="Pills" primaryText="Pills" />
                    <MenuItem value="Other" primaryText="Other" />
                </SelectField>
            </div>
            <br />
            <div>
                <SelectField
                    hintText="Select a drug"
                    value={props.tip.drugTypes}
                    onChange={props.handleSelectChange.bind(null, "drugTypes")}
                    >
                    <MenuItem value="On the street" primaryText="On the street" />
                    <MenuItem value="In an apartment / house" primaryText="In an apartment / house" />
                    <MenuItem value="From a vehicle" primaryText="From a vehicle" />
                    <MenuItem value="Other" primaryText="Other" />
                </SelectField>
            </div>
            <br />
            <div className="prompt">What time of day are drugs sold?</div>
            <div>
                <TextField
                    hintText="10am-4pm on weekdays"
                    value={props.tip.drugSaleTime}
                    onChange={props.handleTextChange.bind(null, "drugSaleTime")}
                />
                </div>
            <br />
            <div className="prompt">What is the phone number dialed to buy drugs?</div>
            <div>
                <TextField
                    hintText="917-123-4567"
                    value={props.tip.drugSalePhoneNumber}
                    onChange={props.handleTextChange.bind(null, "drugSalePhoneNumber")}
                />
                </div>
            <br />
        </div>
    );
}

export default TipFormDrugs