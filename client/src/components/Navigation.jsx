import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';
import { BrandMark } from './ui';
import { useBranding } from '../branding';

class NavigationInner extends Component {
  logout = async () => {
    if (this.props.onLogout) await this.props.onLogout();
  };

  render() {
    const user = this.props.user;
    const uid = user?.id;
    const admin = user?.admin;
    const { name, tagline, logoUrl } = this.props.branding;

    return (
      <header className="site-header">
        <div className="site-header__inner">
          <Link to={uid ? '/dashboard' : '/'} className="brand">
            <BrandMark logoUrl={logoUrl || undefined} alt="" />
            <span>
              <span className="brand__name">{name}</span>
              <span className="brand__tag">{tagline}</span>
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {!uid && (
              <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                Submit a tip
              </NavLink>
            )}
            {uid && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                Dashboard
              </NavLink>
            )}
            {uid && (
              <NavLink
                to="/settings"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                My settings
              </NavLink>
            )}
            {admin && (
              <NavLink
                to="/account_management"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                Accounts
              </NavLink>
            )}
            {admin && (
              <NavLink
                to="/branding"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                Branding
              </NavLink>
            )}
            {admin && (
              <NavLink
                to="/audit"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                Audit
              </NavLink>
            )}
            {!uid && (
              <NavLink
                to="/faq"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                FAQ
              </NavLink>
            )}
            {!uid && (
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                About
              </NavLink>
            )}
          </nav>

          <nav className="nav-links nav-links--right" aria-label="Account">
            {!uid && (
              <div className="lang-select">
                <label className="visually-hidden" htmlFor="lang">
                  Language
                </label>
                <select id="lang" defaultValue="en" aria-label="Language">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            )}
            {!uid ? (
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                Officer login
              </NavLink>
            ) : (
              <Link to="/login" className="nav-link" onClick={this.logout}>
                Sign out
              </Link>
            )}
          </nav>
        </div>
      </header>
    );
  }
}

NavigationInner.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  branding: PropTypes.shape({
    name: PropTypes.string,
    tagline: PropTypes.string,
    logoUrl: PropTypes.string,
  }).isRequired,
};

NavigationInner.defaultProps = {
  user: null,
  onLogout: null,
};

export default function Navigation(props) {
  const branding = useBranding();
  return <NavigationInner {...props} branding={branding} />;
}
