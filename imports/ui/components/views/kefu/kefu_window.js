import React, {Component} from 'react';
import { FormattedMessage } from 'react-intl';

export default class KefuWindow extends Component {
  componentDidUpdate() {
    let scroll = document.getElementById('usermessages');
    scroll.scrollTop = scroll.scrollHeight;
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/123.jpg';
  }

  render() {
    let messages = [];
    if(this.props.immsgs) {
      messages = this.props.immsgs.messages;
    }

    return (
      <div className="box-body">
        <div id="usermessages" className="direct-chat-messages" style={{padding: '20px'}}>
          {messages.map((message,i)=>{
            if (message.sourceId === this.props.thirdId) {
              return (
                <div className="direct-chat-msg right" key={i}>
                  <div className="direct-chat-info clearfix message-time-right">
                    <span className="direct-chat-name pull-right">{message.sourceName}</span>
                    <span className="direct-chat-timestamp pull-left">{new Date(message.data).toLocaleString()}</span>
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    className="direct-chat-img"
                    src="/123.jpg"
                    onError={this.handleOnError.bind(this)}
                    alt="User Image"
                  />
                  <div className="direct-chat-text message-text-right">
                    {message.msg}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="direct-chat-msg" key={i}>
                  <div className="direct-chat-info clearfix message-time">
                    <span className="direct-chat-name pull-left">{this.props.immsgs.customServer || ''}</span>
                    <span className="direct-chat-timestamp pull-right">{new Date(message.data).toLocaleString()}</span>
                  </div>
                  {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                  <img
                    className="direct-chat-img"
                    src="/user_img/default.jpg"
                    onError={this.handleOnError.bind(this)}
                    alt="Message User Image"
                  />
                  <div className="direct-chat-text message-text">{message.msg}</div>
                </div>
              );
            }
          })}
        </div>
        {
          this.props.immsgs && !this.props.immsgs.isActive ?
            <div style={{margin: '5px 20px'}}>
              <FormattedMessage
                id="SessionInvalidation"
                defaultMessage="会话失效"
              />
            </div>
            :null
        }
      </div>
    )
  }
}
