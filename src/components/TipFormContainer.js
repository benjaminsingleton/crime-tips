import React from 'react'
import PropTypes from 'prop-types';
import { Card, Button, Step } from 'semantic-ui-react'

const TipFormContainer = (props) => {
  return (
    <Card centered fluid>
      <Card.Content header={props.title} meta='All tips are completely anonymous. Your community needs your help.' />
      {/*<Card.Content>
        <Step.Group size='mini'>
          <Step active icon='marker' title='Incident' />
          <Step icon='user' title='Suspect' />
          <Step disabled icon='car' title='Vehicle' description='optional' />
          <Step disabled icon='medkit' title='Drugs' description='optional' />
          <Step disabled icon='cloud upload' title='Media' description='optional' />
          <Step icon='check' title='Finish' />
        </Step.Group>
      </Card.Content>*/}
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