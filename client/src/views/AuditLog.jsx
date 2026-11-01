import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Layout from '../components/Layout';
import { api } from '../api';
import { Panel, TextInput, Button, Alert } from '../components/ui';

export default class AuditLog extends Component {
  state = {
    activities: [],
    total: 0,
    labels: {},
    userId: '',
    tipId: '',
    action: '',
    from: '',
    to: '',
    limit: 50,
    offset: 0,
    loading: false,
    error: '',
    draftPurge: null,
    purgeMessage: '',
    purgeBusy: false,
  };

  componentDidMount() {
    this.load();
    this.loadPurge();
  }

  load = async () => {
    this.setState({ loading: true, error: '' });
    try {
      const { userId, tipId, action, from, to, limit, offset } = this.state;
      const data = await api.listAudit({
        userId: userId.trim() || undefined,
        tipId: tipId.trim() || undefined,
        action: action.trim() || undefined,
        from: from || undefined,
        to: to || undefined,
        limit,
        offset,
      });
      this.setState({
        activities: data.activities || [],
        total: data.total || 0,
        labels: data.labels || {},
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: err.message || 'Failed to load audit log',
      });
    }
  };

  loadPurge = async () => {
    try {
      const { draftPurge } = await api.draftPurgeStatus();
      this.setState({ draftPurge });
    } catch (err) {
      console.error(err);
    }
  };

  applyFilters = (e) => {
    e.preventDefault();
    this.setState({ offset: 0 }, () => this.load());
  };

  changePage = (delta) => {
    this.setState(
      (prev) => ({
        offset: Math.max(0, prev.offset + delta * prev.limit),
      }),
      () => this.load(),
    );
  };

  exportJson = async () => {
    try {
      const { userId, tipId, action, from, to } = this.state;
      const data = await api.exportAudit({
        format: 'json',
        userId: userId.trim() || undefined,
        tipId: tipId.trim() || undefined,
        action: action.trim() || undefined,
        from: from || undefined,
        to: to || undefined,
        limit: 5000,
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'audit-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      this.setState({ error: err.message || 'Export failed' });
    }
  };

  runPurge = async (dryRun) => {
    this.setState({ purgeBusy: true, purgeMessage: '' });
    try {
      const { draftPurge } = await api.runDraftPurge({ dryRun });
      this.setState({
        draftPurge,
        purgeBusy: false,
        purgeMessage: dryRun
          ? `Dry run: ${draftPurge.lastCandidateCount} abandoned draft(s) would be deleted.`
          : `Purged ${draftPurge.lastDeletedCount} abandoned draft(s).`,
      });
    } catch (err) {
      this.setState({
        purgeBusy: false,
        purgeMessage: err.message || 'Purge failed',
      });
    }
  };

  formatRow = (item) => {
    const when = item.timestamp
      ? moment(new Date(item.timestamp)).format('YYYY-MM-DD HH:mm:ss')
      : '';
    const who = item.user?.displayName || item.user?.email || item.userId || '—';
    const label = this.state.labels[item.action] || item.action;
    const status = typeof item.status === 'boolean' ? String(item.status) : '—';
    return { when, who, label, status, tipId: item.tipId || '—' };
  };

  render() {
    const { activities, total, offset, limit, draftPurge } = this.state;
    return (
      <Layout user={this.props.user} onLogout={this.props.onLogout} variant="officer">
        <Panel title="Audit log" meta="Agency accountability feed (no tip narratives)">
          {this.state.error ? <Alert tone="error" content={this.state.error} /> : null}
          <form className="form-grid form-grid--2" onSubmit={this.applyFilters} style={{ marginBottom: '1rem' }}>
            <TextInput
              label="User id"
              name="userId"
              value={this.state.userId}
              onChange={(e) => this.setState({ userId: e.target.value })}
            />
            <TextInput
              label="Tip id"
              name="tipId"
              value={this.state.tipId}
              onChange={(e) => this.setState({ tipId: e.target.value })}
            />
            <TextInput
              label="Action"
              name="action"
              value={this.state.action}
              onChange={(e) => this.setState({ action: e.target.value })}
              placeholder="tipOpen, archived, userCreate…"
            />
            <TextInput
              label="From (ISO date)"
              name="from"
              value={this.state.from}
              onChange={(e) => this.setState({ from: e.target.value })}
              placeholder="2026-01-01"
            />
            <TextInput
              label="To (ISO date)"
              name="to"
              value={this.state.to}
              onChange={(e) => this.setState({ to: e.target.value })}
              placeholder="2026-12-31"
            />
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <Button type="submit" variant="primary" content="Apply filters" />
              <Button type="button" variant="secondary" content="Export JSON" onClick={this.exportJson} />
            </div>
          </form>

          <p style={{ color: 'var(--ct-muted)', fontSize: '0.85rem' }}>
            {this.state.loading ? 'Loading…' : `${total} event${total === 1 ? '' : 's'}`}
          </p>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Officer</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>Tip</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ cursor: 'default', color: 'var(--ct-muted)' }}>
                      No activity matches these filters.
                    </td>
                  </tr>
                ) : (
                  activities.map((item) => {
                    const row = this.formatRow(item);
                    return (
                      <tr key={item.id} style={{ cursor: 'default' }}>
                        <td>{row.when}</td>
                        <td>{row.who}</td>
                        <td>{row.label}</td>
                        <td>{row.status}</td>
                        <td style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>
                          {row.tipId}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="pager">
            {offset > 0 && (
              <Button content="Previous" variant="secondary" onClick={() => this.changePage(-1)} />
            )}
            {offset + activities.length < total && (
              <Button content="Next" variant="secondary" onClick={() => this.changePage(1)} />
            )}
          </div>
        </Panel>

        <Panel title="Abandoned draft retention" meta="Unsubmitted tips only">
          {draftPurge ? (
            <div className="subpanel__body">
              <p className="detail-row">
                Enabled: <b>{draftPurge.enabled ? 'yes' : 'no'}</b>
                {' · '}Retention days: <b>{draftPurge.retentionDays}</b>
                {' · '}Interval hours: <b>{draftPurge.intervalHours}</b>
              </p>
              <p className="detail-row">
                Last run: <b>{draftPurge.lastRunAt || 'never'}</b>
                {' · '}Dry run: <b>{String(Boolean(draftPurge.lastDryRun))}</b>
                {' · '}Candidates: <b>{draftPurge.lastCandidateCount}</b>
                {' · '}Deleted: <b>{draftPurge.lastDeletedCount}</b>
              </p>
              {draftPurge.lastError ? (
                <p className="detail-row" style={{ color: 'var(--ct-danger, #a33)' }}>
                  Last error: {draftPurge.lastError}
                </p>
              ) : null}
              {this.state.purgeMessage ? <Alert content={this.state.purgeMessage} /> : null}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Button
                  variant="secondary"
                  content="Dry run"
                  disabled={this.state.purgeBusy}
                  onClick={() => this.runPurge(true)}
                />
                <Button
                  variant="danger-outline"
                  content="Purge now"
                  disabled={this.state.purgeBusy || !draftPurge.enabled}
                  onClick={() => this.runPurge(false)}
                />
              </div>
              <p style={{ color: 'var(--ct-muted)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                Purge deletes DB rows and upload files for unsubmitted drafts older than retention.
                Submitted tips are never touched. See docs/ops/retention.md.
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--ct-muted)' }}>Loading retention status…</p>
          )}
        </Panel>
      </Layout>
    );
  }
}

AuditLog.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};

AuditLog.defaultProps = {
  user: null,
  onLogout: null,
};
