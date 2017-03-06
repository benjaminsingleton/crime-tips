import React from 'react'

const TipFormIntro = (props) => {
    return (
        <div className="ibox">
            <div className="ibox-title">
                <h5>{props.title}</h5>
            </div>
            <div className="ibox-content">
                <form onSubmit={(e) => props.createTip(e)}>
                    <p>What kind of crime was committed?</p>
                    <select 
                        className="form-control m-b" 
                        value={props.tip.crimeType} 
                        defaultValue='default' 
                        name="crimeType"
                        onChange={props.handleInputChange} 
                    >
                        <option value='default' disabled="disabled">Select a crime type</option>    
                        <option>Murder</option>
                        <option>Shooting</option>
                        <option>Illegal Gun Possession / Sale</option>
                        <option>Rape</option>
                        <option>Sexual Assault</option>
                        <option>Robbery</option>
                        <option>Assault</option>
                        <option>Drug Sale / Possession</option>
                        <option>Human Trafficking / Prostitution</option>
                        <option>Other</option>
                    </select>
                    <br />
                    <p>
                        Please tell us what you know. 
                        <span className="pull-right">
                            <small><a>Click here</a> for an example of a helpful tip.</small>
                        </span>
                    </p>
                    <textarea 
                        className="form-control" 
                        name="tipText"
                        value={props.tip.tipText} 
                        onChange={props.handleInputChange} 
                    />
                    <br />
                    <p>How are you aware of this crime?</p>
                    <select 
                        className="form-control m-b" 
                        value={props.tip.reporterAwareOfCrimeMethod} 
                        defaultValue='default' 
                        name="reporterAwareOfCrimeMethod"
                        onChange={props.handleInputChange} 
                    >
                        <option value='default' disabled="disabled">Select an option</option>    
                        <option>I observed it happen</option>
                        <option>It happened to me directly</option>
                        <option>Somebody I know told me about it</option>
                        <option>I overheard a conversation inadvertently</option>
                        <option>Other</option>
                    </select>
                    <br />
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">Submit</button>
                        <div className="pull-right">
                            <button 
                                className="btn btn-primary" 
                                onClick={() => props.changeStep('next')}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

TipFormIntro.propTypes = {
    title: React.PropTypes.string.isRequired,
    handleInputChange: React.PropTypes.func.isRequired
}

export default TipFormIntro