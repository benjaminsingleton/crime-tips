import React from 'react'
import { tipTimeFormat } from '../helpers/helpers'

const MailboxRow = (props) => {

    const { details } = props;

    return (
        <tr className={details.readStatus}>
            <td className="check-mail">
                <div className="icheckbox_square-green">
                    <input type="checkbox" ref={props.index} onChange={() => props.addSelectedItem(props.index)}/>
                </div>
            </td>
            <td className="mail-status">
                {details.important ? <i className="fa fa-certificate"></i> : null}
                {details.archived ? <i className="fa fa-archive"></i> : null}
            </td>
            <td className="mail-contact">
                <a onClick={() => props.markAsRead(props.index)}>{details.crimeType}</a>
            </td>
            <td className="mail-subject">
                <a onClick={() => props.markAsRead(props.index)}>{details.tipText}</a>
            </td>
            <td className="mail-attachment">
                {details.attachment ? <i className="fa fa-paperclip"></i> : null}
            </td>
            <td className="text-right mail-date">{tipTimeFormat(details.dateTime)}</td>
        </tr> 
    )
}

MailboxRow.propTypes = {
    details: React.PropTypes.object.isRequired,
    index: React.PropTypes.string.isRequired,
    addSelectedItem: React.PropTypes.func.isRequired,
    markAsRead: React.PropTypes.func.isRequired
}

export default MailboxRow