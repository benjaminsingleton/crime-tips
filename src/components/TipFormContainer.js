import React from 'react'
import PropTypes from 'prop-types';
import { Card, Button, Container, Breadcrumb, Icon } from 'semantic-ui-react'

const TipFormContainer = (props) => {
  return (
    <Card centered fluid>
      <Card.Content header={props.title} meta='All tips are completely anonymous. Your community needs your help.' />
      {/*<Card.Content>
        <div className="ui one column stackable grid container">
          <Step.Group size='mini'>
            <Step active icon='marker' title='Incident' />
            <Step icon='user' title='Suspect' />
            <Step disabled icon='car' title='Vehicle' description='optional' />
            <Step disabled icon='medkit' title='Drugs' description='optional' />
            <Step disabled icon='cloud upload' title='Media' description='optional' />
            <Step icon='check' title='Finish' />
          </Step.Group>
        </div>
        <table className="ui unstackable table">
          <tbody>
            <tr>
              <td>Incident</td>
              <td>Suspect</td>
              <td>Vehicle</td>
              <td>Drugs</td>
              <td>Media</td>
              <td>Finish</td>
            </tr>
          </tbody>
        </table>
      </Card.Content>*/}
      <Card.Content>
        <Container textAlign='center'>
          <Breadcrumb>
            <Breadcrumb.Section active={props.activeModule === 'intro'}>
              <Icon disabled={props.activeModule !== 'intro'} name='marker' />Incident
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon='right arrow' />
            {props.showFormModule.suspect === true && 
              <Breadcrumb.Section active={props.activeModule === 'suspect'}>
                <Icon disabled={props.activeModule !== 'suspect'} name='user' />Suspect
              </Breadcrumb.Section>
            }
            {props.showFormModule.suspect === true && <Breadcrumb.Divider icon='right arrow' />}
            {props.showFormModule.vehicle === true && 
              <Breadcrumb.Section active={props.activeModule === 'vehicle'}>
                <Icon disabled={props.activeModule !== 'vehicle'} name='car' />Vehicle
              </Breadcrumb.Section>
            }
            {props.showFormModule.vehicle === true && <Breadcrumb.Divider icon='right arrow' />}
            {props.showFormModule.drugs === true && 
              <Breadcrumb.Section active={props.activeModule === 'drugs'}>
                <Icon disabled={props.activeModule !== 'drugs'} name='medkit' />Drugs
              </Breadcrumb.Section>
            }
            {props.showFormModule.drugs === true && <Breadcrumb.Divider icon='right arrow' />}
            {props.showFormModule.media === true && 
              <Breadcrumb.Section active={props.activeModule === 'media'}>
                <Icon disabled={props.activeModule !== 'media'} name='cloud upload' />Media
              </Breadcrumb.Section>
            }
            {props.showFormModule.media === true && <Breadcrumb.Divider icon='right arrow' />}
            <Breadcrumb.Section active={props.activeModule === 'final'}>
              <Icon disabled={props.activeModule !== 'final'} name='check' />Submit
            </Breadcrumb.Section>
          </Breadcrumb>
        </Container>
      </Card.Content>
      <Card.Content>
        {props.OptionalMsg &&
          <p>
            All of our questions are <b>optional</b> so feel free to skip any questions you can’t answer.
          </p>
        }
        {props.children}
      </Card.Content>
      <Card.Content>
        {props.previousButton &&
          <Button
            content="Previous"
            onClick={() => props.changeFormWizardIndex('previous')}
          />
        }
        {props.nextButton &&
          <Button
            content="Next"
            color='violet'
            onClick={() => props.changeFormWizardIndex('next')}
          />
        }
        {props.showSubmit &&
          <Button 
            content="Submit" 
            color='violet'
            onClick={(e) => props.createTip(e)} 
          />
        }
      </Card.Content>
    </Card>
  );
}

TipFormContainer.propTypes = {
  title: PropTypes.string.isRequired,
  changeFormWizardIndex: PropTypes.func.isRequired,
}

export default TipFormContainer