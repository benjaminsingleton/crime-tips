import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import {firebaseApp, databaseRef} from '../helpers/constants'

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

export default class TipFormMedia extends Component {

  constructor() {
    super()
    this.state = {
      uploadPercent: 0,
      attachments: []
    }
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile(event) {
    const file = event.target.files[0]; // get the first file uploaded
    const storageRef = firebaseApp.storage().ref(`tips/${this.props.tipKey}/${file.name}`);
    const uploadTask = storageRef.put(file);
    uploadTask.on('state_changed', function progress(snapshot) {
      let uploadPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      this.setState({'uploadPercent': uploadPercent}) // progress of upload
      if (uploadPercent === 100) {
        databaseRef.child(`tips/${this.props.tipKey}/attachments/`).push({
          filename: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        })
        const attachments = this.state.attachments
        attachments.push(file.name)
        this.setState({attachments});
      }
    }.bind(this));
  }

  render() {
    const uploadedFiles = this.state.attachments.length > 0
                          ? this.state.attachments.map(filename => <p key={filename}>{filename}</p>)
                          : null
    return (
        <div>
          {this.state.uploadPercent === 100 ? <p><b>File was uploaded successfully.</b></p> : null}
          {uploadedFiles}
          <RaisedButton
            label="Upload media"
            labelPosition="before"
            containerElement="label"
            style={styles.button}
          >
            <input type="file" style={styles.exampleImageInput} onChange={(e) => this.uploadFile(e)} />
          </RaisedButton>
        </div>
      );
  }
}