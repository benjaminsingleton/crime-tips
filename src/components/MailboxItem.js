import React from 'react'
import { tipTimeFormat } from '../helpers/helpers'

const MailboxItem = (props) => {

    const { details, index, addSelectedItem, markAsRead } = props;

    return (
        <tr className={details.readStatus}>
            <td className="check-mail">
                <div className="icheckbox_square-green">
                    <input type="checkbox" ref={index} onChange={() => addSelectedItem(index)}/>
                </div>
            </td>
            <td className="mail-status">
                {details.important ? <i className="fa fa-certificate"></i> : null}
                {details.archived ? <i className="fa fa-archive"></i> : null}
            </td>
            <td className="mail-contact">
                <a onClick={() => markAsRead(index)}>{details.crimeType}</a>
            </td>
            <td className="mail-subject">
                <a onClick={() => markAsRead(index)}>{details.tipText}</a>
            </td>
            <td className="mail-attachment">
                {details.attachment ? <i className="fa fa-paperclip"></i> : null}
            </td>
            <td className="text-right mail-date">{tipTimeFormat(details.dateTime)}</td>
        </tr> 
    )

}

export default MailboxItem