import React from 'react'
import { tipTimeFormatLong } from '../helpers'

const TipDetail = (props) => {
    const { details } = props;

    return (
    <div className="col-lg-9 animated fadeInRight">
        <div className="mail-box-header">
            <h2>
                Tip Detail
            </h2>
            <div className="mail-tools tooltip-demo m-t-md">
                <h3>
                    <span className="font-normal">Crime Type: </span>{details.crimeType}
                </h3>
                <h5>
                    <span className="pull-right font-normal">{tipTimeFormatLong(details.dateTime)}</span>
                </h5>
            </div>
        </div>
        <div className="mail-box">
            <div className="mail-body">
                <p>
                    {details.tipText}
                </p>
            </div>
            { !details.attachment ? null : 
            <div className="mail-attachment">
                <p>
                    <span><i className="fa fa-paperclip"></i> 2 attachments </span>
                </p>
                <div className="attachment">
                    <div className="file-box">
                        <div className="file">
                            <a href="#">
                                <span className="corner"></span>
                                <div className="icon">
                                    <i className="fa fa-file"></i> 
                                    {/*<img alt="image" className="img-responsive" src="img/p1.jpg">*/}
                                </div>
                                <div className="file-name">
                                    Document_2014.doc
                                    <br/>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div className="mail-body text-right tooltip-demo">
                    <a className="btn btn-sm btn-white" href="mail_compose.html"><i className="fa fa-check-square-o"></i> Mark As Reviewed</a>
                    <a className="btn btn-sm btn-white" href="mail_compose.html"><i className="fa fa-arrow-right"></i> Forward</a>
                    <button title="" data-placement="top" data-toggle="tooltip" type="button" data-original-title="Print" className="btn btn-sm btn-white"><i className="fa fa-print"></i> Print</button>
                    <button title="" data-placement="top" data-toggle="tooltip" data-original-title="Archive" className="btn btn-sm btn-white"><i className="fa fa-archive"></i> Archive</button>
            </div>
        </div>
    </div>

    )
    
}

export default TipDetail;