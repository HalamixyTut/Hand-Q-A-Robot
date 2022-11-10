import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import ListRoom from './list_room';
import { Room } from '../../../../api/rooms/rooms';
import Pagination from '../utils/pagination';
import {handleDelete as Delete} from '../utils/common';
import {DialogUpdate} from '../utils/modal_dialog'
import {getOptions} from '../utils/select_options';

class ShowRoom extends React.Component {
  constructor() {
    super();
    this.roomName = React.createRef();

    this.state = {
      roomList: [], // 存储用于更新或删除的记录
      options: [], //存储快码
      clearCheck: false,
    }
  }

  componentDidMount() {
    getOptions('roomType').then(data => this.setState({options: data}));
  }

  // 处理子组件传递过来的被点击的记录
  dealRoomList(roomList) {
    let flag = 0;

    for(let eachRoom of this.state.roomList) {
      if(eachRoom.roomId === roomList.roomId) {
        this.state.roomList.splice(this.state.roomList.indexOf(eachRoom),1);
        this.setState({
          roomList: this.state.roomList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.roomList.push(roomList);

      this.setState({
        roomList: this.state.roomList,
      });
    }
  }

  // 删除被选中的记录
  handleDeleteRoom(e) {
    Delete('rooms.remove', this.state.roomList, this, 'roomList');
  }

  // 更新记录，一次只能更新一条记录，将需要更新的记录传递给父组件
  handleUpdateRoom(e) {
    if(this.state.roomList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.roomList.length === 1 ){
      if(this.props.setUpdateRoomInfo){
        this.props.setUpdateRoomInfo(this.state.roomList)
      }
      $('#roomUpdate').modal('show');
    }
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(event) {
    event.preventDefault();

    const roomName = this.roomName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(roomName);
    }

    if (this.props.rooms.length >0) {
      this.setState({roomList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      roomList: [],
    });
    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  changeClear = () => this.setState({clearCheck: false});

  render() {
    return(
      <div className="col-xs-12">
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="sysManage"
                defaultMessage="系统管理"
              />
              /
              <FormattedMessage
                id="commManage"
                defaultMessage="通讯组管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="room-form">
                {
                  Session.get('permission').includes('room_btn_c') ?
                  <button
                    type="button" data-toggle="modal" data-target="#roomModal"
                    className="btn btn-info pull-left"
                  >
                    <i className="fa fa-plus-square" />
                    <FormattedMessage
                      id="new"
                      defaultMessage="新建"
                    />
                  </button> : null
                }
                {
                  Session.get('permission').includes('room_btn_u') ?
                    <button
                      id="buttonUpdate"
                      type="button"
                      className="btn btn-info pull-left btn-edit"
                      onClick={this.handleUpdateRoom.bind(this)}
                    >
                      <i className="fa fa-edit" />
                      <FormattedMessage
                        id="update"
                        defaultMessage="更新"
                      />
                    </button>
                    : null
                }
                {
                  Session.get('permission').includes('room_btn_d') ?
                  <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDeleteRoom.bind(this)}><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                  </button> : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('room_btn_r') ?
                <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="communication_name">
                    {(txt) => (
                      <input
                        type="text" ref={this.roomName} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form> : null
            }
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="name"
                    defaultMessage="名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="type"
                    defaultMessage="类型"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="msgSaveTime"
                    defaultMessage="消息保留时间"
                  />
                </th>
                {/*待定后续开发*/}
                {/*<th>
                  <FormattedMessage
                    id='userNum'
                    defaultMessage='用户数量'
                  />
                </th>
                <th>
                  <FormattedMessage
                    id='msgNum'
                    defaultMessage='消息数量'
                  />
                </th>*/}
              </tr>
              </thead>
              <tbody>
              {
                this.props.rooms.map((room, index) => {
                  return(
                    <ListRoom
                      key={room._id}
                      room={room}
                      dealRoomList={this.dealRoomList.bind(this)}
                      options={this.state.options}
                      clearCheck={this.state.clearCheck}
                      changeClear={this.changeClear}
                    />
                  );
                })
              }
              </tbody>
            </table>
          </div>
          <div className="box-footer">
            <Pagination count={this.props.countRoom} changePage={this.changePage.bind(this)} />
          </div>
        </div>
        <DialogUpdate />
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('rooms');

  if(queryKey === ''){
    return{
      rooms: Room.find({}, {limit: limit, skip: skip}).fetch(),
      countRoom: Room.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      rooms: Room.find({roomName: regExp}, {limit: limit, skip: skip}).fetch(),
      countRoom: Room.find({roomName: regExp}).count(),
    }
  }
})(ShowRoom);
