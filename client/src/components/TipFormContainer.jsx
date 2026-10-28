import React from 'react';
import PropTypes from 'prop-types';
import { Button, Panel } from './ui';

const TipFormContainer = (props) => {
  const steps = [
    { key: 'intro', label: props.lang.incident, show: true },
    { key: 'suspect', label: props.lang.suspect, show: props.showFormModule.suspect === true },
    { key: 'vehicle', label: props.lang.vehicle, show: props.showFormModule.vehicle === true },
    { key: 'drugs', label: props.lang.drugs, show: props.showFormModule.drugs === true },
    { key: 'media', label: props.lang.mediaBreadcrumb, show: props.showFormModule.media === true },
    { key: 'final', label: props.lang.final, show: true },
  ].filter((s) => s.show);

  const hasFooter = props.previousButton || props.nextButton || props.showSubmit;
  const footer = hasFooter ? (
    <>
      {props.previousButton && (
        <Button
          variant="secondary"
          content={props.lang.previous}
          onClick={() => props.changeFormWizardIndex('previous')}
        />
      )}
      {props.nextButton && (
        <Button
          variant="primary"
          content={props.lang.next}
          onClick={() => props.changeFormWizardIndex('next')}
        />
      )}
      {props.showSubmit && (
        <Button
          variant="primary"
          content={props.lang.submit}
          onClick={(e) => props.createTip(e)}
        />
      )}
    </>
  ) : null;

  return (
    <Panel title={props.title} meta={props.lang.cardSubtitle} footer={footer}>
      {props.activeModule !== 'success' && (
        <ol className="wizard-steps" aria-label="Tip form steps">
          {steps.map((step) => (
            <li
              key={step.key}
              className={props.activeModule === step.key ? 'is-active' : undefined}
            >
              <span className="step-dot" aria-hidden="true" />
              {step.label}
            </li>
          ))}
        </ol>
      )}
      {props.children}
    </Panel>
  );
};

TipFormContainer.propTypes = {
  activeModule: PropTypes.string,
  lang: PropTypes.object,
  title: PropTypes.string,
  changeFormWizardIndex: PropTypes.func,
  createTip: PropTypes.func,
  showFormModule: PropTypes.shape({
    suspect: PropTypes.bool,
    vehicle: PropTypes.bool,
    drugs: PropTypes.bool,
    media: PropTypes.bool,
  }),
  children: PropTypes.node.isRequired,
  previousButton: PropTypes.bool,
  nextButton: PropTypes.bool,
  showSubmit: PropTypes.bool,
};

TipFormContainer.defaultProps = {
  activeModule: 'intro',
  lang: {
    cardSubtitle: '',
    incident: '',
    suspect: '',
    vehicle: '',
    drugs: '',
    mediaBreadcrumb: '',
    final: '',
    previous: 'Previous',
    next: 'Next',
    submit: 'Submit',
  },
  title: '',
  changeFormWizardIndex: () => {},
  showFormModule: {},
  previousButton: false,
  nextButton: false,
  showSubmit: false,
  createTip: null,
};

export default TipFormContainer;
