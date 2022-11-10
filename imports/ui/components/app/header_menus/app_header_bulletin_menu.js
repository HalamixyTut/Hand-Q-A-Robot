import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {FormattedMessage} from 'react-intl';
import AppHeaderBulletinMenuItem from './app_header_bulletin_menu_item';
import {Bulletin} from '../../../../api/bulletin/bulletins';
import AppHeaderShowBulletins from './show_bulletins';

class AppHeaderBulletinMenu extends Component {
  constructor() {
    super();
    this.state = {
      bulletinInfo: [],
    }
  }

  getNotificationItems() {
    if(this.props.bulletins.length > 0) {
      return this.props.bulletins.map((item,index) => (
        <AppHeaderBulletinMenuItem
          key={item._id}
          classNames="fa fa-envelope-o"
          index={index}
          item={item}
          bulletinInfo={this.setbulletinInfo.bind(this)}
        />
      ));
    }
  }

  setbulletinInfo(bulletin) {
    let bulletinInfo = [];
    bulletinInfo.push(bulletin)
    this.setState({
      bulletinInfo: bulletinInfo,
    });
  }

  render() {
    let count = 0;
    if(this.props.bulletins.length > 0) {
      count = this.props.bulletins.length;
    }
    return (
      <li className="dropdown notifications-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <i className="fa fa-envelope-o" />
          <span className="label label-warning">{count}</span>
        </a>
        <ul className="dropdown-menu">
          <li className="header">
            <FormattedMessage
              id="YouHave"
              defaultMessage="您有"
            />
            {count}
            <FormattedMessage
              id="SystemAnnouncements"
              defaultMessage="个系统公告"
            />
          </li>
          <li>
            <ul className="menu">
              {this.getNotificationItems()}
            </ul>
          </li>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
          <li className="footer"><a href="#"></a></li>
        </ul>

        <AppHeaderShowBulletins bulletinInfo={this.state.bulletinInfo} />
      </li>
    );
  }
}

export default withTracker(() => {
  /**
   * Add subscriptions here
   */
  Meteor.subscribe('bulletins');

  return {
    bulletins: Bulletin.find({},{sort:{updateDate:-1}}).fetch(),
  };
})(AppHeaderBulletinMenu);
