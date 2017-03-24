import React, {Component} from 'react';
import base from '../base'
import _ from 'underscore'

import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import Mailbox from '../components/Mailbox'

import {oneDayAgoTimestamp, firstOfThisYearTimestamp} from '../helpers/helpers'

class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      tips: {},
      tipsToDisplay: null,
      selectedTipKeys: [],
      tipDetail: null,
      mailboxRightPanel: 'mailbox',
      searchTerm: ''
    }
    this.showTipDetail = this.showTipDetail.bind(this);
    this.addSelectedItem = this.addSelectedItem.bind(this);
    this.markTipAs = this.markTipAs.bind(this);
    this.filterTips = this.filterTips.bind(this);
    this.openTipLongForm = this.openTipLongForm.bind(this);
    this.reverseTips = this.reverseTips.bind(this)
    this.searchTips = this.searchTips.bind(this)
  }

  componentWillMount() {
    this.ref = base.syncState('tips', {
      context: this,
      state: 'tips'
    });
  }

  componentWillUnmount = () => base.removeBinding(this.ref);

  showTipDetail(key) {
    // Tip marked as read when clicked
    const tips = {
      ...this.state.tips
    };
    tips[key].readStatus = 'read'

    // Log activity to 'logs' and 'users/uid' for auditing purposes
    const user = this.props.uid;
    const timestamp = Date.now()
    base.push(`logs/`, {
      data: {
        user,
        tip: key,
        action: 'read',
        timestamp
      }
    });
    base.push(`users/${user}/activity/`, {
      data: {
        tip: key,
        action: 'read',
        timestamp
      }
    });

    this.setState({tips: tips, tipDetail: tips[key], mailboxRightPanel: 'detail'});
  }

  addSelectedItem(selectedRows) {
    // Adds keys of items checked in mailbox
    const tipsToDisplay = _.isEmpty(this.state.tipsToDisplay)
      ? this.reverseTips(this.state.tips)
      : this.state.tipsToDisplay

    const selectedTipKeys = []
    selectedRows.map((index) => selectedTipKeys.push(Object.keys(tipsToDisplay)[index]))

    this.setState({selectedTipKeys})
  }

  markTipAs(criteria) {
    const user = this.props.uid;
    const timestamp = Date.now()
    const tips = {...this.state.tips};

    // toggle criteria boolean value and log activity
    function updateItem(criteria, key) {
      const status = !tips[key][criteria]
      tips[key][criteria] = status

      base.push(`logs/`, {
        data: {
          user,
          tip: key,
          action: criteria,
          status,
          timestamp
        }
      });
      base.push(`users/${user}/activity/`, {
        data: {
          tip: key,
          action: criteria,
          status,
          timestamp
        }
      });
    };

    this.state.selectedTipKeys.map(key => updateItem(criteria, key))

    this.setState({tips: tips, selectedTipKeys: []});
  }

  reverseTips(tipObj) {
    const tipsToDisplay = {};
    Object.keys(tipObj).reverse().forEach((key) => tipsToDisplay[key] = tipObj[key])
    return tipsToDisplay
  }

  filterTips(criteria, value) {
    console.log(criteria, value)
    let filteredTips
    if (criteria === 'archived' && value === true) {
      filteredTips = _.pick(this.state.tips, key => key['archived'] === true)
    } else {
      let notArchivedTips = _.pick(this.state.tips, key => key['archived'] === false)
      filteredTips = _.pick(notArchivedTips, key => key[criteria] === value)
    }
    const tipsToDisplay = this.reverseTips(filteredTips);

    this.setState({
      tipsToDisplay, 
      mailboxRightPanel: 'mailbox', 
      searchTerm: ''
    })
  }

  openTipLongForm = () => this.setState({mailboxRightPanel: 'form'});

  searchTips(searchTerm) {
    if (searchTerm === '') {
      this.setState({searchTerm: '', tipsToDisplay: null})
    } else {
      console.log(searchTerm)
      const tips = {...this.state.tips}
      const matches = Object.keys(tips).filter(key => tips[key].tipText.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
      
      const tipsToDisplay = {}
      matches.reverse().forEach((key) => tipsToDisplay[key] = tips[key])
      this.setState({searchTerm, tipsToDisplay})
    }
  }

  render() {

    const {tips} = this.state;

    const tipsToDisplay = _.isNull(this.state.tipsToDisplay)
      ? this.reverseTips(_.pick(tips, key => key['archived'] === false))
      : this.state.tipsToDisplay

    const counts = {
      unreadCount: Object.keys(tips).filter(key => tips[key].readStatus === 'unread').length,
      lastTwentyFourHourTipCount: Object.keys(tips).filter(key => tips[key].dateTime >= oneDayAgoTimestamp()).length,
      thisYearTipCount: Object.keys(tips).filter(key => tips[key].dateTime >= firstOfThisYearTimestamp()).length
    }

    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <DashboardMetrics counts={counts} />
        <Mailbox
          tips={tips}
          tipsToDisplay={tipsToDisplay}
          unreadCount={counts.unreadCount}
          showTipDetail={this.showTipDetail}
          tipDetail={this.state.tipDetail}
          addSelectedItem={this.addSelectedItem}
          markTipAs={this.markTipAs}
          filterTips={this.filterTips}
          mailboxRightPanel={this.state.mailboxRightPanel}
          openTipLongForm={this.openTipLongForm}
          selectedTipKeys={this.state.selectedTipKeys}
          searchTips={this.searchTips} 
          searchTerm={this.state.searchTerm} />
      </Layout>
    )
  }
}

export default Dashboard;
