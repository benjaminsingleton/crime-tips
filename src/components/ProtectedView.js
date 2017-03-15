import React, { Component } from 'react'
import { browserHistory } from 'react-router' 
import base from '../base'

import Login from '../views/Login'

class ProtectedView extends Component {
    constructor () {
        super();
        this.state = {
            uid: null,
            email: '',
            password: '',
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.authenticate = this.authenticate.bind(this)
        this.authHandler = this.authHandler.bind(this)
        this.logout = this.logout.bind(this)
    }

    handleTextChange(name, event) {
        this.setState({
            [name]: event.target.value
        });
    }

    authenticate(e) {
        console.log('authenticating')
        e.preventDefault();

        base.authWithPassword({
            email: this.state.email,
            password : this.state.password
        }, 
            this.authHandler
        )
    }

    authHandler(err, authData) {
        console.log('auth handler')
        if (err) {
            console.log('theres an error')
            console.error(err)
            return;
        }
        console.log('success')
        console.log(authData.uid)
        this.setState({ uid: authData.uid })
        console.log('state set')
        browserHistory.push('/admin')
    }

    logout() {
        base.unauth();
        this.setState({ uid: null })
        browserHistory.push('/logout')
    }

    renderLogin() {
        return (
            <Login 
                email={this.state.email}
                password={this.state.password} 
                authenticate={this.authenticate}
                handleTextChange={this.handleTextChange}
            />
        )
    }

    render () {
        const logout = this.logout 
        const uid = this.state.uid
        // adds uid and logout props to all children components
        var children = React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                logout: logout,
                uid: uid
            })
        })

        return (
            <div>{ !uid ?  this.renderLogin() : <div>{children}</div>}</div>
        )
    }
}

export default ProtectedView