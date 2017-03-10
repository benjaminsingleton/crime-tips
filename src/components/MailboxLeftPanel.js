import React from 'react'

const MailboxLeftPanel  = (props) => {
    
    const {unreadCount, filterTips, openTipLongForm } = props;

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
                                <a onClick={() => filterTips('archived', false)}>
                                    <i className="fa fa-inbox"></i> Tip Inbox 
                                    <span className="label label-warning pull-right">{ unreadCount }</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={() => filterTips('important', true)}>
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
                                <a onClick={() => filterTips('archived', true)}><i className="fa fa-archive"></i> Archived</a>
                            </li>
                        </ul>
                        <h5>Categories</h5>
                        <ul className="category-list">
                            <li>
                                <a onClick={() => filterTips('crimeType', 'Murder')}>
                                    <i className="fa fa-circle text-primary"></i> Murder
                                </a>
                            </li>
                            <li>
                                <a onClick={() => filterTips('crimeType', 'Shooting')}>
                                    <i className="fa fa-circle text-success"></i> Shooting
                                </a>
                            </li>
                            <li>
                                <a onClick={() => filterTips('crimeType', 'Illegal Gun Possession / Sale')}>
                                    <i className="fa fa-circle text-info"></i> Illegal Gun Possession / Sale
                                </a>
                            </li>
                             <li>
                                <a onClick={() => filterTips('crimeType', 'Rape / Sexual Assault')}>
                                    <i className="fa fa-circle text-warning"></i> Rape / Sexual Assault
                                </a>
                            </li>
                            <li>
                                <a onClick={() => filterTips('crimeType', 'Robbery')}>
                                    <i className="fa fa-circle text-danger"></i> Robbery
                                </a>
                            </li>
                             <li>
                                <a onClick={() => filterTips('crimeType', 'Assault')}>
                                    <i className="fa fa-circle text-navy"></i> Assault
                                </a>
                            </li>
                             <li>
                                <a onClick={() => filterTips('crimeType', 'Drug Sale / Possession')}>
                                    <i className="fa fa-circle text-primary"></i> Drug Sale / Possession
                                </a>
                            </li>
                             <li>
                                <a onClick={() => filterTips('crimeType', 'Human Trafficking / Prostitution')}>
                                    <i className="fa fa-circle text-success"></i> Human Trafficking / Prostitution
                                </a>
                            </li>
                            <li>
                                <a onClick={() => filterTips('crimeType', 'Other')}>
                                    <i className="fa fa-circle text-info"></i> Other
                                </a>
                            </li>
                        </ul>
                        
                    </div>
                </div>
            </div>
        </div>
        )
}

export default MailboxLeftPanel