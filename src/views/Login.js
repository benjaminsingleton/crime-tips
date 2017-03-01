import React, { Component } from 'react';
import { Link } from 'react-router' 

import Layout from '../components/Layout'

class Login extends Component {
  render() {
    return (
      <Layout isAdmin={false} >
        <div className="middle-box text-center loginscreen animated fadeInDown">
            <div>
                <div>
                    <h1 className="logo-name">CT+</h1>
                </div>
                <h3>Welcome to Crime Tips+</h3>
                <p>Login in below.</p>
                <form className="m-t" role="form" action="#">
                    <div className="form-group">
                        <input type="email" className="form-control" placeholder="Username" required="" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" placeholder="Password" required="" />
                    </div>
                    <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
                    <Link to="forgot_password"><small>Forgot password?</small></Link>
                </form>
            </div>
        </div>
      </Layout>
    );
  }
}

export default Login;



