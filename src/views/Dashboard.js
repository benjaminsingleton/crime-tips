import React, { Component } from 'react';
import base from '../base'

import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import Mailbox from '../components/Mailbox'

import { oneDayAgoTimestamp, firstOfThisYearTimestamp } from '../helpers/helpers'


class Dashboard extends Component {
  constructor () {
    super()
    this.state = {
      tips: {},
      tipsToDisplayStatus: {
        'criteria': 'archived',
        'value': false
      },
      selectedItems: [],
      tipDetail: null,
      mailboxRightPanel: 'mailbox',
    }
    this.showTipDetail = this.showTipDetail.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.markTipAs = this.markTipAs.bind(this);
    this.filterTips = this.filterTips.bind(this);
    this.openTipLongForm = this.openTipLongForm.bind(this);
  }

  componentWillMount () {
    this.ref = base.syncState('tips'
      , {
        context: this,
        state: 'tips'
    });
  }

  componentWillUnmount () {
    base.removeBinding(this.ref);
  }

  showTipDetail(key) {
    // Tip marked as read when clicked
    const tips = {...this.state.tips};
    tips[key].readStatus = 'read'

    // Log activity to 'logs' and 'users/uid' for auditing purposes
    const user = this.props.uid;
    const timestamp = Date.now()
    base.push(`logs/read/${key}`, {data: {user, timestamp}});
    base.push(`users/${user}/read/${key}`, {data: {timestamp}});
    
    this.setState({ 
      tips: tips, 
      tipDetail: tips[key],
      mailboxRightPanel: 'detail',
    });
  }

  addSelectedItem(key) {
    // Adds keys of items checked in mailbox
    const selectedItems = this.state.selectedItems

    if (!selectedItems.includes(key)) {
      selectedItems.push(key)
    } else {
      var pos = selectedItems.indexOf(key);
      selectedItems.splice(pos, 1)
    };

    this.setState({selectedItems: selectedItems})
  }

  markTipAs(criteria) {
    const user = this.props.uid;
    const timestamp = Date.now()
    const tips = {...this.state.tips};

    // toggle criteria boolean value and log activity
    function updateItem(criteria, key) {
      const status = !tips[key][criteria]
      tips[key][criteria] = status

      base.push(`logs/${criteria}/${key}`, {data: {user, status, timestamp}});
      base.push(`users/${user}/${criteria}/${key}`, {data: {status, timestamp}});
    };

    this.state.selectedItems.map(key => updateItem(criteria, key))

    this.setState({ 
      tips: tips, 
      selectedItems: []
    });
  }

  filterTips(criteria, value) {
    this.setState({ 
      tipsToDisplayStatus: {
        'criteria': criteria,
        'value': value
      },
      mailboxRightPanel: 'mailbox'
     });
  }

  openTipLongForm() {
    this.setState({ 
      mailboxRightPanel: 'form'
     });
  }

  render() {

    const {tips, tipsToDisplayStatus} = this.state;

    const tipsToDisplayKeys = Object.keys(tips).filter(key => tips[key][tipsToDisplayStatus['criteria']] === tipsToDisplayStatus['value'])

    const tipsToDisplay = {}
    for (var i = 0; i < tipsToDisplayKeys.length; i++) {
      tipsToDisplay[tipsToDisplayKeys[i]] = tips[tipsToDisplayKeys[i]]
    } 

    const counts = {
      unreadCount: Object.keys(tips).filter(key => tips[key].readStatus === 'unread').length,
      lastTwentyFourHourTipCount: Object.keys(tips).filter(key => tips[key].dateTime >= oneDayAgoTimestamp()).length,
      thisYearTipCount: Object.keys(tips).filter(key => tips[key].dateTime >= firstOfThisYearTimestamp()).length
    }

    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <DashboardMetrics counts={counts}/>
        <Mailbox  tips={this.state.tips} 
                  tipsToDisplay={tipsToDisplay}
                  unreadCount={counts.unreadCount}  
                  showTipDetail={this.showTipDetail}
                  tipDetail={this.state.tipDetail}
                  addSelectedItem={this.addSelectedItem}
                  markTipAs={this.markTipAs}
                  filterTips={this.filterTips}
                  mailboxRightPanel={this.state.mailboxRightPanel}
                  openTipLongForm={this.openTipLongForm}
                  selectedItems={this.state.selectedItems}
        />
      </Layout>
    )
  }
}

export default Dashboard;
