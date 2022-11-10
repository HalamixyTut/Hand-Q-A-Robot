import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';

export default class ChatInput extends Component {
  constructor() {
    super();
    this.message = React.createRef();
  }

  getMessage(e) {
    e.preventDefault();
    const msg = this.message.current.value.trim();
    if(msg) {
      this.props.sendMessage(msg);
      this.message.current.value = '';
    }
  }

  render() {
    return (
      <div className="box-footer">
        <form onSubmit={this.getMessage.bind(this)}>
          <div className="input-group">
            {
              this.props.talkUser ?
                <input
                  type="text"
                  ref={this.message}
                  name="message"
                  placeholder="Type Message ..."
                  className="form-control"
                />
                :
                <input
                  type="text"
                  ref={this.message}
                  name="message"
                  placeholder="Type Message ..."
                  className="form-control"
                  disabled
                />
            }

            <span className="input-group-btn">
              <button
                type="button"
                className="btn btn-primary btn-flat"
                onClick={this.getMessage.bind(this)}
              >
                <FormattedMessage id="send" defaultMessage="发送" />
              </button>
            </span>
          </div>
        </form>
      </div>
    )
  }
}
