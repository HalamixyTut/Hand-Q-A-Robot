/*eslint-disable react/no-find-dom-node,jsx-a11y/img-redundant-alt,react/no-string-refs*/
import { Meteor } from 'meteor/meteor';
import React from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import { Message } from '../../../../api/chat/message';
import RightSider from './rightSider';
import HaibotMsg from './haibot_msg';
import { Images } from '../../../../api/account/images';
import JenkinsMsg from './jenkins_msg';

class ChatBox extends React.Component {
  constructor() {
    super();

    this.state = {
      url: '',
      otherUrl: '',
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

  componentDidMount() {
    $(function () {
      $('[data-toggle=\'popover\']').popover({
        trigger: 'hover',
        html: true,
      });
    });
  }

  componentDidUpdate() {
    let scroll = document.getElementById('usermessages');
    scroll.scrollTop = scroll.scrollHeight;
  }

  sendMessage(e) {
    e.preventDefault();
    const userMsg = {
      userId: Meteor.userId(),
      userName: this.props.users[0].username,
      userMsg: ReactDOM.findDOMNode(this.refs.message).value.trim(),
      date: new Date().toISOString(),
    };
    ReactDOM.findDOMNode(this.refs.message).value = '';

    if (userMsg.userMsg !== '') {
      Meteor.call('insert.message', userMsg, this.props.title);
    }
  }

  autoReply(msg) {
    if (msg) {
      msg = 'aibot ' + msg;

      const userMsg = {
        userId: Meteor.userId(),
        userName: this.props.users[0].username,
        userMsg: msg,
        date: new Date().toISOString(),
      };

      if (userMsg.userMsg !== '') {
        Meteor.call('insert.message', userMsg, this.props.title);
      }
    }
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/123.jpg';
  }

  handleOnChange(e) {
    e.preventDefault();

    const msg = e.target.value;
    const charMsg = msg.charAt(msg.length - 1)
    if ('@' === charMsg) {

      return (
        <div className="form-group">
          {/* eslint-disable-next-line jsx-a11y/label-has-for */}
          <label>Select</label>
          <select className="form-control">
            {
              this.props.allUsersName.map((userName) => {
                <option key={userName._id}>{userName.username}</option>
              })
            }
          </select>
        </div>
      )
    }
  }

  chatMessage(message) {
    const botId = Meteor.users.findOne({username: 'aibot'}, {fields: {_id: 1}});
    const url = this.state.url;
    const otherUrl = this.state.otherUrl;

    return message.map((msg,i)=>{
      if (!Array.isArray(msg.message)) {
        if (msg.message.userId === Meteor.userId()) {
          return (
            <div className="direct-chat-msg right" key={i}>
              <div className="direct-chat-info clearfix message-time-right">
                          <span className="direct-chat-name pull-right">
                            {msg.message.userName}
                          </span>
                <span className="direct-chat-timestamp pull-left">
                            {new Date(msg.message.date).toLocaleString()}
                </span>
              </div>
              <img
                className="direct-chat-img"
                src={url}
                onError={this.handleOnError.bind(this)} alt="Message User Image"
              />
              <div className="direct-chat-text message-text-right">
                {msg.message.userMsg}
              </div>
            </div>
          );
        } else {
          let url1 = '';
          if(Images.findOne({_id: msg.message.userId})) {
            if(url) {
              url1 = url.replace(Meteor.userId(), msg.message.userId);
            }else {
              const splitUrl = otherUrl.split('/');
              url1 = otherUrl.replace(splitUrl[splitUrl.length-3], msg.message.userId);
            }
          }
          return (
            <div className="direct-chat-msg" key={i}>
              <div className="direct-chat-info clearfix message-time">
                          <span className="direct-chat-name pull-left">
                            {msg.message.userName}
                          </span>
                <span className="direct-chat-timestamp pull-right">
                            {new Date(msg.message.date).toLocaleString()}
                </span>
              </div>
              <img
                className="direct-chat-img"
                src={url1}
                onError={this.handleOnError.bind(this)} alt="Message User Image"
              />
              {
                msg.message.userId !== botId._id || '' ?
                  <div className="direct-chat-text message-text">
                    {msg.message.userMsg}
                  </div>
                  :
                  <HaibotMsg
                    message={msg.message.userMsg}
                    autoReply={this.autoReply.bind(this)}
                  />
              }
            </div>
          );
        }
      } else { //针对来自jenkins的消息
        let url1 = '';
        if(Images.findOne({_id: msg.message[0].userId})) {
          if(url) {
            url1 = url.replace(Meteor.userId(), msg.message[0].userId);
          }else {
            const splitUrl = otherUrl.split('/');
            url1 = otherUrl.replace(splitUrl[splitUrl.length-3], msg.message[0].userId);
          }
        }
        return (
          <div className="direct-chat-msg" key={i}>
            <div className="direct-chat-info clearfix message-time">
                          <span className="direct-chat-name pull-left">
                            {msg.message[0].userName}
                          </span>
              <span className="direct-chat-timestamp pull-right">
                            {new Date(msg.message[0].date).toLocaleString()}
              </span>
            </div>
            <img
              className="direct-chat-img"
              src={url1}
              onError={this.handleOnError.bind(this)} alt="Message User Image"
            />
            <JenkinsMsg message={msg.message} />
          </div>
        );
      }
    })
  }

  render() {
    const url = this.state.url;
    const otherUrl = this.state.otherUrl;

    return (
      <div className="row chat-box">
        <div className="col-md-8 chat-window">
          <div className="box box-primary direct-chat direct-chat-primary">
            <div className="box-header with-border">
              <h3 className="box-title">
                <FormattedMessage
                  id="instantMsg"
                  defaultMessage="即时通讯"
                />
                /
                <FormattedMessage
                  id="pubChannel"
                  defaultMessage="公共通讯组"
                />
                /{this.props.title}
              </h3>
            </div>
            <div className="box-body box-messages">
              <div id="usermessages" className="direct-chat-messages">
                {this.chatMessage(this.props.message)}
              </div>
            </div>

            <div className="box-body box-friends">
              <p>
                <FormattedMessage
                  id="ProjectTeam"
                  defaultMessage="项目组"
                />
              </p>
              <ul>
                {
                  this.props.allUsersName.map((userName) => {
                    let url1 = '';
                    if(Images.findOne({_id: userName._id})) {
                      if(url) {
                        url1 = url.replace(Meteor.userId(), userName._id);
                      }else {
                        const splitUrl = otherUrl.split('/');
                        url1 = otherUrl.replace(splitUrl[splitUrl.length-3], userName._id);
                      }
                    }

                    const dataContent = `
                            <ul className="dropdown-menu">
                              <li className="user-header" style="list-style-type:none">
                                email:${userName.emails[0].address}
                              </li>

                              <li className="user-body" style="list-style-type:none">
                                phone:${userName.profile.phone}
                              </li>
                            </ul>
                          `;

                    return (
                      <li
                        key={userName._id} title={userName.username}
                        data-container="body" data-toggle="popover" data-placement="right"
                        data-content={dataContent}
                      >
                        <img
                          className="user-adatar" src={url1}
                          onError={this.handleOnError.bind(this)} alt="Message User Image"
                        />
                        <span>{userName.username}</span>
                      </li>
                    );
                  })
                }
              </ul>
            </div>

            <div className="box-footer">
              <form onSubmit={this.sendMessage.bind(this)}>
                <div className="input-group">
                  <input
                    type="text"
                    ref="message"
                    name="message"
                    placeholder="Type Message ..."
                    className="form-control"
                    onChange={this.handleOnChange.bind(this)}
                  />

                  <span className="input-group-btn">
                    <button
                      type="button"
                      className="btn btn-primary btn-flat"
                      onClick={this.sendMessage.bind(this)}
                    >
                      <FormattedMessage
                        id="send"
                        defaultMessage="发送"
                      />
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
        <RightSider />
      </div>
    );
  }
}

export default withTracker(({title,roomId}) => {
  Meteor.subscribe('message');
  return {
    allUsersName: Meteor.users.find({}, {sort: {username: 1}}).fetch(),
    users: Meteor.users.find({_id: Meteor.userId()}).fetch(),
    message: Message.find({roomId: roomId}, {sort: {date: -1}}).fetch(),
  }
})(ChatBox);
