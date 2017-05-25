import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'semantic-ui-react';
import Incident from '../components/tip/Incident';
import Suspect from '../components/tip/Suspect';
import Vehicle from '../components/tip/Vehicle';
import Drugs from '../components/tip/Drugs';
import Media from '../components/tip/Media';
import Final from '../components/tip/Final';
import { firebaseApp } from '../helpers/firebase';
import { language } from '../helpers/languages';

export default class TipLongForm extends Component {
  state = {
    tip: {
      archived: false,
      read: true,
      attachment: false,
      type: 'phone',
    },
  }

  handleInputChange = (e, { name, value }) => {
    const tip = { ...this.state.tip };
    tip[name] = value;
    this.setState({ tip });
  }

  handleCheckChange = (e, { name }) => {
    const tip = { ...this.state.tip };
    tip[name] = tip[name] ? !tip[name] : true;
    this.setState({ tip });
  }

  createTip = (event) => {
    event.preventDefault();
    const tip = { ...this.state.tip };
    tip.submitted = true;
    tip.timestamp = Date.now();
    tip.uid = firebaseApp.auth().currentUser.uid;
    firebaseApp.database().ref('tips/').push({ ...tip });
    this.setState({ tip: {} });
    this.props.filterTips('archived', false);
  }

  render() {
    const lang = language.english;
    const style = {
      card: { margin: '10px' },
      header: { backgroundColor: '#E0E0E0' },
      actions: { textAlign: 'right' },
    };
    return (
      <Card fluid>
        <Card.Content header="New Crime Tip" />
        <Card fluid style={style.card}>
          <Card.Content header="1. Incident" style={style.header} />
          <Card.Content>
            <Incident
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              handleCheckChange={this.handleCheckChange}
              lang={lang}
              handleFormModuleChange={this.handleFormModuleChange}
              errorText={false}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content header="2. Suspect" style={style.header} />
          <Card.Content>
            <Suspect
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content header="3. Vehicle" style={style.header} />
          <Card.Content>
            <Vehicle
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content title="4. Drugs" style={style.header} />
          <Card.Content>
            <Drugs
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content title="5. Media" style={style.header} />
          <Card.Content>
            <Media tip={this.state.tip} />
          </Card.Content>
        </Card>
        <Card fluid style={style.card}>
          <Card.Content header="6. Final" style={style.header} />
          <Card.Content>
            <Final
              tip={this.state.tip}
              handleInputChange={this.handleInputChange}
              lang={lang}
            />
          </Card.Content>
        </Card>
        <Card.Content style={{ textAlign: 'right' }}>
          <Button content="Discard" />
          <Button content="Save Draft" />
          <Button content="Submit" color="violet" onClick={e => this.createTip(e)} />
        </Card.Content>
      </Card>
    );
  }
}

TipLongForm.propTypes = {
  filterTips: PropTypes.func.isRequired,
};
