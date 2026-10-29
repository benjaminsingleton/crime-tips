import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { tipTimeFormat } from '../helpers/helpers';
import { api } from '../api';
import { Button, Panel } from './ui';

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
      <tr key={key} className={tips[key].read ? undefined : 'is-unread'}>
        <td className="cell-actions" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={this.state.selectedTipKeys.indexOf(key) !== -1}
            onChange={() => this.addSelectedItem(key)}
            aria-label={`Select tip ${key}`}
          />
        </td>
        <td className="cell-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`star-btn${tips[key].important ? ' is-on' : ''}`}
            aria-label={tips[key].important ? 'Unmark important' : 'Mark important'}
            onClick={() => this.markTipAs(key, 'important')}
          >
            {tips[key].important ? '★' : '☆'}
          </button>
          <span style={{ marginLeft: 4, color: 'var(--ct-muted)', fontSize: '0.75rem' }}>
            {tips[key].tipType === 'web' ? 'Web' : 'Phone'}
          </span>
        </td>
        <td onClick={() => this.showTipDetail(key)}>{tips[key].crimeType}</td>
        <td onClick={() => this.showTipDetail(key)}>{tips[key].tipText}</td>
        <td onClick={() => this.showTipDetail(key)}>
          {tips[key].attachments && Object.keys(tips[key].attachments).length > 0 ? 'Yes' : '—'}
        </td>
        <td onClick={() => this.showTipDetail(key)} style={{ textAlign: 'right' }}>
          {tipTimeFormat(tips[key].timestampStart || tips[key].dateTime)}
        </td>
      </tr>
    ));
  };

  render() {
    const keys = this.filteredKeys();
    return (
      <Panel>
        <div className="mailbox-toolbar">
          <h2>Tip inbox</h2>
          <Button
            size="sm"
            variant="secondary"
            content="Archive selected"
            onClick={() => this.markSelectedTipsAs('archived')}
          />
          <input
            className="input search-input"
            type="search"
            placeholder="Search…"
            value={this.state.searchTerm}
            onChange={(e) => this.searchTips(e.target.value)}
            aria-label="Search tips"
          />
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th aria-label="Select" />
                <th aria-label="Flags" />
                <th>Crime type</th>
                <th>Tip</th>
                <th>Files</th>
                <th style={{ textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ cursor: 'default', color: 'var(--ct-muted)' }}>
                    No tips in this folder.
                  </td>
                </tr>
              ) : (
                this.renderMailboxRows(keys)
              )}
            </tbody>
          </table>
        </div>
        <div className="pager">
          {this.state.showPreviousButton && (
            <Button content="Previous" variant="secondary" onClick={() => this.changePage(-1)} />
          )}
          {this.state.showNextButton && (
            <Button content="Next" variant="secondary" onClick={() => this.changePage(1)} />
          )}
        </div>
      </Panel>
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
