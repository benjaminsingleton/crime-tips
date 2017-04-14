import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'
import {databaseRef, firebaseAuth} from '../helpers/constants'

export default class UserSettings extends Component {
  constructor () {
    super()
    this.state = {
      rank: null,
      firstName: null,
      lastName: null,
      notifications: true,
      password: '',
      passwordRepeat: '',
      errorText: null,
      passwordMsg: ''
    }
    this.onToggle = this.onToggle.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.changePassword = this.changePassword.bind(this)
  }

  componentWillMount() {
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
    const uid = firebaseAuth().currentUser.uid
    const newPassword = this.state.password
    const newPasswordRepeate = this.state.passwordRepeat

    if (newPassword === newPasswordRepeate) {
      firebaseAuth().updateUser(uid, {
        password: newPassword,
      })
        .then(function(userRecord) {
          console.log('success');
          this.setState({
            passwordMsg: "Your password has been updated.",
            password: '',
            passwordRepeat: ''
          });
        })
        .catch(function(error) {
          console.log("Error updating user:", error);
          this.setState({
            passwordMsg: "An error has occurred. Please try again.",
            password: '',
            passwordRepeat: ''
          });
        });
    } else {
      this.setState({
        password: '',
        passwordRepeat: '',
        errorText: "The passwords do not match.",
      });
    }
  }

  render() {
    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <Card style={{marginLeft: '8px', marginTop: '8px'}} >
              <CardHeader title="My Settings"/>
              <Divider />
              <CardText>
                <h2>{`${this.state.rank} ${this.state.firstName} ${this.state.lastName}`}</h2>
                <br />
                <h3>Notifications</h3>
                <Toggle
                  label="Receive emails when new tips are submitted"
                  toggled={this.state.notifications}
                  style={{marginBottom: '20px'}}
                  onToggle={this.onToggle}
                />
                <Divider />
                <h3>Change Password</h3>
                <p>Type in a new password (twice) to change it</p>
                {this.state.passwordMsg && <p>{this.state.passwordMsg}</p>}
                <TextField
                  hintText="New password" 
                  type="password"
                  value={this.state.password}
                  errorText={this.state.errorText}
                  onChange={this.handleTextChange.bind(null, "password")}
                />
                <TextField 
                  hintText="Repeat new password"
                  type="password"
                  value={this.state.passwordRepeat}
                  errorText={this.state.errorText}
                  style={{marginBottom: '20px'}}
                  onChange={this.handleTextChange.bind(null, "passwordRepeat")}
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
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <Card style={{marginTop: '8px'}}>
              <CardHeader title="Recent Activity"/>
              <Divider />
              <CardText>
                <p>5m ago</p>
                <p><b>Ben Singleton</b> added a new tip.</p>
                <Divider />
                <p>8m ago</p>
                <p><b>Ben Singleton</b> added a new tip.</p>
                <Divider />
                <p>16m ago</p>
                <p><b>Ben Singleton</b> archived a tip.</p>
                <Divider />
                <p>2hr ago</p>
                <p><b>Ben Singleton</b> flagged a tip as important.</p>
                <Divider />
                <p>2hr ago</p>
                <p><b>Ben Singleton</b> read a tip.</p>
              </CardText>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}