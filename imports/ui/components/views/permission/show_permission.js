/*eslint-disable react/no-unused-state*/
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import {Permission} from '../../../../api/permission/permission';
import ListPermission from './list_permission';
import Pagination from '../utils/pagination';
import PermissionShowResource from './resource/permission_show_resource';
import ListPermissionPermission from './list_permission_permission';
import {handleDelete as Delete} from '../utils/common';
import {DialogUpdate} from '../utils/modal_dialog'

class ShowPermission extends React.Component {
  constructor() {
    super();
    this.permissionName = React.createRef();

    this.state = {
      permissionList: [], // 存储用于更新或删除的记录
      permissionInfo: {},
      queryKey: '', //存储权限添加资源时，在拉取的页面资源中，对资源进行查询的关键字
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      clearCheck: false,
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  setQueryKey(queryKey) {
    this.setState({
      queryKey: queryKey,
    })
  }

  setTest(num){
    if (this.props.setTest){
      this.props.setTest(num)
    }
  }

  // 处理子组件传递过来的被点击的记录
  dealList(permissionList) {
    let flag = 0;

    for(let eachItem of this.state.permissionList) {
      if(eachItem.permissionInfo._id === permissionList.permissionInfo._id) {
        this.state.permissionList.splice(this.state.permissionList.indexOf(eachItem),1);
        this.setState({
          permissionList: this.state.permissionList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.permissionList.push(permissionList);

      this.setState({
        permissionList: this.state.permissionList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete(e) {
    Delete('permissions.delete', this.state.permissionList, this, 'permissionList');
  }

  // 更新记录
  handleUpdate() {
    if(this.state.permissionList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.permissionList.length === 1 ){
      if(this.props.setUpdateInfo){
        this.props.setUpdateInfo(this.state.permissionList)
      }
      $('#permissionUpdate').modal('show');
    }
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const permissionName = this.permissionName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(permissionName);
    }

    if (this.props.permissions.length >0) {
      this.setState({permissionList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  editResource(permissionInfo) {
    this.setState({
      permissionInfo: permissionInfo,
      queryKey: '', //点击不同的权限时，清空查询关键字
    });
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      permissionList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
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
                id="permManage"
                defaultMessage="权限管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="permission-form">
                {
                  Session.get('permission').includes('permission_btn_c') ?
                    <button
                      type="button" name="permission_btn_c"
                      data-toggle="modal" data-target="#permissionAdd" className="btn btn-info pull-left"
                    >
                      <i className="fa fa-plus-square" />
                      <FormattedMessage
                        id="new"
                        defaultMessage="新建"
                      />
                    </button>
                  : null
                }
                {
                  Session.get('permission').includes('permission_btn_u') ?
                    <button
                      type="button"
                      className="btn btn-info pull-left btn-edit"
                      onClick={this.handleUpdate.bind(this)}
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
                  Session.get('permission').includes('permission_btn_d') ?
                  <button
                    type="button" name="permission_btn_d" className="btn btn-info pull-left btn-trash"
                    onClick={this.handleDelete.bind(this)}
                  ><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                  </button>
                  : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('permission_btn_r') ?
              <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                  <FormattedMessage
                    id="search"
                    defaultMessage="查询"
                  />
                </button>
                <FormattedMessage id="PermissionName">
                  {(txt) => (
                    <input
                      type="text" ref={this.permissionName} className="pull-right find-input"
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
                    id="PermissionName"
                    defaultMessage="权限名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="PermissionsDescribed"
                    defaultMessage="权限描述"
                  />
                </th>
                {
                  Session.get('permission').includes('permission_add_resource') ?
                    <th>
                      <FormattedMessage
                        id="resource"
                        defaultMessage="资源"
                      />
                    </th>
                    :
                    null
                }
              </tr>
              </thead>
              <tbody>
              {
                this.props.permissions.map((permission) => {
                  return(
                    Session.get('permission').includes('permission_add_resource') ?
                      <ListPermissionPermission
                        key={permission._id}
                        permission={permission}
                        dealList={this.dealList.bind(this)}
                        editResource={this.editResource.bind(this)}
                        clearCheck={this.state.clearCheck}
                        changeClear={this.changeClear}
                      />
                      :
                      <ListPermission
                        key={permission._id}
                        permission={permission}
                        dealList={this.dealList.bind(this)}
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
            <Pagination count={this.props.counts} changePage={this.changePage.bind(this)} />
          </div>
          <PermissionShowResource
            setTest={this.setTest.bind(this)}
            permissionInfo={this.state.permissionInfo}
          />
        </div>
        <DialogUpdate />
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('permissions');
  Meteor.subscribe('roles');

  if(queryKey === ''){
    return {
      permissions: Permission.find({}, {sort: {name: 1}, limit: limit, skip: skip}).fetch(),
      counts: Permission.find({}).count(),
    }
  } else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      permissions: Permission.find({name: regExp}, {sort: {name: 1}, limit: limit, skip: skip}).fetch(),
      counts: Permission.find({name: regExp}).count(),
    }
  }
})(ShowPermission);
