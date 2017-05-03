import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Card, Form, Button } from 'semantic-ui-react'
import _ from 'underscore'
import moment from 'moment'
import { tipTimeFormatLong } from '../helpers/helpers'
import { firebaseApp } from '../helpers/firebase'

export default class TipDetail extends Component {
  state = {
    uid: firebaseApp.auth().currentUser.uid,
    tip: {},
    noteAuthors: {}
  }

  componentWillMount = () => {
    firebaseApp.database().ref(`tips/${this.props.tipDetailKey}`).on('value', (snapshot) => {
        const tip = snapshot.val()
        this.setState({tip})
    });
  }

  componentWillUnmount = () => firebaseApp.database().ref(`tips/${this.props.tipDetailKey}`).off();

  componentDidUpdate(prevProps, prevState) {
    if (_.isEmpty(prevState.tip) && !_.isEmpty(this.state.tip)) {
      // get names of note authors
      const userNotes = this.state.tip.userNotes
      const userNoteKeys = userNotes ? Object.keys(userNotes).filter(key => !userNotes[key].deleted) : null
      const noteAuthors = {...this.state.noteAuthors}

      if (userNoteKeys) userNoteKeys.map(key => 
        firebaseApp.database().ref(`users/${userNotes[key].uid}/account`).once('value', (snapshot) => {
          const user = snapshot.val()
          noteAuthors[key] = `${user.rank} ${user.firstName} ${user.lastName}`
          this.setState({noteAuthors})
        })
      )
    }
  }

  togglePanel = (panelNumber) => {
    const panelDisplay = {...this.state.panelDisplay}
    panelDisplay[panelNumber] = !panelDisplay[panelNumber]
    this.setState({panelDisplay})
  }

  handleTextChange = (event) => {this.setState({userNote: event.target.value})}

  createUserNote = () => {
    firebaseApp.database().ref(`tips/${this.props.tipDetail.key}/userNotes/`).push({
      note: this.state.userNote,
      uid: this.state.uid,
      timestamp: Date.now()
    });
    this.setState({userNote: ''})
  }

  deleteUserNote = (userNoteKey) => {
    firebaseApp.database().ref(`tips/${this.props.tipDetail.key}/userNotes/${userNoteKey}`).update({
      deleted: true,
      deleted_timestamp: Date.now()
    })
  }

  displayUserNotes = (userNotes) => {
    const notDeletedUserNoteKeys = Object.keys(userNotes).filter(key => !userNotes[key].deleted)
    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'},
      actions: {textAlign: 'right'}
    }
    const userNotesToDisplay = notDeletedUserNoteKeys.map(key => 
        <Card style={style.card} key={key}>
          <Card.Content 
            header={`${this.state.noteAuthors[key]}, ${moment(new Date(userNotes[key].timestamp)).format('MMMM Do YYYY, h:mm a')}`}
            style={style.header} 
          />
          <Card.Content>
            <p>{userNotes[key].note}</p>
          </Card.Content>
          {(userNotes[key].uid === this.state.uid)
            ? <Card.Content style={style.actions}>
                <Button 
                  label="Delete" 
                  onClick={() => this.deleteUserNote(key)} 
                />
              </Card.Content>
            : null
          }
        </Card>
      )

    return userNotesToDisplay
  }

  render() {
    const tip = this.state.tip
    const userNotes = tip.userNotes ? this.displayUserNotes(tip.userNotes) : null
    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'},
      actions: {textAlign: 'right'}
    }
    return (
      <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        <Card fluid>
          <Card.Content>
            <h2>Tip Detail</h2>
            <p>Crime Type: {tip.crimeType}</p>
            <p>Date Time: {tipTimeFormatLong(tip.dateTime)}</p>
          </Card.Content>
          <Card fluid style={style.card}>
            <Card.Content header="1. Incident" style={style.header} />
            <Card.Content>
              <p><span className="detail-prompt">What kind of crime was committed?</span> <b>{tip.crimeType}</b></p>
              <p><span className="detail-prompt">Please tell us the information you wanted to share.</span> <b>{tip.tipText}</b></p>
              <p><span className="detail-prompt">How are you aware of this crime?</span> <b>{tip.tipsterAwareOfCrimeMethod}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="2. Suspect" style={style.header} />
            <Card.Content>
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
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="3. Vehicle" style={style.header} />
            <Card.Content>
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
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="4. Drugs" style={style.header} />
            <Card.Content>
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
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="5. Media" style={style.header} />
            <Card.Content>
              <p><span className="detail-prompt">What drug is possessed / being sold?</span> <b>{tip.drugTypes}</b></p>
              <p><span className="detail-prompt">How are the drugs being sold?</span> <b>{tip.drugSaleMethod}</b></p>
              <p><span className="detail-prompt">What time of day are drugs sold?</span> <b>{tip.drugSaleTime}</b></p>
              <p><span className="detail-prompt">What is the phone number dialed to buy drugs?</span> <b>{tip.drugSalePhoneNumber}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="6. Final" style={style.header} />
            <Card.Content>
              <p>Media goes here.</p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="7. Conclusion" style={style.header} />
            <Card.Content>
              <p><span className="detail-prompt">How did you find out about online crime tips?</span> <b>{tip.tipsterWebsiteDiscoveryMethod}</b></p>
              <p><span className="detail-prompt">I want to be contacted by the police.</span> <b>{tip.tipsterWantsToBeContacted}</b></p>
              <p><span className="detail-prompt">Please provide contact tip.</span> <b>{tip.tipsterContacttip}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="** User Notes **" style={style.header} />
            <Card.Content>
              {userNotes}
              <Form onSubmit={(e) => this.createUserNote(e)}>
              <Form.TextArea
                placeholder="Add new note here"
                value={this.state.userNote}
                onChange={this.handleTextChange}
                style={{marginTop: '14px'}}
              />
              <div style={{textAlign: 'right'}}>
                <Form.Button content="Add Note" color='violet' />
              </div>
              </Form>
            </Card.Content>
          </Card>
          <Card.Content>
          </Card.Content>
        </Card>
      </div>
    )
  }
}

TipDetail.propTypes = {
  tipDetailKey: PropTypes.string.isRequired
}