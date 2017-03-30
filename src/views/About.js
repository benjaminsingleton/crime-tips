import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';

import Layout from '../components/Layout'

const About = () => {
    return (
		<Layout>
			<div className="row" style={{margin: '100px 2px 30px 2px'}}>
				<div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-lg-offset-4 col-lg-4">
          <Card>
						<CardTitle title="About" subtitle="about section" />
						<CardText>
							<div className="prompt">
                About us
              </div>
							<div className="prompt">
                More about us
              </div>
						</CardText>
					</Card>
				</div>
			</div>
		</Layout>
    );
}

 export default About;

