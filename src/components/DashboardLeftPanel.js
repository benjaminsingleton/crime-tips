import React, { Component } from 'react'
import { Card, Button, Icon, Menu, Label } from 'semantic-ui-react'

export default class DashboardLeftPanel extends Component {
  state = { activeItem: 'inbox' }

  handleItemClick = (e, { name }) => {
    switch (name) {
      case 'inbox':
        this.props.filterTips('archived', false)
        break;
      case 'abandoned':
        this.props.filterTips('abandoned', true)
        break;
      case 'important':
        this.props.filterTips('important', true)
        break;
      case 'archive':
        this.props.filterTips('archived', true)
        break;
      case 'draft':
        this.props.filterTips('draft', true)
        break;
      default:
        console.error('invalid filterTip name')
    }
    this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state
    return (
      <Card fluid>
        <Card.Content>
          <Button content='New Tip' fluid color='violet' onClick={() => this.props.changePanel('form')} />
          <h4>FOLDERS</h4>
          <Menu vertical fluid>
            <Menu.Item name='inbox' active={activeItem === 'inbox'} onClick={this.handleItemClick}>
              <Label color='teal'>#</Label>
               <Icon name='inbox' /> Tip Inbox
            </Menu.Item>
            <Menu.Item name='abandoned' active={activeItem === 'abandoned'} onClick={this.handleItemClick}>
              <Label>#</Label>
              <Icon name='feed' /> Abandoned Tips
            </Menu.Item>
            <Menu.Item name='important' active={activeItem === 'important'} onClick={this.handleItemClick}>
              <Label>#</Label>
              <Icon name='star' /> Important
            </Menu.Item>
            <Menu.Item name='archive' active={activeItem === 'archive'} onClick={this.handleItemClick}>
              <Label>#</Label>
              <Icon name='archive' /> Archive
            </Menu.Item>
            <Menu.Item name='draft' active={activeItem === 'draft'} onClick={this.handleItemClick}>
              <Label>#</Label>
              <Icon name='mail square' /> Tip Drafts
            </Menu.Item>
          </Menu>
          <h4>CATEGORIES</h4>
        </Card.Content>
      </Card>
    )
  }
}