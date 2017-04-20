import React from 'react';
import { Grid, Card } from 'semantic-ui-react'
import Layout from '../components/Layout'

const FAQ = () => {
	return (
		<Layout>
			<Grid centered container columns={1}>
				<Grid.Column mobile={16} tablet={12} computer={11} largeScreen={10}>
					<Card centered fluid>
						<Card.Content header='FAQ' meta='Your questions answered.' />
						<Card.Content>
							<p className="prompt">
								<b>What is Crime Tips 24/7?</b>
							</p>
							<p>
								Crime Tips 24/7 is a website that allows police departments to receive anonymous tips from 
								concerned members of the public.
							</p>
							<br />
							<p className="prompt">
								<b>What is a tip?</b>
							</p>
							<p>
								A tip is information about unsolved crimes, wanted fugitives, narcotics activity, bullying,
								and missing persons, among other issues of interest to the police. Any information you can 
								provide might be of value, no matter how important or unimportant you believe it to be. Tipsters 
								are not snitches -- they care about their community.
							</p>
							<br />
							<p className="prompt">
								<b>What is not a tip?</b>
							</p>
							<p>
								The Crime Stoppers program is not a substitute for the 9-1-1 emergency system. In the event 
								of an emergency, tipsters are encouraged to call the 9-1-1 emergency system immediately!
							</p>
							<br />
							<p className="prompt">
								<b>What will you do with the information you get from a tip?</b>
							</p>
							<p>
								Once a tip is received, a detective will review the information and will determine who should 
								investigate the information provided.
							</p>
							<br />
							<p className="prompt">
								<b>How do I know that I will remain anonymous?</b>
							</p>
							<p>
								We guarantee complete anonymity — no IP addresses or any other data (other than the tip). In 
								fact, we are so transparent about this issue that our source code is publicly available on Github.
							</p>
							<br />
							<p className="prompt">
								<b>I want to provide information, but I’m concerned. What should I do?</b>
							</p>
							<p>
								We understand that providing information can put you in an uncomfortable situation, but the 
								community depends on people like you to identify criminals so they won’t victimize more people 
								in the future. As always, call 911 if you are in imminent danger.
							</p>
							<br />
							<p className="prompt">
								<b>How do I know if I am eligible to receive a reward?</b>
							</p>
							<p>
								Contact the Department to update your tip information or to check status on your reward. 
								Please have your tip number ready as no information will be provided to you without it. 
								A representative of the Department will let you know if an arrest has been made and a reward 
								is available or the status of the investigation.
							</p>
							<br />
							<p className="prompt">
								<b>How do I collect my reward?</b>
							</p>
							<p>
								After you check the status of your tip and verified that you are eligible to receive a reward, 
								a representative from the Department will provide you with instructions for collecting your 
								reward from the bank. You will not need to provide personal identification to the bank; you will 
								be receiving cash.
							</p>
						</Card.Content>
					</Card>
				</Grid.Column>
			</Grid>
		</Layout>
	);
}

export default FAQ;