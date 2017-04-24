import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Flag } from 'semantic-ui-react'
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
      <Menu inverted stackable size='large' style={{backgroundColor: '#1976d2'}}>
        <Menu.Item 
          content='Gotham Crime Tips' 
          header 
        />
        {!uid && <Menu.Item 
                   content='Home'
                   name='home' 
                   active={activeItem === 'home'} 
                   onClick={this.handleItemClick} 
                   as={Link} 
                   to='/' 
                 />
        }
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
                   content='Questions?' 
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
          {!uid && <Dropdown item text={'Language'}>
                    <Dropdown.Menu>
                      <Dropdown.Item><Flag name='us' /> English</Dropdown.Item>
                      <Dropdown.Item><Flag name='mx' /> Español</Dropdown.Item>
                      <Dropdown.Item><Flag name='cn' /> 广东话</Dropdown.Item>
                      <Dropdown.Item><Flag name='fr' /> Français</Dropdown.Item>
                      <Dropdown.Item><Flag name='ph' /> Tagalog</Dropdown.Item>
                      <Dropdown.Item><Flag name='vn' /> Tiếng Việt</Dropdown.Item>
                      <Dropdown.Item><Flag name='de' /> Deutsch</Dropdown.Item>
                      <Dropdown.Item><Flag name='kr' /> Korean</Dropdown.Item>
                      <Dropdown.Item><Flag name='in' /> हिन्दुस्तानी</Dropdown.Item>
                      <Dropdown.Item><Flag name='eg' /> العَرَبِيَّة</Dropdown.Item>
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
    );
  }
}