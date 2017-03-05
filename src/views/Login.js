import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router' 
import base from '../base'

import Layout from '../components/Layout'

class Login extends Component {

    constructor () {
        super();
        this.state = {
            email: '',
            password: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.authenticate = this.authenticate.bind(this)
        this.authHandler = this.authHandler.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    authenticate(e) {
        e.preventDefault();

        base.authWithPassword({
            email: this.state.email,
            password : this.state.password
        }, 
            this.authHandler
        )
    }

    authHandler(err, authData) {
        if (err) {
            console.error(err)
        } else {
            browserHistory.push('/admin')
        }
    }

    render() {
        return (
            <Layout isAdmin={false} >
                <div className="middle-box text-center loginscreen animated fadeInDown">
                    <div>
                        <div>
                            <h1 className="logo-name">CT</h1>
                        </div>
                        <h3>Welcome to Crime Tips</h3>
                        <p>Login in below.</p>
                        <form className="m-t" role="form">
                            <div className="form-group">
                                <input 
                                    name="email" 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="Email" 
                                    required=""
                                    value={this.state.email}
                                    onChange={this.handleInputChange} 
                                />
                            </div>
                            <div className="form-group">
                                <input 
                                    name="password" 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Password" 
                                    required=""
                                    value={this.state.password}
                                    onChange={this.handleInputChange} 
                                />
                            </div>
                            <button onClick={(e) => this.authenticate(e) } type="submit" className="btn btn-primary block full-width m-b">Login</button>
                            <Link to="forgot_password"><small>Forgot password?</small></Link>
                        </form>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Login;



