import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Panel, TextInput, Button, Alert } from '../components/ui';
import { api } from '../api';

function oidcErrorFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('oidc_error');
  } catch {
    return null;
  }
}

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    mfaCode: '',
    mfaToken: null,
    error: false,
    errorHeader: 'Invalid username or password',
    errorContent: 'Please try again.',
    oidc: { enabled: false, allowPassword: true, buttonLabel: 'Sign in with agency SSO' },
    oidcLoaded: false,
  };

  componentDidMount() {
    const oidcError = oidcErrorFromQuery();
    if (oidcError) {
      this.setState({
        error: true,
        errorHeader: 'Agency SSO failed',
        errorContent: oidcError,
      });
      // Drop error from the address bar without a full reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('oidc_error');
        window.history.replaceState({}, '', url.pathname + url.search);
      } catch {
        /* ignore */
      }
    }

    api
      .oidcStatus()
      .then((oidc) => this.setState({ oidc, oidcLoaded: true }))
      .catch(() => this.setState({ oidcLoaded: true }));
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async (e) => {
    e.preventDefault();
    const { mfaToken, email, password, mfaCode } = this.state;
    try {
      if (mfaToken) {
        const { user } = await api.verifyMfa(mfaToken, mfaCode);
        this.props.onLogin(user);
        return;
      }
      const result = await api.login(email, password);
      if (result.mfaRequired && result.mfaToken) {
        this.setState({
          mfaToken: result.mfaToken,
          mfaCode: '',
          error: false,
        });
        return;
      }
      this.props.onLogin(result.user, {
        mfaEnrollmentRequired: Boolean(result.mfaEnrollmentRequired),
      });
    } catch (err) {
      this.setState({
        error: true,
        errorHeader: mfaToken
          ? 'Invalid authentication code'
          : err?.data?.oidcRequired
            ? 'Password login disabled'
            : 'Invalid username or password',
        errorContent: err?.data?.oidcRequired
          ? 'Use agency SSO to sign in.'
          : 'Please try again.',
      });
    }
  };

  backToPassword = (e) => {
    e.preventDefault();
    this.setState({
      mfaToken: null,
      mfaCode: '',
      error: false,
    });
  };

  render() {
    const mfaStep = Boolean(this.state.mfaToken);
    const { oidc, oidcLoaded } = this.state;
    const showPassword = !oidcLoaded || oidc.allowPassword || !oidc.enabled;
    const showSso = oidc.enabled && !mfaStep;

    return (
      <Layout>
        <div className="auth-panel">
          <Panel
            title={mfaStep ? 'Two-factor authentication' : 'Officer login'}
            meta={
              mfaStep
                ? 'Enter the 6-digit code from your authenticator app'
                : 'Authorized personnel only'
            }
          >
            {showSso && (
              <div className="auth-sso">
                <a className="btn btn--primary btn--block" href="/api/auth/oidc/start">
                  {oidc.buttonLabel}
                </a>
                {showPassword && (
                  <p className="auth-sso__divider">
                    <span>or sign in with email</span>
                  </p>
                )}
              </div>
            )}

            {showPassword && (
              <form onSubmit={this.handleSubmit}>
                {!mfaStep ? (
                  <>
                    <TextInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      autoComplete="username"
                    />
                    <div style={{ height: '0.75rem' }} />
                    <TextInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      autoComplete="current-password"
                    />
                  </>
                ) : (
                  <TextInput
                    label="Authentication code"
                    name="mfaCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="123456"
                    value={this.state.mfaCode}
                    onChange={this.handleChange}
                  />
                )}
                {this.state.error && (
                  <Alert
                    tone="error"
                    title={this.state.errorHeader}
                    content={this.state.errorContent}
                  />
                )}
                <div style={{ marginTop: '1rem' }}>
                  <Button type="submit" variant="primary" block>
                    {mfaStep ? 'Verify' : 'Sign in'}
                  </Button>
                </div>
                {mfaStep ? (
                  <a href="#back" onClick={this.backToPassword} className="auth-link">
                    Back to password
                  </a>
                ) : (
                  <Link to="/forgot_password" className="auth-link">
                    Forgot password?
                  </Link>
                )}
              </form>
            )}

            {!showPassword && this.state.error && (
              <Alert
                tone="error"
                title={this.state.errorHeader}
                content={this.state.errorContent}
              />
            )}
          </Panel>
        </div>
      </Layout>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
