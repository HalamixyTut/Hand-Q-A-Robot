/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import SideBar from './sidebar/sidebar';
import AppHeader from '../app/app_header';
import Statistics from '../views/statistics/statistics';
import Dashboard2 from '../views/statistics/dashboard2';
import Roles from '../views/roles/role_manage';
import Permissions from '../views/permission/permission_manage';
import Resources from '../views/resource/resource_manage';
import Codings from '../views/coding/coding_manage';
import UserManageView from '../views/userManage/userManageView';
import RoomManage from '../views/roomManage/room_manage';
import UserProfile from '../views/account/user_profile';
import PublicRoom from '../views/chatRoom/publicRoom';
import Knowledge from '../views/knowledgeMap/knowledgeMaintain/knowledge';
import Category from '../views/knowledgeMap/category/category';
import Bulletin from '../views/bulletin/bulletin';
import Crontab from '../views/crontab/crontab/crontab';
import Record from '../views/crontab/record/record';
import Keyword from '../views/keyword/keyword_manage';
import Question from '../views/question/question_manage';
import QAddKnowledge from '../views/question/add_konwledge';
import Satisfaction from '../views/satisfaction/satisfaction_manage';
import Ldap from '../views/ldap/ldap_manager';
import loginHistory from '../views/history/history_manage';
import DirectRoom from '../views/chatRoom/direct/direct_room';
import settings from '../views/settings';

class Dashboard extends Component {
  render() {
    const { currentUser } = this.props;
    const contentMinHeight = {
      minHeight: `${window.innerHeight - 101}px`,
    };

    return (
      <div className="wrapper">
        <AppHeader user={currentUser} history={this.props.history} />
        <SideBar
          user={this.props.currentUser}
          users={this.props.users}
        />

        <div className="content-wrapper" style={contentMinHeight} >
          <Route
            exact path="/dashboard" name="statistics"
            component={Statistics}
          />
          <Route path="/dashboard/dashboard2" name="statistics" component={Dashboard2} />
          <Route path="/dashboard/roles" name="roles" component={Roles} />
          <Route path="/dashboard/permissions" name="permissions" component={Permissions} />
          <Route path="/dashboard/resources" name="resources" component={Resources} />
          <Route path="/dashboard/codings" name="codings" component={Codings} />
          <Route path="/dashboard/users" name="users" component={UserManageView} />
          <Route path="/dashboard/rooms" name="rooms" component={RoomManage} />
          <Route path="/dashboard/profile" name="profile" component={UserProfile} />
          <Route path="/dashboard/channel" component={PublicRoom} />
          <Route path="/dashboard/direct" component={DirectRoom} />
          <Route path="/dashboard/knowledge" component={Knowledge} />
          <Route path="/dashboard/category" component={Category} />
          <Route path="/dashboard/bulletin" component={Bulletin} />
          <Route path="/dashboard/crontab" component={Crontab} />
          <Route path="/dashboard/record" component={Record} />
          <Route path="/dashboard/keyword" component={Keyword} />
          <Route path="/dashboard/question" component={Question} />
          <Route path="/dashboard/addknowledge" component={QAddKnowledge} />
          <Route path="/dashboard/satisfaction" component={Satisfaction} />
          <Route path="/dashboard/ldap" component={Ldap} />
          <Route path="/dashboard/history" component={loginHistory} />
          <Route path="/dashboard/setting" component={settings} />
        </div>

        {/*<AppFooter />*/}
        <div className="control-sidebar-bg" />
      </div>
    );
  }
}

Dashboard.propTypes = {
  currentUser: PropTypes.object,
  users: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.object,
};

export default withTracker(() => {
  /**
   * Add subscriptions here
   */
  Meteor.subscribe('users');

  return {
    currentUser: Meteor.user(),
    users: Meteor.users.find().fetch(),
  };
})(Dashboard);
