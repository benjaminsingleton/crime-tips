import React, { Component } from 'react';
import { Grid, Card, Form, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    submitted: false,
  };

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = (event) => {
    event.preventDefault();
    // Password reset email is not wired in the Postgres MVP; show guidance.
    this.setState({ submitted: true });
  };

  render() {
    return (
      <Layout>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <Card centered fluid>
              <Card.Content header="Forgot Password" />
              <Card.Content>
                <p>
                  Enter your email address. An administrator can reset your password from Account
                  Management, or set <code>SMTP_*</code> env vars for email reset in a future
                  release.
                </p>
                <Form success={this.state.submitted} onSubmit={this.handleSubmit}>
                  <Form.Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                  />
                  <Message
                    success
                    header="Request recorded"
                    content="Ask your department admin to reset your password if you cannot sign in."
                  />
                  <Form.Button>Reset Password</Form.Button>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}
