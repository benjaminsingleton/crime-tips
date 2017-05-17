import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Grid, Card, Form, Radio, Divider, Message } from 'semantic-ui-react'
import Layout from '../components/Layout'
import { firebaseApp } from '../helpers/firebase'
import { relativeTime, reverse } from '../helpers/helpers'

// neha comment

export default class UserSettings extends Component {
  state = {
    uid: firebaseApp.auth().currentUser.uid,
    userDetails: {},
    newPassword: '',
    newPasswordRepeat: '',
    passwordMsgStatus: null,
    passwordMsg: '',
    newEmail: '',
    newEmailRepeat: '',
    emailMsg: ''
  }

  componentWillMount = () => {
    firebaseApp.database().ref(`users/${this.state.uid}`).on('value', (snapshot) => {
      const userDetails = snapshot.val()
      this.setState({ userDetails })
    });

    firebaseApp.database().ref(`userActivity/${this.state.uid}`).limitToLast(5).on('value', (snapshot) => {
      const userActivity = snapshot.val()
      this.setState({ userActivity })
    });
  }

  componentWillUnmount = () => {
    firebaseApp.database().ref(`users/${this.state.uid}`).off()
    firebaseApp.database().ref(`userActivity/${this.state.uid}`).off()
  }

  handleInputChange = (e, { name, value }) => this.setState({[name]: value})

  onToggle = () => {
    const notifications = !this.state.userDetails.notifications
    firebaseApp.database().ref(`users/${this.state.uid}`).update({ notifications })
    this.setState({notifications})
  }

  changePassword = (e) => {
    e.preventDefault()
    const user = firebaseApp.auth().currentUser;
    const newPassword = this.state.newPassword
    const newPasswordRepeat = this.state.newPasswordRepeat
    const timestamp = Date.now()

    if (newPassword === newPasswordRepeat) {
      user.updatePassword(newPassword).then(() => {
        firebaseApp.database().ref(`userActivity/${this.state.uid}`).push({
          action: 'changePassword',
          timestamp: timestamp
        });
        this.setState({
          passwordMsgStatus: 'success',
          passwordMsg: "Your password has been updated.",
          newPassword: '',
          newPasswordRepeat: ''
        });
      }, (error) => {
        this.setState({
          passwordMsgStatus: 'error',
          passwordMsg: error.message,
          newPassword: '',
          newPasswordRepeat: ''
        });
      });
    } else {
      this.setState({
        passwordMsgStatus: 'error',
        passwordMsg: "The passwords do not match. Try again.",
        newPassword: '',
        newPasswordRepeat: ''
      });
    }
  }

  changeEmail = (e) => {
    e.preventDefault()
    const user = firebaseApp.auth().currentUser;
    const newEmail = this.state.newEmail
    const newEmailRepeat = this.state.newEmailRepeat
    const timestamp = Date.now()

    if (newEmail === newEmailRepeat) {
      user.updateEmail(newEmail).then(() => {
        firebaseApp.database().ref(`userActivity/${this.state.uid}/`).push({
          action: 'changeEmail',
          timestamp: timestamp
        });
        this.setState({
          emailMsgStatus: 'success',
          emailMsg: "Your email has been updated.",
          newEmail: '',
          newEmailRepeat: ''
        });
      }, (error) => {
        this.setState({
          emailMsgStatus: 'error',
          emailMsg: error.message,
          newEmail: '',
          newEmailRepeat: ''
        });
      });
    } else {
      this.setState({
        emailMsgStatus: 'error',
        emailMsg: "The emails do not match. Try again.",
        newEmail: '',
        newEmailRepeat: ''
      });
    }
  }

  render() {
    const { userActivity, userDetails } = this.state
    const email = firebaseApp.auth().currentUser.email

    function activityText(key) {
      const tipLink = <Link to={`tip/${key}`} style={{textDecoration: 'none'}}>tip</Link>

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
                                    <p><b>{`${userDetails.firstName} ${userDetails.lastName}`}</b> {activityText(key)}</p>
                                    <Divider />
                                  </div>)
    }
    
    return (
      <Layout uid={this.state.uid} logout={this.props.logout}>
        <Grid columns={3} centered>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={5} computer={5} largeScreen={5}>
              <Card fluid>
                <Card.Content header="My Settings" />
                <Card.Content>
                  <h2>{`${userDetails.rank} ${userDetails.firstName} ${userDetails.lastName}`}</h2>
                  <h3>Notifications</h3>
                  <Radio 
                    toggle
                    label='Receive emails when new tips are submitted'
                    checked={userDetails.notifications}
                    style={{marginBottom: '20px'}}
                    onChange={this.onToggle}
                  />
                  <Divider />
                  <h3>Change Email</h3>
                  <Form 
                    error={this.state.emailMsgStatus === 'error'}
                    success={this.state.emailMsgStatus === 'success'}
                    onSubmit={(e) => this.changeEmail(e)}>
                  <p>Current email: {email}</p>
                  <p>Type in a new email (twice) to change it</p>
                  <Message
                    success
                    content={this.state.emailMsg}
                  />
                  <Message
                    error
                    content={this.state.emailMsg}
                  />
                  <Form.Input
                    placeholder='New email'
                    type='email'
                    name='newEmail'
                    value={this.state.newEmail}
                    onChange={this.handleInputChange}
                  />
                  <Form.Input 
                    placeholder='Repeat new email'
                    type='email'
                    name='newEmailRepeat'
                    value={this.state.newEmailRepeat}
                    onChange={this.handleInputChange}
                  />
                  <Form.Button 
                    content='Change Email'
                    color='violet' 
                  />
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={5} computer={5} largeScreen={5}>
              <Card fluid>
                <Card.Content header='Change Password' />
                <Card.Content>
                  <h3>Change Password</h3>
                  <Form 
                      error={this.state.passwordMsgStatus === 'error'}
                      success={this.state.passwordMsgStatus === 'success'}
                      onSubmit={(e) => this.changePassword(e)}>
                  <p>Type in a new password (twice) to change it</p>
                  <Message
                    error
                    content={this.state.passwordMsg}
                  />
                  <Message
                    success
                    content={this.state.passwordMsg}
                  />
                  <Form.Input
                    placeholder='New password'
                    type='password'
                    name='newPassword'
                    value={this.state.newPassword}
                    onChange={this.handleInputChange}
                  />
                  <Form.Input 
                    placeholder='Repeat new password'
                    type='password'
                    name='newPasswordRepeat'
                    value={this.state.newPasswordRepeat}
                    onChange={this.handleInputChange}
                  />
                  <Form.Button 
                    content='Change Password'
                    color='violet' 
                  />
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={5} computer={5} largeScreen={5}>
              <Card fluid>
                <Card.Content header='Recent Activity' />
                <Card.Content>
                  {userActivityToDisplay}
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}