import React, { Component } from 'react';
import { Grid, Card, Segment, Form, Button, Table, Message } from 'semantic-ui-react';
import Layout from '../components/Layout'
import { firebaseApp } from '../helpers/firebase'

class CreateUser extends Component {
  state = {
    success: false,
    error: false
  }

  handleInputChange = (e, { name, value }) => this.setState({[name]: value})

  handleCheckChange = () => {
    const admin = this.state.admin ? !this.state.admin : true
    this.setState({ admin })
  }

  createUser = (e) => {
    e.preventDefault()
    firebaseApp.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((user) => {
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
            .then(() => {
              this.setState({
                rank: '',
                firstName: '',
                lastName: '',
                admin: false,
                email: '',
                password: '',
                success: true,
                message: 'Account successfully created.',
                error: false
              })
            })
            .catch((error) => this.setState({ error: true, message: error.message }));
      })
      .catch((error) => {
        console.error('error')
        this.setState({ error: true, message: error.message })
      });
  }

  render() {
    return (
      <Segment>
        <Form 
          success={this.state.success} 
          error={this.state.error} 
          onSubmit={(e) => this.createUser(e)}>
          <Grid stackable columns={3}>
            <Grid.Row>
              <Grid.Column width={16}>
                <Message
                  error
                  content={this.state.message}
                />
                <Message
                  success
                  content={this.state.message}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label='Rank'
                  name='rank'
                  value={this.state.rank}
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='First name'
                  name='firstName'
                  value={this.state.firstName}
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Last name'
                  name='lastName'
                  value={this.state.lastName}
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label='Email'
                  name='email'
                  value={this.state.email}
                  type="email"
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Password'
                  name='password'
                  value={this.state.password}
                  type="password"
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Checkbox
                  label='Admin?'
                  name='admin'
                  checked={this.state.admin}
                  onChange={() => this.handleCheckChange()}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column />
              <Grid.Column />
              <Grid.Column textAlign='right'>
                <Form.Button content="Create User" color='violet' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    )
  }
}

class EditUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      rank: props.user.rank,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      admin: props.user.admin,
      notifications: props.user.notifications,
      accountActive: props.user.accountActive
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      rank: nextProps.user.rank,
      firstName: nextProps.user.firstName,
      lastName: nextProps.user.lastName,
      email: nextProps.user.email,
      admin: nextProps.user.admin,
      notifications: nextProps.user.notifications,
      accountActive: nextProps.user.accountActive
    })
  }

  handleInputChange = (e, { name, value }) => this.setState({[name]: value})

  handleCheckChange = () => {
    const admin = this.state.admin ? !this.state.admin : true
    this.setState({ admin })
  }

  resetPassword = () => {
    firebaseApp.auth().sendPasswordResetEmail(this.state.email).then(() => {
      this.setState({ success: true, error: false })
    }, (error) => {
      this.setState({ error: true, success: false })
    });
  }

  saveChanges = (e) => {
    e.preventDefault()
    const userData = {
      'rank': this.state.rank,
      'firstName': this.state.firstName,
      'lastName': this.state.lastName,
      'email': this.state.email,
      'admin': this.state.admin,
      'notifications': this.state.notifications,
      'accountActive': this.state.accountActive,
    }
    firebaseApp.database().ref(`users/${this.props.uid}`).update({...userData})
      .then(() => {
        this.setState({
          rank: '',
          firstName: '',
          lastName: '',
          email: '',
          admin: false,
          notifications: false,
          accountActive: false,
        })
      })
      .catch((error) => {
        this.setState({ error: true, message: error.message })
      })
    this.props.toggle('showEditUser')
  }

  render() {
    return (
      <Segment>
        <Form 
          error={this.state.error} 
          onSubmit={(e) => this.saveChanges(e)}>
          <Grid stackable columns={3}>
            <Grid.Row>
              <Grid.Column width={16}>
                <Message
                  error
                  content={this.state.message}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label='Rank'
                  name='rank'
                  value={this.state.rank}
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='First name'
                  name='firstName'
                  value={this.state.firstName}
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label='Last name'
                  name='lastName'
                  value={this.state.lastName}
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label='Email'
                  name='email'
                  value={this.state.email}
                  type="email"
                  onChange={this.handleInputChange} 
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Checkbox
                  label='Admin?'
                  name='admin'
                  checked={this.state.admin}
                  onChange={() => this.handleCheckChange()}
                />
                <Form.Checkbox
                  label='Notifications?'
                  name='notifications'
                  checked={this.state.notifications}
                  onChange={() => this.handleCheckChange()}
                />
                <Form.Checkbox
                  label='Acount active?'
                  name='accountActive'
                  checked={this.state.accountActive}
                  onChange={() => this.handleCheckChange()}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Button content="Reset Password" />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column />
              <Grid.Column>
                <Form.Button content='Cancel' onClick={(e) => {e.preventDefault(); this.props.toggle('showEditUser')}} />
              </Grid.Column>
              <Grid.Column textAlign='right'>
                <Form.Button content="Save Changes" color='violet' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    )
  }
}

export default class AccountManagement extends Component {
  state = {
    users: {},
    showCreateUser: true,
    showEditUser: false,
    editUserId: null
  }

  componentWillMount() {
    firebaseApp.database().ref('users').on('value', (snapshot) => {
        const users = snapshot.val()
        this.setState({ users })
    });
  }

  componentWillUnmount = () => firebaseApp.database().ref('users').off();

  editUser = (editUserId) => this.setState({ editUserId, showEditUser: true })

  toggle = (toToggle) => this.setState({ [toToggle]: !this.state[toToggle] })

  makeUserRows = (userId) => {
    const user = this.state.users[userId]
    return (
      <Table.Row key={userId}>
        <Table.Cell>{user.rank}</Table.Cell>
        <Table.Cell>{user.firstName}</Table.Cell>
        <Table.Cell>{user.lastName}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.admin ? 'True' : 'False'}</Table.Cell>
        <Table.Cell>{user.notifications ? 'True' : 'False'}</Table.Cell>
        <Table.Cell>{user.accountActive ? 'True' : 'False'}</Table.Cell>
        <Table.Cell><Button content='Edit' onClick={() => this.editUser(userId)} /></Table.Cell>
      </Table.Row>
    )
  }

  render() {
    const userRows = Object.keys(this.state.users).map(userId => this.makeUserRows(userId))

    return (
      <Layout>
        <Grid columns={1} centered>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
              <Card fluid>
                <Card.Content header="Account Management" />
                <Card.Content>
                  {this.state.showCreateUser ? <CreateUser toggle={this.toggle} /> : null}
                  {this.state.showEditUser ? 
                    <EditUser 
                      uid={this.state.editUserId}
                      user={this.state.users[this.state.editUserId]} 
                      toggle={this.toggle} 
                    />
                    : null}
                  <Table>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Rank</Table.HeaderCell>
                        <Table.HeaderCell>First name</Table.HeaderCell>
                        <Table.HeaderCell>Last name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Admin</Table.HeaderCell>
                        <Table.HeaderCell>Notifications</Table.HeaderCell>
                        <Table.HeaderCell>Account active?</Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {userRows}
                    </Table.Body>
                  </Table>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}
