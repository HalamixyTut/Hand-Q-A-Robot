/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import Pagination from './pagination';
import {Permission} from '../../../../../api/permission/permission';

class RoleAddPermission extends React.Component {
  constructor(props) {
    super(props);

    this.permissionName =　React.createRef();

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isChecked: false,
      permissionList: [],
      nowList: [],
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.permissionId.length > 0){
      if (this.state.nowList.sort().toString() !== nextProps.permissionId.sort().toString()){
        this.setState({
          nowList: this.props.permissionId,
          permissionList: nextProps.permissionId,
        });
      }
    }
  }

  handleSbumit(e) {
    if(this.state.permissionList.length === 0){
      e.preventDefault();
    }

    if(JSON.stringify(this.props.roleInfo) !== '{}') {
      Meteor.call('roles.add.permissions', this.props.roleInfo._id, this.state.permissionList);
    }
  }

  handleSearch(e) {
    e.preventDefault();
    const permissionName = this.permissionName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(permissionName);
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

  changePage(limit, skip) {
    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  render() {
    let showpermission = [];
    if (this.props.showpermission.length > 0) {
      this.props.showpermission.map((permission) => {
        showpermission.push(permission._id);
      });
    }

    return(
      <div
        className="modal fade" id="roleAddPermission" tabIndex="-1"
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
                  id="SelectPermissions"
                  defaultMessage="选择权限"
                />
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                {/*表单*/}
                <div className="box box-primary">
                  <div className="box-header with-border">
                  </div>
                  <div className="role-button">
                    <form onSubmit={this.handleSbumit.bind(this)}>
                      <button
                        type="button" className="btn btn-info pull-left" data-dismiss="modal"
                        onClick={this.handleSbumit.bind(this)}
                      >
                        <FormattedMessage
                          id="save"
                          defaultMessage="保存"
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
                  <form className="role-form" onSubmit={this.handleSearch.bind(this)}>
                    <button type="button" className="btn btn-info pull-right" onClick={this.handleSearch.bind(this)}><i className="fa fa-search" />
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
                  </form>
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
                    this.props.permissions.map((permission) => {
                      return(
                        <tr className="tr-title-space" key={this.props.roleId + permission._id}>
                          <td className="check-box-position">
                            <div className="icheckbox_flat-blue checked" aria-checked="true" aria-disabled="false">
                              <input type="checkbox" checked={this.state.permissionList.indexOf(permission._id)>=0 ? true : false} onChange={this.toggleChecked.bind(this,permission)} />
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
              <div className="box-footer">
                <Pagination counts={this.props.counts} changePage={this.changePage.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('permissions');

  if(queryKey === '') {
    return{
      permissions: Permission.find({},{limit: limit,skip: skip}).fetch(),
      counts: Permission.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');

    return{
      permissions: Permission.find({name: regExp},{limit: limit,skip: skip}).fetch(),
      counts: Permission.find({name: regExp}).count(),
    }
  }

})(RoleAddPermission);
