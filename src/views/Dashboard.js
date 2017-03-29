import React, {Component} from 'react';
import _ from 'underscore'

import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import Mailbox from '../components/Mailbox'

import {oneDayAgoTimestamp, firstOfThisYearTimestamp} from '../helpers/helpers'
import {ref} from '../helpers/constants'


class Dashboard extends Component {
  constructor() {
    super()
    this.state = {
      tips: {},
      tipsToDisplay: null,
      tipsToDisplayStatus: {
        'criteria': 'archived',
        'value': false
      },
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
    this.displayTips = this.displayTips.bind(this)
    this.searchResults = this.searchResults.bind(this)
  }

  componentWillMount() {
    ref.child('tips').on('value', function(snapshot) {
      const tips = snapshot.val()
      this.setState({tips})
    }.bind(this));
  }

  componentWillUnmount = () => ref.child('tips').off();

  showTipDetail(key) {
    // Tip marked as read when clicked
    const tips = {...this.state.tips};
    tips[key].readStatus = 'read'

    // Log activity to 'logs' and 'users/uid' for auditing purposes
    const user = this.props.uid;
    const timestamp = Date.now()

    ref.child('logs/').push({
        user: user,
        tip: key,
        action: 'read',
        timestamp: timestamp
    });

    ref.child(`users/${user}/activity/`).push({
        tip: key,
        action: 'read',
        timestamp: timestamp
    });

    this.setState({
      tips: tips, 
      tipDetail: {key: key, details: tips[key]}, 
      mailboxRightPanel: 'detail'
    });

    // this.context.router.history.push(`tip/${key}`)   NEEDS TO BE FIGURED OUT
  }

  displayTips() {
    const criteria = this.state.tipsToDisplayStatus['criteria']
    const value = this.state.tipsToDisplayStatus['value']
    return this.reverseTips(_.pick(this.state.tips, key => key[criteria]===value))
  }

  addSelectedItem(selectedRows) {
    const tipsToDisplay = (this.state.searchTerm === '') ? this.displayTips() : this.searchResults()
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

      if (criteria==='archived' && status ===true) {
        tips[key]['important'] = false
      }

      ref.child(`logs/`).push({
        user: user,
        tip: key,
        action: criteria,
        status: status,
        timestamp: timestamp
      });

      ref.child(`users/${user}/activity/`).push({
        tip: key,
        action: criteria,
        status: status,
        timestamp: timestamp
      });
    };

    this.state.selectedTipKeys.map(key => updateItem(criteria, key))

    this.setState({tips, selectedTipKeys: []});
  }

  reverseTips(tipObj) {
    const tipsToDisplay = {};
    Object.keys(tipObj).reverse().forEach((key) => tipsToDisplay[key] = tipObj[key])
    return tipsToDisplay
  }

  filterTips(criteria, value) {
    this.setState({ 
      tipsToDisplayStatus: {
        'criteria': criteria,
        'value': value
      },
      mailboxRightPanel: 'mailbox',
      searchTerm: ''
     });
  }

  openTipLongForm = () => this.setState({mailboxRightPanel: 'form'});

  searchTips = (searchTerm) => this.setState({searchTerm});

  searchResults() {
    const matches = Object.keys(this.state.tips)
                          .filter(key => this.state.tips[key].tipText
                                                              .toLowerCase()
                                                              .indexOf(this.state.searchTerm.toLowerCase()) !== -1)
    const tipsToDisplay = {}
    matches.reverse().forEach((key) => tipsToDisplay[key] = this.state.tips[key])
    return tipsToDisplay
  }

  render() {

    const {tips} = this.state;
    const tipsToDisplay = (this.state.searchTerm === '') ? this.displayTips() : this.searchResults()

    const counts = {
      unreadCount: Object.keys(tips).filter(key => tips[key].readStatus === 'unread').length,
      lastTwentyFourHourTipCount: Object.keys(tips).filter(key => tips[key].dateTime >= oneDayAgoTimestamp()).length,
      thisYearTipCount: Object.keys(tips).filter(key => tips[key].dateTime >= firstOfThisYearTimestamp()).length
    }

    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <DashboardMetrics counts={counts} />
        <Mailbox
          uid={this.props.uid}
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

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

export default Dashboard;
