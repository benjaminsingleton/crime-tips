import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Input, Table, Icon, Checkbox } from 'semantic-ui-react';
import { tipTimeFormat } from '../helpers/helpers';
import { api } from '../api';

export default class Mailbox extends Component {
  state = {
    tips: {},
    tipKeysToDisplay: [],
    selectedTipKeys: [],
    searchTerm: '',
    currentPage: 0,
    tipsPerPage: 10,
    showPreviousButton: false,
    showNextButton: true,
  };

  componentDidMount() {
    this.loadTips(this.props.tipFilter);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tipFilter !== this.props.tipFilter) {
      this.loadTips(this.props.tipFilter);
    }
    if (prevState.tips !== this.state.tips) {
      this.showPaginationButtons(0, this.state.tipsPerPage);
    }
  }

  loadTips = async (tipFilter) => {
    try {
      const { tips } = await api.listTips(tipFilter.criteria, tipFilter.value);
      const tipKeysToDisplay = Object.keys(tips || {}).slice(0, this.state.tipsPerPage);
      this.setState({ tips: tips || {}, tipKeysToDisplay, currentPage: 0, selectedTipKeys: [] });
    } catch (err) {
      console.error(err);
    }
  };

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
    const { tipsPerPage } = this.state;
    const startIndex = nextPage * tipsPerPage;
    const endIndex = startIndex + tipsPerPage;
    const tipKeysToDisplay = Object.keys(this.state.tips).slice(startIndex, endIndex);
    this.showPaginationButtons(startIndex, endIndex);
    this.setState({ currentPage: nextPage, tipKeysToDisplay });
  };

  addSelectedItem = (selectedTipKey) => {
    const selectedTipKeys = [...this.state.selectedTipKeys];
    const index = selectedTipKeys.indexOf(selectedTipKey);
    if (index === -1) selectedTipKeys.push(selectedTipKey);
    else selectedTipKeys.splice(index, 1);
    this.setState({ selectedTipKeys });
  };

  markTipAs = async (key, criteria) => {
    const tips = { ...this.state.tips };
    const status = !tips[key][criteria];
    tips[key] = { ...tips[key], [criteria]: status };
    if (criteria === 'archived' && status === true) {
      tips[key].important = false;
    }
    this.setState({ tips });
    try {
      const flags = { [criteria]: status };
      if (criteria === 'archived' && status) flags.important = false;
      await api.updateTipFlags(key, flags);
    } catch (err) {
      console.error(err);
      this.loadTips(this.props.tipFilter);
    }
  };

  markSelectedTipsAs = (criteria) => {
    this.state.selectedTipKeys.forEach((key) => this.markTipAs(key, criteria));
    this.setState({ selectedTipKeys: [] });
  };

  showTipDetail = async (key) => {
    if (this.state.tips[key].read === false) {
      try {
        await api.updateTipFlags(key, { read: true });
        const tips = { ...this.state.tips };
        tips[key] = { ...tips[key], read: true };
        this.setState({ tips });
      } catch (err) {
        console.error(err);
      }
    }
    this.props.setTipDetailKey(key);
    this.props.navigate(`/tip/${key}`);
  };

  searchTips = (searchTerm) => this.setState({ searchTerm, currentPage: 0 });

  filteredKeys = () => {
    const { searchTerm, tipKeysToDisplay, tips } = this.state;
    if (!searchTerm) return tipKeysToDisplay;
    const q = searchTerm.toLowerCase();
    return tipKeysToDisplay.filter((key) => {
      const tip = tips[key];
      return (
        String(tip.crimeType || '').toLowerCase().includes(q) ||
        String(tip.tipText || '').toLowerCase().includes(q)
      );
    });
  };

  renderMailboxRows = (tipKeysToDisplay) => {
    const { tips } = this.state;
    return tipKeysToDisplay.map((key) => (
      <Table.Row key={key}>
        <Table.Cell width={1} textAlign="center">
          <Checkbox
            checked={this.state.selectedTipKeys.indexOf(key) !== -1}
            onChange={() => this.addSelectedItem(key)}
          />
        </Table.Cell>
        <Table.Cell width={1}>
          {tips[key].important ? (
            <Icon name="star" color="yellow" onClick={() => this.markTipAs(key, 'important')} />
          ) : (
            <Icon name="star outline" disabled onClick={() => this.markTipAs(key, 'important')} />
          )}
          {tips[key].tipType === 'web' ? (
            <Icon name="computer" disabled />
          ) : (
            <Icon name="phone" disabled />
          )}
        </Table.Cell>
        <Table.Cell width={4} onClick={() => this.showTipDetail(key)}>
          {tips[key].read ? tips[key].crimeType : <b>{tips[key].crimeType}</b>}
        </Table.Cell>
        <Table.Cell width={8} onClick={() => this.showTipDetail(key)}>
          {tips[key].read ? tips[key].tipText : <b>{tips[key].tipText}</b>}
        </Table.Cell>
        <Table.Cell width={1} onClick={() => this.showTipDetail(key)}>
          {tips[key].attachments && Object.keys(tips[key].attachments).length > 0 ? (
            <Icon name="attach" />
          ) : null}
        </Table.Cell>
        <Table.Cell width={2} textAlign="right" onClick={() => this.showTipDetail(key)}>
          {tips[key].read ? (
            tipTimeFormat(tips[key].timestampStart || tips[key].dateTime)
          ) : (
            <b>{tipTimeFormat(tips[key].timestampStart || tips[key].dateTime)}</b>
          )}
        </Table.Cell>
      </Table.Row>
    ));
  };

  render() {
    const keys = this.filteredKeys();
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
              onChange={(e) => this.searchTips(e.target.value)}
            />
          </form>
          <Button
            icon="archive"
            style={{ float: 'right', margin: '0 20px' }}
            onClick={() => this.markSelectedTipsAs('archived')}
          />
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
                <Table.HeaderCell width={2} textAlign="right">
                  Date
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {keys.length === 0 ? null : this.renderMailboxRows(keys)}
            </Table.Body>
          </Table>
          <div style={{ textAlign: 'right' }}>
            {this.state.showPreviousButton && (
              <Button content="Previous" onClick={() => this.changePage(-1)} />
            )}
            {this.state.showNextButton && (
              <Button content="Next" onClick={() => this.changePage(1)} />
            )}
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Mailbox.propTypes = {
  tipFilter: PropTypes.shape({
    criteria: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
  setTipDetailKey: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};
