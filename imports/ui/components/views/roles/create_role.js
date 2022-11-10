/* eslint-disable import/no-unresolved */
import React from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class CreateRole extends React.Component {
  static contextTypes = {
    intl: intlShape,
  };

  constructor(props) {
    super(props);

    this.validator = new Validator();
    this.state = {
      roleName: '',
      roleDesc: '',
      notExist: true,
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 创建角色
  handleCreateRole(e) {
    e.preventDefault();
    Submit(this, 'roles.insert', this.state);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="roleModal" tabIndex="-1"
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
                  id="addRole"
                  defaultMessage="添加角色"
                />
                {this.validator.message('notExist', this.state.notExist, 'accepted',{
                  accepted: formatMessage({id: 'roleName'})+formatMessage({id: 'hasExist'}),
                })}
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                {/*表单*/}
                <div className="box box-primary">
                  <div className="box-header with-border">
                  </div>
                  <form>
                    <div className="form-group">
                      <label htmlFor="recipient-name" className="control-label">
                        <FormattedMessage
                          id="roleName"
                          defaultMessage="角色名称"
                        />
                      </label>
                      <input
                        id="recipient-name"
                        type="text"
                        className="form-control"
                        value={this.state.roleName}
                        onChange={this.handleOnChange.bind(this, 'roleName')}
                      />
                      {this.validator.message('roleName', this.state.roleName, 'required',{
                        required: formatMessage({id: 'roleName'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="message-text" className="control-label">
                        <FormattedMessage
                          id="roleDesc"
                          defaultMessage="角色描述"
                        />
                      </label>
                      <input
                        id="message-text"
                        type="text"
                        className="form-control"
                        value={this.state.roleDesc}
                        onChange={this.handleOnChange.bind(this, 'roleDesc')}
                      />
                      {this.validator.message('roleDesc', this.state.roleDesc, 'required',{
                        required: formatMessage({id: 'roleDesc'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                  </form>
                </div>
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
                type="submit" className="btn btn-primary" form="role-form"
                onClick={this.handleCreateRole.bind(this)}
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

export default CreateRole;
