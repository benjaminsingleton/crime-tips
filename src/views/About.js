import React from 'react';
import { Grid, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'

const About = () => {
	return (
		<Layout>
			<Grid centered container columns={1}>
				<Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
					<Card centered fluid>
						<Card.Content header='About' meta='A brief background on Crime Tips 24/7' />
						<Card.Content>
							<p>
								Founded in 2017, Crime Tips 24/7 was created to provide a significantly better user experience for concerned 
								members of the public who wanted to share information about crimes with the police.
							</p>
						</Card.Content>
					</Card>
				</Grid.Column>
			</Grid>
		</Layout>
	);
}

export default About;

