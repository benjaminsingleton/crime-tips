import React from 'react'

const TipFormIntro = (props) => {
    return (
        <div>
        <div className="form-group">
            <label className="col-sm-6 control-label">What kind of crime was committed?</label>
            <div className="col-sm-6">
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
                    <option>Rape / Sexual Assault</option>
                    <option>Robbery</option>
                    <option>Assault</option>
                    <option>Drug Sale / Possession</option>
                    <option>Human Trafficking / Prostitution</option>
                    <option>Other</option>
                </select>
            </div>
        </div>
        <br />
        <p>
            <strong>Please tell us the information you wanted to share.</strong>
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
        <div className="form-group">
            <label className="col-sm-6 control-label">How are you aware of this crime?</label>
            <div className="col-sm-6">
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
            </div>
        </div>
        <br />
        </div>
    );
}

TipFormIntro.propTypes = {
    title: React.PropTypes.string.isRequired,
    handleInputChange: React.PropTypes.func.isRequired
}

export default TipFormIntro