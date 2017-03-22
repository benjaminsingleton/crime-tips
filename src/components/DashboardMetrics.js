import React from 'react'
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import { oneDayAgoDate, getMonthAndDay } from '../helpers/helpers'

const DashboardMetrics = (props) => {

    const style = {
        title: {
            fontSize: '16px',
            lineHeight: '24px', 
        },
        metric: {
            fontSize: '24px',
        },
        detail: {
            fontSize: '12px',
            color: 'rgb(117, 117, 117)',
            marginTop: '8px'
        }
    }
    
    const {counts} = props;

    return (
        <div className="row" style={{margin: '10px 2px 8px 2px'}}>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Unread Tips" titleStyle={style.title} style={{borderTopColor: 'red'}}/>
                    <Divider />
                    <CardText>
                        <div style={style.metric}>{counts.unreadCount}</div>
                        <div style={style.detail}>To be reviewed</div>
                    </CardText>
                </Card>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Tips Received - 24hrs" titleStyle={style.title} />
                    <Divider />
                    <CardText style={style.metric}>
                        <div>{counts.lastTwentyFourHourTipCount}</div>
                        <div style={style.detail}>Since {getMonthAndDay(oneDayAgoDate())}</div>
                    </CardText>
                </Card>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Tips Received - YTD" titleStyle={style.title} />
                    <Divider />
                    <CardText style={style.metric}>
                        <div>{counts.thisYearTipCount}</div>
                        <div style={style.detail}>Since January 1</div>
                    </CardText>
                </Card>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Abandoned Tips" titleStyle={style.title} />
                    <Divider />
                    <CardText style={style.metric}>
                        <div>XX</div>
                        <div style={style.detail}>Never completed</div>
                    </CardText>
                </Card>
            </div>
        </div>
    );
}

export default DashboardMetrics