import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Segment, Progress } from 'semantic-ui-react';
import { firebaseApp } from '../../helpers/firebase';

export default class Media extends Component {
  state = {
    uploadPercent: 0,
    filename: '',
  }

  click = (e) => {
    e.preventDefault();
    this.fileInput.click();
  }

  delete = (filename) => {
    firebaseApp.storage().ref(`tips/${this.props.tipKey}/${filename}`).delete().then(() => {
      if (Object.keys(this.props.tip.attachments).length === 1) {
        firebaseApp.database().ref(`abandonedTips/${this.props.tipKey}/attachments`).remove();
      } else {
        firebaseApp.database().ref(`abandonedTips/${this.props.tipKey}/attachments`).once('value').then((snapshot) => {
        // Query all attachments and find the key associated with the filename to be deleted
          const attachments = snapshot.val();
          const keyToDelete = Object.keys(attachments)
            .filter(key => attachments[key].filename === filename)[0];
          firebaseApp.database().ref(`abandonedTips/${this.props.tipKey}/attachments/${keyToDelete}`).remove();
        });
      }
      this.setState({ error: null });
    })
    .catch((error) => {
      this.setState({ error: error.code });
    });
  }

  uploadFile = (event) => {
    const file = event.target.files[0]; // get the first file uploaded
    this.setState({ filename: file.name });
    const storageRef = firebaseApp.storage().ref(`tips/${this.props.tipKey}/${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', (snapshot) => {
      // in progress
      const uploadPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({ uploadPercent });
    }, (error) => {
      // error
      this.setState({ error: error.code, uploadPercent: 0 });
    }, () => {
      // success
      firebaseApp.database().ref(`abandonedTips/${this.props.tipKey}/attachments`).push({
        filename: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        storageKey: this.props.tipKey,
      });
      this.setState({ filename: '', uploadPercent: 0 });
    });
  }

  render() {
    const { attachments } = this.props.tip;
    const uploadedFiles = attachments
      ? Object.keys(attachments).map(key =>
        (<Segment key={key}>
          <p>
            {attachments[key].filename}
            <Button
              basic
              compact
              icon="delete"
              color="red"
              floated="right"
              onClick={() => this.delete(attachments[key].filename)}
            />
          </p>
        </Segment>))
      : null;

    return (
      <div>
        {(attachments || this.state.uploadPercent > 0 || this.state.error) &&
          <Segment padded basic>
            {this.state.error &&
              <p>
                <b>An error occurred. Please try again.</b>
                {`(Error Code: ${this.state.error})`}
              </p>}
            {(this.state.uploadPercent > 0 && this.state.uploadPercent < 100) &&
              <p><b>Uploading ...</b></p>}
            {this.state.uploadPercent > 0 &&
              <Progress percent={this.state.uploadPercent} indicating autoSuccess />}
            {uploadedFiles}
          </Segment>
        }
        <Form>
          <Form.Field>
            <label>{this.props.lang.media.label}</label>
            <div className="ui file input action">
              <Input type="text" value={this.state.filename} readOnly />
              <input
                type="file"
                ref={(input) => { this.fileInput = input; }}
                style={{ display: 'none' }}
                onChange={e => this.uploadFile(e)}
              />
              <Button content="Upload" icon="cloud upload" onClick={e => this.click(e)} />
            </div>
          </Form.Field>
        </Form>
      </div>
    );
  }
}

Media.propTypes = {
  tip: PropTypes.object.isRequired,
  tipKey: PropTypes.string.isRequired,
  lang: PropTypes.object.isRequired,
};
