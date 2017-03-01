import React, { Component } from 'react';

import Layout from '../components/Layout'

class UserSettings extends Component {
  render() {
    return (
      <Layout isAdmin={false} >
        <div class="wrapper wrapper-content">
            <div class="row animated fadeInRight">
                <div class="col-md-4">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>Profile Detail</h5>
                        </div>
                        <div>
                            <div class="ibox-content no-padding border-left-right"></div>
                            <div class="ibox-content profile-content">
                                <h4><strong>Ben Singleton</strong></h4>
                                <h5>Police Officer</h5>
                                <p><i class="fa fa-map-marker"></i> User since 2/10/2017</p>
                                <div class="user-button">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <button class="btn btn-primary btn-sm btn-block" type="button">Change Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>Recent Activity</h5>
                        </div>
                        <div class="ibox-content">
                            <div>
                                <div class="feed-activity-list">
                                    <div class="feed-element">
                                        <a class="pull-left" href="#"><img alt="image" class="img-circle" src="img/profile.jpg" /></a>
                                        <div class="media-body">
                                            <small class="pull-right">5m ago</small> <strong>Ben Singleton</strong> added a new tip.
                                            <br/>
                                            <small class="text-muted">Today 5:60 pm - 12.06.2014</small>
                                        </div>
                                    </div>
                                    <div class="feed-element">
                                        <a class="pull-left" href="#"><img alt="image" class="img-circle" src="img/profile.jpg" /></a>
                                        <div class="media-body">
                                            <small class="pull-right">5m ago</small> <strong>Ben Singleton</strong> added a new tip.
                                            <br/>
                                            <small class="text-muted">Today 5:60 pm - 12.06.2014</small>
                                        </div>
                                    </div>
                                    <div class="feed-element">
                                        <a class="pull-left" href="#"><img alt="image" class="img-circle" src="img/profile.jpg" /></a>
                                        <div class="media-body">
                                            <small class="pull-right">5m ago</small> <strong>Ben Singleton</strong> reviewed and closed a tip.
                                            <br/>
                                            <small class="text-muted">Today 5:60 pm - 12.06.2014</small>
                                        </div>
                                    </div>
                                    <div class="feed-element">
                                        <a class="pull-left" href="#"><img alt="image" class="img-circle" src="img/profile.jpg" /></a>
                                        <div class="media-body">
                                            <small class="pull-right">5m ago</small> <strong>Ben Singleton</strong> posted a new blog.
                                            <br/>
                                            <small class="text-muted">Today 5:60 pm - 12.06.2014</small>
                                        </div>
                                    </div>
                                    <div class="feed-element">
                                        <a class="pull-left" href="#"><img alt="image" class="img-circle" src="img/profile.jpg" /></a>
                                        <div class="media-body">
                                            <small class="pull-right">5m ago</small> <strong>Ben Singleton</strong> reviewed and closed a tip.
                                            <br/>
                                            <small class="text-muted">Today 5:60 pm - 12.06.2014</small>
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
