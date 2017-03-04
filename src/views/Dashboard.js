import React, { Component } from 'react';
import base from '../base'

import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import Mailbox from '../components/Mailbox'

import { oneDayAgoTimestamp, firstOfThisYearTimestamp } from '../helpers'


class Dashboard extends Component {
  constructor () {
    super()

    // get initial state
    this.state = {
      tips: {},
      tipsToDisplayStatus: 'all',
      tipsToDisplay: {},
      selectedItems: [],
      showTipDetail: false,
      tipDetail: null,
      mailboxRightPanel: 'mailbox'
    }

    this.markAsRead = this.markAsRead.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.markTipAs = this.markTipAs.bind(this);
    this.showTips = this.showTips.bind(this);
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

  markAsRead(key) {
    // Tip marked as read when clicked
    const tips = {...this.state.tips};
    tips[key].readStatus = 'read'
    
    this.setState({ 
      tips: tips, 
      showTipDetail: true,
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

  markTipAs(name) {
    // Marks selected tips as important or archived
    const tips = {...this.state.tips};

    switch (name) {
      case 'important':
        this.setState({ tips });
        break;
      case 'archived':
        this.state.selectedItems.map(key => tips[key].important = !tips[key].important);
        break;
      default:
        throw new Error({'Unrecognized':"Items can only be marked 'important' or 'archived'"}); 
    }
    
    this.setState({ tips: tips, selectedItems: []});
  }

  showTips(criteria) {
    // Displays tips
    const tips = {...this.state.tips};

    var filteredTipKeys = []

    switch (criteria) {
      case 'all':
        filteredTipKeys = Object.keys(tips).filter(key => tips[key].archived === false);
        this.setState({ tipsToDisplayStatus: 'all'});
        break;
      case 'important':
        filteredTipKeys = Object.keys(tips).filter(key => tips[key].important === true);
        this.setState({ tipsToDisplayStatus: 'important'});
        break;
      case 'archived':
        filteredTipKeys = Object.keys(tips).filter(key => tips[key].archived === true);
        this.setState({ tipsToDisplayStatus: 'archived'});
        break;
      default:
        throw new Error({'Unrecognized':"Items can only be filtered as 'important' or 'archived'"}); 
    }

    const newTipsToDisplay = {}
    for (let key of filteredTipKeys) {
      newTipsToDisplay[key] = tips[key]
    }

    // Object.keys(tips).filter(key => tips[key].important === true).map(key => tipsToDisplay[key] = tips[key] }) // why doesnt this work

    this.setState({ 
      tipsToDisplay: newTipsToDisplay,
      showTipDetail: false,
      tipDetail: null,
      mailboxRightPanel: 'mailbox'
     });
  }

  openTipLongForm() {
    this.setState({ 
      mailboxRightPanel: 'form'
     });
  }

  render() {
    const {tips} = this.state;

    const unreadCount = Object.keys(tips).filter(key => tips[key].readStatus === 'unread').length
    const lastTwentyFourHourTipCount = Object.keys(tips).filter(key => tips[key].dateTime >= oneDayAgoTimestamp()).length
    const thisYearTipCount = Object.keys(tips).filter(key => tips[key].dateTime >= firstOfThisYearTimestamp()).length

    const counts = {
      unreadCount,
      lastTwentyFourHourTipCount,
      thisYearTipCount,
    }

    var filteredTipKeys = []
    
    switch (this.state.tipsToDisplayStatus) {
      case 'all':
        filteredTipKeys = Object.keys(tips).filter(key => tips[key].archived === false);
        break;
      case 'important':
        filteredTipKeys = Object.keys(tips).filter(key => tips[key].important === true);
        break;
      case 'archived':
        filteredTipKeys = Object.keys(tips).filter(key => tips[key].archived === true);
        break;
      default:
        throw new Error({'Unrecognized':"Items can only be filtered as 'important' or 'archived'"}); 
    }

    const tipsToDisplay = {}

    for (let key of filteredTipKeys) {
      tipsToDisplay[key] = tips[key]
    }

    return (
      <Layout isAdmin={true} >
        <DashboardMetrics counts={counts}/>
        <Mailbox  tips={this.state.tips} 
                  tipsToDisplay={tipsToDisplay}
                  unreadCount={unreadCount}  
                  markAsRead={this.markAsRead} 
                  addSelectedItem={this.addSelectedItem}
                  markTipAs={this.markTipAs}
                  showTips={this.showTips}
                  showTipDetail={this.state.showTipDetail}
                  tipDetail={this.state.tipDetail}
                  mailboxRightPanel={this.state.mailboxRightPanel}
                  openTipLongForm={this.openTipLongForm}
                  />
      </Layout>
    )
  }
}

export default Dashboard;
