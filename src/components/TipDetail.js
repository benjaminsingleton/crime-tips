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
    if (prevState.tip !== this.state.tip) {
      // get names of note authors
      const userNotes = this.state.tip.userNotes
      const userNoteKeys = userNotes ? Object.keys(userNotes).filter(key => !userNotes[key].deleted) : null
      const noteAuthors = {...this.state.noteAuthors}

      if (userNoteKeys) userNoteKeys.map(key => 
        firebaseApp.database().ref(`users/${userNotes[key].uid}`).once('value', (snapshot) => {
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

  createUserNote = (e) => {
    e.preventDefault()
    firebaseApp.database().ref(`tips/${this.props.tipDetailKey}/userNotes/`).push({
      note: this.state.userNote,
      uid: this.state.uid,
      timestamp: Date.now()
    });
    this.setState({userNote: ''})
  }

  deleteUserNote = (userNoteKey) => {
    firebaseApp.database().ref(`tips/${this.props.tipDetailKey}/userNotes/${userNoteKey}`).update({
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
        <Card fluid style={style.card} key={key}>
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
                  content="Delete" 
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
              <p>What kind of crime was committed? <b>{tip.crimeType}</b></p>
              <p>Please tell us the information you wanted to share. <b>{tip.tipText}</b></p>
              <p>Where did the crime take place? <b>{tip.crimeLocation}</b></p>
              <p>When did the crime occur? <b>{tip.crimeDate}</b></p>
              <p>How many suspects were involved? <b>{tip.numberOfSuspects}</b></p>
              <p>How many vehicles were involved? <b>{tip.numberOfVehicles}</b></p>
              <p>I have media to upload. <b>{tip.tipsterHasMedia}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="2. Suspect(s)" style={style.header} />
            <Card.Content>
              <p>Full name: <b>{tip.suspectFullName}</b></p>
              <p>Nickname / alias: <b>{tip.suspectNickname}</b></p>
              <p>Date of Birth: <b>{tip.suspectDateOfBirth}</b></p>
              <p>Approximate Age: <b>{tip.suspectAge}</b></p>
              <p>Gender: <b>{tip.suspectGender}</b></p>
              <p>Race: <b>{tip.suspectRace}</b></p>
              <p>Height: <b>{tip.suspectHeight}</b></p>
              <p>Weight: <b>{tip.suspectWeight}</b></p>
              <p>Hair Color: <b>{tip.suspectHairColor}</b></p>
              <p>Eye Color: <b>{tip.suspectEyeColor}</b></p>
              <p>Home Address: <b>{tip.suspectAddress}</b></p>
              <p>City: <b>{tip.suspectCity}</b></p>
              <p>State: <b>{tip.suspectState}</b></p>
              <p>Phone Number: <b>{tip.suspectPhone}</b></p>
              <p>Scars, Marks, Tattoos, Piercings: <b>{tip.suspectMarkings}</b></p>
              <p>Gang: <b>{tip.suspectGang}</b></p>
              <p>Social Media: <b>{tip.suspectSocialMedia}</b></p>
              <p>Does the suspect carry weapons? What kind? <b>{tip.suspectWeapon}</b></p>
              <p>Place of employment: <b>{tip.suspectWeapon}</b></p>
              <p>Is there anything else we should know about the suspect? <b>{tip.suspectComments}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="3. Vehicle(s)" style={style.header} />
            <Card.Content>
              <p>Make: <b>{tip.suspectVehicleMake}</b></p>
              <p>Model: <b>{tip.suspectVehicleModel}</b></p>
              <p>Color: <b>{tip.suspectVehicleColor}</b></p>
              <p>License Plate Number: <b>{tip.suspectVehiclePlateNumber}</b></p>
              <p>Where can the vehicle usually be found? <b>{tip.suspectVehicleLocation}</b></p>
              <p>Please note if the vehicle has any identifying marks, scratches, bumper stickers, etc. <b>{tip.suspectVehicleMarkings}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="4. Drugs" style={style.header} />
            <Card.Content>
              <p>What drug is possessed / being sold? <b>{tip.drugTypes}</b></p>
              <p>How are the drugs being sold? <b>{tip.drugSaleMethod}</b></p>
              <p>What time of day are drugs sold? <b>{tip.drugSaleTime}</b></p>
              <p>What is the phone number dialed to buy drugs? <b>{tip.drugSalePhoneNumber}</b></p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="5. Media" style={style.header} />
            <Card.Content>
              <p>Media goes here.</p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="6. Final" style={style.header} />
            <Card.Content>
              <p>How did you find out about online crime tips? <b>{tip.tipsterWebsiteDiscoveryMethod}</b></p>
              <p>I want to be contacted by the police. <b>{tip.tipsterWantsToBeContacted}</b></p>
              <p>Please provide contact tip. <b>{tip.tipsterContacttip}</b></p>
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