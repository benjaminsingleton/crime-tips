import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Layout from '../components/Layout'
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import {firebaseApp} from '../helpers/firebase'

export default class AccountManagement extends Component {
  constructor () {
    super()
    this.state = {
      users: {},
      showCreateUser: true,
      rank: '',
      firstName: '',
      lastName: '',
      admin: false,
      email: '',
      password: '',
      createUserMessage: null,
      editUserId: null,
    }
    this.baseState = this.state
    this.createUser = this.createUser.bind(this)
    this.makeUserRows = this.makeUserRows.bind(this)
  }

  componentWillMount() {
    firebaseApp.database().ref('users').on('value', function(snapshot) {
        const users = snapshot.val()
        this.setState({users})
    }.bind(this));
  }

  componentWillUnmount = () => firebaseApp.database().ref('users').off();

  handleTextChange = (name, event) => this.setState({[name]: event.target.value})

  handleCheckboxChange = (name, event, isInputChecked) => this.setState({[name]: isInputChecked})

  createUser() { 
    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(function(user) {
          const userData = {
            'rank': this.state.rank,
            'firstName': this.state.firstName,
            'lastName': this.state.lastName,
            'email': this.state.email,
            'admin': this.state.admin,
            'notifications': true,
            'accountActive': true,
          }
          firebaseApp.database().ref(`users/${user.uid}`).update({...userData})
          this.setState({
            rank: '',
            firstName: '',
            lastName: '',
            admin: false,
            email: '',
            password: '',
            createUserMessage: 'Account successfully created.'
          })
      }.bind(this))
      .catch(function(error) {
        console.log(error.code, error.message)
        this.setState({createUserMessage: error.message})
      }.bind(this));
  }

  editUser = (editUserId) => this.setState({editUserId})

  makeUserRows(userId) {
    const user = this.state.users[userId]
    return (
      <tr key={userId}>
        <td>{userId}</td>
        <td>{user.rank}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.admin ? 'True' : 'False'}</td>
        <td>{user.notifications ? 'True' : 'False'}</td>
        <td>{user.accountActive ? 'True' : 'False'}</td>
        <td><button onClick={() => this.editUser(userId)}>Edit</button></td>
      </tr>
    )
  }

  render() {
    const userRows = Object.keys(this.state.users).map(userId => this.makeUserRows(userId))

    const createUser = (
      <div>
        {this.state.createUserMessage ? <p><b>{this.state.createUserMessage}</b></p> : null}
        <div>
          <TextField
            value={this.state.rank}
            floatingLabelText="Rank"
            onChange={this.handleTextChange.bind(null, "rank")} 
          />
          <TextField
            value={this.state.firstName}
            floatingLabelText="First name"
            onChange={this.handleTextChange.bind(null, "firstName")} 
          />
          <TextField
            value={this.state.lastName}
            floatingLabelText="Last name"
            onChange={this.handleTextChange.bind(null, "lastName")} 
          />
        </div>
        <div>
          <TextField
            value={this.state.email}
            floatingLabelText="Email"
            type="email"
            onChange={this.handleTextChange.bind(null, "email")} 
          />
          <TextField
            value={this.state.password}
            floatingLabelText="Password"
            type="password"
            onChange={this.handleTextChange.bind(null, "password")} 
          />
          <Checkbox
            label="Admin?"
            checked={this.state.admin}
            onCheck={this.handleCheckboxChange.bind(null, "admin")}
          />
          <RaisedButton label="Create User" primary={true} onTouchTap={() => this.createUser()} />
        </div>
        <Divider />
      </div>)

    return (
      <Layout>
        <div className="row" style={{margin: '60px 2px 30px 2px'}}>
          <div className="col-xs-12 col-sm-offset-12 col-sm-8 col-md-offset-2 col-md-8 col-lg-offset-2 col-lg-8">
            <Card>
              <CardHeader title="Account Management"/>
              <Divider />
              <CardText>
                {this.state.showCreateUser ? createUser : null}
                <table>
                  <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Rank</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Notifications</th>
                    <th>Account active?</th>
                    <th>Edit</th>
                  </tr>
                  </thead>
                  <tbody>
                  {userRows}
                  </tbody>
                </table>
              </CardText>
            </Card>
          </div>
        </div>
      </Layout>
    )
  }
}
