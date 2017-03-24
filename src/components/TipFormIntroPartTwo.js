import React from 'react'
import Checkbox from 'material-ui/Checkbox';

const TipFormIntroPartTwo = (props) => {
    return (
        <div>
            <div className="prompt">
                Please check any of the following statements so we can ask you a few 
                important follow-up questions.
            </div>
            <div>
                <Checkbox
                label="I can provide a description of the suspect."
                style={{marginTop: '22px'}}
                checked={props.tip.tipsterKnowsSuspectDescription}
                onCheck={props.addToStepContent.bind(null, "tipsterKnowsSuspectDescription")}
                />
            </div>
            <div>
                <Checkbox
                label="I know where the suspect lives or hangs out."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsSuspectLocation}
                onCheck={props.addToStepContent.bind(null, "tipsterKnowsSuspectLocation")}
                />
            </div>
            <div>
                <Checkbox
                label="I know where the suspect works."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsSuspectEmployment}
                onCheck={props.addToStepContent.bind(null, "tipsterKnowsSuspectEmployment")}
                />
            </div>
            <div>
                <Checkbox
                label="I can provide a description of the suspect’s vehicle."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsSuspectVehicle}
                onCheck={props.addToStepContent.bind(null, "tipsterKnowsSuspectVehicle")}
                />
            </div>
            <div>
                <Checkbox
                label="I have information about drug sales."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsAboutDrugs}
                onCheck={props.addToStepContent.bind(null, "tipsterKnowsAboutDrugs")}
                />
            </div>
            <div>
                <Checkbox
                label="I have media (such as an image or video) to upload."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterHasMedia}
                onCheck={props.addToStepContent.bind(null, "tipsterHasMedia")}
                />
            </div>
        </div>
    );
}

TipFormIntroPartTwo.propTypes = {
  addToStepContent: React.PropTypes.func.isRequired
}

export default TipFormIntroPartTwo