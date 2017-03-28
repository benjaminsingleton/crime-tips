import React, {Component} from 'react'
import {tipTimeFormatLong} from '../helpers/helpers'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

class TipDetail extends Component {

  constructor() {
    super()
    this.state = {
      tip: {},
      panelDisplay: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true
      }
    }
    this.togglePanel = this.togglePanel.bind(this)
  }

  togglePanel(panelNumber) {
    const panelDisplay = {...this.state.panelDisplay}
    panelDisplay[panelNumber] = !panelDisplay[panelNumber]
    this.setState({panelDisplay})
  }

  render() {
    const {details} = this.props;

    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'}
    }

    return (
      <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        <Card>
          <CardText>
            <h2>Tip Detail</h2>
            <p>Crime Type: {details.crimeType}</p>
            <p>Date Time: {tipTimeFormatLong(details.dateTime)}</p>
          </CardText>
          <Divider />
          <Card expanded={this.state.panelDisplay[1]} onExpandChange={() => this.togglePanel(1)} style={style.card}>
            <CardHeader title="1. Tip Summary" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What kind of crime was committed?</span> <b>{details.crimeType}</b></p>
              <p><span className="detail-prompt">Please tell us the information you wanted to share.</span> <b>{details.tipText}</b></p>
              <p><span className="detail-prompt">How are you aware of this crime?</span> <b>{details.tipsterAwareOfCrimeMethod}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[2]} onExpandChange={() => this.togglePanel(2)} style={style.card}>
            <CardHeader title="2. Suspect Description" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What is the suspect's government name?</span> <b>{details.suspectFullName}</b></p>
              <p><span className="detail-prompt">If the suspect has a nickname, provide it here:</span> <b>{details.suspectNickname}</b></p>
              <p><span className="detail-prompt">What is the suspect's exact date of birth?</span> <b>{details.suspectDateOfBirth}</b></p>
              <p><span className="detail-prompt">What is the suspect's age?</span> <b>{details.suspectAge}</b></p>
              <p><span className="detail-prompt">What is the suspect's gender?</span> <b>{details.suspectGender}</b></p>
              <p><span className="detail-prompt">What is the suspect's race?</span> <b>{details.suspectRace}</b></p>
              <p><span className="detail-prompt">What is the suspect's height?</span> <b>{details.suspectHeight}</b></p>
              <p><span className="detail-prompt">What is the suspect's weight?</span> <b>{details.suspectWeight}</b></p>
              <p><span className="detail-prompt">What is the suspect's hair color?</span> <b>{details.suspectHairColor}</b></p>
              <p><span className="detail-prompt">What is the suspect's eye color?</span> <b>{details.suspectEyeColor}</b></p>
              <p><span className="detail-prompt">If the suspect has tattoos, piercings or markings, please describe them.</span> <b>{details.suspectTatoosPiercingsMarkings}</b></p>
              <p><span className="detail-prompt">What is the suspect's social media account?</span> <b>{details.suspectSocialMedia}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[3]} onExpandChange={() => this.togglePanel(3)} style={style.card}>
            <CardHeader title="3. Suspect Location" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">Where does the suspect hang out?</span> <b>{details.suspectHangoutLocation}</b></p>
              <p><span className="detail-prompt">What is the suspect's home address?</span> <b>{details.suspectAddressLine1}</b></p>
              <p><span className="detail-prompt">What is the suspect's apartment number?</span> <b>{details.suspectAddressLine2}</b></p>
              <p><span className="detail-prompt">What city does the suspect live in?</span> <b>{details.suspectCity}</b></p>
              <p><span className="detail-prompt">What state does the suspect live in?</span> <b>{details.suspectState}</b></p>
              <p><span className="detail-prompt">The suspect has a weapon in the house.</span> <b>{details.suspectHasWeaponInHouse}</b></p>
              <p><span className="detail-prompt">What type of weapon?</span> <b>{details.suspectHomeWeaponType}</b></p>
              <p><span className="detail-prompt">Where is the weapon kept?</span> <b>{details.suspectHomeWeaponLocation}</b></p>
              <p><span className="detail-prompt">The suspect has a dogs / animals in the house.</span> <b>{details.suspectHasAnimalInHouse}</b></p>
              <p><span className="detail-prompt">What kind of animal(s)?</span> <b>{details.suspectAnimalType}</b></p>
              <p><span className="detail-prompt">The suspect often carries a weapon.</span> <b>{details.suspectCarriesWeapon}</b></p>
              <p><span className="detail-prompt">What type of weapon?</span> <b>{details.suspectCarryWeaponType}</b></p>
              <p><span className="detail-prompt">Where is the weapon kept?</span> <b>{details.suspectCarryWeaponLocation}</b></p>
              <p><span className="detail-prompt">The suspect is in a gang / crew.</span> <b>{details.suspectInAGang}</b></p>
              <p><span className="detail-prompt">What is the name of the gang / crew?</span> <b>{details.suspectGangName}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[4]} onExpandChange={() => this.togglePanel(4)} style={style.card}>
            <CardHeader title="4. Suspect Employment" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">Who is the suspect's employer?</span> <b>{details.suspectEmployer}</b></p>
              <p><span className="detail-prompt">What kind of work does the suspect do?</span> <b>{details.suspectEmploymentType}</b></p>
              <p><span className="detail-prompt">I know the address where the suspect works.</span> <b>{details.tipsterKnowsEmployerAddress}</b></p>
              <p><span className="detail-prompt">Address Line 1</span> <b>{details.employerAddressLine1}</b></p>
              <p><span className="detail-prompt">Address Line 2</span> <b>{details.employerAddressLine2}</b></p>
              <p><span className="detail-prompt">City / Borough</span> <b>{details.employerCity}</b></p>
              <p><span className="detail-prompt">State</span> <b>{details.employerState}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[5]} onExpandChange={() => this.togglePanel(5)} style={style.card}>
            <CardHeader title="5. Suspect Vehicle" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What is the vehicle's make?</span> <b>{details.suspectVehicleMake}</b></p>
              <p><span className="detail-prompt">What is the vehicle's model?</span> <b>{details.suspectVehicleModel}</b></p>
              <p><span className="detail-prompt">What is the color of the vehicle?</span> <b>{details.suspectVehicleColor}</b></p>
              <p><span className="detail-prompt">What is the vehicle's license plate number?</span> <b>{details.suspectVehiclePlateNumber}</b></p>
              <p><span className="detail-prompt">What state is on the license plate?</span> <b>{details.suspectVehicleState}</b></p>
              <p><span className="detail-prompt">What year was the car made?</span> <b>{details.suspectVehicleYear}</b></p>
              <p><span className="detail-prompt">Where is the vehicle usually located / parked?</span> <b>{details.suspectVehicleLocation}</b></p>
              <p><span className="detail-prompt">The suspect keeps a weapon in the vehicle.</span> <b>{details.suspectHasWeaponInVehicle}</b></p>
              <p><span className="detail-prompt">What type of weapon?</span> <b>{details.suspectVehicleWeaponType}</b></p>
              <p><span className="detail-prompt">Where is the weapon kept?</span> <b>{details.suspectVehicleWeaponLocation}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[6]} onExpandChange={() => this.togglePanel(6)} style={style.card}>
            <CardHeader title="6. Drugs" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What drug is possessed / being sold?</span> <b>{details.drugTypes}</b></p>
              <p><span className="detail-prompt">How are the drugs being sold?</span> <b>{details.drugSaleMethod}</b></p>
              <p><span className="detail-prompt">What time of day are drugs sold?</span> <b>{details.drugSaleTime}</b></p>
              <p><span className="detail-prompt">What is the phone number dialed to buy drugs?</span> <b>{details.drugSalePhoneNumber}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[7]} onExpandChange={() => this.togglePanel(7)} style={style.card}>
            <CardHeader title="7. Media" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p>Media goes here.</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[8]} onExpandChange={() => this.togglePanel(8)} style={style.card}>
            <CardHeader title="8. Conclusion" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">How did you find out about online crime tips?</span> <b>{details.tipsterWebsiteDiscoveryMethod}</b></p>
              <p><span className="detail-prompt">I want to be contacted by the police.</span> <b>{details.tipsterWantsToBeContacted}</b></p>
              <p><span className="detail-prompt">Please provide contact details.</span> <b>{details.tipsterContactDetails}</b></p>
            </CardText>
          </Card>
          <CardActions style={{textAlign: 'right'}}>
            <RaisedButton label="Print" default={true}/>
            <RaisedButton label="Email" default={true}/>
            <RaisedButton label="Archive" primary={true}/>
          </CardActions>
        </Card>
      </div>
    )
  }
}

TipDetail.propTypes = {
  details: React.PropTypes.object.isRequired
}

export default TipDetail;