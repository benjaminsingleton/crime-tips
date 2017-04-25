import React, { Component } from 'react';
import { Grid, Card, Form } from 'semantic-ui-react'
import Layout from '../components/Layout'

export default class ForgotPassword extends Component {
  state = {
    email: '',
    password: ''
  }

  handleInputChange = (e, { name, value }) => this.setState({[name]: value})

  handleSubmit = (event) => {
    event.preventDefault();
    // base.resetPassword({
    //   email: this.state.email
    // }, this.errorHandler);
  }

  render() {
    return (
      <Layout>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <Card centered fluid>
              <Card.Content header='Forgot Password' />
              <Card.Content>
                <p>Enter your email address and you will receive a link to reset your password.</p>
                <Form error={this.state.error} onSubmit={this.handleSubmit}>
                  <Form.Input 
                    name='email'
                    type='email'
                    placeholder='Email'
                    value={this.state.email}
                    onChange={this.handleChange}
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