import React from 'react';
import DirectChat from './direct_chat';
import RightSider from '../rightSider';

class DirectRoom extends React.Component{
  constructor() {
    super();

    this.state = {
      imId: '',
    }
  }

  setImId(imId) {
    this.setState(imId)
  }

  render() {
    return (
      <div className="statistic-content" >
        <section className="content">
          <div className="row chat-box">
            <DirectChat
              setImId={this.setImId.bind(this)}
              imId={this.state.imId}
            />
            <RightSider />
          </div>
        </section>
      </div>
    );
  }
}

export default DirectRoom;
