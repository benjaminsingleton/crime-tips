import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import { api } from '../api';
import { Panel, TextInput, Checkbox, Button, Alert } from '../components/ui';

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
    if (this.state.password.length < 10) {
      this.setState({
        error: true,
        success: false,
        header: 'Error!',
        message: 'Password must be at least 10 characters.',
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
      <div className="subpanel" style={{ marginBottom: '1.25rem' }}>
        <div className="subpanel__header">Create user</div>
        <div className="subpanel__body">
          <form onSubmit={(e) => this.createUser(e)}>
            {this.state.success && (
              <Alert tone="success" title={this.state.header} content={this.state.message} />
            )}
            <div className="form-grid form-grid--3">
              <TextInput
                label="Rank"
                name="rank"
                value={this.state.rank}
                onChange={this.handleInputChange}
              />
              <TextInput
                label="First name"
                name="firstName"
                value={this.state.firstName}
                onChange={this.handleInputChange}
              />
              <TextInput
                label="Last name"
                name="lastName"
                value={this.state.lastName}
                onChange={this.handleInputChange}
              />
              <TextInput
                label="Email"
                name="email"
                value={this.state.email}
                type="email"
                onChange={this.handleInputChange}
              />
              <TextInput
                label="Password (min 10 characters)"
                name="password"
                value={this.state.password}
                type="password"
                onChange={this.handleInputChange}
              />
              <div style={{ display: 'flex', alignItems: 'end', paddingBottom: '0.35rem' }}>
                <Checkbox
                  label="Admin?"
                  name="admin"
                  checked={this.state.admin}
                  onChange={this.handleCheckChange}
                />
              </div>
            </div>
            {this.state.error && (
              <Alert tone="error" title={this.state.header} content={this.state.message} />
            )}
            <div className="actions-end" style={{ marginTop: '0.85rem' }}>
              <Button type="submit" variant="primary" content="Create user" />
            </div>
          </form>
        </div>
      </div>
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
      currentPassword: '',
      mfaCode: '',
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

  isEditingSelf = () =>
    Boolean(this.props.viewer?.id) && this.props.viewer.id === this.props.uid;

  resetPassword = async (e) => {
    e.preventDefault();
    if (!this.state.newPassword || this.state.newPassword.length < 10) {
      this.setState({
        error: true,
        header: 'Error!',
        message: 'Enter a new password (min 10 characters) to reset.',
      });
      return;
    }
    const self = this.isEditingSelf();
    if (self && !this.state.currentPassword && !this.props.viewer?.oidcLinked) {
      this.setState({
        error: true,
        header: 'Error!',
        message: 'Enter your current password to reset your own account.',
      });
      return;
    }
    if (self && this.props.viewer?.oidcLinked && this.props.user.mfaEnabled && !this.state.mfaCode) {
      this.setState({
        error: true,
        header: 'Error!',
        message: 'Enter an authenticator code to confirm resetting your own password.',
      });
      return;
    }
    try {
      await api.changePassword(
        this.props.uid,
        this.state.newPassword,
        self
          ? {
              currentPassword: this.state.currentPassword || undefined,
              mfaCode: this.state.mfaCode || undefined,
            }
          : {},
      );
      this.setState({
        error: false,
        success: true,
        header: 'Success!',
        message: 'Password updated.',
        newPassword: '',
        currentPassword: '',
        mfaCode: '',
      });
    } catch (error) {
      this.setState({ error: true, success: false, header: 'Error!', message: error.message });
    }
  };

  resetMfa = async (e) => {
    e.preventDefault();
    if (
      !window.confirm(
        'Clear MFA for this officer? They will enroll again at next login if MFA is required.',
      )
    ) {
      return;
    }
    try {
      await api.mfaAdminReset(this.props.uid);
      this.setState({
        error: false,
        success: true,
        header: 'Success!',
        message: 'MFA cleared for this account.',
      });
      this.props.onSaved();
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
      <div className="subpanel" style={{ marginBottom: '1.25rem' }}>
        <div className="subpanel__header">Edit user</div>
        <div className="subpanel__body">
          <form onSubmit={this.saveChanges}>
            <div className="form-grid form-grid--3">
              <TextInput
                label="Rank"
                name="rank"
                value={this.state.rank}
                onChange={this.handleInputChange}
              />
              <TextInput
                label="First name"
                name="firstName"
                value={this.state.firstName}
                onChange={this.handleInputChange}
              />
              <TextInput
                label="Last name"
                name="lastName"
                value={this.state.lastName}
                onChange={this.handleInputChange}
              />
              <TextInput
                label="Email"
                name="email"
                value={this.state.email}
                type="email"
                onChange={this.handleInputChange}
              />
              <TextInput
                label="Set new password"
                name="newPassword"
                type="password"
                value={this.state.newPassword}
                onChange={this.handleInputChange}
              />
              {this.isEditingSelf() ? (
                <>
                  <TextInput
                    label={
                      this.props.viewer?.oidcLinked
                        ? 'Current password (optional if SSO / MFA confirms)'
                        : 'Current password (required for your own account)'
                    }
                    name="currentPassword"
                    type="password"
                    value={this.state.currentPassword}
                    onChange={this.handleInputChange}
                    autoComplete="current-password"
                  />
                  {this.props.user.mfaEnabled ? (
                    <TextInput
                      label="Authentication code"
                      name="mfaCode"
                      value={this.state.mfaCode}
                      onChange={this.handleInputChange}
                      autoComplete="one-time-code"
                    />
                  ) : null}
                </>
              ) : null}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'end' }}>
                <Button size="sm" variant="secondary" content="Reset password" onClick={this.resetPassword} />
                {this.props.user.mfaEnabled ? (
                  <Button
                    size="sm"
                    type="button"
                    variant="secondary"
                    content="Reset MFA"
                    onClick={this.resetMfa}
                  />
                ) : null}
              </div>
            </div>
            <div className="form-grid form-grid--3" style={{ marginTop: '0.75rem' }}>
              <Checkbox
                label="Admin?"
                checked={this.state.admin}
                onChange={() => this.toggleBool('admin')}
              />
              <Checkbox
                label="Notifications?"
                checked={this.state.notifications}
                onChange={() => this.toggleBool('notifications')}
              />
              <Checkbox
                label="Account active?"
                checked={this.state.accountActive}
                onChange={() => this.toggleBool('accountActive')}
              />
            </div>
            <p style={{ marginTop: 8 }}>
              MFA: {this.props.user.mfaEnabled ? 'Enabled' : 'Off'}
            </p>
            {this.state.success && (
              <Alert tone="success" title={this.state.header} content={this.state.message} />
            )}
            {this.state.error && (
              <Alert tone="error" title={this.state.header} content={this.state.message} />
            )}
            <div className="actions-end" style={{ marginTop: '0.85rem' }}>
              <Button
                type="button"
                variant="secondary"
                content="Cancel"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.toggle('showEditUser');
                }}
              />
              <Button type="submit" variant="primary" content="Save" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EditUser.propTypes = {
  user: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  onSaved: PropTypes.func.isRequired,
  viewer: PropTypes.object,
};

EditUser.defaultProps = {
  viewer: null,
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
      <tr key={userId}>
        <td>{user.rank}</td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>{user.admin ? 'True' : 'False'}</td>
        <td>{user.notifications ? 'True' : 'False'}</td>
        <td>{user.accountActive ? 'True' : 'False'}</td>
        <td>{user.mfaEnabled ? 'On' : 'Off'}</td>
        <td className="cell-actions">
          <Button size="sm" content="Edit" variant="secondary" onClick={() => this.editUser(userId)} />
        </td>
      </tr>
    );
  };

  render() {
    const userRows = Object.keys(this.state.users).map((userId) => this.makeUserRows(userId));

    return (
      <Layout user={this.props.user} onLogout={this.props.onLogout} variant="officer">
        <div style={{ maxWidth: '56rem', margin: '1.25rem auto 0' }}>
          <Panel title="Account management">
            {this.state.showCreateUser ? <CreateUser onCreated={this.loadUsers} /> : null}
            {this.state.showEditUser && this.state.users[this.state.editUserId] ? (
              <EditUser
                uid={this.state.editUserId}
                user={this.state.users[this.state.editUserId]}
                viewer={this.props.user}
                toggle={this.toggle}
                onSaved={this.loadUsers}
              />
            ) : null}
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Notifications</th>
                    <th>Account active?</th>
                    <th>MFA</th>
                    <th />
                  </tr>
                </thead>
                <tbody>{userRows}</tbody>
              </table>
            </div>
          </Panel>
        </div>
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
