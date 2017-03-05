import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import SubmitATip from './views/SubmitATip';
import Dashboard from './views/Dashboard';
import UserSettings from './views/UserSettings';
import Login from './views/Login';
import LoggedOut from './views/LoggedOut';
import ForgotPassword from './views/ForgotPassword';
import NoMatch from './views/NoMatch';
import ProtectedView from './components/ProtectedView'

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={SubmitATip} />
		<Route component={ProtectedView}>
			<Route path="admin" component={Dashboard} />
			<Route path="settings" component={UserSettings} />
			<Route path="login" component={Login} />
			<Route path="logout" component={LoggedOut} />
		</Route>
		<Route path="forgot_password" component={ForgotPassword} />
		<Route path="*" component={NoMatch} />
  	</Router>,
  document.getElementById('root')
);
