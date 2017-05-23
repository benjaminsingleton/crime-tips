import React, { Component } from 'react';

export default class TipContainer extends Component {
  state = {
    tipKey: null,
  }
  
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
