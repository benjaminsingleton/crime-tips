import React from 'react';

import Navigation from '../components/Navigation'
import Footer from '../components/Footer'


const Layout = (props) => {
    return (
        <div id="wrapper">
            <div id="page-wrapper" className="gray-bg">
                < Navigation isAdmin={props.isAdmin} logout={props.logout} />
                    {props.children}
                < Footer />
            </div>
        </div>
    );
}

export default Layout;
