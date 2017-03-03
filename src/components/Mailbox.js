import React, { Component } from 'react'
import MailboxItem from './MailboxItem'

class Mailbox extends Component {
    

    render () {

        const {tips, tipsToDisplay, unreadCount, markAsRead, 
            addSelectedItem, markTipAs, showTips } = this.props;

        const mailboxItems =  Object.keys(tipsToDisplay).reverse().map(key => <MailboxItem   key={key} 
                                                                                    index={key} 
                                                                                    markAsRead={markAsRead}
                                                                                    addSelectedItem={addSelectedItem}
                                                                                    details={tipsToDisplay[key]} />);

        return (
            <div className="wrapper wrapper-content" id="mailbox">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="ibox float-e-margins">
                            <div className="ibox-content mailbox-content">
                                <div className="file-manager">
                                    <a className="btn btn-block btn-primary compose-mail" href="mail_compose.html">New Tip</a>
                                    <div className="space-25"></div>
                                    <h5>Folders</h5>
                                    <ul className="folder-list m-b-md">
                                        <li>
                                            <a onClick={() => showTips('all')}><i className="fa fa-inbox"></i> Tip Inbox <span className="label label-warning pull-right">{ unreadCount }</span></a>
                                        </li>
                                        <li>
                                            <a onClick={() => showTips('important')}><i className="fa fa-certificate"></i> Important</a>
                                        </li>
                                        <li>
                                            <a><i className="fa fa-file-text-o"></i> My Tip Drafts <span className="label label-danger pull-right">2</span></a>
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
                                    <h5 className="tag-title">Labels</h5>
                                    <ul className="tag-list">
                                        <li>
                                            <a><i className="fa fa-tag"></i> Likely Unfounded</a>
                                        </li>
                                        <li>
                                            <a><i className="fa fa-tag"></i> TBD</a>
                                        </li>
                                    </ul>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                </div>
            </div>
        )
    }
}

export default Mailbox