import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Alert } from './ui';
import { api } from '../api';

export default class TipFormMedia extends Component {
  state = {
    uploadPercent: 0,
    filename: '',
    error: null,
  };

  click = (e) => {
    e.preventDefault();
    this.fileInput.click();
  };

  delete = async (attachmentId) => {
    try {
      await api.deleteAttachment(
        this.props.tipKey,
        attachmentId,
        this.props.editToken,
      );
      if (this.props.onAttachmentsChange) {
        const { attachments } = await api.listAttachments(
          this.props.tipKey,
          this.props.editToken,
        );
        this.props.onAttachmentsChange(attachments);
      }
      this.setState({ error: null });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  uploadFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    this.setState({ filename: file.name, error: null });
    try {
      await api.uploadAttachment(
        this.props.tipKey,
        file,
        (uploadPercent) => {
          this.setState({ uploadPercent });
        },
        this.props.editToken,
      );
      if (this.props.onAttachmentsChange) {
        const { attachments } = await api.listAttachments(
          this.props.tipKey,
          this.props.editToken,
        );
        this.props.onAttachmentsChange(attachments);
      }
      this.setState({ filename: '', uploadPercent: 0 });
    } catch (error) {
      this.setState({ error: error.message, uploadPercent: 0 });
    }
  };

  render() {
    const { attachments } = this.props.tip;
    const uploadedFiles = attachments
      ? Object.keys(attachments).map((key) => (
          <div className="file-row" key={key}>
            <span>{attachments[key].filename}</span>
            <Button
              type="button"
              size="sm"
              variant="danger-outline"
              content="Remove"
              onClick={() => this.delete(key)}
            />
          </div>
        ))
      : null;

    return (
      <div>
        {(attachments || this.state.uploadPercent > 0 || this.state.error) && (
          <div style={{ marginBottom: '1rem' }}>
            {this.state.error && (
              <Alert
                tone="error"
                title="Upload failed"
                content={`${this.state.error}`}
              />
            )}
            {this.state.uploadPercent > 0 && this.state.uploadPercent < 100 && (
              <p><strong>Uploading…</strong> {this.state.filename}</p>
            )}
            {this.state.uploadPercent > 0 && (
              <div className="progress" role="progressbar" aria-valuenow={this.state.uploadPercent}>
                <div className="progress__bar" style={{ width: `${this.state.uploadPercent}%` }} />
              </div>
            )}
            {uploadedFiles}
          </div>
        )}
        <div className="field">
          <label className="field__label">{this.props.lang.media.label}</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              className="input"
              type="text"
              value={this.state.filename}
              readOnly
              placeholder="No file selected"
              style={{ flex: 1, minWidth: '12rem' }}
            />
            <input
              type="file"
              ref={(input) => {
                this.fileInput = input;
              }}
              style={{ display: 'none' }}
              onChange={(e) => this.uploadFile(e)}
            />
            <Button type="button" variant="primary" content="Upload" onClick={(e) => this.click(e)} />
          </div>
        </div>
      </div>
    );
  }
}

TipFormMedia.propTypes = {
  tip: PropTypes.object.isRequired,
  tipKey: PropTypes.string.isRequired,
  editToken: PropTypes.string,
  lang: PropTypes.object.isRequired,
  onAttachmentsChange: PropTypes.func,
};

TipFormMedia.defaultProps = {
  editToken: null,
  onAttachmentsChange: null,
};
