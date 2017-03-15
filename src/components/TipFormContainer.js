import React from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const TipFormContainer = (props) => {
    return (
        <Card>
            <div className="cardAccentBanner"></div>
            <CardTitle title={props.title} subtitle="All tips are completely anonymous. Your community needs your help."/>
            <Divider />
            <CardText>
                {props.noOptionalMsg ? null :
                    <div style={{color: 'rgba(0,0,0,0.541176)', fontSize: '14px', marginBottom: '24px'}}>
                        All of our questions are <b>optional</b> so feel free to skip any questions you can’t answer.
                    </div>
                }
                {props.children}
            </CardText>
            <CardActions>
                {props.noPreviousButton ? null :  <RaisedButton label="Previous" default={true} onClick={() => props.changeStep('previous')} />}
                {props.noNextButton ? null :  <RaisedButton label="Next" primary={true} onClick={() => props.changeStep('next')} />}
                {props.showSubmit ? <RaisedButton label="Submit" primary={true} onClick={() => props.createTip()}/> : null}
            </CardActions>
        </Card>
    )
}

export default TipFormContainer