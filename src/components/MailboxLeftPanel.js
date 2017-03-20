import React from 'react'
import {Card, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ImageLens from 'material-ui/svg-icons/image/lens';

const MailboxLeftPanel  = (props) => {
    
    const {filterTips, openTipLongForm } = props;

    return (
        <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3">
            <Card>
                <CardText>
                    <RaisedButton label="New Tip" primary={true} fullWidth={true} onClick={() => openTipLongForm()} />
                    <h4>FOLDERS</h4>
                    <List>
                        <ListItem primaryText="Tip Inbox" 
                            leftIcon={<ContentInbox />} 
                            onClick={() => filterTips('archived', false)} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Important" 
                            leftIcon={<ActionGrade />} 
                            onClick={() => filterTips('important', true)} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="My Drafts" 
                            leftIcon={<ContentDrafts />} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Archived" 
                            leftIcon={<ContentArchive />} 
                            onClick={() => filterTips('archived', true)}
                            style={{fontSize:'12px;'}} 
                        />
                    </List>
                    <h4>CATEGORIES</h4>
                    <List>
                        <ListItem primaryText="Murder" 
                            leftIcon={<ImageLens style={{fill: 'red'}} />} 
                            onClick={() => filterTips('crimeType', 'Murder')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Shooting" 
                            leftIcon={<ImageLens style={{fill: 'DarkBlue'}} />} 
                            onClick={() => filterTips('crimeType', 'Shooting')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Illegal Gun Possession / Sale" 
                            leftIcon={<ImageLens style={{fill: 'DarkOrange'}} />} 
                            onClick={() => filterTips('crimeType', 'Illegal Gun Possession / Sale')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Rape / Sexual Assault" 
                            leftIcon={<ImageLens style={{fill: 'DarkSlateGrey'}} />} 
                            onClick={() => filterTips('crimeType', 'Rape / Sexual Assault')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Robbery" 
                            leftIcon={<ImageLens style={{fill: 'Gold'}} />} 
                            onClick={() => filterTips('crimeType', 'Robbery')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Assault" 
                            leftIcon={<ImageLens style={{fill: 'DodgerBlue'}} />} 
                            onClick={() => filterTips('crimeType', 'Assault')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Drug Sale / Possession" 
                            leftIcon={<ImageLens style={{fill: 'SaddleBrown'}} />} 
                            onClick={() => filterTips('crimeType', 'Drug Sale / Possession')} 
                            style={{fontSize:'12px;'}} 
                        />
                        <ListItem primaryText="Other" 
                            leftIcon={<ImageLens style={{fill: 'LimeGreen'}} />} 
                            onClick={() => filterTips('crimeType', 'Other')} 
                            style={{fontSize:'12px;'}} 
                        />
                    </List>
                </CardText>
            </Card>
        </div>
        )
}

export default MailboxLeftPanel