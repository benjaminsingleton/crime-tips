import React from 'react'
import { Grid, Card, Button, List, Icon, Divider } from 'semantic-ui-react'

const DashboardLeftPanel = ({filterTips, changePanel}) => {
  return (  
    <Grid.Column mobile={16} tablet={8} computer={4} largeScreen={4}>
      <Card>
        <Card.Content>
          <Button content='New Tip' fluid onClick={() => changePanel('form')} />
          <h4>FOLDERS</h4>
          <List selection relaxed verticalAlign='middle' size='big'>
            <List.Item onClick={() => filterTips('archived', false)}>
              <Icon name='inbox' />
              <List.Content>
                <List.Header style={{fontWeight: '300'}}>Tip Inbox</List.Header>
              </List.Content>
            </List.Item>
            <List.Item style={{marginTop: '10px'}}>
              <Icon name='feed' />
              <List.Content>
                <List.Header style={{fontWeight: '300'}}>Abandoned Tips</List.Header>
              </List.Content>
            </List.Item>
            <List.Item onClick={() => filterTips('important', true)} style={{marginTop: '10px'}}>
              <Icon name='star' />
              <List.Content>
                <List.Header style={{fontWeight: '300'}}>Important</List.Header>
              </List.Content>
            </List.Item>
            <List.Item onClick={() => filterTips('archived', true)} style={{marginTop: '10px'}}>
              <Icon name='archive' />
              <List.Content>
                <List.Header style={{fontWeight: '300'}}>Archived</List.Header>
              </List.Content>
            </List.Item>
            <Divider />
            <List.Item style={{marginTop: '10px'}}>
              <Icon name='mail square' />
              <List.Content>
                <List.Header style={{fontWeight: '300'}}>Tip Drafts</List.Header>
              </List.Content>
            </List.Item>
          </List>
          <h4>CATEGORIES</h4>
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}

export default DashboardLeftPanel