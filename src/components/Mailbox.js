import React, { Component } from 'react'
import MailboxItem from './MailboxItem'

class Mailbox extends Component {
    render () {
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
                                            <a href="mailbox.html"><i className="fa fa-inbox"></i> Tip Inbox <span className="label label-warning pull-right">4</span></a>
                                        </li>
                                        <li>
                                            <a href="mailbox.html"><i className="fa fa-certificate"></i> Important</a>
                                        </li>
                                        <li>
                                            <a href="mailbox.html"><i className="fa fa-file-text-o"></i> My Tip Drafts <span className="label label-danger pull-right">2</span></a>
                                        </li>
                                        <li>
                                            <a href="mailbox.html"><i className="fa fa-archive"></i> Archive</a>
                                        </li>
                                    </ul>
                                    <h5>Categories</h5>
                                    <ul className="category-list">
                                        <li>
                                            <a href="#"><i className="fa fa-circle text-danger"></i> Murder</a>
                                        </li>
                                        <li>
                                            <a href="#"><i className="fa fa-circle text-navy"></i> Shooting</a>
                                        </li>
                                        <li>
                                            <a href="#"><i className="fa fa-circle text-primary"></i> Robbery</a>
                                        </li>
                                        <li>
                                            <a href="#"><i className="fa fa-circle text-info"></i> Guns</a>
                                        </li>
                                        <li>
                                            <a href="#"><i className="fa fa-circle text-warning"></i> Drugs</a>
                                        </li>
                                    </ul>
                                    <h5 className="tag-title">Labels</h5>
                                    <ul className="tag-list">
                                        <li>
                                            <a href=""><i className="fa fa-tag"></i> Likely Unfounded</a>
                                        </li>
                                        <li>
                                            <a href=""><i className="fa fa-tag"></i> TBD</a>
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
                            <button className="btn btn-white btn-sm" data-placement="top" data-toggle="tooltip" id="mark-important-btn" title="Mark as important"><i className="fa fa-certificate"></i></button> 
                            <button className="btn btn-white btn-sm" data-placement="top" data-toggle="tooltip" id="archive-btn" title="Move to archives"><i className="fa fa-archive"></i></button>
                            </span> 
                            <h2>Tip Inbox</h2>
                        </div>
                        <div className="mail-box">
                            <table className="table table-hover table-mail">
                                <tbody>
                                    <MailboxItem 
                                        readStatus="unread" 
                                        crimeType="Shooting"
                                        tipTextPreview="I saw Joe pull out his gun when Jim was yelling at him."
                                        attachment={true}
                                        dateTime="18:10"
                                    />
                                    <MailboxItem 
                                        readStatus="unread" 
                                        crimeType="Robbery"
                                        tipTextPreview="The three kids who hang out on 123 Street and Avenue A have ..."
                                        attachment={false}
                                        dateTime="12:05"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Murder"
                                        tipTextPreview="A red Jeep wranger drove away after I heard the shots. I think ..."
                                        attachment={false}
                                        dateTime="06:44"
                                    />
                                    <MailboxItem 
                                        readStatus="unread" 
                                        crimeType="Shooting"
                                        tipTextPreview="Fred shot him. I saw him do it."
                                        attachment={false}
                                        dateTime="05:55"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Drugs"
                                        tipTextPreview="The people in apartment 5B are selling crack everyday."
                                        attachment={true}
                                        dateTime="Yesterday"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Burglary"
                                        tipTextPreview="A guy named Gabe is stealing TVs from peoples homes."
                                        attachment={false}
                                        dateTime="Yesterday"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Robbery"
                                        tipTextPreview="Tom and Jerry are planning to rob James this weekend."
                                        attachment={false}
                                        dateTime="February 13"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Murder"
                                        tipTextPreview="The guy who shot Marcus was wearing a blue tshirt and black jeans ..."
                                        attachment={false}
                                        dateTime="February 13"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Rape"
                                        tipTextPreview="I overheard Greg saying that he raped Molly at the bar."
                                        attachment={false}
                                        dateTime="February 13"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Drugs"
                                        tipTextPreview="I saw hand to hand crack sales on 123 Street."
                                        attachment={false}
                                        dateTime="February 11"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Guns"
                                        tipTextPreview="Joe is posting pictures of guns on Facebook"
                                        attachment={true}
                                        dateTime="February 11"
                                    />
                                    <MailboxItem 
                                        readStatus="read" 
                                        crimeType="Rape"
                                        tipTextPreview="I overheard talk about a rape at the bar."
                                        attachment={true}
                                        dateTime="February 10"
                                    />
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