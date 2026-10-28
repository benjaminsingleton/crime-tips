import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Form, Radio, Divider, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { relativeTime } from '../helpers/helpers';

export default class UserSettings extends Component {
  state = {
    userDetails: this.props.user || {},
    userActivity: {},
    newPassword: '',
    newPasswordRepeat: '',
    passwordMsgStatus: null,
    passwordMsg: '',
    newEmail: '',
    newEmailRepeat: '',
    emailMsgStatus: null,
    emailMsg: '',
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    try {
      const { user } = await api.me();
      const { activity } = await api.userActivity(user.id);
      this.setState({ userDetails: user, userActivity: activity || {} });
      if (this.props.setUser) this.props.setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  onToggle = async () => {
    const notifications = !this.state.userDetails.notifications;
    try {
      const { user } = await api.updateUser(this.state.userDetails.id, { notifications });
      this.setState({ userDetails: user });
      if (this.props.setUser) this.props.setUser(user);
    } catch (err) {
      console.error(err);
    }
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  changePassword = async (e) => {
    e.preventDefault();
    const { newPassword, newPasswordRepeat } = this.state;
    if (newPassword !== newPasswordRepeat) {
      this.setState({
        passwordMsgStatus: 'error',
        passwordMsg: 'The passwords do not match. Try again.',
        newPassword: '',
        newPasswordRepeat: '',
      });
      return;
    }
    try {
      await api.changePassword(this.state.userDetails.id, newPassword);
      this.setState({
        passwordMsgStatus: 'success',
        passwordMsg: 'Your password has been updated.',
        newPassword: '',
        newPasswordRepeat: '',
      });
      this.refresh();
    } catch (error) {
      this.setState({
        passwordMsgStatus: 'error',
        passwordMsg: error.message,
        newPassword: '',
        newPasswordRepeat: '',
      });
    }
  };

  changeEmail = async (e) => {
    e.preventDefault();
    const { newEmail, newEmailRepeat } = this.state;
    if (newEmail !== newEmailRepeat) {
      this.setState({
        emailMsgStatus: 'error',
        emailMsg: 'The emails do not match. Try again.',
        newEmail: '',
        newEmailRepeat: '',
      });
      return;
    }
    try {
      const { user } = await api.updateUser(this.state.userDetails.id, { email: newEmail });
      this.setState({
        emailMsgStatus: 'success',
        emailMsg: 'Your email has been updated.',
        newEmail: '',
        newEmailRepeat: '',
        userDetails: user,
      });
      if (this.props.setUser) this.props.setUser(user);
    } catch (error) {
      this.setState({
        emailMsgStatus: 'error',
        emailMsg: error.message,
        newEmail: '',
        newEmailRepeat: '',
      });
    }
  };

  render() {
    const activityKeys = Object.keys(this.state.userActivity || {});
    return (
      <Layout user={this.props.user} onLogout={this.props.onLogout}>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={10} computer={8}>
            <Card fluid>
              <Card.Content header="My Settings" />
              <Card.Content>
                <p>
                  {this.state.userDetails.rank} {this.state.userDetails.firstName}{' '}
                  {this.state.userDetails.lastName}
                </p>
                <p>{this.state.userDetails.email}</p>
                <Divider />
                <Form>
                  <Form.Field>
                    Email notifications:{' '}
                    <Radio
                      toggle
                      checked={!!this.state.userDetails.notifications}
                      onChange={this.onToggle}
                    />
                  </Form.Field>
                </Form>
                <Divider />
                <Form
                  success={this.state.passwordMsgStatus === 'success'}
                  error={this.state.passwordMsgStatus === 'error'}
                  onSubmit={this.changePassword}
                >
                  <Form.Input
                    label="New password"
                    name="newPassword"
                    type="password"
                    value={this.state.newPassword}
                    onChange={this.handleInputChange}
                  />
                  <Form.Input
                    label="Repeat password"
                    name="newPasswordRepeat"
                    type="password"
                    value={this.state.newPasswordRepeat}
                    onChange={this.handleInputChange}
                  />
                  <Message success content={this.state.passwordMsg} />
                  <Message error content={this.state.passwordMsg} />
                  <Form.Button>Update password</Form.Button>
                </Form>
                <Divider />
                <Form
                  success={this.state.emailMsgStatus === 'success'}
                  error={this.state.emailMsgStatus === 'error'}
                  onSubmit={this.changeEmail}
                >
                  <Form.Input
                    label="New email"
                    name="newEmail"
                    type="email"
                    value={this.state.newEmail}
                    onChange={this.handleInputChange}
                  />
                  <Form.Input
                    label="Repeat email"
                    name="newEmailRepeat"
                    type="email"
                    value={this.state.newEmailRepeat}
                    onChange={this.handleInputChange}
                  />
                  <Message success content={this.state.emailMsg} />
                  <Message error content={this.state.emailMsg} />
                  <Form.Button>Update email</Form.Button>
                </Form>
                <Divider />
                <h4>Recent activity</h4>
                {activityKeys.length === 0 ? (
                  <p>No recent activity.</p>
                ) : (
                  activityKeys.map((key) => (
                    <p key={key}>
                      {this.state.userActivity[key].action} —{' '}
                      {relativeTime(this.state.userActivity[key].timestamp)}
                    </p>
                  ))
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

UserSettings.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  setUser: PropTypes.func,
};

UserSettings.defaultProps = {
  user: null,
  onLogout: null,
  setUser: null,
};
