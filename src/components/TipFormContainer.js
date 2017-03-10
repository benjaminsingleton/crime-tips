import React from 'react'

const TipFormContainer = (props) => {
    return (
         <div className="ibox">
            <div className="ibox-title">
                <h5>{props.title}</h5>
            </div>
            <div className="ibox-content">
                <form className="form-horizonal">
                {props.children}
                </form>
                <div className="text-right">
                    <button className="btn btn-prev" onClick={() => props.changeStep('previous')}>Previous</button>
                    <button className="btn btn-primary" onClick={() => props.changeStep('next')}>Next</button>
                </div>
            </div>
        </div>
    )
}

export default TipFormContainer