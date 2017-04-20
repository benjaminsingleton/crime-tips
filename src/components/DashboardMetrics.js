import React, {Component} from 'react'
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import {databaseRef} from '../helpers/firebase'

import {oneDayAgoDate, getMonthAndDay} from '../helpers/helpers'

export default class DashboardMetrics extends Component {
  constructor () {
    super()
    this.state = {
      metrics: {
        unreadTips: null,
        tipsReceivedLast24Hours: null,
        tipsReceivedYTD: null,
        unreadAbandonedTips: null,
      }
    }
  }

  componentWillMount() {
    databaseRef.child('metrics').on('value', function(snapshot) {
        const metrics = snapshot.val()
        this.setState({metrics})
    }.bind(this));
  }

  componentWillUnmount = () => databaseRef.child('metrics').off();

  render() {
    const style = {
      row: {margin: '10px 2px 8px 2px'},
      title: {
        fontSize: '16px',
        lineHeight: '24px'
      },
      metric: {fontSize: '24px'},
      detail: {
        fontSize: '12px',
        color: 'rgb(117, 117, 117)',
        marginTop: '8px'
      }
    }
    return (
      <div className="row" style={style.row}>
        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <Card>
            <CardTitle title="Unread Tips" titleStyle={style.title} />
            <Divider />
            <CardText>
              <div style={style.metric}>{this.state.metrics.unreadTips}</div>
              <div style={style.detail}>To be reviewed</div>
            </CardText>
          </Card>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <Card>
            <CardTitle title="Tips Received - 24hrs" titleStyle={style.title} />
            <Divider />
            <CardText style={style.metric}>
              <div>{this.state.metrics.tipsReceivedLast24Hours}</div>
              <div style={style.detail}>Since {getMonthAndDay(oneDayAgoDate())}</div>
            </CardText>
          </Card>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <Card>
            <CardTitle title="Tips Received - YTD" titleStyle={style.title} />
            <Divider />
            <CardText style={style.metric}>
              <div>{this.state.metrics.tipsReceivedYTD}</div>
              <div style={style.detail}>Since January 1</div>
            </CardText>
          </Card>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
          <Card>
            <CardTitle title="Abandoned Tips" titleStyle={style.title} />
            <Divider />
            <CardText style={style.metric}>
              <div>{this.state.metrics.unreadAbandonedTips}</div>
              <div style={style.detail}>Never completed</div>
            </CardText>
          </Card>
        </div>
      </div>
    )
  }
}