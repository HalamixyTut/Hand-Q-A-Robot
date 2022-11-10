import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class UpdatePermission extends React.Component{
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

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.permissionInfo) {
      const {name, desc} = nextProps.permissionInfo;
      this.setState({permissionName: name, permissionDesc: desc});
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 更新记录
  handleSbumit(e) {
    Submit(this, 'permissions.update', {
      id: this.props.permissionInfo._id,
      name: this.state.permissionName,
      desc: this.state.permissionDesc,
    });
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="permissionUpdate" tabIndex="-1"
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
                  id="UpdateAuthority"
                  defaultMessage="更新权限"
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
                        value={this.state.permissionName || ''}
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
                        value={this.state.permissionDesc || ''}
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
                type="button" className="btn btn-info pull-right" form="permission-form"
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

export default UpdatePermission;
