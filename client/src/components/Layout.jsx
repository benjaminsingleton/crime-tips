import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './Navigation';

const Layout = ({ children, user, onLogout }) => (
  <div>
    <Navigation user={user} onLogout={onLogout} />
    {children}
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

Layout.defaultProps = {
  user: null,
  onLogout: null,
};

export default Layout;
