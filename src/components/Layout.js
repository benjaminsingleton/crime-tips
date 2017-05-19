import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';

const Layout = props => (
  <div>
    <Navigation />
    {props.children}
  </div>
  );

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
