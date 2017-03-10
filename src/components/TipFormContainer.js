import React from 'react'

const TipFormContainer = (props) => {
    return (
         <div className="ibox">
            <div className="ibox-title">
                <h5>{props.title}</h5>
            </div>
            <div className="ibox-content">
                <form className="form-horizontal">
                {props.children}
                { props.showSubmit
                    ? <div className="text-center">
                        <button className="btn btn-primary" onClick={()=>props.createTip()}>Submit</button>'
                      </div>
                    : null
                }
                </form>
                <div className="text-right">
                    { props.noPreviousButton 
                        ? null 
                        : <button className="btn btn-prev" onClick={() => props.changeStep('previous')}>Previous</button> 
                    }
                    { props.noNextButton 
                        ? null
                        : <button className="btn btn-primary" onClick={() => props.changeStep('next')}>Next</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default TipFormContainer