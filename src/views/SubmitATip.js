import React, { Component } from 'react';
import base from '../base'
import Layout from '../components/Layout'

class SubmitATip extends Component {

    constructor () {
        super()

        // get initial state
        this.state = {
            displayForm: true,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.createTip = this.createTip.bind(this)
        this.toggleDisplayForm = this.toggleDisplayForm.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    createTip(event) {
        event.preventDefault();
        // create object to store tip data
        const tip = {
            crimeType: this.state.crimeType,
            tipText: this.state.tipText,
            dateTime: Date.now(),
            readStatus: 'unread',
            attachment: false,
            important: false,
            archived: false,
        }
        // push tip object to firebase
        base.push('tips', {data: tip});
        // clear the form
        this.tipForm.reset();
        this.setState({ 
            displayForm: false,
            crimeType: undefined,
            tipText: undefined
        });
    }

    toggleDisplayForm () {
        const displayForm = !this.state.displayForm
        this.setState({ displayForm }) 
    }

    render() {

        return (
            <Layout isAdmin={false} >
                <div className="row">
                    <h1 className="text-center" id="headline">Gotham Crime Tips</h1>
                    <h3 className="text-center" id="headline2">Do you have information about a crime?</h3>
                    <h4 className="text-center" id="headline3">Provide it anonymously and receive up to $2000 for a tip that leads to an arrest and indictment.</h4>
                </div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                            { this.state.displayForm ? 
                                <div className="ibox">
                                    <div className="ibox-title">
                                        <h5>Submit a Tip</h5>
                                    </div>
                                    <div className="ibox-content">
                                        <p>
                                            What kind of crime did you witness?
                                        </p>
                                        <form ref={(input) => this.tipForm = input} onSubmit={(e) => this.createTip(e)}>
                                            <select 
                                                className="form-control m-b" 
                                                value={this.state.crimeType} 
                                                defaultValue='default' 
                                                name="crimeType"
                                                onChange={this.handleInputChange} 
                                            >
                                                <option value='default' disabled="disabled">Select a crime type</option>    
                                                <option>Murder</option>
                                                <option>Shooting</option>
                                                <option>Guns</option>
                                                <option>Robbery</option>
                                                <option>Drugs</option>
                                            </select>
                                            <br />
                                            <p>
                                                What did you witness?                                
                                            </p>
                                            <textarea 
                                                className="form-control" 
                                                name="tipText"
                                                value={this.state.tipText} 
                                                onChange={this.handleInputChange} 
                                            />
                                            <br />
                                            <button className="btn btn-primary" type="submit">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            : <h3 className="text-center">Thanks! <a onClick={this.toggleDisplayForm}>Click here</a> to write another tip.</h3> }
                        </div>
                    </div>
                </div>
            </Layout>
        );
  }
}

export default SubmitATip;
