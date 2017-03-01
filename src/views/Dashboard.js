import React, { Component } from 'react';

import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import Mailbox from '../components/Mailbox'


class Dashboard extends Component {
  render() {
    return (
      <Layout isAdmin={true} >
        <DashboardMetrics />
        <Mailbox />
      </Layout>
    )
  }
}

export default Dashboard;
