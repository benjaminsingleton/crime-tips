import React from 'react';

import Layout from '../components/Layout'

const NoMatch = () => {
    return (
		<Layout>
			<div className="middle-box text-center animated fadeInDown">
				<h1>404</h1>
				<h3 className="font-bold">Page Not Found</h3>
				<div className="error-desc">
					Sorry, but the page you are looking for has note been found. 
					Try checking the URL for error, then hit the refresh button on your browser 
					or try found something else in our app.
				</div>
			</div>
		</Layout>
    );
}

export default NoMatch;
