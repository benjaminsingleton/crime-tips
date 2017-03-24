import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

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
        <AppBar
          title="Gotham Police Crime Tips"
          iconElementRight={this.props.uid ? <FlatButton label="Log Out" onClick={this.props.logout}/> : null}
          onLeftIconButtonTouchTap={this.handleToggle}
          zDepth={0}/>
        <Drawer
          open={this.state.open}
          onRequestChange={this.closeDrawer}
          docked={false}>
          {this.props.uid
            ? <MenuItem>Settings</MenuItem>
            : <div>
                <MenuItem>FAQs</MenuItem>
                <MenuItem>About</MenuItem>
              </div>
          }
        </Drawer>
      </div>
    )
  }
}

export default Navigation