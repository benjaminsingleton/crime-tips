import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'
import {databaseRef, firebaseApp} from '../helpers/constants'
import {relativeTime, reverse} from '../helpers/helpers'

export default class UserSettings extends Component {
  constructor () {
    super()
    this.state = {
      rank: null,
      firstName: null,
      lastName: null,
      notifications: true,
      newPassword: '',
      newPasswordRepeat: '',
      passwordMsg: '',
      newEmail: '',
      newEmailRepeat: '',
      emailMsg: ''
    }
    this.onToggle = this.onToggle.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.changeEmail = this.changeEmail.bind(this)
  }

  componentDidMount() {
    databaseRef.child(`users/${this.props.uid}/account`).once('value', function(snapshot) {
      const userDetails = snapshot.val()
      this.setState({
        rank: userDetails.rank,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        notifications: userDetails.notifications
      })
    }.bind(this));

    databaseRef.child(`users/${this.props.uid}/activity`).limitToLast(5).once('value', function(snapshot) {
      const userActivity = snapshot.val()
      this.setState({userActivity})
    }.bind(this));
  }

  handleTextChange(name, event) {
    this.setState({[name]: event.target.value})
  }

  onToggle() {
    const notifications = !this.state.notifications
    databaseRef.child(`users/${this.props.uid}/account`).update({notifications})
    this.setState({notifications})
  }

  changePassword() {
    const user = firebaseApp.auth().currentUser;
    const newPassword = this.state.newPassword
    const newPasswordRepeat = this.state.newPasswordRepeat
    const timestamp = Date.now()

    if (newPassword === newPasswordRepeat) {
      user.updatePassword(newPassword).then(function() {
        databaseRef.child(`users/${user.uid}/activity/`).push({
          action: 'changePassword',
          timestamp: timestamp
        });
        this.setState({
          passwordMsg: "Your password has been updated.",
          newPassword: '',
          newPasswordRepeat: ''
        });
      }.bind(this), function(error) {
        this.setState({
          passwordMsg: error.message,
          newPassword: '',
          newPasswordRepeat: ''
        });
      }.bind(this));
    } else {
      this.setState({
        passwordMsg: "The passwords do not match. Try again.",
        newPassword: '',
        newPasswordRepeat: ''
      });
    }
  }

  changeEmail() {
    const user = firebaseApp.auth().currentUser;
    const newEmail = this.state.newEmail
    const newEmailRepeat = this.state.newEmailRepeat
    const timestamp = Date.now()

    if (newEmail === newEmailRepeat) {
      user.updateEmail(newEmail).then(function() {
        databaseRef.child(`users/${user.uid}/activity/`).push({
          action: 'changeEmail',
          timestamp: timestamp
        });
        this.setState({
          emailMsg: "Your email has been updated.",
          newEmail: '',
          newEmailRepeat: ''
        });
      }.bind(this), function(error) {
        this.setState({
          emailMsg: error.message,
          newEmail: '',
          newEmailRepeat: ''
        });
      }.bind(this));
    } else {
      this.setState({
        emailMsg: "The emails do not match. Try again.",
        newEmail: '',
        newEmailRepeat: ''
      });
    }
  }

  render() {
    const {userActivity} = this.state
    const email = firebaseApp.auth().currentUser.email

    function activityText(key) {

      const tipLink = <Link to={`tips/${key}`} style={{textDecoration: 'none'}}>tip</Link>

      switch (userActivity[key].action) {
        case 'read':
          return <span>read a {tipLink}.</span>
        case 'important':
          if (userActivity[key].status === true) {
            return <span>flagged a {tipLink} as important.</span>
          } else {
            return <span>unflagged a {tipLink} as important.</span>
          }
        case 'archived':
          if (userActivity[key].status === true) {
              return <span>archived a {tipLink}.</span>
            } else {
              return <span>unarchived a {tipLink}.</span>
            }
        case 'changePassword':
          return 'changed their password.'
        case 'changeEmail':
          return 'changed their email.'
        default:
          console.error("Invalid user activity type.")
      }
    }

    let userActivityToDisplay = null
    if (userActivity) {
      const userActivityReversed = reverse(userActivity)
      userActivityToDisplay = Object.keys(userActivityReversed).map(key =>  
                                  <div key={key}>
                                    <p style={{color: 'rgb(117, 117, 117)'}}>{relativeTime(userActivity[key].timestamp)}</p>
                                    <p><b>{`${this.state.firstName} ${this.state.lastName}`}</b> {activityText(key)}</p>
                                    <Divider />
                                  </div>)
    }
    
    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <div className="row" style={{margin: '10px 2px 8px 2px'}}>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <Card>
              <CardHeader title="My Settings"/>
              <Divider />
              <CardText>
                <h2>{`${this.state.rank} ${this.state.firstName} ${this.state.lastName}`}</h2>
                <h3>Notifications</h3>
                <Toggle
                  label="Receive emails when new tips are submitted"
                  toggled={this.state.notifications}
                  style={{marginBottom: '20px'}}
                  onToggle={this.onToggle}
                />
                <Divider />
                <h3>Change Email</h3>
                <p>Current email: {email}</p>
                <p>Type in a new email (twice) to change it</p>
                {this.state.emailMsg && <p style={{color: 'red'}}>{this.state.emailMsg}</p>}
                <TextField
                  hintText="New email" 
                  type="email"
                  value={this.state.newEmail}
                  onChange={this.handleTextChange.bind(null, "newEmail")}
                />
                <TextField 
                  hintText="Repeat new email"
                  type="email"
                  value={this.state.newEmailRepeat}
                  style={{marginBottom: '20px'}}
                  onChange={this.handleTextChange.bind(null, "newEmailRepeat")}
                />
                <RaisedButton 
                  label="Change Email" 
                  primary={true} 
                  style={{marginBottom: '10px'}}
                  onTouchTap={() => this.changeEmail()}
                />                
              </CardText>
            </Card>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <Card>
              <CardHeader title="Change Password"/>
              <Divider />
              <CardText>
                <h3>Change Password</h3>
                <p>Type in a new password (twice) to change it</p>
                {this.state.passwordMsg && <p style={{color: 'red'}}>{this.state.passwordMsg}</p>}
                <TextField
                  hintText="New password" 
                  type="password"
                  value={this.state.newPassword}
                  onChange={this.handleTextChange.bind(null, "newPassword")}
                />
                <TextField 
                  hintText="Repeat new password"
                  type="password"
                  value={this.state.newPasswordRepeat}
                  style={{marginBottom: '20px'}}
                  onChange={this.handleTextChange.bind(null, "newPasswordRepeat")}
                />
                <RaisedButton 
                  label="Change Password" 
                  primary={true} 
                  style={{marginBottom: '10px'}}
                  onTouchTap={() => this.changePassword()}
                />
              </CardText>
            </Card>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
            <Card>
              <CardHeader title="Recent Activity"/>
              <Divider />
              <CardText>
                {userActivityToDisplay}
              </CardText>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}