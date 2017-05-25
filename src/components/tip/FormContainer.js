import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container, Breadcrumb, Icon } from 'semantic-ui-react';
import _ from 'underscore';

export default class FormContainer extends Component {
  state = {
    formModules: ['incident', 'suspect', 'vehicle', 'drugs', 'media', 'final', 'submitted'],
    moduleIndex: 0,
    showModule: {
      incident: true,
      suspect: true,
      vehicle: false,
      drugs: false,
      media: false,
      final: true,
      submitted: true,
    },
  }

  componentWillReceiveProps(nextProps) {
    const updatedTip = _.omit(nextProps.tip, (v, k) => this.props.tip[k] === v);
    const updatedTipKey = Object.keys(updatedTip)[0];
    const moduleFields = ['crimeType', 'numberOfSuspect', 'numberOfVehicles', 'tipsterHasMedia'];
    if (moduleFields.indexOf(updatedTipKey) > -1) {
      this.changeFormModules(updatedTipKey, updatedTip[updatedTipKey]);
    }
  }

  changeFormModules(name, value) {
    const showModule = { ...this.state.showModule };
    if (name === 'crimeType') {
      if (value === 'Drugs' && showModule.drugs === false) {
        showModule.drugs = true;
      } else if (value !== 'Drugs' && showModule.drugs === true) {
        showModule.drugs = false;
      }
    } else if (name === 'numberOfSuspects') {
      if (value === 0 && showModule.suspect === true) {
        showModule.suspect = false;
      } else if (value > 0 && showModule.suspect === false) {
        showModule.suspect = true;
      }
    } else if (name === 'numberOfVehicles') {
      if (value === 0 && showModule.vehicle === true) {
        showModule.vehicle = false;
      } else if (value > 0 && showModule.vehicle === false) {
        showModule.vehicle = true;
      }
    } else if (name === 'tipsterHasMedia') {
      showModule.media = !showModule.media;
    }

    this.setState({ showModule });
  }

  setNewModuleIndex = (direction) => {
    const { moduleIndex } = this.state;
    let changeIndex = true;
    let i = 1;
    let newModuleIndex;
    do {
      if (direction === 'next') {
        newModuleIndex = moduleIndex + i;
      } else {
        newModuleIndex = moduleIndex - i;
      }

      const newModule = this.state.formModules[newModuleIndex];
      if (this.state.showModule[newModule] === false) {
        i += 1;
      } else {
        changeIndex = false;
      }
    }
    while (changeIndex);
    return newModuleIndex;
  }

  navigateTo = (newModuleIndex) => {
    const formModule = this.state.formModules[newModuleIndex];
    if (formModule === 'incident') {
      this.props.history.push('/');
    } else {
      this.props.history.push(`/${formModule}`);
    }
  }

  changeFormModule = (direction) => {
    let newModuleIndex;

    if (direction === 'next') {
      // if ((this.state.moduleIndex === 0) && !this.props.validateIncidentModule()) {
      //   return;
      // }
      newModuleIndex = this.setNewModuleIndex(direction);
    } else if (direction === 'previous') {
      newModuleIndex = this.setNewModuleIndex(direction);
    }
    this.setState({ moduleIndex: newModuleIndex });
    this.navigateTo(newModuleIndex);
  }

  render() {
    const { currentRoute, lang } = this.props;
    const { suspect, vehicle, drugs, media } = this.state.showModule;
    const showPreviousButton = (['/', '/submitted'].indexOf(currentRoute) === -1);
    const showNextButton = (['/final', '/submitted'].indexOf(currentRoute) === -1);
    const showSubmitButton = (currentRoute === '/final');
    return (
      <Card centered fluid style={{ marginBottom: '14px' }}>
        <Card.Content header="Submit A Tip" meta={lang.cardSubtitle} />
        <Card.Content>
          <Container textAlign="center">
            <Breadcrumb>
              <Breadcrumb.Section active={currentRoute === '/'}>
                <Icon disabled={currentRoute !== '/'} name="marker" />{lang.incident}
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right arrow" />
              {suspect === true &&
                <Breadcrumb.Section active={currentRoute === '/suspect'}>
                  <Icon disabled={currentRoute !== '/suspect'} name="user" />{lang.suspect}
                </Breadcrumb.Section>
              }
              {suspect === true && <Breadcrumb.Divider icon="right arrow" />}
              {vehicle === true &&
                <Breadcrumb.Section active={currentRoute === '/vehicle'}>
                  <Icon disabled={currentRoute !== 'vehicle'} name="car" />{lang.vehicle}
                </Breadcrumb.Section>
              }
              {vehicle === true && <Breadcrumb.Divider icon="right arrow" />}
              {drugs === true &&
                <Breadcrumb.Section active={currentRoute === '/drugs'}>
                  <Icon disabled={currentRoute !== 'drugs'} name="medkit" />{lang.drugs}
                </Breadcrumb.Section>
              }
              {drugs === true && <Breadcrumb.Divider icon="right arrow" />}
              {media === true &&
                <Breadcrumb.Section active={currentRoute === '/media'}>
                  <Icon disabled={currentRoute !== 'media'} name="cloud upload" />{lang.mediaBreadcrumb}
                </Breadcrumb.Section>
              }
              {media === true && <Breadcrumb.Divider icon="right arrow" />}
              <Breadcrumb.Section active={currentRoute === '/final'}>
                <Icon disabled={currentRoute !== 'final'} name="check" />{lang.final}
              </Breadcrumb.Section>
            </Breadcrumb>
          </Container>
        </Card.Content>
        <Card.Content>
          {this.props.children}
        </Card.Content>
        <Card.Content>
          {showPreviousButton &&
            <Button
              content={lang.previous}
              onClick={() => this.changeFormModule('previous')}
            />
          }
          {showNextButton &&
            <Button
              content={lang.next}
              color="violet"
              onClick={() => this.changeFormModule('next')}
            />
          }
          {showSubmitButton &&
            <Button
              content={lang.submit}
              color="violet"
              onClick={e => this.props.submitTip(e)}
            />
          }
        </Card.Content>
      </Card>
    );
  }
}

FormContainer.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  lang: PropTypes.object.isRequired,
  submitTip: PropTypes.func.isRequired,
  currentRoute: PropTypes.string.isRequired,
  validateIncidentModule: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
