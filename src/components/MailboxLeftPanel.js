import React from 'react'
import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ImageLens from 'material-ui/svg-icons/image/lens';

const MailboxLeftPanel = ({filterTips, openTipLongForm}) => {
  
  const style = {
    fontSize: '14px',
    lineHeight: '8px'
  }

  return (  
    <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
      <Card>
        <CardText>
          <RaisedButton
            label="New Tip"
            primary={true}
            fullWidth={true}
            onClick={() => openTipLongForm()}/>
          <h4>FOLDERS</h4>
          <List>
            <ListItem
              primaryText="Tip Inbox"
              leftIcon={<ContentInbox />}
              onClick={() => filterTips('archived', false)}
              style={style}/>
            <ListItem
              primaryText="Important"
              leftIcon={<ActionGrade />}
              onClick={() => filterTips('important', true)}
              style={style}
            />
            <ListItem
              primaryText="My Drafts"
              leftIcon={<ContentDrafts />}
              style={style}
            />
            <ListItem
              primaryText="Archived"
              leftIcon={<ContentArchive />}
              onClick={() => filterTips('archived', true)}
              style={style}
            />
          </List>
          <h4>CATEGORIES</h4>
          <List>
            <ListItem
              primaryText="Murder"
              leftIcon={<ImageLens style={{fill: 'red', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Murder')}
              style={style}
            />
            <ListItem
              primaryText="Shooting"
              leftIcon={<ImageLens style={{fill: 'DarkBlue', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Shooting')}
              style={style}
            />
            <ListItem
              primaryText="Illegal Gun Possession / Sale"
              leftIcon={<ImageLens style={{fill: 'DarkOrange', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Illegal Gun Possession / Sale')}
              style={style}
            />
            <ListItem
              primaryText="Rape / Sexual Assault"
              leftIcon={<ImageLens style={{fill: 'DarkSlateGrey', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Rape / Sexual Assault')}
              style={style}
            />
            <ListItem
              primaryText="Robbery"
              leftIcon={<ImageLens style={{fill: 'Gold', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Robbery')}
              style={style}
            />
            <ListItem
              primaryText="Assault"
              leftIcon={<ImageLens style={{fill: 'DodgerBlue', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Assault')}
              style={style}
            />
            <ListItem
              primaryText="Drug Sale / Possession"
              leftIcon={<ImageLens style={{fill: 'SaddleBrown', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Drug Sale / Possession')}
              style={style}
            />
            <ListItem
              primaryText="Other"
              leftIcon={<ImageLens style={{fill: 'LimeGreen', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Other')}
              style={style}
            />
            <ListItem
              primaryText="Other"
              leftIcon={<ImageLens style={{fill: 'LimeGreen', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Other2')}
              style={style}
            />
            <ListItem
              primaryText="Other"
              leftIcon={<ImageLens style={{fill: 'LimeGreen', height: '16px'}}/>}
              onClick={() => filterTips('crimeType', 'Other3')}
              style={style}
            />
          </List>
        </CardText>
      </Card>
    </div>
  )
}

export default MailboxLeftPanel