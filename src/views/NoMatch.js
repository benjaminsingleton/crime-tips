import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import Layout from '../components/Layout'

const NoMatch = () => {
    return (
		<Layout>
			<div className="row" style={{margin: '100px 2px 30px 2px'}}>
				<div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-lg-offset-4 col-lg-4">
                    <Card>
						<CardTitle title="404" subtitle="Page Not Found" />
						<CardText>
							<div>Sorry, but the page you are looking for has note been found. 
								Try checking the URL for error, then hit the refresh button on your browser 
								or try found something else in our app.
							</div>
						</CardText>
					</Card>
				</div>
			</div>
		</Layout>
    );
}

export default NoMatch;
