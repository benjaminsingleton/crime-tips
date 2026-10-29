import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '../components/ui';

const FAQ = ({ lang }) => (
  <Panel title={lang.faq} meta={lang.faqSubtitle}>
    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
      <div className="faq-item" key={n}>
        <h3>{lang[`faq${n}Question`]}</h3>
        <p>{lang[`faq${n}Answer`]}</p>
      </div>
    ))}
  </Panel>
);

FAQ.propTypes = {
  lang: PropTypes.object.isRequired,
};

export default FAQ;
