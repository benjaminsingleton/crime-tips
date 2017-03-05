import React from 'react';
import { Link } from 'react-router' 

import Layout from '../components/Layout'

const Login = (props) => {

    return (
        <Layout isAdmin={false} >
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <div>
                        <h1 className="logo-name">CT</h1>
                    </div>
                    <h3>Welcome to Crime Tips</h3>
                    <p>Login in below.</p>
                    <form className="m-t" role="form" onSubmit={props.authenticate}>
                        <div className="form-group">
                            <input 
                                name="email" 
                                type="email" 
                                className="form-control" 
                                placeholder="Email" 
                                required=""
                                value={props.email}
                                onChange={props.handleInputChange} 
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                name="password" 
                                type="password" 
                                className="form-control" 
                                placeholder="Password" 
                                required=""
                                value={props.password}
                                onChange={props.handleInputChange} 
                            />
                        </div>
                        <button className="btn btn-primary block full-width m-b" type="submit">Login</button>
                        <Link to="forgot_password"><small>Forgot password?</small></Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Login;



