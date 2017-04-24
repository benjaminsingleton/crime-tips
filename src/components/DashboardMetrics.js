import React, {Component} from 'react'
import { Grid, Card } from 'semantic-ui-react'
import { firebaseApp } from '../helpers/firebase'
import { oneDayAgoDate, getMonthAndDay } from '../helpers/helpers'

export default class DashboardMetrics extends Component {
  state = {
    metrics: {
        unreadTips: null,
        tipsReceivedLast24Hours: null,
        tipsReceivedYTD: null,
        unreadAbandonedTips: null,
    }
  }

  componentWillMount = () => {
    firebaseApp.database().ref('metrics').on('value', (snapshot) => {
        const metrics = snapshot.val()
        this.setState({metrics})
    });
  }

  componentWillUnmount = () => firebaseApp.database().ref('metrics').off();

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
      <Grid container columns={4}>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={8} computer={4} largeScreen={4}>
            <Card centered fluid>
              <Card.Content header='Unread Tips' />
              <Card.Content>
                <div style={style.metric}>{this.state.metrics.unreadTips}</div>
                <div style={style.detail}>To be reviewed</div>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={4} largeScreen={4}>
            <Card centered fluid>
              <Card.Content header='Tips Received - 24hrs' />
              <Card.Content>
                <div>{this.state.metrics.tipsReceivedLast24Hours}</div>
                <div style={style.detail}>Since {getMonthAndDay(oneDayAgoDate())}</div>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={4} largeScreen={4}>
            <Card centered fluid>
              <Card.Content header='Tips Received - YTD' />
              <Card.Content>
                <div>{this.state.metrics.tipsReceivedYTD}</div>
                <div style={style.detail}>Since January 1</div>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column mobile={16} tablet={8} computer={4} largeScreen={4}>
            <Card centered fluid>
              <Card.Content header='Abandoned Tips' />
              <Card.Content>
                <div>{this.state.metrics.unreadAbandonedTips}</div>
                <div style={style.detail}>Never completed</div>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}