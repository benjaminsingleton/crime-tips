import React, {Component} from 'react'
import {tipTimeFormatLong} from '../helpers/helpers'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import moment from 'moment'
import {firebaseApp, databaseRef} from '../helpers/constants'

export default class TipDetail extends Component {
  constructor() {
    super()
    this.state = {
      uid: firebaseApp.auth().currentUser.uid,
      panelDisplay: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
        9: true
      },
      noteAuthors: {}
    }
    this.togglePanel = this.togglePanel.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.createUserNote = this.createUserNote.bind(this)
    this.displayUserNotes = this.displayUserNotes.bind(this)
  }

  componentDidMount() {
    // get names of note authors
    const tip = this.props.tips[this.props.tipDetail.key]
    const userNoteKeys = tip.userNotes 
                        ? Object.keys(tip.userNotes).filter(key => !tip.userNotes[key].deleted)
                        : null
    
    function getAuthorName(key, uid) {
      const noteAuthors = {...this.state.noteAuthors}
      databaseRef.child(`users/${uid}/account`).once('value', function(snapshot) {
        const user = snapshot.val()
        noteAuthors[key] = `${user.rank} ${user.firstName} ${user.lastName}`
        this.setState({noteAuthors})
      });
    }

    if (userNoteKeys) userNoteKeys.map(key => getAuthorName(key, tip.userNotes[key].uid))
  }

  togglePanel(panelNumber) {
    const panelDisplay = {...this.state.panelDisplay}
    panelDisplay[panelNumber] = !panelDisplay[panelNumber]
    this.setState({panelDisplay})
  }

  handleTextChange = (event) => {this.setState({userNote: event.target.value})}

  createUserNote() {
    databaseRef.child(`tips/${this.props.tipDetail.key}/userNotes/`).push({
      note: this.state.userNote,
      uid: this.state.uid,
      timestamp: Date.now()
    });
    this.setState({userNote: ''})
  }

  deleteUserNote(userNoteKey) {
    databaseRef.child(`tips/${this.props.tipDetail.key}/userNotes/${userNoteKey}`).update({
      deleted: true,
      deleted_timestamp: Date.now()
    })
  }

  displayUserNotes(userNotes) {
    const notDeletedUserNoteKeys = Object.keys(userNotes).filter(key => !userNotes[key].deleted)
    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'},
      actions: {textAlign: 'right'}
    }
    const userNotesToDisplay = notDeletedUserNoteKeys.map(key => 
        <Card style={style.card} key={key}>
          <CardHeader 
            title={`${moment(new Date(userNotes[key].timestamp)).format('MMMM Do YYYY, h:mm a')}`}
            style={style.header} 
          />
          <CardText>
            <p>{userNotes[key].note}</p>
          </CardText>
          {(userNotes[key].uid === this.state.uid)
            ? <CardActions style={style.actions}>
                <RaisedButton 
                  label="Delete" 
                  default={true} 
                  onTouchTap={() => this.deleteUserNote(key)} 
                />
              </CardActions>
            : null
          }
        </Card>
      )

    return userNotesToDisplay
  }

  render() {
    const tip = this.props.tips[this.props.tipDetail.key]
    const userNotes = tip.userNotes ? this.displayUserNotes(tip.userNotes) : null
    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'},
      actions: {textAlign: 'right'}
    }
    return (
      <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        <Card>
          <CardText>
            <h2>Tip Detail</h2>
            <p>Crime Type: {tip.crimeType}</p>
            <p>Date Time: {tipTimeFormatLong(tip.dateTime)}</p>
          </CardText>
          <Divider />
          <Card expanded={this.state.panelDisplay[1]} onExpandChange={() => this.togglePanel(1)} style={style.card}>
            <CardHeader title="1. Tip Summary" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What kind of crime was committed?</span> <b>{tip.crimeType}</b></p>
              <p><span className="detail-prompt">Please tell us the information you wanted to share.</span> <b>{tip.tipText}</b></p>
              <p><span className="detail-prompt">How are you aware of this crime?</span> <b>{tip.tipsterAwareOfCrimeMethod}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[2]} onExpandChange={() => this.togglePanel(2)} style={style.card}>
            <CardHeader title="2. Suspect Description" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What is the suspect's government name?</span> <b>{tip.suspectFullName}</b></p>
              <p><span className="detail-prompt">If the suspect has a nickname, provide it here:</span> <b>{tip.suspectNickname}</b></p>
              <p><span className="detail-prompt">What is the suspect's exact date of birth?</span> <b>{tip.suspectDateOfBirth}</b></p>
              <p><span className="detail-prompt">What is the suspect's age?</span> <b>{tip.suspectAge}</b></p>
              <p><span className="detail-prompt">What is the suspect's gender?</span> <b>{tip.suspectGender}</b></p>
              <p><span className="detail-prompt">What is the suspect's race?</span> <b>{tip.suspectRace}</b></p>
              <p><span className="detail-prompt">What is the suspect's height?</span> <b>{tip.suspectHeight}</b></p>
              <p><span className="detail-prompt">What is the suspect's weight?</span> <b>{tip.suspectWeight}</b></p>
              <p><span className="detail-prompt">What is the suspect's hair color?</span> <b>{tip.suspectHairColor}</b></p>
              <p><span className="detail-prompt">What is the suspect's eye color?</span> <b>{tip.suspectEyeColor}</b></p>
              <p><span className="detail-prompt">If the suspect has tattoos, piercings or markings, please describe them.</span> <b>{tip.suspectTatoosPiercingsMarkings}</b></p>
              <p><span className="detail-prompt">What is the suspect's social media account?</span> <b>{tip.suspectSocialMedia}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[3]} onExpandChange={() => this.togglePanel(3)} style={style.card}>
            <CardHeader title="3. Suspect Location" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">Where does the suspect hang out?</span> <b>{tip.suspectHangoutLocation}</b></p>
              <p><span className="detail-prompt">What is the suspect's home address?</span> <b>{tip.suspectAddressLine1}</b></p>
              <p><span className="detail-prompt">What is the suspect's apartment number?</span> <b>{tip.suspectAddressLine2}</b></p>
              <p><span className="detail-prompt">What city does the suspect live in?</span> <b>{tip.suspectCity}</b></p>
              <p><span className="detail-prompt">What state does the suspect live in?</span> <b>{tip.suspectState}</b></p>
              <p><span className="detail-prompt">The suspect has a weapon in the house.</span> <b>{tip.suspectHasWeaponInHouse}</b></p>
              <p><span className="detail-prompt">What type of weapon?</span> <b>{tip.suspectHomeWeaponType}</b></p>
              <p><span className="detail-prompt">Where is the weapon kept?</span> <b>{tip.suspectHomeWeaponLocation}</b></p>
              <p><span className="detail-prompt">The suspect has a dogs / animals in the house.</span> <b>{tip.suspectHasAnimalInHouse}</b></p>
              <p><span className="detail-prompt">What kind of animal(s)?</span> <b>{tip.suspectAnimalType}</b></p>
              <p><span className="detail-prompt">The suspect often carries a weapon.</span> <b>{tip.suspectCarriesWeapon}</b></p>
              <p><span className="detail-prompt">What type of weapon?</span> <b>{tip.suspectCarryWeaponType}</b></p>
              <p><span className="detail-prompt">Where is the weapon kept?</span> <b>{tip.suspectCarryWeaponLocation}</b></p>
              <p><span className="detail-prompt">The suspect is in a gang / crew.</span> <b>{tip.suspectInAGang}</b></p>
              <p><span className="detail-prompt">What is the name of the gang / crew?</span> <b>{tip.suspectGangName}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[4]} onExpandChange={() => this.togglePanel(4)} style={style.card}>
            <CardHeader title="4. Suspect Employment" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">Who is the suspect's employer?</span> <b>{tip.suspectEmployer}</b></p>
              <p><span className="detail-prompt">What kind of work does the suspect do?</span> <b>{tip.suspectEmploymentType}</b></p>
              <p><span className="detail-prompt">I know the address where the suspect works.</span> <b>{tip.tipsterKnowsEmployerAddress}</b></p>
              <p><span className="detail-prompt">Address Line 1</span> <b>{tip.employerAddressLine1}</b></p>
              <p><span className="detail-prompt">Address Line 2</span> <b>{tip.employerAddressLine2}</b></p>
              <p><span className="detail-prompt">City / Borough</span> <b>{tip.employerCity}</b></p>
              <p><span className="detail-prompt">State</span> <b>{tip.employerState}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[5]} onExpandChange={() => this.togglePanel(5)} style={style.card}>
            <CardHeader title="5. Suspect Vehicle" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What is the vehicle's make?</span> <b>{tip.suspectVehicleMake}</b></p>
              <p><span className="detail-prompt">What is the vehicle's model?</span> <b>{tip.suspectVehicleModel}</b></p>
              <p><span className="detail-prompt">What is the color of the vehicle?</span> <b>{tip.suspectVehicleColor}</b></p>
              <p><span className="detail-prompt">What is the vehicle's license plate number?</span> <b>{tip.suspectVehiclePlateNumber}</b></p>
              <p><span className="detail-prompt">What state is on the license plate?</span> <b>{tip.suspectVehicleState}</b></p>
              <p><span className="detail-prompt">What year was the car made?</span> <b>{tip.suspectVehicleYear}</b></p>
              <p><span className="detail-prompt">Where is the vehicle usually located / parked?</span> <b>{tip.suspectVehicleLocation}</b></p>
              <p><span className="detail-prompt">The suspect keeps a weapon in the vehicle.</span> <b>{tip.suspectHasWeaponInVehicle}</b></p>
              <p><span className="detail-prompt">What type of weapon?</span> <b>{tip.suspectVehicleWeaponType}</b></p>
              <p><span className="detail-prompt">Where is the weapon kept?</span> <b>{tip.suspectVehicleWeaponLocation}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[6]} onExpandChange={() => this.togglePanel(6)} style={style.card}>
            <CardHeader title="6. Drugs" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <p><span className="detail-prompt">What drug is possessed / being sold?</span> <b>{tip.drugTypes}</b></p>
              <p><span className="detail-prompt">How are the drugs being sold?</span> <b>{tip.drugSaleMethod}</b></p>
              <p><span className="detail-prompt">What time of day are drugs sold?</span> <b>{tip.drugSaleTime}</b></p>
              <p><span className="detail-prompt">What is the phone number dialed to buy drugs?</span> <b>{tip.drugSalePhoneNumber}</b></p>
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
              <p><span className="detail-prompt">How did you find out about online crime tips?</span> <b>{tip.tipsterWebsiteDiscoveryMethod}</b></p>
              <p><span className="detail-prompt">I want to be contacted by the police.</span> <b>{tip.tipsterWantsToBeContacted}</b></p>
              <p><span className="detail-prompt">Please provide contact tip.</span> <b>{tip.tipsterContacttip}</b></p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[9]} onExpandChange={() => this.togglePanel(9)} style={style.card}>
            <CardHeader title="** User Notes **" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              {userNotes}
              <TextField
                hintText="Add new note here"
                multiLine={true}
                fullWidth={true}
                value={this.state.userNote}
                onChange={this.handleTextChange}
                style={{marginTop: '14px'}}
              />
              <div style={{textAlign: 'right'}}>
              <RaisedButton label="Add Note" primary={true} onTouchTap={(e) => this.createUserNote(e)}/>
              </div>
            </CardText>
          </Card>
          <CardActions style={{textAlign: 'right'}}>
            <RaisedButton label="Print" default={true} />
            <RaisedButton label="Email" default={true}/>
            <RaisedButton label="Archive" primary={true}/>
          </CardActions>
        </Card>
      </div>
    )
  }
}

TipDetail.propTypes = {
  tipDetail: React.PropTypes.object.isRequired
}