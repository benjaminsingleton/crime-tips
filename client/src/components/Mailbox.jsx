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
    crimeType: '',
    currentPage: 0,
    tipsPerPage: 10,
    total: 0,
    loading: false,
    showPreviousButton: false,
    showNextButton: false,
  };

  searchTimer = null;
  crimeTypeTimer = null;
  loadGeneration = 0;

  componentDidMount() {
    this.loadTips();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tipFilter !== this.props.tipFilter) {
      this.setState({ currentPage: 0, searchTerm: '', crimeType: '' }, () => this.loadTips());
    }
  }

  componentWillUnmount() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    if (this.crimeTypeTimer) clearTimeout(this.crimeTypeTimer);
    this.loadGeneration += 1;
  }

  loadTips = async () => {
    const generation = ++this.loadGeneration;
    const { tipFilter } = this.props;
    const { currentPage, tipsPerPage, searchTerm, crimeType } = this.state;
    const offset = currentPage * tipsPerPage;
    this.setState({ loading: true });
    try {
      const data = await api.listTips(tipFilter.criteria, tipFilter.value, {
        q: searchTerm.trim() || undefined,
        crimeType: crimeType.trim() || undefined,
        limit: tipsPerPage,
        offset,
      });
      if (generation !== this.loadGeneration) return;
      const tips = data.tips || {};
      const tipKeysToDisplay = Object.keys(tips);
      const total = Number(data.total || tipKeysToDisplay.length);
      this.setState({
        tips,
        tipKeysToDisplay,
        total,
        selectedTipKeys: [],
        loading: false,
        showPreviousButton: offset > 0,
        showNextButton: offset + tipKeysToDisplay.length < total,
      });
    } catch (err) {
      if (generation !== this.loadGeneration) return;
      console.error(err);
      this.setState({ loading: false });
    }
  };

  changePage = (value) => {
    this.setState(
      (prev) => ({ currentPage: Math.max(0, prev.currentPage + value) }),
      () => this.loadTips(),
    );
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
      this.loadTips();
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

  searchTips = (searchTerm) => {
    this.setState({ searchTerm, currentPage: 0 });
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadTips(), 300);
  };

  filterCrimeType = (crimeType) => {
    this.setState({ crimeType, currentPage: 0 });
    if (this.crimeTypeTimer) clearTimeout(this.crimeTypeTimer);
    this.crimeTypeTimer = setTimeout(() => this.loadTips(), 300);
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
    const { tipKeysToDisplay, total, loading } = this.state;
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
            placeholder="Search tip text, suspects, plates, contact…"
            value={this.state.searchTerm}
            onChange={(e) => this.searchTips(e.target.value)}
            aria-label="Search tips"
          />
          <input
            className="input search-input"
            type="search"
            placeholder="Crime type"
            value={this.state.crimeType}
            onChange={(e) => this.filterCrimeType(e.target.value)}
            aria-label="Filter by crime type"
          />
        </div>
        <p className="mailbox-meta" style={{ color: 'var(--ct-muted)', margin: '0 0 0.75rem', fontSize: '0.85rem' }}>
          {loading ? 'Loading…' : `${total} tip${total === 1 ? '' : 's'}`}
        </p>
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
              {tipKeysToDisplay.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ cursor: 'default', color: 'var(--ct-muted)' }}>
                    {loading ? 'Loading…' : 'No tips in this folder.'}
                  </td>
                </tr>
              ) : (
                this.renderMailboxRows(tipKeysToDisplay)
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
