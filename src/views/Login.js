import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Layout from '../components/Layout'
import { login, resetPassword } from '../helpers/auth'

function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

export default class Login extends Component {
  state = { loginMessage: null }
  handleSubmit = (e) => {
    e.preventDefault()
    login(this.state.email, this.state.pw)
      .catch((error) => {
          this.setState(setErrorMsg('Invalid username/password.'))
        })
  }
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }
  render () {
    return (
      <Layout>
        <div className="row" style={{margin: '100px 2px 30px 2px'}}>
          <div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-lg-offset-4 col-lg-4">
            <Card>
              <CardTitle title="Login" subtitle="Enter your credentials below"/>
              <Divider/>
              <form onSubmit={this.handleSubmit}>
                <CardText>
                  <div>
                    <TextField
                      fullWidth={true}
                      value={this.state.email}
                      floatingLabelText="Email"
                      type="email"
                      onChange={(e) => this.setState({email: e.target.value})}/>
                  </div>
                  <div>
                    <TextField
                      fullWidth={true}
                      value={this.state.pw}
                      floatingLabelText="Password"
                      type="password"
                      onChange={(e) => this.setState({pw: e.target.value})}/>
                  </div>
                </CardText>
                <CardActions>
                  <RaisedButton type="submit" label="Login" primary={true}/>
                  <Link to="forgot_password" style={{textDecoration: 'none', fontSize: '12px'}}>Forgot password?</Link>
                </CardActions>
              </form>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}