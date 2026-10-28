import React from 'react';
import PropTypes from 'prop-types';
import Navigation from './Navigation';

const Layout = ({ children, user, onLogout, variant = 'public' }) => (
  <>
    <Navigation user={user} onLogout={onLogout} />
    <main
      className={
        variant === 'officer' ? 'app-main app-main--wide' : 'app-main app-main--narrow'
      }
    >
      {children}
    </main>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.object,
  onLogout: PropTypes.func,
  variant: PropTypes.oneOf(['public', 'officer']),
};

Layout.defaultProps = {
  user: null,
  onLogout: null,
  variant: 'public',
};

export default Layout;
