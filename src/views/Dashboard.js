import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import Layout from '../components/Layout';
import DashboardMetrics from '../components/DashboardMetrics';
import DashboardLeftPanel from '../components/DashboardLeftPanel';
import Mailbox from '../components/Mailbox';
import TipDetail from '../components/TipDetail';
import TipLongForm from '../components/TipLongForm';

export default class Dashboard extends Component {
  state = {
    panelToDisplay: 'mailbox',
    tipFilter: {
      criteria: 'archived',
      value: false,
    },
    tipDetailKey: null,
  }

  componentWillMount() {
    if (this.props.match.path === '/tip/:tipId') {
      this.setTipDetailKey(this.props.match.params.tipId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.path === '/dashboard' && this.state.panelToDisplay !== 'mailbox') {
      this.setState({ panelToDisplay: 'mailbox', tipDetailKey: null });
    } else if (nextProps.match.path === '/tip/:tipId') {
      this.setTipDetailKey(nextProps.match.params.tipId);
    }
  }

  setTipDetailKey = tipDetailKey => this.setState({ tipDetailKey, panelToDisplay: 'detail' })

  changePanel = panelToDisplay => this.setState({ panelToDisplay })

  filterTips = (criteria, value) => {
    this.setState({
      tipFilter: {
        criteria,
        value,
      },
      panelToDisplay: 'mailbox',
    });
    this.props.history.push('/dashboard');
  }


  renderDashboardRightPanel = () => {
    switch (this.state.panelToDisplay) {
      case 'mailbox':
        return (
          <Mailbox
            tipFilter={this.state.tipFilter}
            setTipDetailKey={this.setTipDetailKey}
            history={this.props.history}
          />
        );
      case 'detail':
        return <TipDetail tipDetailKey={this.state.tipDetailKey} />;
      case 'form':
        return <TipLongForm />;
      default:
        return null;
    }
  }

  render() {
    const dashboardRightPanel = this.renderDashboardRightPanel();
    return (
      <Layout>
        <DashboardMetrics />
        <Grid columns={4}>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={6} largeScreen={4}>
              <DashboardLeftPanel filterTips={this.filterTips} changePanel={this.changePanel} />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={10} largeScreen={12}>
              {dashboardRightPanel}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

Dashboard.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      tipId: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
