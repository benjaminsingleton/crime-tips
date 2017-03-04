import React from 'react'

const TipLongForm = () => {
    return (
        <div className="col-lg-9 animated fadeInRight">
            <div className="mail-box-header">
                <div className="pull-right tooltip-demo">
                    <a href="mailbox.html" className="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to draft folder"><i className="fa fa-pencil"></i> Draft</a>
                    <a href="mailbox.html" className="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Discard email"><i className="fa fa-times"></i> Discard</a>
                </div>
                <h2>
                    Compse mail
                </h2>
            </div>
            <div className="mail-box">
                <div className="mail-body">
                    <form className="form-horizontal" method="get">
                        <div className="form-group"><label className="col-sm-2 control-label">To:</label>
                            <div className="col-sm-10"><input type="text" className="form-control" value="alex.smith@corporat.com" /></div>
                        </div>
                        <div className="form-group"><label className="col-sm-2 control-label">Subject:</label>
                            <div className="col-sm-10"><input type="text" className="form-control" value="" /></div>
                        </div>
                    </form>
                </div>
                <div className="mail-text h-200">
                    <div className="summernote">
                        <h3>Hello Jonathan! </h3>
                        dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industry's</strong> standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic
                        typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
                        <br/>
                        <br/>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="mail-body text-right tooltip-demo">
                    <a href="mailbox.html" className="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="top" title="Send"><i className="fa fa-reply"></i> Send</a>
                    <a href="mailbox.html" className="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Discard email"><i className="fa fa-times"></i> Discard</a>
                    <a href="mailbox.html" className="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to draft folder"><i className="fa fa-pencil"></i> Draft</a>
                </div>
                <div className="clearfix"></div>
            </div>
        </div>
    )
}

export default TipLongForm