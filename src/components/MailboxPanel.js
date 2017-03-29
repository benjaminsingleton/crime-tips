import React from 'react'
import {Card, CardText, CardActions} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file';
import {tipTimeFormat} from '../helpers/helpers'

const MailboxPanel = (props) => {

  const {markTipAs, addSelectedItem, tipsToDisplay, searchTerm, searchTips} = props;

  const tipRows = Object.keys(tipsToDisplay).map(key => 
                  <TableRow key={key}>
                    <TableRowColumn style={{width: '10%'}}>
                      {tipsToDisplay[key].important ? <ActionGrade/> : null}
                    </TableRowColumn>
                    <TableRowColumn style={{width: '20%'}}>
                      <a onClick={() => props.showTipDetail(key)}>{tipsToDisplay[key].crimeType}</a>
                    </TableRowColumn>
                    <TableRowColumn style={{width: '45%'}}>
                      <a onClick={() => props.showTipDetail(key)}>{tipsToDisplay[key].tipText}</a>
                    </TableRowColumn>
                    <TableRowColumn style={{width: '10%'}}>
                      <a onClick={() => props.showTipDetail(key)}>
                        {tipsToDisplay[key].attachment ? <EditorAttachFile style={{height: '20px', width: '20px'}}/> : null}
                      </a>
                    </TableRowColumn>
                    <TableRowColumn style={{width: '15%', textAlign: 'right'}}>
                      <a onClick={() => props.showTipDetail(key)}>
                        {tipTimeFormat(tipsToDisplay[key].dateTime)}
                      </a>
                    </TableRowColumn>
                  </TableRow>)

  return (
    <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
      <Card>
        <CardText>
          <h2 style={{ float: 'left'}}>Tip Inbox</h2>
          <form style={{float: 'right'}}>
            <TextField
              hintText="Search tip text"
              style={{margin: '0 5px'}}
              value={searchTerm}
              onChange={(e) => searchTips(e.target.value)} />
          </form>
          <IconButton
            style={{float: 'right', margin: '0 20px'}}
            onTouchTap={() => markTipAs('archived')}>
            <ContentArchive/>
          </IconButton>
          <IconButton
            onTouchTap={() => markTipAs('important')}
            style={{float: 'right'}}>
            <ActionGrade/>
          </IconButton>
          <div style={{clear: 'both'}}></div>
          <Table
            multiSelectable={true}
            onRowSelection={(selectedRows) => addSelectedItem(selectedRows)} >
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={{width: '10%'}}>Status</TableHeaderColumn>
                <TableHeaderColumn style={{width: '20%'}}>Crime Type</TableHeaderColumn>
                <TableHeaderColumn style={{width: '45%'}}>Tip Text</TableHeaderColumn>
                <TableHeaderColumn style={{width: '10%'}}>File(s)</TableHeaderColumn>
                <TableHeaderColumn style={{width: '15%', textAlign: 'right'}}>Date</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tipsToDisplay.length === 0) ? null : tipRows}
            </TableBody>
          </Table>
        </CardText>
        <CardActions style={{textAlign: 'right'}}>
          <RaisedButton label="Previous" default={true}/>
          <RaisedButton label="Next" default={true}/>
        </CardActions>
      </Card>
    </div>
  )
}

MailboxPanel.propTypes = {
  showTipDetail: React.PropTypes.func.isRequired,
  addSelectedItem: React.PropTypes.func.isRequired,
  markTipAs: React.PropTypes.func.isRequired
}

export default MailboxPanel