import React from 'react';

export default ({message}) => {
  //获取时间 hh:mm
  const getTime = date => {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${hour}:${minutes}`;
  };

  //将来自jenkins的一连串消息的第一个剥离出来
  const format = message => {
    const formatMsg = message.concat();
    const first = formatMsg[0];

    formatMsg.splice(0, 1);

    return (
      <React.Fragment>

        <div className="direct-chat-text message-text">
          <div className="haibot-msg">
            <span dangerouslySetInnerHTML={{__html: first.userMsg.replace(/```/g, '<code>')}} className="haibot-msg"></span>
          </div>
        </div>
        <ul className="timeline" style={{margin: '5px 0 0 30px'}}>
          {
            formatMsg.map((msg, i) => {
              return (
                <li key={i}>
                  <i className="fa fa-envelope bg-blue"></i>

                  <div className="timeline-item">
                    <span className="time"><i className="fa fa-clock-o"></i> {getTime(new Date(msg.date))}</span>

                    <h3 className="timeline-header">Jenkins Job Status</h3>

                    <div className="timeline-body">
                      {msg.userMsg}
                    </div>
                    <div className="timeline-footer"></div>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {
        // eslint-disable-next-line no-useless-escape
        /\@/.test(message[0].userMsg) ?
          format(message)
          :
          <ul className="timeline" style={{margin: '5px 0 0 30px'}}>
            {
              message.map((msg, i) => {
                return (
                  <li key={i}>
                    <i className="fa fa-envelope bg-blue"></i>

                    <div className="timeline-item">
                      <span className="time"><i className="fa fa-clock-o"></i> {getTime(new Date(msg.date))}</span>

                      <h3 className="timeline-header">Jenkins Job Status</h3>

                      <div className="timeline-body">
                        {msg.userMsg}
                      </div>
                      <div className="timeline-footer"></div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
      }
    </React.Fragment>
  );
}
