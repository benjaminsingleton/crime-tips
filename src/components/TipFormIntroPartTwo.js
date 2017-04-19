import React from 'react'
import PropTypes from 'prop-types';
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
                onCheck={props.addFormWizardContent.bind(null, "tipsterKnowsSuspectDescription")}
                />
            </div>
            <div>
                <Checkbox
                label="I know where the suspect lives or hangs out."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsSuspectLocation}
                onCheck={props.addFormWizardContent.bind(null, "tipsterKnowsSuspectLocation")}
                />
            </div>
            <div>
                <Checkbox
                label="I know where the suspect works."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsSuspectEmployment}
                onCheck={props.addFormWizardContent.bind(null, "tipsterKnowsSuspectEmployment")}
                />
            </div>
            <div>
                <Checkbox
                label="I can provide a description of the suspect’s vehicle."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsSuspectVehicle}
                onCheck={props.addFormWizardContent.bind(null, "tipsterKnowsSuspectVehicle")}
                />
            </div>
            <div>
                <Checkbox
                label="I have information about drug sales."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterKnowsAboutDrugs}
                onCheck={props.addFormWizardContent.bind(null, "tipsterKnowsAboutDrugs")}
                />
            </div>
            <div>
                <Checkbox
                label="I have media (such as an image or video) to upload."
                style={{marginTop: '16px'}}
                checked={props.tip.tipsterHasMedia}
                onCheck={props.addFormWizardContent.bind(null, "tipsterHasMedia")}
                />
            </div>
        </div>
    );
}

TipFormIntroPartTwo.propTypes = {
  addFormWizardContent: PropTypes.func.isRequired
}

export default TipFormIntroPartTwo