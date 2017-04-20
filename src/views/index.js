import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import Login from './Login'
import FAQ from './FAQ'
import About from './About'
import Home from './Home';
import Dashboard from './Dashboard';
import UserSettings from './UserSettings';
import AccountManagement from './AccountManagement';
import LoggedOut from './LoggedOut';
import ForgotPassword from './ForgotPassword';
import NoMatch from './NoMatch';
import { firebaseApp } from '../helpers/firebase'

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
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
        : <Redirect to={props.location.state ? props.location.state.from : '/dashboard'} />}
    />
  )
}

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      authed: false
    }
  }
  
  componentWillMount () {
    this.removeListener = firebaseApp.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user) {
        this.setState({authed: true})
      } else {
        this.setState({authed: false})
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' exact component={About} />
            <Route path='/faq' exact component={FAQ} />
            <PublicRoute authed={this.state.authed} path='/login' component={Login} />
            <PublicRoute authed={this.state.authed} path='/forgot_password' component={ForgotPassword} />
            <PrivateRoute authed={this.state.authed} path='/dashboard' component={Dashboard} />
            <PrivateRoute authed={this.state.authed} path='/settings' component={UserSettings} />
            <PrivateRoute authed={this.state.authed} path='/account_management' component={AccountManagement} />
            <PrivateRoute authed={this.state.authed} path='/tip/:tipId' component={Dashboard} />
            <PrivateRoute authed={this.state.authed} path='/logout' component={LoggedOut} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}