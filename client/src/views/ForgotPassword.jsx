import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Panel, TextInput, Button, Alert } from '../components/ui';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    submitted: false,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ submitted: true });
  };

  render() {
    return (
      <Layout>
        <div className="auth-panel">
          <Panel title="Forgot password" meta="Account recovery">
            <p style={{ color: 'var(--ct-muted)', marginTop: 0 }}>
              Enter your email address. An administrator can reset your password from Account
              Management, or set <code>SMTP_*</code> env vars for email reset in a future release.
            </p>
            <form onSubmit={this.handleSubmit}>
              <TextInput
                name="email"
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
              {this.state.submitted && (
                <Alert
                  tone="success"
                  title="Request recorded"
                  content="Ask your department admin to reset your password if you cannot sign in."
                />
              )}
              <div style={{ marginTop: '1rem' }}>
                <Button type="submit" variant="primary" block>
                  Reset password
                </Button>
              </div>
            </form>
          </Panel>
        </div>
      </Layout>
    );
  }
}
