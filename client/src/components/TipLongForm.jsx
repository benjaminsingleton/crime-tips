import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { api } from '../api';
import { Panel, TextInput, TextArea, Button, Alert } from './ui';

export default class TipLongForm extends Component {
  state = {
    tip: {
      tipType: 'officer',
      tipText: '',
      crimeType: '',
      timestampStart: Date.now(),
    },
    success: false,
    error: null,
  };

  handleInputChange = (e, { name, value }) => {
    this.setState({ tip: { ...this.state.tip, [name]: value } });
  };

  createTip = async (event) => {
    event.preventDefault();
    try {
      await api.createTip({
        ...this.state.tip,
        submitted: true,
        timestampSubmit: Date.now(),
        officerId: this.props.user?.id,
      });
      this.setState({
        success: true,
        error: null,
        tip: {
          tipType: 'officer',
          tipText: '',
          crimeType: '',
          timestampStart: Date.now(),
        },
      });
    } catch (err) {
      this.setState({ error: err.message, success: false });
    }
  };

  render() {
    return (
      <Panel title="Submit a tip (officer)">
        <form onSubmit={this.createTip}>
          <TextInput
            label="Crime type"
            name="crimeType"
            value={this.state.tip.crimeType}
            onChange={this.handleInputChange}
          />
          <div style={{ height: '0.75rem' }} />
          <TextArea
            label="Tip"
            name="tipText"
            value={this.state.tip.tipText}
            onChange={this.handleInputChange}
          />
          {this.state.success && <Alert tone="success" content="Tip submitted." />}
          {this.state.error && <Alert tone="error" content={this.state.error} />}
          <div style={{ marginTop: '1rem' }}>
            <Button type="submit" variant="primary" content="Submit" />
          </div>
        </form>
      </Panel>
    );
  }
}

TipLongForm.propTypes = {
  user: PropTypes.object,
};

TipLongForm.defaultProps = {
  user: null,
};
