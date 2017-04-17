import React, {Component} from 'react'
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
import {tipTimeFormat, reverse} from '../helpers/helpers'
import {firebaseApp, databaseRef} from '../helpers/constants'

export default class Mailbox extends Component {
  constructor () {
    super()
    this.state = {
      uid: firebaseApp.auth().currentUser.uid,
      tips: {},
      tipKeysToDisplay: [],
      selectedTipKeys: [],
      searchTerm: '',
      currentPage: 0,
      tipsPerPage: 10,
      showPreviousButton: false,
      showNextButton: true
    }
    this.addSelectedItem = this.addSelectedItem.bind(this)
    this.changePage = this.changePage.bind(this)
    this.markTipAs = this.markTipAs.bind(this)
    this.renderMailboxRows = this.renderMailboxRows.bind(this)
    this.showTipDetail = this.showTipDetail.bind(this)
  }

  componentWillMount() {
    databaseRef.child('tips')
      .orderByChild(this.props.tipFilter.criteria)
      .equalTo(this.props.tipFilter.value)
      .limitToLast(1000)
      .on('value', function(snapshot) {
        const tips = reverse(snapshot.val())
        const tipKeysToDisplay = Object.keys(tips).slice(0, this.state.tipsPerPage)
        this.setState({tips, tipKeysToDisplay})
    }.bind(this));
  }

  componentWillUnmount = () => databaseRef.child('tips').off();

