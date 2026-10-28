import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Segment, Progress } from 'semantic-ui-react';
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
          <Segment key={key}>
            <p>
              {attachments[key].filename}
              <Button
                basic
                compact
                icon="delete"
                color="red"
                floated="right"
                onClick={() => this.delete(key)}
              />
            </p>
          </Segment>
        ))
      : null;

    return (
      <div>
        {(attachments || this.state.uploadPercent > 0 || this.state.error) && (
          <Segment padded basic>
            {this.state.error && (
              <p>
                <b>An error occurred. Please try again.</b>
                {` (${this.state.error})`}
              </p>
            )}
            {this.state.uploadPercent > 0 && this.state.uploadPercent < 100 && (
              <p>
                <b>Uploading ...</b>
              </p>
            )}
            {this.state.uploadPercent > 0 && (
              <Progress percent={this.state.uploadPercent} indicating autoSuccess />
            )}
            {uploadedFiles}
          </Segment>
        )}
        <Form>
          <Form.Field>
            <label>{this.props.lang.media.label}</label>
            <div className="ui file input action">
              <Input type="text" value={this.state.filename} readOnly />
              <input
                type="file"
                ref={(input) => {
                  this.fileInput = input;
                }}
                style={{ display: 'none' }}
                onChange={(e) => this.uploadFile(e)}
              />
              <Button content="Upload" icon="cloud upload" onClick={(e) => this.click(e)} />
            </div>
          </Form.Field>
        </Form>
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
