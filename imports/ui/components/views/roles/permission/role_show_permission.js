/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import RoleAddPermission from './role_add_permission';
import {Permission} from '../../../../../api/permission/permission';

class RoleShowPermission extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isChecked: false,
      permissionList: [],
      queryKey: '', // 存储角色添加权限时，在拉取的权限页面中，对权限进行查询的关键字
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
    }
  }

  setQueryKey(queryKey) {
    this.setState({
      queryKey: queryKey,
    })
  }

  setTest(){
    if (this.props.setTest){
      this.props.setTest(Math.random()*100)
    }
  }

  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
  }

  handleClick(e) {
    if(this.state.permissionList.length === 0){
      e.preventDefault();
    }

    if(JSON.stringify(this.props.roleInfo) !== '{}') {
      Meteor.call('roles.delete.permissions', this.props.roleInfo._id, this.state.permissionList);
    }
  }

  toggleChecked(permission) {
    let flag = 0;

    for(let eachItem of this.state.permissionList) {
      if(eachItem === permission._id) {
        this.state.permissionList.splice(this.state.permissionList.indexOf(eachItem),1);
        this.setState({
          permissionList: this.state.permissionList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.permissionList.push(permission._id);

      this.setState({
        permissionList: this.state.permissionList,
      });
    }
  }

  render() {
    let permissions = [];
    let roleName = '';
    let roleId = '';
    let permissionId = [];

    if(JSON.stringify(this.props.roleInfo) !== '{}') {
      roleName = this.props.roleInfo.name;
      roleId = this.props.roleInfo._id;

      const permissionsId = this.props.roleInfo.permission;
      for(let eachItem of permissionsId) {
        const permission = Permission.findOne({_id: eachItem});
        permissions.push(permission);
        permissionId.push(permission._id);
      }
    }

    return(
      <div
        className="modal fade" id="roleShowPermission" tabIndex="-1"
        role="dialog" aria-labelledby="roleModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              ><span
                aria-hidden="true"
              >&times;
               </span>
              </button>
              <h4 className="modal-title" id="roleModalLabel">
                <FormattedMessage
                  id="AssignPermissions"
                  defaultMessage="分配权限"
                />
                ({roleName})
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                {/*表单*/}
                <div className="box box-primary">
                  <div className="box-header with-border">
                  </div>
                  <div className="role-button">
                    <form className="role-form">
                      <button
                        onClick={this.setTest.bind(this)}
                        type="button"
                        className="btn btn-info pull-left"
                        data-toggle="modal"
                        data-target="#roleAddPermission"
                      >
                        <i className="fa fa-plus-square" />
                        <FormattedMessage
                          id="new"
                          defaultMessage="新建"
                        />
                      </button>
                      <button type="submit" className="btn btn-info pull-left btn-trash" onClick={this.handleClick.bind(this)}><i className="fa fa-trash-o" />
                        <FormattedMessage
                          id="delete"
                          defaultMessage="删除"
                        />
                      </button>
                      <button type="button" className="btn pull-left btn-default" data-dismiss="modal">
                        <FormattedMessage
                          id="cancel"
                          defaultMessage="取消"
                        />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="box-body">
                <table id="roles" className="table table-bordered table-hover">
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
                  </tr>
                  </thead>
                  <tbody>
                  {
                    permissions.map((permission) => {
                      return (
                        <tr className="tr-title-space" key={roleId + permission._id}>
                          <td className="check-box-position">
                            <div className="icheckbox_flat-blue checked" aria-checked="true" aria-disabled="false">
                              <input type="checkbox" onClick={this.toggleChecked.bind(this,permission)} />
                            </div>
                          </td>
                          <td>{permission.name}</td>
                          <td>{permission.desc}</td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <RoleAddPermission
          roleId={roleId}
          permissionId={permissionId}
          showpermission={permissions}
          roleInfo={this.props.roleInfo}
          setQueryKey={this.setQueryKey.bind(this)}
          queryKey={this.state.queryKey}
          changePageCondition={this.changePageCondition.bind(this)}
          limit={this.state.pageLimit}
          skip={this.state.pageSkip}
        />
      </div>
    );
  }
}

export default RoleShowPermission;
