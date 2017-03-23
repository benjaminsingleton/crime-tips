import React from 'react'
import {tipTimeFormat} from '../helpers/helpers'
import {TableRow, TableRowColumn} from 'material-ui/Table';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file';

const MailboxRow = (props) => {

  const {details, index, addSelectedItem, showTipDetail, ...otherProps} = props;

  return (
    <TableRow { ...otherProps }>
      {otherProps.children[0]}
      <TableRowColumn style={{width: '10%'}}>{details.important ? <ActionGrade/> : null}</TableRowColumn>
      <TableRowColumn style={{width: '20%'}}>{details.crimeType}</TableRowColumn>
      <TableRowColumn style={{width: '45%'}}>{details.tipText}</TableRowColumn>
      <TableRowColumn style={{width: '10%'}}>{details.attachment ? <EditorAttachFile/> : null}</TableRowColumn>
      <TableRowColumn style={{width: '15%', textAlign: 'right'}}>{tipTimeFormat(details.dateTime)}</TableRowColumn>
    </TableRow>
  )
}

MailboxRow.propTypes = {
  details: React.PropTypes.object.isRequired,
  index: React.PropTypes.string.isRequired,
  addSelectedItem: React.PropTypes.func.isRequired,
  showTipDetail: React.PropTypes.func.isRequired
}

export default MailboxRow