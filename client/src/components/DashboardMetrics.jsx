import React, { Component } from 'react';
import { Grid, Segment, Icon } from 'semantic-ui-react';
import { api } from '../api';

export default class DashboardMetrics extends Component {
  state = {
    metrics: {
      unreadTips: 0,
      tipsReceivedLast24Hours: 0,
      tipsReceivedYTD: 0,
      unreadAbandonedTips: 0,
    },
  };

  componentDidMount() {
    this.load();
    this.timer = setInterval(() => this.load(), 15000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  load = async () => {
    try {
      const { metrics } = await api.metrics();
      this.setState({ metrics });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const style = {
      metric: { fontSize: '2em', fontWeight: 'bold' },
      label: { color: '#666' },
    };
    return (
      <Grid columns={4} stackable style={{ marginBottom: 10 }}>
        <Grid.Column>
          <Segment textAlign="center">
            <Icon name="mail outline" size="large" />
            <div style={style.metric}>{this.state.metrics.unreadTips}</div>
            <div style={style.label}>Unread tips</div>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            <Icon name="clock" size="large" />
            <div style={style.metric}>{this.state.metrics.tipsReceivedLast24Hours}</div>
            <div style={style.label}>Last 24 hours</div>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            <Icon name="calendar" size="large" />
            <div style={style.metric}>{this.state.metrics.tipsReceivedYTD}</div>
            <div style={style.label}>Year to date</div>
          </Segment>
        </Grid.Column>
        <Grid.Column>
          <Segment textAlign="center">
            <Icon name="wait" size="large" />
            <div style={style.metric}>{this.state.metrics.unreadAbandonedTips}</div>
            <div style={style.label}>Abandoned drafts</div>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}
