import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Button, Confirm } from 'semantic-ui-react';
import moment from 'moment';
import { tipTimeFormatLong } from '../helpers/helpers';
import { api } from '../api';

export default class TipDetail extends Component {
  state = {
    tip: {},
    userNote: '',
    open: false,
    noteToDelete: null,
  };

  componentDidMount() {
    this.loadTip(this.props.tipDetailKey);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tipDetailKey !== this.props.tipDetailKey) {
      this.loadTip(this.props.tipDetailKey);
    }
  }

  loadTip = async (id) => {
    try {
      const { tip } = await api.getTip(id);
      this.setState({ tip });
    } catch (err) {
      console.error(err);
    }
  };

  handleTextChange = (event) => {
    this.setState({ userNote: event.target.value });
  };

  createUserNote = async (e) => {
    e.preventDefault();
    try {
      await api.addNote(this.props.tipDetailKey, this.state.userNote);
      this.setState({ userNote: '' });
      this.loadTip(this.props.tipDetailKey);
    } catch (err) {
      console.error(err);
    }
  };

  deleteUserNote = async (userNoteKey) => {
    try {
      await api.deleteNote(this.props.tipDetailKey, userNoteKey);
      this.setState({ open: false, noteToDelete: null });
      this.loadTip(this.props.tipDetailKey);
    } catch (err) {
      console.error(err);
    }
  };

  displayUserNotes = (userNotes) => {
    const notDeletedUserNoteKeys = Object.keys(userNotes).filter(
      (key) => !userNotes[key].deleted,
    );
    const style = {
      card: { margin: '10px' },
      header: { backgroundColor: '#E0E0E0' },
      actions: { textAlign: 'right' },
    };
    return notDeletedUserNoteKeys.map((key) => (
      <Card fluid style={style.card} key={key}>
        <Card.Content
          header={`${userNotes[key].authorName || 'Officer'}, ${moment(
            new Date(userNotes[key].timestamp),
          ).format('MMMM Do YYYY, h:mm a')}`}
          style={style.header}
        />
        <Card.Content>
          <p>{userNotes[key].note}</p>
        </Card.Content>
        {userNotes[key].uid === this.props.user?.id ? (
          <Card.Content style={style.actions}>
            <Button
              content="Delete"
              onClick={() => this.setState({ open: true, noteToDelete: key })}
            />
            <Confirm
              open={this.state.open && this.state.noteToDelete === key}
              onCancel={() => this.setState({ open: false, noteToDelete: null })}
              onConfirm={() => this.deleteUserNote(key)}
            />
          </Card.Content>
        ) : null}
      </Card>
    ));
  };

  render() {
    const tip = this.state.tip || {};
    const userNotes = tip.userNotes ? this.displayUserNotes(tip.userNotes) : null;
    const attachments = tip.attachments || {};
    const style = {
      card: { margin: '10px' },
      header: { backgroundColor: '#E0E0E0' },
    };
    return (
      <div>
        <Card fluid>
          <Card.Content>
            <h2>Tip Detail</h2>
            <p>Crime Type: {tip.crimeType}</p>
            <p>Date Time: {tipTimeFormatLong(tip.dateTime || tip.timestampSubmit)}</p>
          </Card.Content>
          <Card fluid style={style.card}>
            <Card.Content header="1. Incident" style={style.header} />
            <Card.Content>
              <p>
                What kind of crime was committed? <b>{tip.crimeType}</b>
              </p>
              <p>
                Please tell us the information you wanted to share. <b>{tip.tipText}</b>
              </p>
              <p>
                Where did the crime take place? <b>{tip.crimeLocation}</b>
              </p>
              <p>
                When did the crime occur? <b>{tip.crimeDate}</b>
              </p>
              <p>
                How many suspects were involved? <b>{tip.numberOfSuspects}</b>
              </p>
              <p>
                How many vehicles were involved? <b>{tip.numberOfVehicles}</b>
              </p>
              <p>
                I have media to upload. <b>{String(tip.tipsterHasMedia)}</b>
              </p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="2. Suspect(s)" style={style.header} />
            <Card.Content>
              <p>
                Full name: <b>{tip.suspectFullName}</b>
              </p>
              <p>
                Nickname / alias: <b>{tip.suspectNickname}</b>
              </p>
              <p>
                Gender: <b>{tip.suspectGender}</b>
              </p>
              <p>
                Race: <b>{tip.suspectRace}</b>
              </p>
              <p>
                Comments: <b>{tip.suspectComments}</b>
              </p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="3. Vehicle(s)" style={style.header} />
            <Card.Content>
              <p>
                Make: <b>{tip.suspectVehicleMake}</b>
              </p>
              <p>
                Model: <b>{tip.suspectVehicleModel}</b>
              </p>
              <p>
                Color: <b>{tip.suspectVehicleColor}</b>
              </p>
              <p>
                Plate: <b>{tip.suspectVehiclePlateNumber}</b>
              </p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="4. Drugs" style={style.header} />
            <Card.Content>
              <p>
                Drug types: <b>{tip.drugTypes}</b>
              </p>
              <p>
                Sale method: <b>{tip.drugSaleMethod}</b>
              </p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="5. Media" style={style.header} />
            <Card.Content>
              {Object.keys(attachments).length === 0 ? (
                <p>No attachments.</p>
              ) : (
                Object.keys(attachments).map((id) => (
                  <p key={id}>
                    <a
                      href={`/api/tips/${this.props.tipDetailKey}/attachments/${id}/download`}
                      onClick={(e) => {
                        e.preventDefault();
                        api
                          .downloadAttachment(this.props.tipDetailKey, id)
                          .then((blob) => {
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = attachments[id].filename;
                            a.click();
                            URL.revokeObjectURL(url);
                          })
                          .catch((err) => console.error(err));
                      }}
                    >
                      {attachments[id].filename}
                    </a>
                  </p>
                ))
              )}
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="6. Final" style={style.header} />
            <Card.Content>
              <p>
                How are you aware of this crime? <b>{tip.tipsterAwareOfCrimeMethod}</b>
              </p>
              <p>
                Website discovery: <b>{tip.tipsterWebsiteDiscoveryMethod || tip.websiteDiscoveryMethod}</b>
              </p>
              <p>
                Wants contact: <b>{String(tip.tipsterWantsToBeContacted)}</b>
              </p>
              <p>
                Contact details: <b>{tip.tipsterContactDetails}</b>
              </p>
            </Card.Content>
          </Card>
          <Card fluid style={style.card}>
            <Card.Content header="Officer Notes" style={style.header} />
            <Card.Content>
              {userNotes}
              <Form onSubmit={this.createUserNote}>
                <Form.TextArea
                  value={this.state.userNote}
                  onChange={this.handleTextChange}
                  placeholder="Add a note"
                />
                <Button content="Add note" color="violet" />
              </Form>
            </Card.Content>
          </Card>
        </Card>
      </div>
    );
  }
}

TipDetail.propTypes = {
  tipDetailKey: PropTypes.string.isRequired,
  user: PropTypes.object,
};

TipDetail.defaultProps = {
  user: null,
};
