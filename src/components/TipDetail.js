import React, {Component} from 'react'
import {tipTimeFormatLong} from '../helpers/helpers'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

class TipDetail extends Component {

  constructor() {
    super()
    this.state = {
      tip: {},
      panelDisplay: {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true
      }
    }
    this.togglePanel = this.togglePanel.bind(this)
  }

  togglePanel(panelNumber) {
    const panelDisplay = {...this.state.panelDisplay}
    panelDisplay[panelNumber] = !panelDisplay[panelNumber]
    this.setState({panelDisplay})
  }

  render() {
    const {details} = this.props;

    return (
      <div className="col-xs-12 col-sm-8 col-md-9 col-lg-9">
        <Card>
          <CardText>
            <h2>Tip Detail</h2>
            <p>Crime Type: {details.crimeType}</p>
            <p>Date Time: {tipTimeFormatLong(details.dateTime)}</p>
          </CardText>
          <Divider />
          <Card expanded={this.state.panelDisplay[1]} onExpandChange={() => this.togglePanel(1)}>
            <CardHeader title="1. Tip Summary" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>{details.tipText}</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[2]} onExpandChange={() => this.togglePanel(2)}>
            <CardHeader title="2. Suspect Description" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[3]} onExpandChange={() => this.togglePanel(3)}>
            <CardHeader title="3. Suspect Location" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[4]} onExpandChange={() => this.togglePanel(4)}>
            <CardHeader title="4. Suspect Employment" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[5]} onExpandChange={() => this.togglePanel(5)}>
            <CardHeader title="5. Suspect Vehicle" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[6]} onExpandChange={() => this.togglePanel(6)}>
            <CardHeader title="6. Drugs" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[7]} onExpandChange={() => this.togglePanel(7)}>
            <CardHeader title="7. Media" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <Card expanded={this.state.panelDisplay[8]} onExpandChange={() => this.togglePanel(8)}>
            <CardHeader title="8. Conclusion" actAsExpander={true} showExpandableButton={true} />
            <CardText expandable={true}>
              <p>'to do'</p>
            </CardText>
          </Card>
          <CardActions style={{textAlign: 'right'}}>
            <RaisedButton label="Print" default={true}/>
            <RaisedButton label="Email" default={true}/>
            <RaisedButton label="Archive" default={true}/>
          </CardActions>
        </Card>
      </div>
    )
  }
}

TipDetail.propTypes = {
  details: React.PropTypes.object.isRequired
}

export default TipDetail;