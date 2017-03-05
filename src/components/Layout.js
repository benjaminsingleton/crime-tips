import React, { Component } from 'react';

import Navigation from '../components/Navigation'
import Footer from '../components/Footer'


class Layout extends Component {
  render() {
    return (
        <div id="wrapper">
            <div id="page-wrapper" className="gray-bg">
                < Navigation isAdmin={this.props.isAdmin} logout={this.props.logout} />
                    {this.props.children}
                < Footer />
            </div>
    </div>
    );
  }
}

export default Layout;
