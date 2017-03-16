import React from 'react';
import { Link } from 'react-router' 
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Layout from '../components/Layout'

const Login = (props) => {

    return (
        <Layout>
            <div className="row" style={{margin: '100px 2px 30px 2px'}}>
                <div className="col-xs-12 col-sm-offset-3 col-sm-6 col-md-offset-4 col-md-4 col-lg-offset-4 col-lg-4">
                    <Card>
                        <CardTitle title="Login" subtitle="Enter your credentials below" />
                        <Divider />
                        <form onSubmit={props.authenticate}>
                        <CardText>
                            <div>
                                <TextField
                                    fullWidth={true}
                                    value={props.email}
                                    floatingLabelText="Email"
                                    type="username"
                                    onChange={props.handleTextChange.bind(null, "email")}
                                />
                            </div>
                            <div>
                                <TextField
                                    fullWidth={true}
                                    value={props.password}
                                    floatingLabelText="Password"
                                    type="password"
                                    onChange={props.handleTextChange.bind(null, "password")}
                                />
                            </div>
                        </CardText>
                        <CardActions>
                            <RaisedButton type="submit" label="Login" primary={true} />
                            <Link to="forgot_password"><small>Forgot password?</small></Link>
                        </CardActions>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}

export default Login;



