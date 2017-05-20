import React, { Component } from 'react';
import { Grid, Card, Form, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { firebaseApp } from '../helpers/firebase';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    password: '',
  }

  handleInputChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (event) => {
    event.preventDefault();
    firebaseApp.auth().sendPasswordResetEmail(this.state.email).then(() => {
      this.setState({ success: true, error: false });
    }, () => {
      this.setState({ error: true });
    });
  }

  render() {
    return (
      <Layout>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <Card centered fluid>
              <Card.Content header="Forgot Password" />
              <Card.Content>
                <p>Enter your email address and you will receive a link to reset your password.</p>
                <Form
                  error={this.state.error}
                  success={this.state.success}
                  onSubmit={this.handleSubmit}
                >
                  <Form.Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <Message
                    success
                    header="Reset Password Email Sent"
                    content="Follow the instructions in the email you will receive shortly."
                  />
                  <Message
                    error
                    header="Error"
                    content="An error occurred. Check your email address."
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
