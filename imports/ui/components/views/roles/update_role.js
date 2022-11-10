import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class UpdateRole extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();

    this.state = {
      roleName: '',
      roleDesc: '',
      notExist: true,
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.roleInfo) {
      const {name, desc} = nextProps.roleInfo;
      this.setState({roleName: name, roleDesc: desc});
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 更新记录
  handleSbumit(e) {
    e.preventDefault();
    const roleId = this.props.roleInfo._id;
    Submit(this, 'roles.update', {roleId, ...this.state});
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="roleUpdate" tabIndex="-1"
        role="dialog" aria-labelledby="roleModalLabel"
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
              <h4 className="modal-title" id="roleModalLabel">
                <FormattedMessage
                  id="updateRole"
                  defaultMessage="更新角色"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'roleName'})+formatMessage({id: 'hasExist'}),
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
                          id="roleName"
                          defaultMessage="角色名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.roleName || ''}
                        onChange={this.handleOnChange.bind(this, 'roleName')}
                      />
                      {this.validator.message('roleName', this.state.roleName, 'required',{
                        required: formatMessage({id: 'roleName'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="roleDesc"
                          defaultMessage="角色描述"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.roleDesc || ''}
                        onChange={this.handleOnChange.bind(this, 'roleDesc')}
                      />
                      {this.validator.message('roleDesc', this.state.roleDesc, 'required',{
                        required: formatMessage({id: 'roleDesc'})+formatMessage({id: 'isRequired'}),
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
                type="submit" className="btn btn-info pull-right" form="role-form"
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

export default UpdateRole;
