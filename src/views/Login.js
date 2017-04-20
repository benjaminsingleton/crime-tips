import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Card, Form, Message } from 'semantic-ui-react'
import Layout from '../components/Layout'
import { firebaseApp } from '../helpers/firebase'

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      error: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (e) => {
    e.preventDefault()
    firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch((error) => this.setState({ error: true }))
  }

  render () {
    const style = {
      forgotPassword: {
        textDecoration: 'none', 
        fontSize: '12px'
      }
    }
    return (
      <Layout>
        <Grid centered container columns={1}>
          <Grid.Column mobile={16} tablet={8} computer={8} largeScreen={8}>
            <Card centered fluid>
              <Card.Content header='Login' meta='Enter your credentials below' />
              <Card.Content>
                <Form error={this.state.error} onSubmit={this.handleSubmit}>
                  <Form.Input 
                    label='Email'
                    name='email'
                    type='email'
                    placeholder='Email'
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <Form.Input 
                    label='Password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  {this.state.error && <Message
                                         error
                                         header='Invalid username or password'
                                         content='Please try again.'
                                        />
                  }
                  <Form.Button>Submit</Form.Button>
                  <Link to="forgot_password" style={style.forgotPassword}>Forgot password?</Link>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}