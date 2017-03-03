import React, { Component } from 'react'

class MailboxItem extends Component {
    render () {
        return (
           <tr className={this.props.readStatus}>
                <td className="check-mail">
                    <div className="icheckbox_square-green">
                        <input type="checkbox" />
                    </div>
                </td>
                <td className="mail-ontact">
                    <a href="#">{this.props.crimeType}</a>
                </td>
                <td className="mail-subject">
                    <a href="#">{this.props.tipTextPreview}</a>
                </td>
                <td className="">
                    { this.props.attachment ? <i className="fa fa-paperclip"></i> : ''}
                </td>
                <td className="text-right mail-date">{this.props.dateTime}</td>
            </tr> 
        )
    }
}

export default MailboxItem