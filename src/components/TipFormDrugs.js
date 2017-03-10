import React from 'react'

const TipFormDrugs = (props) => {
    return (
       <div>
        <div className="form-group">
            <label className="col-sm-6 control-label">What drugs are possessed / being sold?</label>
            <div className="col-sm-6">
                <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="drugTypes"
                    value={props.tip.drugTypes} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a drug</option>    
                    <option>Marijuana</option>
                    <option>Cocaine</option>
                    <option>Crack</option>
                    <option>Heroin</option>
                    <option>Methamphetamine</option>
                    <option>Pills</option>
                    <option>Other</option>
                </select>
                </div>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">Where are the drugs being sold?</label>
            <div className="col-sm-6">
                <div className="col-sm-6">
                <select 
                    className="form-control m-b" 
                    name="drugSaleLocation"
                    value={props.tip.drugSaleLocation} 
                    defaultValue='default' 
                    onChange={props.handleInputChange} 
                >
                    <option value='default' disabled="disabled">Select a method</option>    
                    <option>On the street</option>
                    <option>In an apartment / house</option>
                    <option>From a vehicle</option>
                    <option>Other</option>
                </select>
            </div>
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What time of day are drugs sold?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="drugSaleTime"
                    placeholder="10am-4pm on weekdays"
                    value={props.tip.drugSaleTime} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
        <div className="form-group">
            <label className="col-sm-6 control-label">What is the phone number dialed to buy drugs?</label>
            <div className="col-sm-6">
                <input 
                    className="form-control" 
                    name="drugSalePhoneNumber"
                    placeholder="917-123-4567"
                    value={props.tip.drugSalePhoneNumber} 
                    onChange={props.handleInputChange} 
                />
            </div>
        </div>
        <br />
       </div>
    );
}

export default TipFormDrugs