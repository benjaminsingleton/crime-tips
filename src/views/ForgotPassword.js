import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import base from '../base'

import Layout from '../components/Layout'

class ForgotPassword extends Component {

	constructor () {
		super();
		this.state = {
			email: ''
		}
		this.errorHandler = this.errorHandler.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
    	this.setState({email: event.target.value});
  	}

	handleSubmit(event) {
		event.preventDefault();
		base.resetPassword({email: this.state.email}, this.errorHandler);
	}

	errorHandler (err) {
		if (err) {
            console.error(err)
			// TODO render message
            return;
        }
        browserHistory.push('/login')
	}

	render() {
		return (
			<Layout >
				<div className="passwordBox animated fadeInDown">
					<div className="row">
						<div className="col-md-12">
							<div className="ibox-content">
								<h2 className="font-bold">Forgot password</h2>
								<p>
									Enter your email address and your password will be reset and emailed to you.
								</p>
								<div className="row">
									<div className="col-lg-12">
										<form className="m-t" role="form" onSubmit={this.handleSubmit}>
											<div className="form-group">
												<input 
													type="email" 
													className="form-control" 
													placeholder="Email address" 
													required=""
													value={this.state.email}
													onChange={this.handleChange} 
												/>
											</div>
											<button type="submit" className="btn btn-primary block full-width m-b">
												Send new password
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	}
}

export default ForgotPassword;


		