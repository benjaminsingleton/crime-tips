import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { tipTimeFormatLong } from '../helpers/helpers';
import { api } from '../api';
import { Panel, Button, TextArea, ConfirmDialog } from './ui';

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
    return notDeletedUserNoteKeys.map((key) => (
      <div className="note-card" key={key}>
        <div className="note-card__header">
          {`${userNotes[key].authorName || 'Officer'}, ${moment(
            new Date(userNotes[key].timestamp),
          ).format('MMMM Do YYYY, h:mm a')}`}
        </div>
        <div className="note-card__body">
          <p style={{ margin: 0 }}>{userNotes[key].note}</p>
        </div>
        {userNotes[key].uid === this.props.user?.id ? (
          <div className="note-card__actions">
            <Button
              size="sm"
              variant="danger-outline"
              content="Delete"
              onClick={() => this.setState({ open: true, noteToDelete: key })}
            />
          </div>
        ) : null}
      </div>
    ));
  };

  render() {
    const tip = this.state.tip || {};
    const userNotes = tip.userNotes ? this.displayUserNotes(tip.userNotes) : null;
    const attachments = tip.attachments || {};

    return (
      <div>
        <Panel
          title="Tip detail"
          meta={`Crime type: ${tip.crimeType || '—'} · ${tipTimeFormatLong(tip.dateTime || tip.timestampSubmit) || ''}`}
        >
          <div className="subpanel">
            <div className="subpanel__header">1. Incident</div>
            <div className="subpanel__body">
              <p className="detail-row">What kind of crime was committed? <b>{tip.crimeType}</b></p>
              <p className="detail-row">Please tell us the information you wanted to share. <b>{tip.tipText}</b></p>
              <p className="detail-row">Where did the crime take place? <b>{tip.crimeLocation}</b></p>
              <p className="detail-row">When did the crime occur? <b>{tip.crimeDate}</b></p>
              <p className="detail-row">How many suspects were involved? <b>{tip.numberOfSuspects}</b></p>
              <p className="detail-row">How many vehicles were involved? <b>{tip.numberOfVehicles}</b></p>
              <p className="detail-row">I have media to upload. <b>{String(tip.tipsterHasMedia)}</b></p>
            </div>
          </div>

          <div className="subpanel">
            <div className="subpanel__header">2. Suspect(s)</div>
            <div className="subpanel__body">
              <p className="detail-row">Full name: <b>{tip.suspectFullName}</b></p>
              <p className="detail-row">Nickname / alias: <b>{tip.suspectNickname}</b></p>
              <p className="detail-row">Gender: <b>{tip.suspectGender}</b></p>
              <p className="detail-row">Race: <b>{tip.suspectRace}</b></p>
              <p className="detail-row">Comments: <b>{tip.suspectComments}</b></p>
            </div>
          </div>

          <div className="subpanel">
            <div className="subpanel__header">3. Vehicle(s)</div>
            <div className="subpanel__body">
              <p className="detail-row">Make: <b>{tip.suspectVehicleMake}</b></p>
              <p className="detail-row">Model: <b>{tip.suspectVehicleModel}</b></p>
              <p className="detail-row">Color: <b>{tip.suspectVehicleColor}</b></p>
              <p className="detail-row">Plate: <b>{tip.suspectVehiclePlateNumber}</b></p>
            </div>
          </div>

          <div className="subpanel">
            <div className="subpanel__header">4. Drugs</div>
            <div className="subpanel__body">
              <p className="detail-row">Drug types: <b>{tip.drugTypes}</b></p>
              <p className="detail-row">Sale method: <b>{tip.drugSaleMethod}</b></p>
            </div>
          </div>

          <div className="subpanel">
            <div className="subpanel__header">5. Media</div>
            <div className="subpanel__body">
              {Object.keys(attachments).length === 0 ? (
                <p className="detail-row">No attachments.</p>
              ) : (
                Object.keys(attachments).map((id) => (
                  <p className="detail-row" key={id}>
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
            </div>
          </div>

          <div className="subpanel">
            <div className="subpanel__header">6. Final</div>
            <div className="subpanel__body">
              <p className="detail-row">How are you aware of this crime? <b>{tip.tipsterAwareOfCrimeMethod}</b></p>
              <p className="detail-row">
                Website discovery:{' '}
                <b>{tip.tipsterWebsiteDiscoveryMethod || tip.websiteDiscoveryMethod}</b>
              </p>
              <p className="detail-row">Wants contact: <b>{String(tip.tipsterWantsToBeContacted)}</b></p>
              <p className="detail-row">Contact details: <b>{tip.tipsterContactDetails}</b></p>
            </div>
          </div>

          <div className="subpanel">
            <div className="subpanel__header">Officer notes</div>
            <div className="subpanel__body">
              {userNotes}
              <form onSubmit={this.createUserNote}>
                <TextArea
                  value={this.state.userNote}
                  onChange={(e) => this.handleTextChange(e)}
                  placeholder="Add a note"
                />
                <div style={{ marginTop: '0.75rem' }}>
                  <Button type="submit" variant="primary" content="Add note" />
                </div>
              </form>
            </div>
          </div>
        </Panel>

        <ConfirmDialog
          open={this.state.open}
          title="Delete note"
          content="Delete this note? This cannot be undone."
          onCancel={() => this.setState({ open: false, noteToDelete: null })}
          onConfirm={() => this.deleteUserNote(this.state.noteToDelete)}
        />
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
