import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'

const About = () => {
    return (
		<Layout>
			<div className="row" style={{margin: '60px 2px 30px 2px'}}>
				<div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
          <Card>
						<CardTitle title="About" subtitle="A brief background on Crime Tips 24/7" />
						<Divider />
						<CardText>
							<p>
								Founded in 2017, Crime Tips 24/7 was created to provide a significantly better user experience for concerned 
								members of the public who wanted to share information about crimes with the police.
							</p>
						</CardText>
					</Card>
				</div>
			</div>
		</Layout>
    );
}

 export default About;

