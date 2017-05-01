import React from 'react';
import { Grid, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'

const NoMatch = () => {
	return (
		<Layout>
			<Grid centered container columns={1}>
				<Grid.Column mobile={16} tablet={12} computer={10} largeScreen={10}>
					<Card centered fluid>
						<Card.Content header='404' meta='Page Not Found' />
						<Card.Content>
							<p>Sorry, but the page you are looking for has not been found.</p>
						</Card.Content>
					</Card>
				</Grid.Column>
			</Grid>
		</Layout>
	);
}

export default NoMatch;

