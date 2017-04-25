import React from 'react';
import { Card } from 'semantic-ui-react'

const About = ({ lang }) => {
	return (
		<Card centered fluid style={{marginBottom: '14px'}}>
			<Card.Content header={lang.about} meta={lang.aboutSubtitle} />
			<Card.Content>
				<p>{lang.aboutContent}</p>
			</Card.Content>
		</Card>
	);
}

export default About;

