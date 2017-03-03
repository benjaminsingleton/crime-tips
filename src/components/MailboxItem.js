import React, { Component } from 'react'

class MailboxItem extends Component {

    render () {
        const { details, index } = this.props;
        return (
           <tr className={details.readStatus}>
                <td className="check-mail">
                    <div className="icheckbox_square-green">
                        <input type="checkbox" ref={index} onChange={() => this.props.addSelectedItem(index)}/>
                    </div>
                </td>
                <td className="mail-status">
                    {details.important ? <i className="fa fa-certificate"></i> : null}
                    {details.archived ? <i className="fa fa-archive"></i> : null}
                </td>
                <td className="mail-contact">
                    <a onClick={() => this.props.markAsRead(index)}>{details.crimeType}</a>
                </td>
                <td className="mail-subject">
                    <a onClick={() => this.props.markAsRead(index)}>{details.tipText}</a>
                </td>
                <td className="mail-attachment">
                    {details.attachment ? <i className="fa fa-paperclip"></i> : null}
                </td>
                <td className="text-right mail-date">{details.dateTime}</td>
            </tr> 
        )
    }
}

export default MailboxItem