import React, {Component} from 'react'
import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import DashboardLeftPanel from '../components/DashboardLeftPanel'
import Mailbox from '../components/Mailbox'
import TipDetail from '../components/TipDetail'
import TipLongForm from '../components/TipLongForm'

export default class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      panelToDisplay: 'mailbox',
      tipFilter: {
        'criteria': 'archived',
        'value': false
      },
      tipDetailKey: null
    }
    this.renderDashboardRightPanel = this.renderDashboardRightPanel.bind(this)
    this.filterTips = this.filterTips.bind(this)
  }

  filterTips(criteria, value) {
    this.setState({
      tipFilter: {
        'criteria': criteria, 
        'value': value
      }, 
      panelToDisplay: 'mailbox'
    })
    this.props.history.push(`/dashboard`)
  } 

  changePanel = (panelToDisplay) => this.setState({panelToDisplay})

  setTipDetailKey = (tipDetailKey) => this.setState({tipDetailKey})

  renderDashboardRightPanel() {
    switch(this.state.panelToDisplay) {
      case 'mailbox':
        return (
          <Mailbox 
            tipFilter={this.state.tipFilter} 
            setTipDetailKey={this.setTipDetailKey} 
            changePanel={this.changePanel} 
            {...this.props}
          />
        )
      case 'detail':
        return <TipDetail tipDetailKey={this.state.tipDetailKey} />
      case 'form':
        return <TipLongForm />
      default:
        console.error('Invalid panel selected.')
    }
  }

  render() {
    return (
      <Layout>
        <DashboardMetrics />
        <div className="row" style={{margin: '10px 2px 8px 2px'}}>
          <DashboardLeftPanel filterTips={this.filterTips} changePanel={this.changePanel} /> 
          {this.renderDashboardRightPanel()}
        </div>
      </Layout>
    )
  }
}