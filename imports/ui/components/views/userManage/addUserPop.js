import React from 'react';
import {Meteor} from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {FormattedMessage, intlShape} from 'react-intl';
import Select from 'react-select';
import Validator from '../utils/validator';
import {DialogMessage} from '../utils/modal_dialog'
import {SelectOptions} from '../utils/select_options';

class AddUserPop extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();
    this.language = React.createRef();

    this.validator = new Validator();
    this.state = {
      username: '',
      email: '',
      phone: '',
      password: '',
      roles: [],
      gender: 'M',
      createDate:new Date(),
      notExist: true,
      userOremail: 'username', //判断是用户名还是邮箱重复
      errMessage: '',
      type: 'normal',
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  handleRoleChange(e) {
    if(e) {
      let roles = [];
      for(let role of e) {
        roles.push(role.value)
      }

      this.setState({
        roles: roles,
      })
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if(this.validator.allValid()){
      const self = this;
      Meteor.call('insert.userinfo', this.state, function (err, result) {
        if(!err) {
          if(result === 'emailExists') {
            self.setState({notExist: false, userOremail: 'email'}, ()=>{
              self.validator.showMessage();
              self.forceUpdate();
            });
          } else if(result === 'userExists') {
            self.setState({notExist: false, userOremail: 'username'}, ()=>{
              self.validator.showMessage();
              self.forceUpdate();
            });
          } else {
            window.location.reload();
          }
        } else {
          self.setState({errMessage: err.reason}, ()=>$('#modal-default').modal('show'));
        }
      });
    } else {
      this.validator.showMessage();
      this.forceUpdate();
    }
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;

    let roles = [];
    if(this.props.roles){
      for(let role of this.props.roles) {
        roles.push(role)
      }
      for(let role of roles){
        role.label = role.name;
        role.value = role._id;
      }
    }

    return(
      <div>
        <div
          className="modal fade" id="myModal" tabIndex="-1"
          role="dialog" aria-labelledby="myModalLabel"
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
                <h4 className="modal-title" id="myModalLabel">
                  <FormattedMessage
                    id="addUser"
                    defaultMessage="添加用户"
                  />
                </h4>
                {this.validator.message('notExist', this.state.notExist, 'accepted',{
                  accepted: formatMessage({id: this.state.userOremail})+formatMessage({id: 'hasExist'}),
                })}
              </div>
              <div className="modal-body">
                {/*表单*/}
                <div className="box box-primary">
                  <div className="box-header with-border">
                  </div>
                  <form role="form">
                    <div className="box-body">
                      <div className="form-group">
                        <label htmlFor="inputEmail1">
                          <FormattedMessage
                            id="email"
                            defaultMessage="Email"
                          />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          value={this.state.email}
                          onChange={this.handleOnChange.bind(this, 'email')}
                        />
                        {this.validator.message('email', this.state.email, 'required|email',{
                          required: formatMessage({id: 'email'})+formatMessage({id: 'isRequired'}),
                          email: formatMessage({id: 'isEmail'}),
                        })}
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputUserName">
                          <FormattedMessage
                            id="username"
                            defaultMessage="用户名称"
                          />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="UserName"
                          value={this.state.username}
                          onChange={this.handleOnChange.bind(this, 'username')}
                        />
                        {this.validator.message('username', this.state.username, 'required|specialChar',{
                          required: formatMessage({id: 'username'})+formatMessage({id: 'isRequired'}),
                          specialChar: formatMessage({id: 'username'})+formatMessage({id: 'specialChar'}),
                        })}
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputUserName">
                          <FormattedMessage
                            id="MobilePhoneNo"
                            defaultMessage="手机号"
                          />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="UserName"
                          value={this.state.phone}
                          onChange={this.handleOnChange.bind(this, 'phone')}
                        />
                        {this.validator.message('phone', this.state.phone, 'required|phone',{
                          required: formatMessage({id: 'MobilePhoneNo'})+formatMessage({id: 'isRequired'}),
                          phone: formatMessage({id: 'isPhone'}),
                        })}
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputPassword">
                          <FormattedMessage
                            id="password"
                            defaultMessage="密码"
                          />
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          value={this.state.password}
                          onChange={this.handleOnChange.bind(this, 'password')}
                        />
                        {this.validator.message('password', this.state.password, 'required|min:6',{
                          required: formatMessage({id: 'password'})+formatMessage({id: 'isRequired'}),
                          min:
                            <FormattedMessage
                              id="minLength"
                              values={{count: '6'}}
                            />,
                        })}
                      </div>
                      <div className="form-group">
                        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                        <label>
                          <FormattedMessage
                            id="role"
                            defaultMessage="角色"
                          />
                        </label>
                        <Select
                          isMulti
                          options={roles}
                          placeholder="select roles"
                          onChange={this.handleRoleChange.bind(this)}
                        >
                        </Select>
                        {this.validator.message('roles', this.state.roles.toString(), 'required',{
                          required: formatMessage({id: 'role'})+formatMessage({id: 'isRequired'}),
                        })}
                      </div>
                      <div className="form-group">
                        <label htmlFor="inputGender">
                          <FormattedMessage
                            id="gender"
                            defaultMessage="性别"
                          />
                        </label>
                        <SelectOptions
                          cname="gender"
                          value={this.state.gender}
                          onChange={this.handleOnChange.bind(this, 'gender')}
                        />
                      </div>
                      <div className="form-group">
                        {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                        <label htmlFor="inputGender">
                          类型
                        </label>
                        <SelectOptions
                          cname="userType"
                          value={this.state.type}
                          onChange={this.handleOnChange.bind(this, 'type')}
                        />
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
                  type="submit"
                  className="btn btn-info pull-right"
                  form="user-form"
                  onClick={this.handleSubmit.bind(this)}
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

        <DialogMessage message={this.state.errMessage} />
      </div>
    )
  }
}

export default withTracker(() => {
  Meteor.subscribe('roles');

  return {
    roles: Meteor.roles.find({},{fields:{name:1}}).fetch(),
  };
})(AddUserPop);
