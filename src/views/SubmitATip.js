import React, { Component } from 'react';

import Layout from '../components/Layout'


class TipSubmit extends Component {
    createTip(event) {
        event.preventDefault();
        console.log('form submitted')
        const tip = {
            crimeType: this.crimeType.value,
            tipText: this.tipText.value,
        }
        console.log(tip)
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
                        <div className="ibox">
                            <div className="ibox-title">
                                <h5>Submit a Tip</h5>
                            </div>
                            <div className="ibox-content">
                                <p>
                                    What kind of crime did you witness?
                                </p>
                                <form onSubmit={(e) => this.createTip(e)}>
                                    <select ref={(input) => this.crimeType = input} className="form-control m-b" name="crime-type">
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
                                    <textarea ref={(input) => this.tipText = input } className="form-control" />
                                    <br />
                                    <button className="btn btn-primary" type="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </Layout>

    );
  }
}

export default TipSubmit;
