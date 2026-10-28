import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Form, Radio, Divider, Message, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { api } from '../api';
import { relativeTime } from '../helpers/helpers';

export default class UserSettings extends Component {
  state = {
    userDetails: this.props.user || {},
    userActivity: {},
    mfaRequired: false,
    newPassword: '',
    newPasswordRepeat: '',
    passwordMsgStatus: null,
    passwordMsg: '',
    newEmail: '',
    newEmailRepeat: '',
    emailMsgStatus: null,
    emailMsg: '',
    mfaSetup: null,
    mfaCode: '',
    mfaDisablePassword: '',
    mfaDisableCode: '',
    mfaMsgStatus: null,
    mfaMsg: '',
    backupCodes: null,
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = async () => {
    try {
      const me = await api.me();
      const { user } = me;
      const { activity } = await api.userActivity(user.id);
      this.setState({
        userDetails: user,
        userActivity: activity || {},
        mfaRequired: Boolean(me.mfaRequired),
      });
      if (user.mfaEnabled) {
        sessionStorage.removeItem('mfaEnrollmentRequired');
      }
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

  startMfaSetup = async () => {
    try {
      const setup = await api.mfaSetup();
      this.setState({
        mfaSetup: setup,
        mfaCode: '',
        backupCodes: null,
        mfaMsgStatus: null,
        mfaMsg: '',
      });
    } catch (error) {
      this.setState({ mfaMsgStatus: 'error', mfaMsg: error.message });
    }
  };

  confirmMfa = async (e) => {
    e.preventDefault();
    try {
      const result = await api.mfaConfirm(this.state.mfaCode);
      this.setState({
        mfaSetup: null,
        mfaCode: '',
        backupCodes: result.backupCodes || [],
        userDetails: result.user,
        mfaMsgStatus: 'success',
        mfaMsg: 'Two-factor authentication is enabled. Save your backup codes now.',
      });
      sessionStorage.removeItem('mfaEnrollmentRequired');
      if (this.props.setUser) this.props.setUser(result.user);
      this.refresh();
    } catch (error) {
      this.setState({ mfaMsgStatus: 'error', mfaMsg: error.message });
    }
  };

  disableMfa = async (e) => {
    e.preventDefault();
    try {
      const { user } = await api.mfaDisable(
        this.state.mfaDisablePassword,
        this.state.mfaDisableCode,
      );
      this.setState({
        userDetails: user,
        mfaDisablePassword: '',
        mfaDisableCode: '',
        backupCodes: null,
        mfaMsgStatus: 'success',
        mfaMsg: 'Two-factor authentication has been disabled.',
      });
      if (this.props.setUser) this.props.setUser(user);
    } catch (error) {
      this.setState({ mfaMsgStatus: 'error', mfaMsg: error.message });
    }
  };

  renderMfaSection() {
    const { userDetails, mfaSetup, mfaRequired, backupCodes } = this.state;
    const enrollmentForced =
      mfaRequired &&
      !userDetails.mfaEnabled &&
      sessionStorage.getItem('mfaEnrollmentRequired') === '1';

    return (
      <>
        <h4>Two-factor authentication (TOTP)</h4>
        {enrollmentForced && (
          <Message
            warning
            header="MFA enrollment required"
            content="This deployment sets MFA_REQUIRED=true. Enroll an authenticator app before using the dashboard."
          />
        )}
        <p>
          Status:{' '}
          <strong>{userDetails.mfaEnabled ? 'Enabled' : 'Not enabled'}</strong>
          {mfaRequired ? ' (required for all officers)' : ''}
        </p>
        {backupCodes && backupCodes.length > 0 && (
          <Message info>
            <Message.Header>Backup codes (save these; shown once)</Message.Header>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{backupCodes.join('\n')}</pre>
          </Message>
        )}
        {!userDetails.mfaEnabled && !mfaSetup && (
          <Button type="button" primary onClick={this.startMfaSetup}>
            Set up authenticator
          </Button>
        )}
        {mfaSetup && (
          <Form
            success={this.state.mfaMsgStatus === 'success'}
            error={this.state.mfaMsgStatus === 'error'}
            onSubmit={this.confirmMfa}
          >
            <p>Scan this QR code with Google Authenticator, Authy, or a similar app:</p>
            <img
              src={mfaSetup.qrDataUrl}
              alt="MFA QR code"
              width={200}
              height={200}
              style={{ display: 'block', marginBottom: 12 }}
            />
            <p>
              Or enter this secret manually:{' '}
              <code style={{ wordBreak: 'break-all' }}>{mfaSetup.secret}</code>
            </p>
            <Form.Input
              label="Enter the 6-digit code to confirm"
              name="mfaCode"
              value={this.state.mfaCode}
              onChange={this.handleInputChange}
              autoComplete="one-time-code"
            />
            <Message success content={this.state.mfaMsg} />
            <Message error content={this.state.mfaMsg} />
            <Form.Button primary>Enable MFA</Form.Button>
          </Form>
        )}
        {userDetails.mfaEnabled && !mfaRequired && (
          <Form
            success={this.state.mfaMsgStatus === 'success'}
            error={this.state.mfaMsgStatus === 'error'}
            onSubmit={this.disableMfa}
          >
            <p>To disable MFA, confirm your password and a current authenticator (or backup) code.</p>
            <Form.Input
              label="Current password"
              name="mfaDisablePassword"
              type="password"
              value={this.state.mfaDisablePassword}
              onChange={this.handleInputChange}
            />
            <Form.Input
              label="Authentication code"
              name="mfaDisableCode"
              value={this.state.mfaDisableCode}
              onChange={this.handleInputChange}
            />
            <Message success content={this.state.mfaMsg} />
            <Message error content={this.state.mfaMsg} />
            <Form.Button negative>Disable MFA</Form.Button>
          </Form>
        )}
        {userDetails.mfaEnabled && mfaRequired && (
          <Message info content="MFA cannot be disabled while MFA_REQUIRED is set on the server." />
        )}
        {!mfaSetup && this.state.mfaMsgStatus && !userDetails.mfaEnabled && (
          <Message
            success={this.state.mfaMsgStatus === 'success'}
            error={this.state.mfaMsgStatus === 'error'}
            content={this.state.mfaMsg}
          />
        )}
      </>
    );
  }

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
                {this.renderMfaSection()}
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
