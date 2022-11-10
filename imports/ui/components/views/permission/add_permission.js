import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class AddPermission extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      permissionName: '',
      permissionDesc: '',
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSbumit(e) {
    e.preventDefault();
    Submit(this, 'permissions.insert', {name: this.state.permissionName, desc: this.state.permissionDesc});
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="permissionAdd" tabIndex="-1"
        role="dialog" aria-labelledby="permissionModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title" id="permissionModalLabel">
                <FormattedMessage
                  id="addPermission"
                  defaultMessage="添加权限"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'PermissionName'})+formatMessage({id: 'hasExist'}),
              })}
            </div>
            <div className="modal-body">
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>
                <form role="form">
                  <div className="box-body">
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="PermissionName"
                          defaultMessage="权限名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.permissionName}
                        onChange={this.handleOnChange.bind(this, 'permissionName')}
                      />
                      {this.validator.message('PermissionName', this.state.permissionName, 'required',{
                        required: formatMessage({id: 'PermissionName'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="PermissionsDescribed"
                          defaultMessage="权限描述"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.permissionDesc}
                        onChange={this.handleOnChange.bind(this, 'permissionDesc')}
                      />
                      {this.validator.message('PermissionsDescribed', this.state.permissionDesc, 'required',{
                        required: formatMessage({id: 'PermissionsDescribed'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage
                  id="cancel"
                  defaultMessage="取消"
                />
              </button>
              <button
                type="submit" className="btn btn-info pull-right" form="permission-form"
                onClick={this.handleSbumit.bind(this)}
              >
                <FormattedMessage
                  id="save"
                  defaultMessage="保存"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPermission;
