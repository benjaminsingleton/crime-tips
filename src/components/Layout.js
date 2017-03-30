import React from 'react';

import Navigation from '../components/Navigation'

const Layout = (props) => {
  return (
    <div>
      <Navigation uid={props.uid} logout={props.logout}/> 
      {props.children}
    </div>
  );
}

export default Layout;
