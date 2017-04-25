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
								Founded in 2017, Crime Tips 24/7 was created to enable concerned members of the public 
								to share information about crimes with the police via a user-friendly form. In the spirit of
								transparency, Crime Tips 24/7 has been open-sourced and is available at 
								https://github.com/benjaminsingleton/crime-tips. Police Departments can set up their own tips website
								for free, or pay Crime Tips 24/7 to manage the site for them. The company was founded
								by Benjamin Singleton, the Lead for Public Safety and Criminal Justice at Sidewalk Labs 
								(an Alphabet/Google company) and a former New York Police Department crime analyst.
							</p>
						</Card.Content>
					</Card>
				</Grid.Column>
			</Grid>
		</Layout>
	);
}

export default About;

