import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Segment, Form, Button, Table, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { api } from '../api';

class CreateUser extends Component {
  state = {
    success: false,
    error: false,
    rank: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    admin: false,
    header: '',
    message: '',
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleCheckChange = () => {
    this.setState({ admin: !this.state.admin });
  };

  createUser = async (e) => {
    e.preventDefault();
    if (
      !this.state.rank ||
      !this.state.firstName ||
      !this.state.lastName ||
      !this.state.email ||
      !this.state.password
    ) {
      this.setState({
        error: true,
        success: false,
        header: 'Error!',
        message:
          'None of the following fields can be blank: Rank, First Name, Last Name, Email and Password.',
      });
      return;
    }

    try {
      await api.createUser({
        rank: this.state.rank,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        admin: this.state.admin,
      });
      this.setState({
        rank: '',
        firstName: '',
        lastName: '',
        admin: false,
        email: '',
        password: '',
        success: true,
        error: false,
        message: 'Account successfully created.',
        header: 'Success!',
      });
      this.props.onCreated();
    } catch (error) {
      this.setState({
        error: true,
        success: false,
        header: 'Error!',
        message: error.message,
      });
    }
  };

  render() {
    return (
      <Segment>
        <Form
          success={this.state.success}
          error={this.state.error}
          onSubmit={(e) => this.createUser(e)}
        >
          <Grid stackable columns={3}>
            <Grid.Row>
              <Grid.Column width={16}>
                <Message success header={this.state.header} content={this.state.message} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label="Rank"
                  name="rank"
                  value={this.state.rank}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label="First name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label="Last name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label="Email"
                  name="email"
                  value={this.state.email}
                  type="email"
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label="Password"
                  name="password"
                  value={this.state.password}
                  type="password"
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Checkbox
                  label="Admin?"
                  name="admin"
                  checked={this.state.admin}
                  onChange={this.handleCheckChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Message error header={this.state.header} content={this.state.message} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column />
              <Grid.Column />
              <Grid.Column textAlign="right">
                <Form.Button content="Create User" color="violet" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

CreateUser.propTypes = {
  onCreated: PropTypes.func.isRequired,
};

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      success: false,
      header: '',
      message: '',
      rank: props.user.rank,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
      admin: props.user.admin,
      notifications: props.user.notifications,
      accountActive: props.user.accountActive,
      newPassword: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        rank: this.props.user.rank,
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email,
        admin: this.props.user.admin,
        notifications: this.props.user.notifications,
        accountActive: this.props.user.accountActive,
      });
    }
  }

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  toggleBool = (name) => this.setState({ [name]: !this.state[name] });

  resetPassword = async (e) => {
    e.preventDefault();
    if (!this.state.newPassword || this.state.newPassword.length < 6) {
      this.setState({
        error: true,
        header: 'Error!',
        message: 'Enter a new password (min 6 characters) to reset.',
      });
      return;
    }
    try {
      await api.changePassword(this.props.uid, this.state.newPassword);
      this.setState({
        error: false,
        success: true,
        header: 'Success!',
        message: 'Password updated.',
        newPassword: '',
      });
    } catch (error) {
      this.setState({ error: true, success: false, header: 'Error!', message: error.message });
    }
  };

  saveChanges = async (e) => {
    e.preventDefault();
    if (!this.state.rank || !this.state.firstName || !this.state.lastName || !this.state.email) {
      this.setState({
        error: true,
        header: 'Error!',
        message:
          'None of the following fields can be blank: Rank, First Name, Last Name and Email.',
      });
      return;
    }

    try {
      await api.updateUser(this.props.uid, {
        rank: this.state.rank,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        admin: this.state.admin,
        notifications: this.state.notifications,
        accountActive: this.state.accountActive,
      });
      this.props.onSaved();
      this.props.toggle('showEditUser');
    } catch (error) {
      this.setState({ error: true, message: error.message, header: 'Error!' });
    }
  };

