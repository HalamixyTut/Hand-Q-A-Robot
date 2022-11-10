import React, {Component} from 'react';
import {Images} from '../../../../../api/account/images';

export default class ChatWindow extends Component {
  componentDidUpdate() {
    let scroll = document.getElementById('usermessages');
    scroll.scrollTop = scroll.scrollHeight;
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/123.jpg';
  }

  render() {
    const url = this.props.url;
    const otherUrl = this.props.otherUrl;
    let messages = [];
    if(this.props.immsgs) {
      messages = this.props.immsgs.messages;
    }

    return (
      <div className="box-body box-messages">
        <div id="usermessages" className="direct-chat-messages">
          {messages.map((message,i)=>{
            if (message.sourceId === Meteor.userId()) {
              return (
                <div className="direct-chat-msg right" key={i}>
                  <div className="direct-chat-info clearfix message-time-right">
                    <span className="direct-chat-name pull-right">{message.sourceName}</span>
                    <span className="direct-chat-timestamp pull-left">{new Date(message.data).toLocaleString()}</span>
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    className="direct-chat-img"
                    src={url}
                    onError={this.handleOnError.bind(this)}
                    alt="Message User Image"
                  />
                  <div className="direct-chat-text message-text-right">
                    {message.msg}
                  </div>
                </div>
              );
            } else {
              let url1 = '';
              if(Images.findOne({_id: message.sourceId})) {
                if(url) {
                  url1 = url.replace(Meteor.userId(), message.sourceId);
                }else {
                  const splitUrl = otherUrl.split('/');
                  url1 = otherUrl.replace(splitUrl[splitUrl.length-3], message.sourceId);
                }
              }
              return (
                <div className="direct-chat-msg" key={i}>
                  <div className="direct-chat-info clearfix message-time">
                    <span className="direct-chat-name pull-left">{message.sourceName}</span>
                    <span className="direct-chat-timestamp pull-right">{new Date(message.data).toLocaleString()}</span>
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    className="direct-chat-img"
                    src={url1}
                    onError={this.handleOnError.bind(this)}
                    alt="Message User Image"
                  />
                  <div className="direct-chat-text message-text">{message.msg}</div>
                </div>
              );
            }
          })}
        </div>
      </div>
    )
  }
}
