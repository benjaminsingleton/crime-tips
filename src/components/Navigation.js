import React, {Component} from 'react'
import { withRouter, Route } from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import {logout} from '../helpers/auth'

import {firebaseApp} from '../helpers/constants'

const AppBarWithLink = ({uid, handleToggle}) => (
  <Route render={({history}) => (
    <AppBar
      title="Gotham Police Crime Tips"
      iconElementRight={uid ? <FlatButton label="Log Out" onTouchTap={logout}/> : null}
      onLeftIconButtonTouchTap={handleToggle}
      onTitleTouchTap={() => {history.push('/')}}
      zDepth={0}
    />
  )} />
)

const HomeMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/')}}>Home</MenuItem>
))

const DashboardMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/dashboard')}}>Dashboard</MenuItem>
))

const FAQsMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/faq')}}>FAQ</MenuItem>
))

const AboutMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/about')}}>About</MenuItem>
))

const LoginMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/login')}}>Login</MenuItem>
))

const SettingsMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/settings')}}>My Settings</MenuItem>
))

const AccountManagementMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/account_management')}}>Account Management</MenuItem>
))

export default class Navigation extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      uid: null
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  componentDidMount() {
    const user = firebaseApp.auth().currentUser
    if (user) this.setState({uid: user.uid})
  }

  handleToggle = () => this.setState({open: !this.state.open});

  closeDrawer = () => this.setState({open: false});

  render() {
    return (
      <div>
        <AppBarWithLink uid={this.state.uid} handleToggle={this.handleToggle} />
        <Drawer
          open={this.state.open}
          onRequestChange={this.closeDrawer}
          docked={false}>
          {this.state.uid
            ? <div>
                <HomeMenuItem />
                <DashboardMenuItem />
                <SettingsMenuItem />
                <AccountManagementMenuItem />
                <AboutMenuItem />
              </div>
            : <div>
                <HomeMenuItem />
                <FAQsMenuItem />
                <AboutMenuItem />
                <LoginMenuItem />
              </div>
          }
        </Drawer>
      </div>
    )
  }
}