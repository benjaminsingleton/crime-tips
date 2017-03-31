import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'

const FAQ = () => {
    return (
			<Layout>
				<div className="row" style={{margin: '60px 2px 30px 2px'}}>
					<div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6 col-lg-offset-3 col-lg-6">
						<Card>
							<CardTitle title="FAQ" subtitle="Your questions answered." />
							<Divider />
							<CardText>
								<p className="prompt">
									<b>What is Crime Tips 24/7?</b>
								</p>
								<p>
									Crime Tips 24/7 is a website that allows police departments to receive anonymous tips from concerned members of the public.
								</p>
								<br />
								<p className="prompt">
									<b>What will you do with the information you get from a tip?</b>
								</p>
								<p>
									Once a tip is received, a detective will review the information and will determine who should investigate the information provided.
								</p>
								<br />
								<p className="prompt">
									<b>How do I know that I will remain anonymous?</b>
								</p>
								<p>
									We guarantee complete anonymity — no IP addresses or any other data (other than the tip). In fact, we are so transparent about this issue that our source code is publicly available on Github.
								</p>
								<br />
								<p className="prompt">
									<b>I want to provide information, but I’m concerned. What should I do?</b>
								</p>
								<p>
									We understand that providing information can put you in an uncomfortable situation, but the community depends on people like you to identify criminals so they won’t victimize more people in the future. As always, call 911 if you are in imminent danger.
								</p>
								<br />
								<p className="prompt">
									<b>Is there a reward for providing tips?</b>
								</p>
								<p>
									[ Department answer ]
								</p>
								<br />
								<p className="prompt">
									<b>How do I claim my reward?</b>
								</p>
								<p>
									[ Department answer ] Upon successfully submitting a tip online, a confirmation code will be displayed on the screen. You may call the Department at any time to check on the status of your tip and whether a reward will be awarded.
								</p>
							</CardText>
						</Card>
					</div>
				</div>
			</Layout>
    );
}

 export default FAQ;

