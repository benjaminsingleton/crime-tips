import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'

import {blue700, blue500, blue100, redA200} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SubmitATip from './views/SubmitATip';
import Dashboard from './views/Dashboard';
import UserSettings from './views/UserSettings';
import Login from './views/Login';
import LoggedOut from './views/LoggedOut';
import ForgotPassword from './views/ForgotPassword';
import NoMatch from './views/NoMatch';
import ProtectedView from './components/ProtectedView'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue700,
    primary2Color: blue500,
    primary3Color: blue100,
    accent1Color: redA200,
  },
});

ReactDOM.render(
	<MuiThemeProvider muiTheme={muiTheme}>
	<Router history={browserHistory}>
		<Route path="/" component={SubmitATip} />
		<Route component={ProtectedView}>
			<Route path="login" component={Login} />
			<Route path="admin" component={Dashboard} />
			<Route path="settings" component={UserSettings} />
			<Route path="logout" component={LoggedOut} />
		</Route>
		<Route path="forgot_password" component={ForgotPassword} />
		<Route path="*" component={NoMatch} />
  	</Router>
	</MuiThemeProvider>,
  document.getElementById('root')
);
