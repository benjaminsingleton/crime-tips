import React, {Component} from 'react'
import { Form } from 'semantic-ui-react'
import { firebaseApp } from '../helpers/firebase'

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
        firebaseApp.storage().ref(`tips/${this.props.tipKey}/attachments/`).push({
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
    const { attachments } = this.state
    const uploadedFiles = attachments.length > 0 && attachments.map(filename => <p key={filename}>{filename}</p>)

    return (
      <Form>
        {this.state.uploadPercent === 100 && <p><b>File was uploaded successfully.</b></p>}
        {uploadedFiles}
        <Form.Input 
          label='Upload media relevant to your tip. We can receive images, videos, audio, and documents.'
          type='file'
          onChange={(e) => this.uploadFile(e)}
        />
      </Form>
    );
  }
}