import React from 'react';

import Navigation from '../components/Navigation'

const Layout = (props) => {
  return (
    <div>
      <Navigation uid={props.uid} /> 
      {props.children}
    </div>
  );
}

export default Layout;
