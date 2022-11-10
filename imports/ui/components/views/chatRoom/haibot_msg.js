import React from 'react';

class HaibotMsg extends React.Component {
  handleOnClick(e) {
    const replyMsg = e.target.innerText;
    if(this.props.autoReply) {
      this.props.autoReply(replyMsg.split('. ')[1])
    }
  }

  render() {
    const message = this.props.message;
    let title = '';
    let listTips = '';
    let listItem = [];
    let partMeg = [];

    if(message) {
      if(message.indexOf('*_*') > 0) {
        partMeg = message.split('*_*');
        title = partMeg[0];
        listTips = partMeg[1];
        listItem = partMeg[2].split('(_)');
      }
    }

    return(
      <div className="direct-chat-text message-text">
        {
          title === '' ?
            <div>{this.props.message}</div>
            :
            <div className="haibot-msg">
              <span dangerouslySetInnerHTML={{__html: title}} className="haibot-msg"></span>
              <br /><br />
              <span>{listTips}</span>
              {
                listItem.map((list, i) => {
                  return(
                    <p className="haibot-question" key={i} onClick={this.handleOnClick.bind(this)}>{list}</p>
                  );
                })
              }
            </div>
        }
      </div>
    );
  }
}

export default HaibotMsg;
