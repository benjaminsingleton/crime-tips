import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom';
import Layout from './components/Layout';
import About from './views/About';
import FAQ from './views/FAQ';
import TipContainer from './components/tip/TipContainer';
import Login from './views/Login';
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
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
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
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
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
          <Layout>
            <Switch>
              <Route exact path="/" component={TipContainer} />
              <Route exact path="/suspect" component={TipContainer} />
              <Route exact path="/vehicle" component={TipContainer} />
              <Route exact path="/drugs" component={TipContainer} />
              <Route exact path="/media" component={TipContainer} />
              <Route exact path="/final" component={TipContainer} />
              <Route exact path="/submitted" component={TipContainer} />
              <Route exact path="/about" component={About} />
              <Route exact path="/faq" component={FAQ} />
              <PublicRoute exact authed={this.state.authed} path="/login" component={Login} />
              <PublicRoute exact authed={this.state.authed} path="/forgot_password" component={ForgotPassword} />
              <PrivateRoute exact authed={this.state.authed} path="/dashboard" component={Dashboard} />
              <PrivateRoute exact authed={this.state.authed} path="/settings" component={UserSettings} />
              <PrivateRoute exact authed={this.state.authed} path="/account_management" component={AccountManagement} />
              <PrivateRoute exact authed={this.state.authed} path="/tip/:tipId" component={Dashboard} />
              <PrivateRoute exact authed={this.state.authed} path="/logout" component={LoggedOut} />
              <Route component={NoMatch} />
            </Switch>
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}