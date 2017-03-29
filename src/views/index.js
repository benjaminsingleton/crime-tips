import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue700, blue500, blue100, redA200} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Login from './Login'
import Home from './Home';
import Dashboard from './Dashboard';
import UserSettings from './UserSettings';
import LoggedOut from './LoggedOut';
import ForgotPassword from './ForgotPassword';
import NoMatch from './NoMatch';

import { firebaseAuth } from '../helpers/constants'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue700,
    primary2Color: blue500,
    primary3Color: blue100,
    accent1Color: redA200,
  },
});

function PrivateRoute ({component: Component, authed, uid, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} uid={uid} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/dashboard' />}
    />
  )
}

export default class App extends Component {
  state = {
    authed: false,
    uid: null
  }
  componentDidMount () {
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authed: true,
          uid: user.uid,
        })
      } else {
        this.setState({
          authed: false,
          uid: null,
        })
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <BrowserRouter>
          <div>
            <Switch>
              <Route path='/' exact component={Home} />
              <PublicRoute authed={this.state.authed} path='/login' component={Login} />
              <PublicRoute authed={this.state.authed} path='/forgot_password' component={ForgotPassword} />
              <PrivateRoute authed={this.state.authed} uid={this.state.uid} path='/dashboard' component={Dashboard} />
              <PrivateRoute authed={this.state.authed} path='/settings' component={UserSettings} />
              <PrivateRoute authed={this.state.authed} path='/tip/:tipId' component={Dashboard} />
              <PrivateRoute authed={this.state.authed} path='/logout' component={LoggedOut} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}