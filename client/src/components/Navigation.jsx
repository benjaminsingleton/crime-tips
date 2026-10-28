import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Menu, Dropdown, Flag } from 'semantic-ui-react';

export default class Navigation extends Component {
  state = { activeItem: null };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  logout = async () => {
    if (this.props.onLogout) await this.props.onLogout();
  };

  render() {
    const { activeItem } = this.state;
    const user = this.props.user;
    const uid = user?.id;
    const admin = user?.admin;

    return (
      <Menu inverted stackable size="large" style={{ backgroundColor: '#1976d2' }}>
        <Menu.Item content="Gotham Crime Tips" header />
        {!uid && (
          <Menu.Item
            content="Home"
            name="home"
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
            as={Link}
            to="/"
          />
        )}
        {uid && (
          <Menu.Item
            content="Dashboard"
            name="dashboard"
            active={activeItem === 'dashboard'}
            onClick={this.handleItemClick}
            as={Link}
            to="/dashboard"
          />
        )}
        {uid && (
          <Menu.Item
            content="My Settings"
            name="settings"
            active={activeItem === 'settings'}
            onClick={this.handleItemClick}
            as={Link}
            to="/settings"
          />
        )}
        {admin && (
          <Menu.Item
            content="Account Management"
            name="accountManagement"
            active={activeItem === 'accountManagement'}
            onClick={this.handleItemClick}
            as={Link}
            to="/account_management"
          />
        )}
        {!uid && (
          <Menu.Item
            content="Questions?"
            name="faq"
            active={activeItem === 'faq'}
            onClick={this.handleItemClick}
            as={Link}
            to="/faq"
          />
        )}
        {!uid && (
          <Menu.Item
            content="About"
            name="about"
            active={activeItem === 'about'}
            onClick={this.handleItemClick}
            as={Link}
            to="/about"
          />
        )}
        <Menu.Menu position="right">
          {!uid && (
            <Dropdown item text="Language">
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Flag name="us" style={{ marginRight: '8px' }} />
                  English
                </Dropdown.Item>
                <Dropdown.Item>
                  <Flag name="mx" style={{ marginRight: '8px' }} />
                  Español
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
          {!uid ? (
            <Menu.Item
              content="Login"
              name="login"
              active={activeItem === 'login'}
              onClick={this.handleItemClick}
              as={Link}
              to="/login"
            />
          ) : (
            <Menu.Item content="Logout" onClick={this.logout} as={Link} to="/login" />
          )}
        </Menu.Menu>
      </Menu>
    );
  }
}

Navigation.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

Navigation.defaultProps = {
  user: null,
  onLogout: null,
};
