import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import Layout from '../components/Layout';
import DashboardMetrics from '../components/DashboardMetrics';
import DashboardLeftPanel from '../components/DashboardLeftPanel';
import Mailbox from '../components/Mailbox';
import TipDetail from '../components/TipDetail';
import TipLongForm from '../components/TipLongForm';

class DashboardInner extends Component {
  state = {
    panelToDisplay: 'mailbox',
    tipFilter: {
      criteria: 'archived',
      value: false,
    },
    tipDetailKey: null,
  };

  componentDidMount() {
    if (this.props.tipId) {
      this.setTipDetailKey(this.props.tipId);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      if (this.props.location.pathname === '/dashboard') {
        this.setState({ panelToDisplay: 'mailbox', tipDetailKey: null });
      } else if (this.props.tipId) {
        this.setTipDetailKey(this.props.tipId);
      }
    }
  }

  setTipDetailKey = (tipDetailKey) =>
    this.setState({ tipDetailKey, panelToDisplay: 'detail' });

  changePanel = (panelToDisplay) => this.setState({ panelToDisplay });

  filterTips = (criteria, value) => {
    this.setState({
      tipFilter: { criteria, value },
      panelToDisplay: 'mailbox',
    });
    this.props.navigate('/dashboard');
  };

  renderDashboardRightPanel = () => {
    switch (this.state.panelToDisplay) {
      case 'mailbox':
        return (
          <Mailbox
            tipFilter={this.state.tipFilter}
            setTipDetailKey={this.setTipDetailKey}
            navigate={this.props.navigate}
          />
        );
      case 'detail':
        return (
          <TipDetail tipDetailKey={this.state.tipDetailKey} user={this.props.user} />
        );
      case 'form':
        return <TipLongForm user={this.props.user} />;
      default:
        return null;
    }
  };

  render() {
    return (
      <Layout user={this.props.user} onLogout={this.props.onLogout}>
        <DashboardMetrics />
        <Grid columns={4}>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={16} computer={6} largeScreen={4}>
              <DashboardLeftPanel
                filterTips={this.filterTips}
                changePanel={this.changePanel}
              />
            </Grid.Column>
            <Grid.Column mobile={16} tablet={16} computer={10} largeScreen={12}>
              {this.renderDashboardRightPanel()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

DashboardInner.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  navigate: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  tipId: PropTypes.string,
};

DashboardInner.defaultProps = {
  user: null,
  onLogout: null,
  tipId: null,
};

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tipId } = useParams();
  return (
    <DashboardInner
      user={user}
      onLogout={onLogout}
      navigate={navigate}
      location={location}
      tipId={tipId}
    />
  );
}

Dashboard.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

Dashboard.defaultProps = {
  user: null,
  onLogout: null,
};
