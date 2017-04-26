import React from 'react';
import { Card } from 'semantic-ui-react'

const FAQ = ({ lang }) => {
	return (
		<Card centered fluid style={{marginBottom: '14px'}}>
			<Card.Content header={lang.faq} meta={lang.faqSubtitle} />
			<Card.Content>
				<p><b>{lang.faq1Question}</b></p>
				<p>{lang.faq1Answer}</p>
				<br />
				<p><b>{lang.faq2Question}</b></p>
				<p>{lang.faq2Answer}</p>
				<br />
				<p><b>{lang.faq3Question}</b></p>
				<p>{lang.faq3Answer}</p>
				<br />
				<p><b>{lang.faq4Question}</b></p>
				<p>{lang.faq4Answer}</p>
				<br />
				<p><b>{lang.faq5Question}</b></p>
				<p>{lang.faq5Answer}</p>
				<br />
				<p><b>{lang.faq6Question}</b></p>
				<p>{lang.faq6Answer}</p>
				<br />
				<p><b>{lang.faq7Question}</b></p>
				<p>{lang.faq7Answer}</p>
				<br />
				<p><b>{lang.faq8Question}</b></p>
				<p>{lang.faq8Answer}</p>
			</Card.Content>
		</Card>
	);
}

export default FAQ;