import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

const About = ({ lang }) => (
  <Card centered fluid style={{ marginBottom: '14px' }}>
    <Card.Content header={lang.about} meta={lang.aboutSubtitle} />
    <Card.Content>
      <p>{lang.aboutContent}</p>
    </Card.Content>
  </Card>
);

About.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default About;

