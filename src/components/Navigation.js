import React, {Component} from 'react'
import { withRouter, Route } from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

const AppBarWithLink = ({uid, logout, handleToggle}) => (
  <Route render={({history}) => (
    <AppBar
      title="Gotham Police Crime Tips"
      iconElementRight={uid ? <FlatButton label="Log Out" onClick={logout}/> : null}
      onLeftIconButtonTouchTap={handleToggle}
      onTitleTouchTap={() => {history.push('/')}}
      zDepth={0}
    />
  )} />
)

const HomeMenuItem = withRouter(({ history }) => (
  <MenuItem onTouchTap={() => {history.push('/')}}>Home</MenuItem>
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

class Navigation extends Component {
  constructor() {
    super()
    this.state = {
      open: false
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle = () => this.setState({open: !this.state.open});

  closeDrawer = () => this.setState({open: false});

  render() {
    return (
      <div>
        <AppBarWithLink uid={this.props.uid} logout={this.props.logout} handleToggle={this.handleToggle} />
        <Drawer
          open={this.state.open}
          onRequestChange={this.closeDrawer}
          docked={false}>
          {this.props.uid
            ? <div>
                <HomeMenuItem />
                <SettingsMenuItem />
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

export default Navigation