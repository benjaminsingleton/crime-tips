import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Incident from './components/tip/Incident';
import Suspect from './components/tip/Suspect';
import Vehicle from './components/tip/Vehicle';
import Drugs from './components/tip/Drugs';
import Media from './components/tip/Media';
import Final from './components/tip/Final';
import Success from './components/tip/Success';
import Login from './views/Login';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import UserSettings from './views/UserSettings';
import AccountManagement from './views/AccountManagement';
import LoggedOut from './views/LoggedOut';
import ForgotPassword from './views/ForgotPassword';
import NoMatch from './views/NoMatch';
import { firebaseApp } from './helpers/firebase';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (authed === true)
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  );
}

PrivateRoute.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
  component: PropTypes.func.isRequired,
  authed: PropTypes.bool.isRequired,
};

PrivateRoute.defaultProps = {
  location: null,
};

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (authed === false)
        ? <Component {...props} />
        : <Redirect to={props.location.state ? props.location.state.from : '/dashboard'} />}
    />
  );
}

PublicRoute.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.object,
  }),
  component: PropTypes.func.isRequired,
  authed: PropTypes.bool.isRequired,
};

PublicRoute.defaultProps = {
  location: null,
};

export default class App extends Component {
  state = {
    authed: false,
  }

  componentWillMount() {
    this.removeListener = firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const style = {
      background: '#2196F3',
      margin: '0px',
      boxSizing: 'border-box',
      minHeight: '100vh',
      borderBottom: 'solid 20px #1976d2',
    };
    return (
      <BrowserRouter>
        <div style={style}>
          <Switch>
            <Route path="/" exact component={Layout}>
              <Route path="/report_a_tip" exact component={Incident} />
              <Route path="/suspect" exact component={Suspect} />
              <Route path="/vehicle" exact component={Vehicle} />
              <Route path="/drugs" exact component={Drugs} />
              <Route path="/media" exact component={Media} />
              <Route path="/final" exact component={Final} />
              <Route path="/success" exact component={Success} />
              <Route path="/about" exact component={About} />
              <Route path="/faq" exact component={FAQ} />
              <PublicRoute authed={this.state.authed} path="/login" component={Login} />
              <PublicRoute authed={this.state.authed} path="/forgot_password" component={ForgotPassword} />
              <PrivateRoute authed={this.state.authed} path="/dashboard" component={Dashboard} />
              <PrivateRoute authed={this.state.authed} path="/settings" component={UserSettings} />
              <PrivateRoute authed={this.state.authed} path="/account_management" component={AccountManagement} />
              <PrivateRoute authed={this.state.authed} path="/tip/:tipId" component={Dashboard} />
              <PrivateRoute authed={this.state.authed} path="/logout" component={LoggedOut} />
              <Route component={NoMatch} />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}