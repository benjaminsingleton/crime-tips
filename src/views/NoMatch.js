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
							<div className="prompt">
                Sorry, but the page you are looking for has not been found.
              </div>
							<div className="prompt">
                Try checking the URL for errors, then hit the refresh button on your browser.
              </div>
						</CardText>
					</Card>
				</div>
			</div>
		</Layout>
    );
}

export default NoMatch;

