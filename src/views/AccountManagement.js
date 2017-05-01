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
  state ={
    error: false,
    success: false
  }

  handleInputChange = (e, { name, value }) => this.setState({[name]: value})

  handleCheckChange = () => {
    const admin = this.state.admin ? !this.state.admin : true
    this.setState({ admin })
  }

  saveChanges = (e) => {
    e.preventDefault()
    this.setState({ showEditUser: false })
  }

  render() {
    return (
      <Segment>
        <Form onSubmit={(e) => this.saveChanges(e)}>
          <Form.Button content='Save Changes' color='violet' />
        </Form>
      </Segment>
    )
  }
}


export default class AccountManagement extends Component {
  state = {
    users: {},
    showCreateUser: true,
    showEditUser: true,  // change to false
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
                  {this.state.showCreateUser ? <CreateUser /> : null}
                  {this.state.showEditUser ? <EditUser user={this.state.users[this.state.editUserId]} /> : null}
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
