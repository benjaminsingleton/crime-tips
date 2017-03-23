import React, {Component} from 'react';

import Layout from '../components/Layout'

class UserSettings extends Component {
  render() {
    return (
      <Layout uid={this.props.uid} logout={this.props.logout}>
        <div className="wrapper wrapper-content">
          <div className="row animated fadeInRight">
            <div className="col-md-4">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Profile Detail</h5>
                </div>
                <div>
                  <div className="ibox-content no-padding border-left-right"></div>
                  <div className="ibox-content profile-content">
                    <h4>
                      <strong>Ben Singleton</strong>
                    </h4>
                    <h5>Police Officer</h5>
                    <p><i className="fa fa-map-marker"></i>User since 2/10/2017</p>
                    <div className="user-button">
                      <div className="row">
                        <div className="col-md-6">
                          <button className="btn btn-primary btn-sm btn-block" type="button">Change Password</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="ibox float-e-margins">
                <div className="ibox-title">
                  <h5>Recent Activity</h5>
                </div>
                <div className="ibox-content">
                  <div>
                    <div className="feed-activity-list">
                      <div className="feed-element">
                        <div className="media-body">
                          <small className="pull-right">5m ago</small>
                          <strong>Ben Singleton</strong> added a new tip.
                          <br/>
                          <small className="text-muted">Today 5:60 pm - 12.06.2014</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <div className="media-body">
                          <small className="pull-right">5m ago</small>
                          <strong>Ben Singleton</strong> added a new tip.
                          <br/>
                          <small className="text-muted">Today 5:60 pm - 12.06.2014</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <div className="media-body">
                          <small className="pull-right">5m ago</small>
                          <strong>Ben Singleton</strong> reviewed and closed a tip.
                          <br/>
                          <small className="text-muted">Today 5:60 pm - 12.06.2014</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <div className="media-body">
                          <small className="pull-right">5m ago</small>
                          <strong>Ben Singleton</strong> posted a new blog.
                          <br/>
                          <small className="text-muted">Today 5:60 pm - 12.06.2014</small>
                        </div>
                      </div>
                      <div className="feed-element">
                        <div className="media-body">
                          <small className="pull-right">5m ago</small>
                          <strong>Ben Singleton</strong> reviewed and closed a tip.
                          <br/>
                          <small className="text-muted">Today 5:60 pm - 12.06.2014</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default UserSettings;
