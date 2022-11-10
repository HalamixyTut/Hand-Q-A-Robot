import React from 'react';
import AddRoom from './add_room';
import ShowRoom from './show_room';
import UpdateRoom from './update_room';

class RoomManage extends React.Component{
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      updateRoomInfo: [], // 用于更新时，保存要更新的数据
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
    }
  }

  // 更新查询条件，同时将查询跳过的数目置为0
  setQueryKey(roomName) {
    this.setState({
      queryKey: roomName,
      pageSkip: 0,
    })
  }

  // 更新要更新的数据
  setUpdateRoomInfo(room) {
    this.setState({
      updateRoomInfo: room,
    })
  }

  // 更新分页条件
  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    })
  }

  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <AddRoom />
            <UpdateRoom roomInfo={this.state.updateRoomInfo[0]} />
            <ShowRoom
              queryKey={this.state.queryKey}
              setQueryKey={this.setQueryKey.bind(this)}
              setUpdateRoomInfo={this.setUpdateRoomInfo.bind(this)}
              changePageCondition={this.changePageCondition.bind(this)}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default RoomManage;
