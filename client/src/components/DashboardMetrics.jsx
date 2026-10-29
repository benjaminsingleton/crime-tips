import React, { Component } from 'react';
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
    const items = [
      { value: this.state.metrics.unreadTips, label: 'Unread tips' },
      { value: this.state.metrics.tipsReceivedLast24Hours, label: 'Last 24 hours' },
      { value: this.state.metrics.tipsReceivedYTD, label: 'Year to date' },
      { value: this.state.metrics.unreadAbandonedTips, label: 'Abandoned drafts' },
    ];

    return (
      <div className="metrics">
        {items.map((item) => (
          <div className="metric" key={item.label}>
            <div className="metric__value">{item.value}</div>
            <div className="metric__label">{item.label}</div>
          </div>
        ))}
      </div>
    );
  }
}
