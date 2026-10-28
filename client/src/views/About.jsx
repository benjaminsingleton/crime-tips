import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '../components/ui';

const About = ({ lang }) => (
  <Panel title={lang.about} meta={lang.aboutSubtitle}>
    <p>{lang.aboutContent}</p>
  </Panel>
);

About.propTypes = {
  lang: PropTypes.object.isRequired,
};

export default About;
