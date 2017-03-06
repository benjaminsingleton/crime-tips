import React from 'react'

const MailboxLeftPanel  = (props) => {
    
    const {unreadCount, showTips, openTipLongForm } = props;

    return (
        <div className="col-lg-3 animated fadeInRight" id="mailbox-controls">
            <div className="ibox float-e-margins">
                <div className="ibox-content mailbox-content">
                    <div className="file-manager">
                        <a 
                            className="btn btn-block btn-primary compose-mail" 
                            onClick={() => openTipLongForm()}
                        >
                            New Tip
                        </a>
                        <div className="space-25"></div>
                        <h5>Folders</h5>
                        <ul className="folder-list m-b-md">
                            <li>
                                <a onClick={() => showTips('all')}>
                                    <i className="fa fa-inbox"></i> Tip Inbox 
                                    <span className="label label-warning pull-right">{ unreadCount }</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => showTips('important')}>
                                    <i className="fa fa-certificate"></i> Important
                                </a>
                            </li>
                            <li>
                                <a>
                                    <i className="fa fa-file-text-o"></i> My Tip Drafts 
                                    <span className="label label-danger pull-right">2</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => showTips('archived')}><i className="fa fa-archive"></i> Archived</a>
                            </li>
                        </ul>
                        <h5>Categories</h5>
                        <ul className="category-list">
                            <li>
                                <a><i className="fa fa-circle text-danger"></i> Murder</a>
                            </li>
                            <li>
                                <a><i className="fa fa-circle text-navy"></i> Shooting</a>
                            </li>
                            <li>
                                <a><i className="fa fa-circle text-primary"></i> Robbery</a>
                            </li>
                            <li>
                                <a><i className="fa fa-circle text-info"></i> Guns</a>
                            </li>
                            <li>
                                <a><i className="fa fa-circle text-warning"></i> Drugs</a>
                            </li>
                        </ul>
                        
                    </div>
                </div>
            </div>
        </div>
        )
}

export default MailboxLeftPanel