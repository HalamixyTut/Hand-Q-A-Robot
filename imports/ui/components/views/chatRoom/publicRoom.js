import React from 'react';
import ChatBox from './chatBox';

class PublicRoom extends React.Component{
  constructor(props){
    super(props);
    this.state={
      roomId:props.location.state.roomId,
      roomName:props.location.state.roomName,
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.location.state && (nextProps.location.state.roomId !== this.state.roomId)) {
      this.setState({
        roomId:nextProps.location.state.roomId,
        roomName:nextProps.location.state.roomName,
      });
    }
  }

  render() {
    return (
      <div className="statistic-content" >
        <section className="content">
          <ChatBox  title={this.state.roomName} roomId={this.state.roomId} />
        </section>
      </div>
    );
  }
}

export default PublicRoom;
