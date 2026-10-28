import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Button, Message } from 'semantic-ui-react';
import { api } from '../api';

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
      <Card fluid>
        <Card.Content header="Submit a tip (officer)" />
        <Card.Content>
          <Form success={this.state.success} error={!!this.state.error} onSubmit={this.createTip}>
            <Form.Input
              label="Crime type"
              name="crimeType"
              value={this.state.tip.crimeType}
              onChange={this.handleInputChange}
            />
            <Form.TextArea
              label="Tip"
              name="tipText"
              value={this.state.tip.tipText}
              onChange={this.handleInputChange}
            />
            <Message success content="Tip submitted." />
            <Message error content={this.state.error} />
            <Button content="Submit" color="violet" />
          </Form>
        </Card.Content>
      </Card>
    );
  }
}

TipLongForm.propTypes = {
  user: PropTypes.object,
};

TipLongForm.defaultProps = {
  user: null,
};
