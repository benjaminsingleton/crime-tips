import React, { Component } from 'react'
import { Card, Button, Icon, Menu, Label } from 'semantic-ui-react'

export default class DashboardLeftPanel extends Component {
  state = { activeItem: 'inbox' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    const { filterTips, changePanel } = this.props
    return (
      <Card>
        <Card.Content>
          <Button content='New Tip' fluid onClick={() => changePanel('form')} />
          <h4>FOLDERS</h4>
          <Menu vertical fluid>
            <Menu.Item name='inbox' active={activeItem === 'inbox'} onClick={() => {this.handleItemClick(); filterTips('archived', false)}}>
              <Label color='teal'>1</Label>
               <Icon name='inbox' /> Tip Inbox
            </Menu.Item>
            <Menu.Item name='abandoned' active={activeItem === 'abandoned'} onClick={() => {this.handleItemClick(); filterTips('', false)}}>
              <Label>51</Label>
              <Icon name='feed' /> Abandoned Tips
            </Menu.Item>
            <Menu.Item name='important' active={activeItem === 'important'} onClick={() => {this.handleItemClick(); filterTips('important', true)}}>
              <Label>1</Label>
              <Icon name='star' /> Important
            </Menu.Item>
            <Menu.Item name='archive' active={activeItem === 'archive'} onClick={() => {this.handleItemClick(); filterTips('archived', true)}}>
              <Label>1</Label>
              <Icon name='archive' /> Archive
            </Menu.Item>
            <Menu.Item name='draft' active={activeItem === 'draft'} onClick={() => {this.handleItemClick(); filterTips('', false)}}>
              <Label>1</Label>
              <Icon name='mail square' /> Tip Drafts
            </Menu.Item>
          </Menu>
          <h4>CATEGORIES</h4>
        </Card.Content>
      </Card>
    )
  }
}