import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import {Images} from '../../../../../api/account/images';

export default class FriendList extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(nextProps.users.length === 0)
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/123.jpg';
  }

  filterUser(users) {
    let datas = [];
    if(users.length === 0) return datas;

    datas = users.map((data) => {
      const userId = data._id.replace(new RegExp(Meteor.userId()), '');
      return {...data, userId, userName: userId}
    });

    // datas = datas.reduce((prev, next) => prev.some((item) => item._id === next._id) ? prev : [...prev, next], []);
    return datas
  }

  render() {
    const url = this.props.url;
    const otherUrl = this.props.otherUrl;
    const users = this.filterUser(this.props.users);
    const allMsg = this.props.allMsg || [];

    return (
      <div className="box-body box-friends">
        <p className="friendName">
          <FormattedMessage
            id="customer"
            defaultMessage="客户"
          />
          &nbsp;（{users.length}）
        </p>
          <ul className="friendUl">
            {
              users.map((user) => {
                let url1 = '';
                if(Images.findOne({_id: user.userId})) {
                  if(url) {
                    url1 = url.replace(Meteor.userId(), user.userId);
                  }else {
                    const splitUrl = otherUrl.split('/');
                    url1 = otherUrl.replace(splitUrl[splitUrl.length-3], user.userId);
                  }
                }
                let unReadCount = 0;
                let msg = allMsg.filter((msg) => msg._id === user._id);
                if(msg) {
                  unReadCount = msg[0].messages.filter((msg) => !msg.isRead && (msg.sourceId === user.userId)).length;
                }

                return (
                  <li
                    className={this.props.talkUser == user.userId ? 'isClick friendLi' : 'unClick friendLi'} key={user._id} title={user.userName}
                    onClick={() => this.props.setTalkUser(user)}
                  >
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img
                      className="user-adatar" src={url1} onError={this.handleOnError.bind(this)}
                      alt="Message User Image"
                    />
                    {unReadCount === 0 ? null : <span className="label label-warning">{unReadCount}</span>}
                    <span className={unReadCount ===0 ? 'noblink' : 'blink'} style={{cursor: 'default'}}>{user.userName}</span>
                  </li>
                );
              })
            }
          </ul>
      </div>
    )
  }
}
