import React from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import usStates from '../helpers/state_data'

const TipFormSuspectLocation = (props) => {
    return (
        <div>
            <div className="prompt">Where does the suspect hang out?</div>
            <div>
                <TextField
                    hintText="On the corner of 1st Street"
                    fullWidth={true}
                    value={props.tip.suspectHangoutLocation}
                    onChange={props.handleTextChange.bind(null, "suspectHangoutLocation")}
                />
                </div>
            <br />
            <div className="prompt">What is the suspect's home address?</div>
            <div>
                <TextField
                    hintText="123 Main Street"
                    fullWidth={true}
                    value={props.tip.suspectAddressLine1}
                    onChange={props.handleTextChange.bind(null, "suspectAddressLine1")}
                />
                </div>
            <br />
            <div className="prompt">What is the suspect's apartment number?</div>
            <div>
                <TextField
                    hintText="Apt. 4B"
                    value={props.tip.suspectAddressLine2}
                    onChange={props.handleTextChange.bind(null, "suspectAddressLine2")}
                />
                </div>
            <br />
            <div className="prompt">What city / borough does the suspect live in?</div>
            <div>
                <TextField
                    hintText="Brooklyn"
                    value={props.tip.suspectCity}
                    onChange={props.handleTextChange.bind(null, "suspectCity")}
                />
                </div>
            <br />
            <div className="prompt">What state does the suspect live in?</div>
            <div>
                <SelectField
                    hintText="Select a state"
                    value={props.tip.suspectState}
                    onChange={props.handleSelectChange.bind(null, "suspectState")}
                >
                {Object.keys(usStates).map(key => <MenuItem key={key} value={usStates[key].abbr} primaryText={usStates[key].state} />)}
                </SelectField>
            </div>
            <br />
            <div>
                <Checkbox
                label="The suspect has a weapon in the house."
                style={{marginTop: '16px'}}
                checked={props.tip.suspectHasWeaponInHouse}
                onCheck={props.handleCheckboxChange.bind(null, "suspectHasWeaponInHouse")}
                />
            </div>
            <br />
            { !props.tip.suspectHasWeaponInHouse ? null : 
                <div>
                <div className="prompt">What type of weapon?</div>
                <div>
                    <TextField
                        hintText="Knife"
                        value={props.tip.suspectHomeWeaponType}
                        onChange={props.handleTextChange.bind(null, "suspectHomeWeaponType")}
                    />
                    </div>
                <br />
                <div className="prompt">Where is the weapon kept?</div>
                <div>
                    <TextField
                        hintText="Bedroom closet"
                        value={props.tip.suspectHomeWeaponLocation}
                        onChange={props.handleTextChange.bind(null, "suspectHomeWeaponLocation")}
                    />
                    </div>
                <br />
                </div>
            }
            <div>
                <Checkbox
                label="The suspect has a dogs / animals in the house."
                style={{marginTop: '16px'}}
                checked={props.tip.suspectHasAnimalInHouse}
                onCheck={props.handleCheckboxChange.bind(null, "suspectHasAnimalInHouse")}
                />
            </div>
            <br />
            { !props.tip.suspectHasAnimalInHouse ? null : 
                <div>
                <div className="prompt">What kind of animal(s)?</div>
                <div>
                    <TextField
                        hintText="3 Pitbulls"
                        value={props.tip.suspectAnimalType}
                        onChange={props.handleTextChange.bind(null, "suspectAnimalType")}
                    />
                    </div>
                <br />
                </div>
            }
            <div>
                <Checkbox
                    label="The suspect often carries a weapon."
                    style={{marginTop: '16px'}}
                    checked={props.tip.suspectCarriesWeapon}
                    onCheck={props.handleCheckboxChange.bind(null, "suspectCarriesWeapon")}
                />
            </div>
            <br />
            { !props.tip.suspectCarriesWeapon ? null : 
                <div>
                <div className="prompt">What type of weapon?</div>
                <div>
                    <TextField
                        hintText="Knife"
                        value={props.tip.suspectCarryWeaponType}
                        onChange={props.handleTextChange.bind(null, "suspectCarryWeaponType")}
                    />
                    </div>
                <br />
                <div className="prompt">Where is the weapon kept?</div>
                <div>
                    <TextField
                        hintText="In his waistband"
                        value={props.tip.suspectCarryWeaponLocation}
                        onChange={props.handleTextChange.bind(null, "suspectCarryWeaponLocation")}
                    />
                    </div>
                <br />
                </div>
            }
            <div>
                <Checkbox
                    label="The suspect is in a gang / crew."
                    style={{marginTop: '16px'}}
                    checked={props.tip.suspectInAGang}
                    onCheck={props.handleCheckboxChange.bind(null, "suspectInAGang")}
                />
            </div>
            <br />
            { !props.tip.suspectInAGang ? null : 
                <div>
                <div className="prompt">What is the name of the gang / crew?</div>
                <div>
                    <TextField
                        hintText="Bloods"
                        value={props.tip.suspectGangName}
                        onChange={props.handleTextChange.bind(null, "suspectGangName")}
                    />
                    </div>
                <br />
                </div>
            }
         </div>
    )
}

TipFormSuspectLocation.propTypes = {
  handleTextChange: React.PropTypes.func.isRequired,
  handleSelectChange: React.PropTypes.func.isRequired,
  handleCheckboxChange: React.PropTypes.func.isRequired
}

export default TipFormSuspectLocation