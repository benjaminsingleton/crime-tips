import React, { Component } from 'react'
import { Route, BrowserRouter, Redirect, Switch } from 'react-router-dom'
import FAQ from './FAQ'
import About from './About'
import Login from './Login'
import { firebaseApp } from '../helpers/firebase'

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

function PublicRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to={props.location.state ? props.location.state.from : '/dashboard'} />}
    />
  )
}

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      authed: false
    }
  }
  
  componentWillMount () {
    this.removeListener = firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({authed: true})
      } else {
        this.setState({authed: false})
      }
    })
  }
  componentWillUnmount () {
    this.removeListener()
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path='/' exact component={FAQ} />
            <Route path='/about' component={About} />
            <Route path='/login' component={Login} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}