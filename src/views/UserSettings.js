import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'

class UserSettings extends Component {
  render() {
    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <Card style={{marginLeft: '8px', marginTop: '8px'}} >
              <CardHeader title="My Settings"/>
              <Divider />
              <CardText>
                <h2>Rank Firstname Lastname</h2>
                <br />
                <Divider />
                <h3>Change Password</h3>
                <p>Type in a new password (twice) to change it</p>
                <TextField hintText="Password" />
                <TextField hintText="Password again" style={{marginBottom: '20px'}} />
                <RaisedButton label="Change Password" primary={true} style={{marginBottom: '20px'}}/>
                <Divider />
                <h3>Notifications</h3>
                <Toggle
                  label="Receive emails when new tips are submitted"
                  defaultToggled={true}
                />
              </CardText>
            </Card>
          </div>
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
            <Card style={{marginTop: '8px'}}>
              <CardHeader title="Recent Activity"/>
              <Divider />
              <CardText>
                <p>5m ago</p>
                <p><b>Ben Singleton</b> added a new tip.</p>
                <Divider />
                <p>8m ago</p>
                <p><b>Ben Singleton</b> added a new tip.</p>
                <Divider />
                <p>16m ago</p>
                <p><b>Ben Singleton</b> archived a tip.</p>
                <Divider />
                <p>2hr ago</p>
                <p><b>Ben Singleton</b> flagged a tip as important.</p>
                <Divider />
                <p>2hr ago</p>
                <p><b>Ben Singleton</b> read a tip.</p>
              </CardText>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
}

export default UserSettings;
