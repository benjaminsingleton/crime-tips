import React, {Component} from 'react';
import {browserHistory} from 'react-router'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'

class ForgotPassword extends Component {

  constructor() {
    super();
    this.state = {
      email: ''
    }
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.errorHandler = this.errorHandler.bind(this)
  }

  handleTextChange(name, event) {
    this.setState({[name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    // base.resetPassword({
    //   email: this.state.email
    // }, this.errorHandler);
  }

  errorHandler(err) {
    if (err) {
      console.error(err)
      return;
    }
    browserHistory.push('/login')
  }

  render() {
    return (
      <Layout>
        <div className="row" style={{margin: '100px 2px 30px 2px'}}>
          <div
            className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-lg-offset-4 col-lg-4">
            <Card>
              <CardTitle title="Forgot Password"/>
              <Divider/>
              <form onSubmit={this.handleSubmit}>
                <CardText>
                  <div className="prompt">
                    Enter your email address and you will receive a link to reset your password.
                  </div>
                  <div>
                    <TextField
                      fullWidth={true}
                      value={this.state.email}
                      floatingLabelText="Email"
                      type="email"
                      onChange={this.handleTextChange.bind(null, "email")}/>
                  </div>
                </CardText>
                <CardActions>
                  <RaisedButton type="submit" label="Reset Password" primary={true}/>
                </CardActions>
              </form>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}

export default ForgotPassword;
