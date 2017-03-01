import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import SubmitATip from './views/SubmitATip';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import LoggedOut from './views/LoggedOut';
import ForgotPassword from './views/ForgotPassword';
import NoMatch from './views/NoMatch';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={SubmitATip} />
    <Route path="admin" component={Dashboard} />
    <Route path="login" component={Login} />
    <Route path="logout" component={LoggedOut} />
    <Route path="forgot_password" component={ForgotPassword} />
    <Route path="*" component={NoMatch} />
  </Router>,
  document.getElementById('root')
);
