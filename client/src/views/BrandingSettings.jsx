import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layout from '../components/Layout';
import { Panel, TextInput, Button, Alert } from '../components/ui';
import { api } from '../api';
import { useBranding } from '../branding';

class BrandingSettingsInner extends Component {
  state = {
    name: '',
    tagline: '',
    logoUrl: '',
    primaryColor: '#102033',
    accentColor: '#b8974a',
    env: {},
    loading: true,
    saving: false,
    message: null,
    error: null,
  };

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const data = await api.getBrandingAdmin();
      const b = data.branding || {};
      this.setState({
        name: b.name || '',
        tagline: b.tagline || '',
        logoUrl: b.logoUrl || '',
        primaryColor: b.primaryColor || '#102033',
        accentColor: b.accentColor || '#b8974a',
        env: data.env || {},
        loading: false,
        error: null,
      });
    } catch (err) {
      this.setState({
        loading: false,
        error: err.message || 'Failed to load branding',
      });
    }
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  save = async (e) => {
    e.preventDefault();
    this.setState({ saving: true, message: null, error: null });
    try {
      await api.updateBranding({
        name: this.state.name,
        tagline: this.state.tagline,
        logoUrl: this.state.logoUrl || null,
        primaryColor: this.state.primaryColor,
        accentColor: this.state.accentColor,
      });
      if (this.props.refreshBranding) await this.props.refreshBranding();
      this.setState({ saving: false, message: 'Branding saved. Public tip site and officer shell updated.' });
      await this.load();
    } catch (err) {
      this.setState({ saving: false, error: err.message || 'Save failed' });
    }
  };

  reset = async () => {
    if (!window.confirm('Clear admin branding overrides and remove an uploaded logo? Env defaults will apply again.')) {
      return;
    }
    this.setState({ saving: true, message: null, error: null });
    try {
      await api.resetBranding();
      if (this.props.refreshBranding) await this.props.refreshBranding();
      this.setState({ saving: false, message: 'Overrides cleared. Showing env / built-in defaults.' });
      await this.load();
    } catch (err) {
      this.setState({ saving: false, error: err.message || 'Reset failed' });
    }
  };

  onLogoSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    this.setState({ saving: true, message: null, error: null });
    try {
      const data = await api.uploadBrandingLogo(file);
      if (this.props.refreshBranding) await this.props.refreshBranding();
      this.setState({
        saving: false,
        message: 'Logo uploaded.',
        logoUrl: data.branding?.logoUrl || '/api/branding/logo',
      });
    } catch (err) {
      this.setState({ saving: false, error: err.message || 'Logo upload failed' });
    }
  };

  removeLogo = async () => {
    this.setState({ saving: true, message: null, error: null });
    try {
      await api.deleteBrandingLogo();
      if (this.props.refreshBranding) await this.props.refreshBranding();
      this.setState({ saving: false, message: 'Logo removed.', logoUrl: '' });
      await this.load();
    } catch (err) {
      this.setState({ saving: false, error: err.message || 'Failed to remove logo' });
    }
  };

  render() {
    const { user, onLogout } = this.props;
    const envKeys = Object.keys(this.state.env || {});

    return (
      <Layout user={user} onLogout={onLogout} variant="officer">
        <Panel
          title="Department branding"
          meta="Name, logo, and colors for the public tip site and officer shell — no code fork required"
        >
          {this.state.loading ? (
            <p className="muted">Loading…</p>
          ) : (
            <form onSubmit={this.save} className="branding-form">
              {this.state.error ? <Alert tone="error" title="Error" content={this.state.error} /> : null}
              {this.state.message ? <Alert tone="success" title="Saved" content={this.state.message} /> : null}

              <TextInput
                label="Department / site name"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder="Springfield PD Crime Tips"
              />
              <TextInput
                label="Tagline"
                name="tagline"
                value={this.state.tagline}
                onChange={this.handleChange}
                placeholder="Police tip line"
              />

              <div className="field">
                <span className="field__label">Logo</span>
                <div className="branding-logo-row">
                  {this.state.logoUrl ? (
                    <img className="branding-logo-preview" src={this.state.logoUrl} alt="Department logo preview" />
                  ) : (
                    <span className="muted">Default shield mark</span>
                  )}
                  <div className="branding-logo-actions">
                    <label className="btn btn--secondary btn--sm">
                      Upload logo
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        hidden
                        onChange={this.onLogoSelected}
                      />
                    </label>
                    {this.state.logoUrl ? (
                      <Button type="button" variant="ghost" size="sm" onClick={this.removeLogo}>
                        Remove logo
                      </Button>
                    ) : null}
                  </div>
                </div>
                <span className="field__hint">
                  PNG, JPEG, WebP, or GIF up to 2&nbsp;MB. Or paste an https URL below.
                </span>
              </div>

              <TextInput
                label="Logo URL (optional)"
                name="logoUrl"
                value={this.state.logoUrl}
                onChange={this.handleChange}
                placeholder="/api/branding/logo or https://…"
              />

              <div className="branding-colors">
                <div className="field">
                  <label className="field__label" htmlFor="primaryColor">
                    Primary (navy)
                  </label>
                  <div className="branding-color-input">
                    <input
                      id="primaryColor"
                      type="color"
                      value={this.state.primaryColor}
                      onChange={(e) => this.setState({ primaryColor: e.target.value })}
                    />
                    <input
                      className="input"
                      name="primaryColor"
                      value={this.state.primaryColor}
                      onChange={(e) => this.setState({ primaryColor: e.target.value })}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="accentColor">
                    Accent (gold)
                  </label>
                  <div className="branding-color-input">
                    <input
                      id="accentColor"
                      type="color"
                      value={this.state.accentColor}
                      onChange={(e) => this.setState({ accentColor: e.target.value })}
                    />
                    <input
                      className="input"
                      name="accentColor"
                      value={this.state.accentColor}
                      onChange={(e) => this.setState({ accentColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {envKeys.length > 0 ? (
                <p className="field__hint">
                  Env defaults active for: {envKeys.join(', ')}. Clearing a field or resetting falls back to these.
                </p>
              ) : (
                <p className="field__hint">
                  Tip: set <code>BRAND_NAME</code>, <code>BRAND_TAGLINE</code>, <code>BRAND_LOGO_URL</code>,{' '}
                  <code>BRAND_PRIMARY_COLOR</code>, <code>BRAND_ACCENT_COLOR</code> in <code>.env</code> for
                  deploy-time defaults without using this form.
                </p>
              )}

              <div className="form-actions" style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button type="submit" variant="primary" disabled={this.state.saving}>
                  {this.state.saving ? 'Saving…' : 'Save branding'}
                </Button>
                <Button type="button" variant="secondary" onClick={this.reset} disabled={this.state.saving}>
                  Reset to env / defaults
                </Button>
              </div>
            </form>
          )}
        </Panel>
      </Layout>
    );
  }
}

BrandingSettingsInner.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  refreshBranding: PropTypes.func,
};

export default function BrandingSettings({ user, onLogout }) {
  const { refresh } = useBranding();
  return (
    <BrandingSettingsInner user={user} onLogout={onLogout} refreshBranding={refresh} />
  );
}

BrandingSettings.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
};
