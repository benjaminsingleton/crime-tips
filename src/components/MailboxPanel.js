import React from 'react'

import MailboxItem from './MailboxItem'

const MailboxPanel = (props) => {

    const { tips, markAsRead, addSelectedItem, markTipAs, tipsToDisplay } = props;

    const mailboxItems =  Object.keys(tipsToDisplay)
                                .reverse()
                                .map(key => <MailboxItem
                                                key={key} 
                                                index={key} 
                                                markAsRead={markAsRead}
                                                addSelectedItem={addSelectedItem}
                                                details={tipsToDisplay[key]} 
                                            />);
    return (
            <div className="col-lg-9 animated fadeInRight">
                <div className="mail-box-header">
                    <span className='pull-right'>
                        <form action="index.html" className="pull-right mail-search" method="get">
                            <div className="input-group">
                                <input className="form-control input-sm" name="search" placeholder="Search email" type="text" />
                                <div className="input-group-btn">
                                    <button className="btn btn-sm btn-primary" type="submit">Search</button>
                                </div>
                            </div>
                        </form>
                    <button className="btn btn-white btn-sm" data-placement="top" data-toggle="tooltip" id="refresh-btn" title="Refresh mailbox"><i className="fa fa-refresh"></i></button>
                    <button onClick={() => this.props.markTipAs('important')} className="btn btn-white btn-sm" data-placement="top" data-toggle="tooltip" id="mark-important-btn" title="Mark as important"><i className="fa fa-certificate"></i></button> 
                    <button onClick={() => this.props.markTipAs('archived')} className="btn btn-white btn-sm" data-placement="top" data-toggle="tooltip" id="archive-btn" title="Move to archives"><i className="fa fa-archive"></i></button>
                    </span> 
                    <h2>Tip Inbox</h2>
                </div>
                <div className="mail-box">
                    <table className="table table-hover table-mail">
                        <tbody>
                            { mailboxItems }
                        </tbody>
                    </table>
                    <div className="mail-tools tooltip-demo m-t-md">
                        <div className="btn-group pull-right">
                            <button className="btn btn-white btn-sm"><i className="fa fa-arrow-left"></i></button> <button className="btn btn-white btn-sm"><i className="fa fa-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default MailboxPanel