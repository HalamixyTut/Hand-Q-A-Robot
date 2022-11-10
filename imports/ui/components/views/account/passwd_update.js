import React from 'react';
import {Accounts} from 'meteor/accounts-base';
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {DialogUpdate} from '../utils/modal_dialog'

class PasswdUpdate extends React.Component {
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();
    this.validator = new Validator();
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      messageId: '',
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    if(this.validator.allValid()){
      const self = this;
      const {oldPassword, newPassword} = this.state;
      Accounts.changePassword(oldPassword, newPassword, function (error, result) {
        if (error) {
          self.setState({messageId: 'PasswordError'}, ()=>$('#reset-password').modal('show'));
        } else {
          self.setState({oldPassword: '',newPassword: '',confirmPassword: '',messageId: 'updateSuccess'}, ()=>$('#reset-password').modal('show'));
        }
      });
    } else {
      this.validator.showMessage();
      this.forceUpdate();
    }
  }

  handleOnChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;

    return (
      <div className="box box-primary">
        <div className="box-header with-border">
          <h3 className="box-title">
            <FormattedMessage
              id="ResetPasswords"
              defaultMessage="重置密码"
            />
          </h3>
        </div>
        <form className="form-horizontal">
          <div className="box-body">
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="oldPassword">
                <FormattedMessage
                  id="CurrentPassword"
                  defaultMessage="当前密码"
                />
              </label>
              <div className="col-sm-7">
                <FormattedMessage id="enterpwd">
                  {(txt) => (
                    <input
                      className="form-control"
                      type="password"
                      id="oldPassword"
                      name="oldPassword"
                      placeholder={txt}
                      onChange={this.handleOnChange}
                      value={this.state.oldPassword}
                    />
                  )}
                </FormattedMessage>
              </div>
              {this.validator.message('oldPassword', this.state.oldPassword, 'required|min:6',{
                required: formatMessage({id: 'CurrentPassword'})+formatMessage({id: 'isRequired'}),
                min:
                  <FormattedMessage
                    id="minLength"
                    values={{count: '6'}}
                  />,
              })}
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="newPassword">
                <FormattedMessage
                  id="newPassword"
                  defaultMessage="新密码"
                />
              </label>
              <div className="col-sm-7">
                <FormattedMessage id="enternewpwd">
                  {(txt) => (
                    <input
                      className="form-control"
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      placeholder={txt}
                      onChange={this.handleOnChange}
                      value={this.state.newPassword}
                    />
                  )}
                </FormattedMessage>
              </div>
              {this.validator.message('newPassword', this.state.newPassword, 'required|min:6',{
                required: formatMessage({id: 'newPassword'})+formatMessage({id: 'isRequired'}),
                min:
                  <FormattedMessage
                    id="minLength"
                    values={{count: '6'}}
                  />,
              })}
            </div>
            <div className="form-group">
              <label className="col-sm-2 control-label" htmlFor="confirmPassword">
                <FormattedMessage
                  id="confirmPassword"
                  defaultMessage="重复新密码"
                />
              </label>
              <div className="col-sm-7">
                <FormattedMessage id="confirmpwd">
                  {(txt) => (
                    <input
                      className="form-control"
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder={txt}
                      onChange={this.handleOnChange}
                      value={this.state.confirmPassword}
                    />
                  )}
                </FormattedMessage>
              </div>
              {this.validator.message('confirmPassword', this.state.confirmPassword, 'required|repeat:'+this.state.newPassword,{
                required: formatMessage({id: 'confirmPassword'})+formatMessage({id: 'isRequired'}),
                repeat: formatMessage({id: 'password'})+formatMessage({id: 'mismatch'}),
              })}
            </div>
          </div>
          <div className="box-footer">
            <button
              type="button" className="btn btn-primary pull-right"
              data-toggle="modal"
              data-target="#successModal"
              onClick={this.onSubmit.bind(this)}
            >
              <FormattedMessage
                id="save"
                defaultMessage="保存"
              />
            </button>
          </div>
        </form>

        <DialogUpdate id="reset-password" messageId={this.state.messageId || undefined} />
      </div>
    );
  }
}

export default PasswdUpdate;
