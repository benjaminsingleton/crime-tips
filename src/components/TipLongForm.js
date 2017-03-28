import React, {Component} from 'react'
import base from '../base'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import TipFormIntro from '../components/TipFormIntro'
import TipFormSuspectDescription from '../components/TipFormSuspectDescription'
import TipFormSuspectLocation from '../components/TipFormSuspectLocation'
import TipFormSuspectEmployment from '../components/TipFormSuspectEmployment'
import TipFormSuspectVehicle from '../components/TipFormSuspectVehicle'
import TipFormDrugs from '../components/TipFormDrugs'
import TipFormMedia from '../components/TipFormMedia'
import TipFormFinal from '../components/TipFormFinal'

class TipLongForm extends Component {

  constructor() {
    super()
    this.state = {
      tip: {},
      panelDisplay: {
        1: true,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false
      }
    }

    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.createTip = this.createTip.bind(this)
    this.togglePanel = this.togglePanel.bind(this)
  }

  handleSelectChange(name, event, index, value) {
    const tip = {...this.state.tip}
    tip[name] = value
    this.setState({tip})
  }

  handleTextChange(name, event) {
    const tip = {...this.state.tip}
    tip[name] = event.target.value
    this.setState({tip})
  }

  handleCheckboxChange(name, event, isInputChecked) {
    const tip = {...this.state.tip}
    tip[name] = isInputChecked
    this.setState({tip})
  }

  togglePanel(panelNumber) {
    const panelDisplay = {...this.state.panelDisplay}
    panelDisplay[panelNumber] = !panelDisplay[panelNumber]
    this.setState({panelDisplay})
  }

  createTip(event) {
    event.preventDefault();
    var tip = {...this.state.tip}

    const tipDefaultProperties = {
      timestamp: Date.now(),
      readStatus: 'unread',
      attachment: false,
      type: 'phone',
      uid: this.props.uid
    }
    tip = Object.assign(tip, tipDefaultProperties);
    base.push('tips', {data: tip});
    this.setState({tip: {}});
  }

  render() {
    const style = {
      card: {margin: '10px'},
      header: {backgroundColor: '#E0E0E0'}
    }

    return (
      <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        <Card>
          <CardText>
            <h2>New Crime Tip</h2>
          </CardText>
          <Divider />
          <Card expanded={this.state.panelDisplay[1]} onExpandChange={() => this.togglePanel(1)} style={style.card}>
            <CardHeader title="1. Tip Summary" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormIntro 
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange} 
                handleTextChange={this.handleTextChange} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[2]} onExpandChange={() => this.togglePanel(2)} style={style.card}>
            <CardHeader title="2. Suspect Description" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormSuspectDescription 
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange} 
                handleTextChange={this.handleTextChange} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[3]} onExpandChange={() => this.togglePanel(3)} style={style.card}>
            <CardHeader title="3. Suspect Location" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormSuspectLocation 
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange} 
                handleTextChange={this.handleTextChange} 
                handleCheckboxChange={this.handleCheckboxChange} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[4]} onExpandChange={() => this.togglePanel(4)} style={style.card}>
            <CardHeader title="4. Suspect Employment" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormSuspectEmployment 
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange}
                handleTextChange={this.handleTextChange} 
                handleCheckboxChange={this.handleCheckboxChange} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[5]} onExpandChange={() => this.togglePanel(5)} style={style.card}>
            <CardHeader title="5. Suspect Vehicle" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormSuspectVehicle
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange} 
                handleTextChange={this.handleTextChange} 
                handleCheckboxChange={this.handleCheckboxChange} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[6]} onExpandChange={() => this.togglePanel(6)} style={style.card}>
            <CardHeader title="6. Drugs" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormDrugs
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange} 
                handleTextChange={this.handleTextChange} 
                handleCheckboxChange={this.handleCheckboxChange} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[7]} onExpandChange={() => this.togglePanel(7)} style={style.card}>
            <CardHeader title="7. Media" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormMedia tip={this.state.tip} />
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[8]} onExpandChange={() => this.togglePanel(8)} style={style.card}>
            <CardHeader title="8. Conclusion" actAsExpander={true} showExpandableButton={true} style={style.header} />
            <CardText expandable={true}>
              <TipFormFinal
                tip={this.state.tip}
                handleSelectChange={this.handleSelectChange} 
                handleTextChange={this.handleTextChange} 
                handleCheckboxChange={this.handleCheckboxChange} />
            </CardText>
          </Card>
          <CardActions style={{textAlign: 'right'}}>
            <RaisedButton label="Discard" secondary={true} />
            <RaisedButton label="Save Draft" default={true} />
            <RaisedButton label="Submit" primary={true} onClick={(e) => this.createTip(e)} />
          </CardActions>
        </Card>
      </div>
    )
  }
}

export default TipLongForm