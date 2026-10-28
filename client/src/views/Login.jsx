import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Card, Form, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { api } from '../api';

export default class Login extends Component {
  state = {
    email: '',
    password: '',
    mfaCode: '',
    mfaToken: null,
    error: false,
    errorHeader: 'Invalid username or password',
    errorContent: 'Please try again.',
  };

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
    } catch {
      this.setState({
        error: true,
        errorHeader: mfaToken
          ? 'Invalid authentication code'
          : 'Invalid username or password',
        errorContent: 'Please try again.',
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
    const style = {
      forgotPassword: {
        textDecoration: 'none',
        fontSize: '12px',
      },
    };
    const mfaStep = Boolean(this.state.mfaToken);
    return (
      <Layout>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <Card centered fluid>
              <Card.Content
                header={mfaStep ? 'Two-factor authentication' : 'Login'}
                meta={
                  mfaStep
                    ? 'Enter the 6-digit code from your authenticator app'
                    : 'Enter your credentials below'
                }
              />
              <Card.Content>
                <Form error={this.state.error} onSubmit={this.handleSubmit}>
                  {!mfaStep ? (
                    <>
                      <Form.Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        autoComplete="username"
                      />
                      <Form.Input
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
                    <Form.Input
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
                    <Message
                      error
                      header={this.state.errorHeader}
                      content={this.state.errorContent}
                    />
                  )}
                  <Form.Button>{mfaStep ? 'Verify' : 'Submit'}</Form.Button>
                  {mfaStep ? (
                    <a href="#back" onClick={this.backToPassword} style={style.forgotPassword}>
                      Back to password
                    </a>
                  ) : (
                    <Link to="/forgot_password" style={style.forgotPassword}>
                      Forgot password?
                    </Link>
                  )}
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
