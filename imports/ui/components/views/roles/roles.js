/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import ShowRole from './show_role';
import Pagination from '../utils/pagination';
import RoleShowPermission from './permission/role_show_permission';
import ShowRolePermission from './show_role_permission';
import {handleDelete as Delete} from '../utils/common';
import {DialogUpdate} from '../utils/modal_dialog'

class Roles extends React.Component {
  constructor() {
    super();

    this.roleName = React.createRef();
    this.state = {
      rolesList: [],
      roleInfo: {},
      queryKey: '', // 存储角色添加权限时，在拉取的权限页面中，对权限进行查询的关键字
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      clearCheck: false,
    };
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

  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
  }

  // 过滤查询出的数据
  handleSearch(e) {
    e.preventDefault();
    const roleName = this.roleName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(roleName);
    }

    if (this.props.roles.length >0) {
      this.setState({rolesList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 批量更新时，首先判断 rolesList 中是否有当前选中的记录，
  // 如果有，更新对应的记录，如果没有，则插入到 rolesList 中
  dealRoleList(role) {
    let flag = 0;

    for(let eachItem of this.state.rolesList) {
      if(eachItem.roleInfo._id === role.roleInfo._id) {
        this.state.rolesList.splice(this.state.rolesList.indexOf(eachItem),1);
        this.setState({
          rolesList: this.state.rolesList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.rolesList.push(role);

      this.setState({
        rolesList: this.state.rolesList,
      });
    }
  }

  // 遍历 rolesList，更新所有isChecked为true的记录
  handleUpdate() {
    if(this.state.rolesList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.rolesList.length === 1 ){
      if(this.props.setUpdateInfo){
        this.props.setUpdateInfo(this.state.rolesList)
      }
      $('#roleUpdate').modal('show');
    }
  }

  // 遍历 rolesList，刪除所有isChecked为true的记录
  handleDelete() {
    Delete('roles.remove', this.state.rolesList, this, 'rolesList');
  }

  // 分页，参数pageNum为当前点击的页数
  changePage(limit, skip) {
    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  clearCheckBox() {
    this.setState({
      rolesList: [],
    });
  }

  editPermission(roleInfo) {
    this.setState({
      roleInfo: roleInfo,
      queryKey: '', //点击不同的角色时，清空查询关键字
    });
  }

  changeClear = () => this.setState({clearCheck: false});

  // 根据当前页数，渲染查询出的每一条记录
  renderRole(pageNum) {
    let filterRole = this.props.roles;
    return filterRole.map((role) => (
      Session.get('permission').includes('role_add_permission') ?
        <ShowRolePermission
          key={role._id}
          role={role}
          dealRoleList={this.dealRoleList.bind(this)}
          editPermission={this.editPermission.bind(this)}
          clearCheck={this.state.clearCheck}
          changeClear={this.changeClear}
        />
        :
        <ShowRole
          key={role._id}
          role={role}
          dealRoleList={this.dealRoleList.bind(this)}
          clearCheck={this.state.clearCheck}
          changeClear={this.changeClear}
        />
    ));
  }

  render() {
    return (
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
                id="roleManage"
                defaultMessage="角色管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="role-form">
                {
                  Session.get('permission').includes('role_btn_c') ?
                  <button
                    type="button" data-toggle="modal" data-target="#roleModal"
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
                  Session.get('permission').includes('role_btn_u') ?
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
                  Session.get('permission').includes('role_btn_d') ?
                  <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                  </button> : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('role_btn_r') ?
                <form className="role-form" onSubmit={this.handleSearch.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearch.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="roleName">
                    {(txt) => (
                      <input
                        type="text" ref={this.roleName} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form> : null
            }
          </div>
          <div className="box-body">
            <table id="roles" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="roleName"
                    defaultMessage="角色名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="roleDesc"
                    defaultMessage="角色描述"
                  />
                </th>
                {
                  Session.get('permission').includes('role_add_permission') ?
                    <th>
                      <FormattedMessage
                        id="permission"
                        defaultMessage="权限"
                      />
                    </th>
                    :
                    null
                }
              </tr>
              </thead>
              <tbody>
              {this.renderRole(this.state.pageNum)}
              </tbody>
            </table>
          </div>

          <div className="box-footer">
            <Pagination
              count={this.props.countNum}
              changePage={this.changePage.bind(this)}
              clearCheckBox={this.clearCheckBox.bind(this)}
            />
          </div>
          <RoleShowPermission
            setTest={this.setTest.bind(this)}
            roleInfo={this.state.roleInfo}
          />
        </div>
        <DialogUpdate />
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('roles');

  if(queryKey === '') {
    return {
      roles: Meteor.roles.find({}, {sort: {name: 1}, limit: limit, skip: skip}).fetch(),
      countNum: Meteor.roles.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return {
      roles: Meteor.roles.find({name: regExp}, {sort: {name: 1}, limit: limit, skip: skip}).fetch(),
      countNum: Meteor.roles.find({name: regExp}).count(),
    }
  }
})(Roles);
