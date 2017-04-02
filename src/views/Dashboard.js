import React, {Component} from 'react';
import _ from 'underscore'

import Layout from '../components/Layout'
import DashboardMetrics from '../components/DashboardMetrics'
import Mailbox from '../components/Mailbox'

import {oneDayAgoTimestamp, firstOfThisYearTimestamp} from '../helpers/helpers'
import {databaseRef} from '../helpers/constants'


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
      searchTerm: '',
      tipsPerPage: 10,
      showPage: 0
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
    this.changePage = this.changePage.bind(this)
  }

  componentWillMount() {
    databaseRef.child('tips').on('value', function(snapshot) {
      const tips = snapshot.val()
      this.setState({tips})
    }.bind(this));
  }

  componentDidMount() {
    document.body.style.backgroundColor = '#F5F5F5'
  }

  componentWillUnmount = () => databaseRef.child('tips').off();

  showTipDetail(key) {
    // Tip marked as read when clicked
    const tips = {...this.state.tips};
    tips[key].read = true

    databaseRef.child('tips/' + key).update({read: true})

    // Log activity to 'logs' and 'users/uid' for auditing purposes
    const user = this.props.uid;
    const timestamp = Date.now()

    databaseRef.child('logs/').push({
        user: user,
        tip: key,
        action: 'read',
        timestamp: timestamp
    });

    databaseRef.child(`users/${user}/activity/`).push({
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

  reverseTips(tipObj) {
    const tipsToDisplay = {};
    Object.keys(tipObj).reverse().forEach((key) => tipsToDisplay[key] = tipObj[key])
    return tipsToDisplay
  }

  paginateTips(tips) {
    const showPage = this.state.showPage
    const tipsPerPage = this.state.tipsPerPage
    const paginatedTips = {};
    Object.keys(tips).slice((showPage * tipsPerPage), (showPage * tipsPerPage + tipsPerPage))
                     .forEach((key) => paginatedTips[key] = tips[key]);
    return paginatedTips
  }

  displayTips() {
    const criteria = this.state.tipsToDisplayStatus['criteria']
    const value = this.state.tipsToDisplayStatus['value']
    const tips = this.state.tips

    let tipsToDisplay = _.pick(tips, key => key[criteria]===value)
    tipsToDisplay = this.reverseTips(tipsToDisplay)
    tipsToDisplay = this.paginateTips(tipsToDisplay)
    
    return tipsToDisplay
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

      databaseRef.child('tips/' + key).update({...tips[key]})

      databaseRef.child(`logs/`).push({
        user: user,
        tip: key,
        action: criteria,
        status: status,
        timestamp: timestamp
      });

      databaseRef.child(`users/${user}/activity/`).push({
        tip: key,
        action: criteria,
        status: status,
        timestamp: timestamp
      });
    };

    this.state.selectedTipKeys.map(key => updateItem(criteria, key))

    this.setState({tips, selectedTipKeys: []});
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

  changePage = (value) => this.setState({showPage: this.state.showPage + value})

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
      unreadCount: Object.keys(tips).filter(key => tips[key].read === false).length,
      lastTwentyFourHourTipCount: Object.keys(tips).filter(key => tips[key].timestamp >= oneDayAgoTimestamp()).length,
      thisYearTipCount: Object.keys(tips).filter(key => tips[key].timestamp >= firstOfThisYearTimestamp()).length
    }

    return (
      <Layout uid={this.props.uid}>
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
          searchTerm={this.state.searchTerm} 
          changePage={this.changePage} 
          showPage={this.state.showPage}
          tipsPerPage={this.state.tipsPerPage} />
      </Layout>
    )
  }
}

Dashboard.contextTypes = {
  router: React.PropTypes.object
}

export default Dashboard;