  render() {
    return (
      <Segment>
        <Form error={this.state.error} success={this.state.success} onSubmit={this.saveChanges}>
          <Grid stackable columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label="Rank"
                  name="rank"
                  value={this.state.rank}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label="First name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  label="Last name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Form.Input
                  label="Email"
                  name="email"
                  value={this.state.email}
                  type="email"
                  onChange={this.handleInputChange}
                />
                <Form.Input
                  label="Set new password"
                  name="newPassword"
                  type="password"
                  value={this.state.newPassword}
                  onChange={this.handleInputChange}
                />
                <Form.Button size="small" content="Reset Password" onClick={this.resetPassword} />
              </Grid.Column>
              <Grid.Column>
                <Form.Checkbox
                  label="Admin?"
                  checked={this.state.admin}
                  onChange={() => this.toggleBool('admin')}
                />
                <Form.Checkbox
                  label="Notifications?"
                  checked={this.state.notifications}
                  onChange={() => this.toggleBool('notifications')}
                />
                <Form.Checkbox
                  label="Account active?"
                  checked={this.state.accountActive}
                  onChange={() => this.toggleBool('accountActive')}
                />
              </Grid.Column>
              <Grid.Column />
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Message success header={this.state.header} content={this.state.message} />
                <Message error header={this.state.header} content={this.state.message} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column />
              <Grid.Column />
              <Grid.Column textAlign="right">
                <Form.Group>
                  <Form.Button
                    content="Cancel"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.toggle('showEditUser');
                    }}
                  />
                  <Form.Button content="Save" color="violet" />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>
    );
  }
}

EditUser.propTypes = {
  user: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  onSaved: PropTypes.func.isRequired,
};

export default class AccountManagement extends Component {
  state = {
    users: {},
    showCreateUser: true,
    showEditUser: false,
    editUserId: null,
  };

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = async () => {
    try {
      const { users } = await api.listUsers();
      this.setState({ users: users || {} });
    } catch (err) {
      console.error(err);
    }
  };

  editUser = (editUserId) => this.setState({ editUserId, showEditUser: true });

  toggle = (toToggle) => this.setState({ [toToggle]: !this.state[toToggle] });

  makeUserRows = (userId) => {
    const user = this.state.users[userId];
    return (
      <Table.Row key={userId}>
        <Table.Cell>{user.rank}</Table.Cell>
        <Table.Cell>{user.firstName}</Table.Cell>
        <Table.Cell>{user.lastName}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell>{user.admin ? 'True' : 'False'}</Table.Cell>
        <Table.Cell>{user.notifications ? 'True' : 'False'}</Table.Cell>
        <Table.Cell>{user.accountActive ? 'True' : 'False'}</Table.Cell>
        <Table.Cell>
          <Button content="Edit" onClick={() => this.editUser(userId)} />
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const userRows = Object.keys(this.state.users).map((userId) => this.makeUserRows(userId));

    return (
      <Layout user={this.props.user} onLogout={this.props.onLogout}>
        <Grid columns={1} centered>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
              <Card fluid>
                <Card.Content header="Account Management" />
                <Card.Content>
                  {this.state.showCreateUser ? (
                    <CreateUser onCreated={this.loadUsers} />
                  ) : null}
                  {this.state.showEditUser && this.state.users[this.state.editUserId] ? (
                    <EditUser
                      uid={this.state.editUserId}
                      user={this.state.users[this.state.editUserId]}
                      toggle={this.toggle}
                      onSaved={this.loadUsers}
                    />
                  ) : null}
                  <Table style={{ display: 'inline-block', overflowX: 'scroll' }}>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Rank</Table.HeaderCell>
                        <Table.HeaderCell>First name</Table.HeaderCell>
                        <Table.HeaderCell>Last name</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Admin</Table.HeaderCell>
                        <Table.HeaderCell>Notifications</Table.HeaderCell>
                        <Table.HeaderCell>Account active?</Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>{userRows}</Table.Body>
                  </Table>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

AccountManagement.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

AccountManagement.defaultProps = {
  user: null,
  onLogout: null,
};
