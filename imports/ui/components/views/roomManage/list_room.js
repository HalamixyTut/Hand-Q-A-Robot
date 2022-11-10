import React from 'react';
import {Common} from '../utils/common';

class ListRoom extends React.Component{
  constructor() {
    super();

    this.state = {
      isChecked: false,
    }
  }

  componentDidMount() {
    if(this.props.clearCheck) {
      this.setState({isChecked: false});
      this.props.changeClear();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.clearCheck) {
      this.setState({isChecked: false});
      this.props.changeClear();
    }
  }

  // 点击每条记录的checxbox，首先更改当前isChecked的值，然后传递当前记录的值给父组件
  toggleCheck() {
    this.setState({
      isChecked: !this.state.isChecked,
    });

    if(this.props.dealRoomList){
      const {isChecked, roomId, roomName, roomType, saveTime} =
        {
          isChecked: !this.state.isChecked,
          roomId: this.props.room._id,
          roomName: this.props.room.roomName,
          roomType: this.props.room.roomType,
          saveTime: this.props.room.saveTime,
        };

      this.props.dealRoomList({isChecked, roomId, roomName, roomType, saveTime});
    }
  }

  render() {
    const {room, options} = this.props;

    return(
      <tr className="tr-title-space">
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{room.roomName}</td>
        <td>{Common.getCodeMeaningByValue(options, room.roomType)}</td>
        <td>
          {room.saveTime}天
        </td>
        {/*待定后续开发*/}
        {/*<td>{this.props.room.countUser}</td>
        <td>{this.props.room.countMsg}</td>*/}
      </tr>
    );
  }
}

export default ListRoom;
