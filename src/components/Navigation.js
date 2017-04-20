import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown } from 'semantic-ui-react'
import { firebaseApp } from '../helpers/firebase'

export default class Navigation extends Component {
  state = { 
    uid: null, 
    admin: false 
  }

  componentWillMount() {
    const user = firebaseApp.auth().currentUser
    if (user) {
      firebaseApp.database().ref(`users/${user.uid}/admin`).once('value')
        .then((snapshot) => this.setState({
            uid: user.uid, 
            admin: snapshot.val()
          })
        );
    }
  }

  logout = () => firebaseApp.auth().signOut()

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem, uid, admin } = this.state

    return (
      <Menu stackable size='large'>
        <Menu.Item 
          content='Gotham Crime Tips' 
          header 
        />
        <Menu.Item 
          content='Home'
          name='home' 
          active={activeItem === 'home'} 
          onClick={this.handleItemClick} 
          as={Link} 
          to='/' 
        />
        {uid && <Menu.Item 
                  content='Dashboard'
                  name='dashboard' 
                  active={activeItem === 'dashboard'} 
                  onClick={this.handleItemClick} 
                  as={Link} 
                  to='/dashboard' 
                />
        }
        {uid && <Menu.Item 
                  content='My Settings' 
                  name='settings' 
                  active={activeItem === 'settings'} 
                  onClick={this.handleItemClick} 
                  as={Link} 
                  to='/settings' 
                />
        }
        {admin && <Menu.Item 
                    content='Account Management' 
                    name='accountManagement' 
                    active={activeItem === 'accountManagement'} 
                    onClick={this.handleItemClick} 
                    as={Link} 
                    to='/account_management' 
                  />
        }
        {!uid && <Menu.Item 
                   content='FAQ' 
                   name='faq' 
                   active={activeItem === 'faq'} 
                   onClick={this.handleItemClick} 
                   as={Link} 
                   to='/FAQ' 
                 />
        }
        {!uid && <Menu.Item 
                   content='About'
                   name='about' 
                   active={activeItem === 'about'} 
                   onClick={this.handleItemClick} 
                   as={Link} 
                   to='/about' 
                 />
        }
        <Menu.Menu position='right'>
          {!uid && <Dropdown item text='Language'>
                    <Dropdown.Menu>
                      <Dropdown.Item>English</Dropdown.Item>
                      <Dropdown.Item>Spanish</Dropdown.Item>
                      <Dropdown.Item>Chinese</Dropdown.Item>
                      <Dropdown.Item>French</Dropdown.Item>
                      <Dropdown.Item>Tagalog</Dropdown.Item>
                      <Dropdown.Item>Vietnamese</Dropdown.Item>
                      <Dropdown.Item>German</Dropdown.Item>
                      <Dropdown.Item>Korean</Dropdown.Item>
                      <Dropdown.Item>Hindustani</Dropdown.Item>
                      <Dropdown.Item>Arabic</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
          }
          {!uid ? 
              <Menu.Item 
                content='Login' 
                name='login' 
                active={activeItem === 'login'} 
                onClick={this.handleItemClick} 
                as={Link} 
                to='/login' 
              />
            :
              <Menu.Item 
                content='Logout' 
                onClick={this.logout} 
                as={Link} 
                to='/login' 
              />
          }
       </Menu.Menu>
      </Menu>
    )
  }
}