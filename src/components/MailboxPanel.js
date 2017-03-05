import React from 'react'

import MailboxRow from './MailboxRow'

const MailboxPanel = (props) => {

    const mailboxItems =  Object.keys(props.tipsToDisplay)
                                .reverse()
                                .map(key => <MailboxRow
                                                key={key} 
                                                index={key} 
                                                showTipDetail={props.showTipDetail}
                                                addSelectedItem={props.addSelectedItem}
                                                details={props.tipsToDisplay[key]} 
                                            />);
    return (
            <div className="col-lg-9 animated fadeInRight">
                <div className="mail-box-header">
                    <span className='pull-right'>
                        <form action="index.html" className="pull-right mail-search" method="get">
                            <div className="input-group">
                                <input 
                                    className="form-control input-sm" 
                                    name="search" 
                                    placeholder="Search email" 
                                    type="text" 
                                />
                                <div className="input-group-btn">
                                    <button className="btn btn-sm btn-primary" type="submit">Search</button>
                                </div>
                            </div>
                        </form>
                        <button 
                            className="btn btn-white btn-sm" 
                            data-placement="top" 
                            data-toggle="tooltip" 
                            id="refresh-btn" 
                            title="Refresh mailbox"
                        >
                            <i className="fa fa-refresh"></i>
                        </button>
                        <button 
                            className="btn btn-white btn-sm" 
                            data-placement="top" 
                            data-toggle="tooltip" 
                            id="mark-important-btn" 
                            title="Mark as important"
                            onClick={() => props.markTipAs('important')} 
                        >
                            <i className="fa fa-certificate"></i>
                        </button> 
                        <button 
                            className="btn btn-white btn-sm" 
                            data-placement="top" 
                            data-toggle="tooltip" 
                            id="archive-btn" 
                            title="Move to archives"
                            onClick={() => props.markTipAs('archived')} 
                        >
                            <i className="fa fa-archive"></i>
                        </button>
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
                            <button className="btn btn-white btn-sm"><i className="fa fa-arrow-left"></i></button> 
                            <button className="btn btn-white btn-sm"><i className="fa fa-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
    )
}

MailboxPanel.propTypes = {
     showTipDetail: React.PropTypes.func.isRequired,
     addSelectedItem: React.PropTypes.func.isRequired,
     markTipAs: React.PropTypes.func.isRequired,
     tipsToDisplay: React.PropTypes.object.isRequired
}

export default MailboxPanel