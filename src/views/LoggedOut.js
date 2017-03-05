import React from 'react';
import { Link } from 'react-router';

import Layout from '../components/Layout'

const LoggedOut = () => {
	return (
		<Layout isAdmin={false} >
			<div className="middle-box text-center animated fadeInDown">
				<h1>Signed out.</h1>
			<h3 className="font-bold">Click <Link to="login">here</Link> to login again.</h3>
			</div>
		</Layout>
	);
}

export default LoggedOut;



