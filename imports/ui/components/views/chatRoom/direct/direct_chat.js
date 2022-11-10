import React from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {FormattedMessage} from 'react-intl';
import ChatWindow from './chat_window';
import FriendList from './friend_list';
import ChatInput from './chat_input';
import {Immsg} from '../../../../../api/chat/im_msg';

class DirectChat extends React.Component {
  constructor() {
    super();

    this.state = {
      url: '',
      otherUrl: '',
      talkUser: '',
    }
  }

  componentWillMount() {
    const self = this;
    Meteor.call('chat.get.img.url', Meteor.userId(), function (err, result) {
      if(!err) {
        if(result.includes(Meteor.userId())) {
          self.setState({url: result})
        }else {
          self.setState({otherUrl: result})
        }
      }
    })
  }

  setTalkUser(talkUser) {
    this.setState({talkUser});
    const currentUserId = Meteor.userId();
    const imId = currentUserId < talkUser.userId ? currentUserId + talkUser.userId : talkUser.userId + currentUserId;
    this.props.setImId({imId});
    Meteor.call('update.immsg.to.read', talkUser);
  }

  sendMessage(msg) {
    let imId = '';
    const userId = Meteor.userId();
    if(this.state.talkUser) {
      imId = this.props.imId;
    }else {
      const talkUser = this.props.users[0];
      imId = userId < talkUser.userId ? userId + talkUser.userId : talkUser.userId + userId;
    }

    const imMsg = {
      sourceId: userId,
      sourceName: Meteor.user().username,
      msg: msg,
      isRead: false,
      data: new Date(),
    };

    Meteor.call('immsgs.insert',imId, imMsg)
  }

  render() {
    let username = '';

    if(this.state.talkUser) {
      username = '/' + this.state.talkUser.userName
    }

    return (
      <div className="col-md-8 chat-window">
        <div className="box box-primary direct-chat direct-chat-primary">
          <div className="box-header with-border">
            <h3 className="box-title">
              <FormattedMessage
                id="dirtMsg"
                defaultMessage="点对点通讯"
              />
              {username}
            </h3>
          </div>
          <ChatWindow
            immsgs={this.props.immsgs}
            url={this.state.url}
            otherUrl={this.state.otherUrl}
          />
          <div className="box-body box-mid"></div>
          <FriendList
            talkUser={this.state.talkUser.userId}
            users={this.props.users}
            url={this.state.url}
            otherUrl={this.state.otherUrl}
            setTalkUser={this.setTalkUser.bind(this)}
            allMsg={this.props.allMsg}
          />
          <ChatInput sendMessage={this.sendMessage.bind(this)} talkUser={this.state.talkUser} />
        </div>
      </div>
    );
  }
}

export default withTracker(({imId}) => {
  Meteor.subscribe('immsgs', Meteor.userId());

  return {
    users: Immsg.find({}, {fields: {_id: 1}, sort: {updateAt: -1}}).fetch(),
    immsgs: Immsg.findOne({_id: imId}),
    allMsg: Immsg.find().fetch(),
  }
})(DirectChat);
