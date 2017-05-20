import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Container, Breadcrumb, Icon } from 'semantic-ui-react';

const TipFormContainer = props => (
  <Card centered fluid style={{ marginBottom: '14px' }}>
    <Card.Content header={props.title} meta={props.lang.cardSubtitle} />
    <Card.Content>
      <Container textAlign="center">
        <Breadcrumb>
          <Breadcrumb.Section active={props.activeModule === 'intro'}>
            <Icon disabled={props.activeModule !== 'intro'} name="marker" />{props.lang.incident}
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right arrow" />
          {props.showFormModule.suspect === true &&
            <Breadcrumb.Section active={props.activeModule === 'suspect'}>
              <Icon disabled={props.activeModule !== 'suspect'} name="user" />{props.lang.suspect}
            </Breadcrumb.Section>
          }
          {props.showFormModule.suspect === true && <Breadcrumb.Divider icon="right arrow" />}
          {props.showFormModule.vehicle === true &&
            <Breadcrumb.Section active={props.activeModule === 'vehicle'}>
              <Icon disabled={props.activeModule !== 'vehicle'} name="car" />{props.lang.vehicle}
            </Breadcrumb.Section>
          }
          {props.showFormModule.vehicle === true && <Breadcrumb.Divider icon="right arrow" />}
          {props.showFormModule.drugs === true &&
            <Breadcrumb.Section active={props.activeModule === 'drugs'}>
              <Icon disabled={props.activeModule !== 'drugs'} name="medkit" />{props.lang.drugs}
            </Breadcrumb.Section>
          }
          {props.showFormModule.drugs === true && <Breadcrumb.Divider icon="right arrow" />}
          {props.showFormModule.media === true &&
            <Breadcrumb.Section active={props.activeModule === 'media'}>
              <Icon disabled={props.activeModule !== 'media'} name="cloud upload" />{props.lang.mediaBreadcrumb}
            </Breadcrumb.Section>
          }
          {props.showFormModule.media === true && <Breadcrumb.Divider icon="right arrow" />}
          <Breadcrumb.Section active={props.activeModule === 'final'}>
            <Icon disabled={props.activeModule !== 'final'} name="check" />{props.lang.final}
          </Breadcrumb.Section>
        </Breadcrumb>
      </Container>
    </Card.Content>
    <Card.Content>
      {props.children}
    </Card.Content>
    <Card.Content>
      {props.previousButton &&
        <Button
          content={props.lang.previous}
          onClick={() => props.changeFormWizardIndex('previous')}
        />
      }
      {props.nextButton &&
        <Button
          content={props.lang.next}
          color="violet"
          onClick={() => props.changeFormWizardIndex('next')}
        />
      }
      {props.showSubmit &&
        <Button
          content={props.lang.submit}
          color="violet"
          onClick={e => props.createTip(e)}
        />
      }
    </Card.Content>
  </Card>
);

TipFormContainer.propTypes = {
  activeModule: PropTypes.string.isRequired,
  lang: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  changeFormWizardIndex: PropTypes.func.isRequired,
  createTip: PropTypes.func.isRequired,
  showFormModule: PropTypes.shape({
    suspect: PropTypes.bool,
    vehicle: PropTypes.bool,
    drugs: PropTypes.bool,
    media: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
  previousButton: PropTypes.bool,
  nextButton: PropTypes.bool,
  showSubmit: PropTypes.bool,
};

TipFormContainer.defaultProps = {
  previousButton: false,
  nextButton: false,
  showSubmit: false,
};

export default TipFormContainer;
