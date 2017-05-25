import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Input, Table, Icon, Checkbox } from 'semantic-ui-react';
import { tipTimeFormat, reverse } from '../helpers/helpers';
import { firebaseApp } from '../helpers/firebase';

export default class Mailbox extends Component {
  state = {
    uid: firebaseApp.auth().currentUser.uid,
    tips: {},
    tipKeysToDisplay: [],
    selectedTipKeys: [],
    searchTerm: '',
    currentPage: 0,
    tipsPerPage: 10,
    showPreviousButton: false,
    showNextButton: true,
  }

  componentWillMount = () => {
    firebaseApp.database().ref('tips')
      .orderByChild(this.props.tipFilter.criteria)
      .equalTo(this.props.tipFilter.value)
      .limitToLast(1000)
      .on('value', (snapshot) => {
        const tips = reverse(snapshot.val());
        const tipKeysToDisplay = Object.keys(tips).slice(0, this.state.tipsPerPage);
        this.setState({ tips, tipKeysToDisplay });
      });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.tipFilter !== nextProps.tipFilter) {
      firebaseApp.database().ref('tips')
        .orderByChild(nextProps.tipFilter.criteria)
        .equalTo(nextProps.tipFilter.value)
        .limitToLast(1000)
        .on('value', (snapshot) => {
          const tips = reverse(snapshot.val());
          const tipKeysToDisplay = Object.keys(tips).slice(0, this.state.tipsPerPage);
          this.setState({ tips, tipKeysToDisplay });
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // update tip data in firebase when this.state.tip changes
    if (prevState.tips !== this.state.tips) {
      this.showPaginationButtons(0, this.state.tipsPerPage);
    }
  }

  componentWillUnmount = () => firebaseApp.database().ref('tips').off();

  showPaginationButtons(startIndex, endIndex) {
    const totalTips = Object.keys(this.state.tips).length;
    if (startIndex === 0) {
      if (totalTips - this.state.tipsPerPage <= 0) {
        this.setState({ showNextButton: false, showPreviousButton: false });
      } else {
        this.setState({ showNextButton: true, showPreviousButton: false });
      }
    } else if (totalTips - endIndex <= 0) {
      this.setState({ showNextButton: false, showPreviousButton: true });
    } else {
      this.setState({ showNextButton: true, showPreviousButton: true });
    }
  }

  changePage = (value) => {
    const nextPage = this.state.currentPage + value;
    const tipsPerPage = this.state.tipsPerPage;
    const startIndex = nextPage * tipsPerPage;
    const endIndex = startIndex + tipsPerPage;
    const tipKeysToDisplay = Object.keys(this.state.tips).slice(startIndex, endIndex);
    this.showPaginationButtons(startIndex, endIndex);
    this.setState({ currentPage: nextPage, tipKeysToDisplay });
  }

  addSelectedItem = (selectedTipKey) => {
    const selectedTipKeys = this.state.selectedTipKeys;

    const index = selectedTipKeys.indexOf(selectedTipKey);
    if (index === -1) {
      selectedTipKeys.push(selectedTipKey);
    } else {
      selectedTipKeys.splice(index, 1);
    }
    this.setState({ selectedTipKeys });
  }

  markTipAs = (key, criteria) => {
    const user = this.state.uid;
    const timestamp = Date.now();
    const tips = { ...this.state.tips };

    const status = !tips[key][criteria];
    tips[key][criteria] = status;

    if (criteria === 'archived' && status === true) {
      tips[key].important = false;
    }

    firebaseApp.database().ref(`tips/${key}`).update({ ...tips[key] });

    firebaseApp.database().ref('logs/').push({
      user,
      tip: key,
      action: criteria,
      status,
      timestamp,
    });

    firebaseApp.database().ref(`userActivity/${user}`).push({
      tip: key,
      action: criteria,
      status,
      timestamp,
    });
  };

  markSelectedTipsAs = (criteria) => {
    this.state.selectedTipKeys.map(key => this.markTipAs(key, criteria));

    this.setState({ selectedTipKeys: [] });
  }

  showTipDetail = (key) => {
    // Tip marked as read when clicked
    if (this.state.tips[key].read === false) {
      firebaseApp.database().ref(`tips/${key}`).update({ read: true });
      firebaseApp.database().ref('metrics/unreadTips').transaction(currentValue => currentValue - 1);
    }

    // Log activity to 'logs' and 'users/uid' for auditing purposes
    const user = this.state.uid;
    const timestamp = Date.now();
    firebaseApp.database().ref('logs/').push({
      user,
      tip: key,
      action: 'read',
      timestamp,
    });
    firebaseApp.database().ref(`userActivity/${user}`).push({
      tip: key,
      action: 'read',
      timestamp,
    });

    this.props.setTipDetailKey(key);
    this.props.history.push(`/tip/${key}`);
  }

  searchTips = searchTerm => this.setState({ searchTerm, currentPage: 0 });

  renderMailboxRows = (tipKeysToDisplay) => {
    const tips = this.state.tips;
    const mailboxRows = tipKeysToDisplay.map(key =>
      (<Table.Row key={key}>
        <Table.Cell width={1} textAlign="center">
          <Checkbox
            checked={this.state.selectedTipKeys.indexOf(key) !== -1}
            onChange={() => this.addSelectedItem(key)}
          />
        </Table.Cell>
        <Table.Cell width={1}>
          {tips[key].important ?
            <Icon name="star" color="yellow" onClick={() => this.markTipAs(key, 'important')} />
            : <Icon name="empty star" disabled onClick={() => this.markTipAs(key, 'important')} />
            }
          {tips[key].tipType === 'web' ?
            <Icon name="computer" disabled />
            : <Icon name="phone" disabled />
            }
        </Table.Cell>
        <Table.Cell width={4} onClick={() => this.showTipDetail(key)}>
          {tips[key].read ? tips[key].crimeType : <b>{tips[key].crimeType}</b>}
        </Table.Cell>
        <Table.Cell width={8} onClick={() => this.showTipDetail(key)}>
          {tips[key].read ? tips[key].tipText : <b>{tips[key].tipText}</b>}
        </Table.Cell>
        <Table.Cell width={1} onClick={() => this.showTipDetail(key)}>
          {tips[key].attachment ? <Icon name="attach" style={{ height: '20px', width: '20px' }} /> : null}
        </Table.Cell>
        <Table.Cell width={2} textAlign="right" onClick={() => this.showTipDetail(key)}>
          {tips[key].read
            ? tipTimeFormat(tips[key].timestampStart)
            : <b>{tipTimeFormat(tips[key].timestampStart)}</b>}
        </Table.Cell>
      </Table.Row>));
    return mailboxRows;
  }

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <h2 style={{ float: 'left' }}>Tip Inbox</h2>
          <form style={{ float: 'right' }}>
            <Input
              icon="search"
              placeholder="Search..."
              style={{ margin: '0 5px' }}
              value={this.state.searchTerm}
              onChange={e => this.searchTips(e.target.value)}
            />
          </form>
          <Button icon="archive" style={{ float: 'right', margin: '0 20px' }} onClick={() => this.markSelectedTipsAs('archived')} />
          <div style={{ clear: 'both' }} />
        </Card.Content>
        <Card.Content>
          <Table basic="very" fixed singleLine style={{ cursor: 'pointer' }}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={1} />
                <Table.HeaderCell width={1} />
                <Table.HeaderCell width={3}>Crime Type</Table.HeaderCell>
                <Table.HeaderCell width={8}>Tip Text</Table.HeaderCell>
                <Table.HeaderCell width={1}>File(s)</Table.HeaderCell>
                <Table.HeaderCell width={2} textAlign="right">Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {(this.state.tipKeysToDisplay.length === 0)
                ? null
                : this.renderMailboxRows(this.state.tipKeysToDisplay)}
            </Table.Body>
          </Table>
          <div style={{ textAlign: 'right' }}>
            {this.state.showPreviousButton && <Button content="Previous" onClick={() => this.changePage(-1)} />}
            {this.state.showNextButton && <Button content="Next" onClick={() => this.changePage(1)} />}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Mailbox.propTypes = {
  tipFilter: PropTypes.shape({
    criteria: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
  }).isRequired,
  setTipDetailKey: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