  componentWillReceiveProps(nextProps) {
    if (this.props.tipFilter !== nextProps.tipFilter) {
      databaseRef.child('tips')
        .orderByChild(nextProps.tipFilter.criteria)
        .equalTo(nextProps.tipFilter.value)
        .limitToLast(1000)
        .on('value', function(snapshot) {
          const tips = reverse(snapshot.val())
          const tipKeysToDisplay = Object.keys(tips).slice(0, this.state.tipsPerPage)
          this.setState({tips, tipKeysToDisplay})
      }.bind(this));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // update tip data in firebase when this.state.tip changes
    if (prevState.tips !== this.state.tips) {
      this.showPaginationButtons(0, this.state.tipsPerPage)
    }
  }

  showPaginationButtons(startIndex, endIndex) {
    const totalTips = Object.keys(this.state.tips).length
    if (startIndex === 0) {
      if (totalTips - this.state.tipsPerPage <= 0) {
        this.setState({showNextButton: false, showPreviousButton: false})
      } else {
        this.setState({showNextButton: true, showPreviousButton: false})
      }
    } else if (totalTips - endIndex <= 0) {
      this.setState({showNextButton: false, showPreviousButton: true})
    } else {
      this.setState({showNextButton: true, showPreviousButton: true})
    }
  }

  changePage(value) {
    const nextPage = this.state.currentPage + value
    const tipsPerPage = this.state.tipsPerPage
    const startIndex = nextPage * tipsPerPage
    const endIndex = startIndex + tipsPerPage
    const tipKeysToDisplay = Object.keys(this.state.tips).slice(startIndex, endIndex)
    this.showPaginationButtons(startIndex, endIndex)
    this.setState({currentPage: nextPage, tipKeysToDisplay})
  }

  addSelectedItem(selectedRows) {
    const selectedTipKeys = []
    selectedRows.map((index) => selectedTipKeys.push(this.state.tipKeysToDisplay[index]))
    this.setState({selectedTipKeys})
  }

  markTipAs(criteria) {
    const user = this.state.uid;
    const timestamp = Date.now()
    const tips = {...this.state.tips};

    // toggle criteria boolean value and log activity
    function updateItem(criteria, key) {
      const status = !tips[key][criteria]
      tips[key][criteria] = status

      if (criteria==='archived' && status ===true) {
        tips[key]['important'] = false
      }

      databaseRef.child('tips/' + key).update({...tips[key]})

      databaseRef.child(`logs/`).push({
        user: user,
        tip: key,
        action: criteria,
        status: status,
        timestamp: timestamp
      });

      databaseRef.child(`users/${user}/activity/`).push({
        tip: key,
        action: criteria,
        status: status,
        timestamp: timestamp
      });
    };

    this.state.selectedTipKeys.map(key => updateItem(criteria, key))

    this.setState({tips, selectedTipKeys: []});
  }

  showTipDetail(key) {
    // Tip marked as read when clicked
    databaseRef.child('tips/' + key).update({read: true})

    // Log activity to 'logs' and 'users/uid' for auditing purposes
    const user = this.state.uid;
    const timestamp = Date.now()
    databaseRef.child('logs/').push({
        user: user,
        tip: key,
        action: 'read',
        timestamp: timestamp
    });
    databaseRef.child(`users/${user}/activity/`).push({
        tip: key,
        action: 'read',
        timestamp: timestamp
    });

    this.props.setTipDetailKey(key)
    this.props.changePanel('detail')

    // this.context.router.history.push(`tip/${key}`)   NEEDS TO BE FIGURED OUT
  }

  searchTips = (searchTerm) => this.setState({searchTerm, currentPage: 0});

  renderMailboxRows(tipKeysToDisplay) {
    const tips = this.state.tips
    const mailboxRows = tipKeysToDisplay.map(key => 
      <TableRow key={key}>
        <TableRowColumn style={{width: '10%'}}>
          {tips[key].important ? <ActionGrade/> : null}
        </TableRowColumn>
        <TableRowColumn style={{width: '20%'}}>
          <a onClick={() => this.showTipDetail(key)}>
            {tips[key].read ? tips[key].crimeType : <b>{tips[key].crimeType}</b>}
          </a>
        </TableRowColumn>
        <TableRowColumn style={{width: '45%'}}>
          <a onClick={() => this.showTipDetail(key)}>
            {tips[key].read ? tips[key].tipText : <b>{tips[key].tipText}</b>
            }
          </a>
        </TableRowColumn>
        <TableRowColumn style={{width: '10%'}}>
          <a onClick={() => this.showTipDetail(key)}>
            {tips[key].attachment ? <EditorAttachFile style={{height: '20px', width: '20px'}}/> : null}
          </a>
        </TableRowColumn>
        <TableRowColumn style={{width: '15%', textAlign: 'right'}}>
          <a onClick={() => this.showTipDetail(key)}>
            {tips[key].read ? tipTimeFormat(tips[key].timestampStart) : <b>{tipTimeFormat(tips[key].timestampStart)}</b>}
          </a>
        </TableRowColumn>
      </TableRow>)
    return mailboxRows
  }

  render () {    
    return (
      <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        <Card>
          <CardText>
            <h2 style={{ float: 'left'}}>Tip Inbox</h2>
            <form style={{float: 'right'}}>
              <TextField
                hintText="Search tip text"
                style={{margin: '0 5px'}}
                value={this.state.searchTerm}
                onChange={(e) => this.searchTips(e.target.value)} />
            </form>
            <IconButton
              style={{float: 'right', margin: '0 20px'}}
              onTouchTap={() => this.markTipAs('archived')}>
              <ContentArchive/>
            </IconButton>
            <IconButton
              onTouchTap={() => this.markTipAs('important')}
              style={{float: 'right'}}>
              <ActionGrade/>
            </IconButton>
            <div style={{clear: 'both'}}></div>
            <Table
              multiSelectable={true}
              onRowSelection={(selectedRows) => this.addSelectedItem(selectedRows)} >
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
                {(this.state.tipKeysToDisplay.length === 0) ? null : this.renderMailboxRows(this.state.tipKeysToDisplay)}
              </TableBody>
            </Table>
          </CardText>
          <CardActions style={{textAlign: 'right'}}>
            {this.state.showPreviousButton && <RaisedButton label="Previous" default={true} onTouchTap={() => this.changePage(-1)} />}
            {this.state.showNextButton && <RaisedButton label="Next" default={true} onTouchTap={() => this.changePage(1)} />}
          </CardActions>
        </Card>
      </div>
    )
  }
}

Mailbox.propTypes = {
  tipFilter: React.PropTypes.object.isRequired,
}