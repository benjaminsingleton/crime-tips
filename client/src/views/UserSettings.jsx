import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import { api } from '../api';
import { relativeTime } from '../helpers/helpers';
import { Panel, TextInput, Button, Alert, Toggle } from '../components/ui';

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
        <h3 style={{ fontSize: '1.05rem' }}>Two-factor authentication (TOTP)</h3>
        {enrollmentForced && (
          <Alert
            tone="warn"
            title="MFA enrollment required"
            content="This deployment sets MFA_REQUIRED=true. Enroll an authenticator app before using the dashboard."
          />
        )}
        <p>
          Status:{' '}
          <strong>{userDetails.mfaEnabled ? 'Enabled' : 'Not enabled'}</strong>
          {mfaRequired ? ' (required for all officers)' : ''}
        </p>
        {backupCodes && backupCodes.length > 0 && (
          <Alert tone="info" title="Backup codes (save these; shown once)">
            <pre className="backup-codes">{backupCodes.join('\n')}</pre>
          </Alert>
        )}
        {!userDetails.mfaEnabled && !mfaSetup && (
          <Button type="button" variant="primary" onClick={this.startMfaSetup}>
            Set up authenticator
          </Button>
        )}
        {mfaSetup && (
          <form onSubmit={this.confirmMfa}>
            <p>Scan this QR code with Google Authenticator, Authy, or a similar app:</p>
            <img
              className="mfa-qr"
              src={mfaSetup.qrDataUrl}
              alt="MFA QR code"
              width={200}
              height={200}
            />
            <p>
              Or enter this secret manually:{' '}
              <code style={{ wordBreak: 'break-all' }}>{mfaSetup.secret}</code>
            </p>
            <TextInput
              label="Enter the 6-digit code to confirm"
              name="mfaCode"
              value={this.state.mfaCode}
              onChange={this.handleInputChange}
              autoComplete="one-time-code"
            />
            {this.state.mfaMsgStatus === 'success' && (
              <Alert tone="success" content={this.state.mfaMsg} />
            )}
            {this.state.mfaMsgStatus === 'error' && (
              <Alert tone="error" content={this.state.mfaMsg} />
            )}
            <div style={{ marginTop: '0.75rem' }}>
              <Button type="submit" variant="primary">
                Enable MFA
              </Button>
            </div>
          </form>
        )}
        {userDetails.mfaEnabled && !mfaRequired && (
          <form onSubmit={this.disableMfa}>
            <p>To disable MFA, confirm your password and a current authenticator (or backup) code.</p>
            <TextInput
              label="Current password"
              name="mfaDisablePassword"
              type="password"
              value={this.state.mfaDisablePassword}
              onChange={this.handleInputChange}
            />
            <div style={{ height: '0.65rem' }} />
            <TextInput
              label="Authentication code"
              name="mfaDisableCode"
              value={this.state.mfaDisableCode}
              onChange={this.handleInputChange}
            />
            {this.state.mfaMsgStatus === 'success' && (
              <Alert tone="success" content={this.state.mfaMsg} />
            )}
            {this.state.mfaMsgStatus === 'error' && (
              <Alert tone="error" content={this.state.mfaMsg} />
            )}
            <div style={{ marginTop: '0.75rem' }}>
              <Button type="submit" variant="danger">
                Disable MFA
              </Button>
            </div>
          </form>
        )}
        {userDetails.mfaEnabled && mfaRequired && (
          <Alert
            tone="info"
            content="MFA cannot be disabled while MFA_REQUIRED is set on the server."
          />
        )}
        {!mfaSetup && this.state.mfaMsgStatus && !userDetails.mfaEnabled && (
          <Alert
            tone={this.state.mfaMsgStatus === 'success' ? 'success' : 'error'}
            content={this.state.mfaMsg}
          />
        )}
      </>
    );
  }

  render() {
    const activityKeys = Object.keys(this.state.userActivity || {});
    return (
      <Layout user={this.props.user} onLogout={this.props.onLogout} variant="officer">
        <div style={{ maxWidth: '36rem', margin: '1.25rem auto 0' }}>
          <Panel title="My settings">
            <p style={{ marginTop: 0 }}>
              {this.state.userDetails.rank} {this.state.userDetails.firstName}{' '}
              {this.state.userDetails.lastName}
            </p>
            <p style={{ color: 'var(--ct-muted)' }}>{this.state.userDetails.email}</p>
            <hr className="section-divider" />
            <Toggle
              label="Email notifications"
              checked={!!this.state.userDetails.notifications}
              onChange={this.onToggle}
            />
            <hr className="section-divider" />
            {this.renderMfaSection()}
            <hr className="section-divider" />
            <form onSubmit={this.changePassword}>
              <TextInput
                label="New password"
                name="newPassword"
                type="password"
                value={this.state.newPassword}
                onChange={this.handleInputChange}
              />
              <div style={{ height: '0.65rem' }} />
              <TextInput
                label="Repeat password"
                name="newPasswordRepeat"
                type="password"
                value={this.state.newPasswordRepeat}
                onChange={this.handleInputChange}
              />
              {this.state.passwordMsgStatus === 'success' && (
                <Alert tone="success" content={this.state.passwordMsg} />
              )}
              {this.state.passwordMsgStatus === 'error' && (
                <Alert tone="error" content={this.state.passwordMsg} />
              )}
              <div style={{ marginTop: '0.75rem' }}>
                <Button type="submit" variant="primary">
                  Update password
                </Button>
              </div>
            </form>
            <hr className="section-divider" />
            <form onSubmit={this.changeEmail}>
              <TextInput
                label="New email"
                name="newEmail"
                type="email"
                value={this.state.newEmail}
                onChange={this.handleInputChange}
              />
              <div style={{ height: '0.65rem' }} />
              <TextInput
                label="Repeat email"
                name="newEmailRepeat"
                type="email"
                value={this.state.newEmailRepeat}
                onChange={this.handleInputChange}
              />
              {this.state.emailMsgStatus === 'success' && (
                <Alert tone="success" content={this.state.emailMsg} />
              )}
              {this.state.emailMsgStatus === 'error' && (
                <Alert tone="error" content={this.state.emailMsg} />
              )}
              <div style={{ marginTop: '0.75rem' }}>
                <Button type="submit" variant="primary">
                  Update email
                </Button>
              </div>
            </form>
            <hr className="section-divider" />
            <h3 style={{ fontSize: '1.05rem' }}>Recent activity</h3>
            {activityKeys.length === 0 ? (
              <p style={{ color: 'var(--ct-muted)' }}>No recent activity.</p>
            ) : (
              activityKeys.map((key) => (
                <p key={key}>
                  {this.state.userActivity[key].action} —{' '}
                  {relativeTime(this.state.userActivity[key].timestamp)}
                </p>
              ))
            )}
          </Panel>
        </div>
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
