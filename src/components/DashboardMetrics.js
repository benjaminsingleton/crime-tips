import React from 'react'
import {Card, CardTitle, CardText} from 'material-ui/Card';

// import { oneDayAgoDate, getMonthAndDay } from '../helpers/helpers'

const DashboardMetrics = (props) => {
    
    const {counts} = props;

    return (
        <div className="row" style={{margin: '10px 2px 8px 2px'}}>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Unread Tips" />
                    <CardText>
                        <div className="metric">{counts.unreadCount}</div>
                    </CardText>
                </Card>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Tips Received - 24hrs" />
                    <CardText>
                        <div className="metric">{counts.lastTwentyFourHourTipCount}</div>
                    </CardText>
                </Card>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Tips Received - YTD" />
                    <CardText>
                        <div className="metric">{counts.thisYearTipCount}</div>
                    </CardText>
                </Card>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                <Card>
                    <CardTitle title="Abandoned Tips" />
                    <CardText>
                        <div className="metric">XX</div>
                    </CardText>
                </Card>
            </div>
        </div>
    );
}

export default DashboardMetrics