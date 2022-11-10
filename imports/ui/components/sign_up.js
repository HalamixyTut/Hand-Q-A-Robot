/* eslint-disable import/no-unresolved */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';
import {FormattedMessage, intlShape} from 'react-intl';
import Footer from './footer';
import Validator from './views/utils/validator';
import {DialogUpdate} from './views/utils/modal_dialog'

export default class SignUp extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  constructor(props) {
    super(props);

    this.validator = new Validator();
    this.state = {
      username: '',
      email: '',
      phone: '',
      password: '',
      repeatPassword: '',
      hasError: false,
      errorMessage: '',
      registerSuccess: false,
      successMessage: '',
      notExist: true,
      userOremail: 'username', //判断是用户名还是邮箱重复
    };
  }

  onSubmit(event) {
    event.preventDefault();

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      phone: this.state.phone,
      password: this.state.password,
      gender: 'unknown',
      isActivated: false,
      updateDate: new Date(),
    };

    if(this.validator.allValid()){
      const self = this;
      Meteor.call('sign.insert.userinfo', newUser, function (err, result) {
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
            $('#modal-default').modal('show');
            self.setState({
              username: '',
              email: '',
              phone: '',
              password: '',
              repeatPassword: '',
              hasError: false,
              errorMessage: '',
              registerSuccess: false,
              successMessage: '',
              notExist: true,
              userOremail: 'username',
            }, ()=>{
              self.validator.hideMessage();
              self.forceUpdate();
            });
          }
        }
      });
    } else {
      this.validator.showMessage();
      this.forceUpdate();
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return (
      <div>
        {/*导航栏*/}
        <div className="main-header home-header">
          <nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
              <div className="navbar-header">
                <button
                  type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#navbar-collapse"
                >
                  <i className="fa fa-bars" />
                </button>
                <a href="/" className="navbar-brand">
                  <img alt="hand" src="img/aibot_logo.png" />
                </a>
              </div>

              <div id="navbar" className="navbar-collapse collapse">
                <div className="home-sign">
                  <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/sign-in">
                      <FormattedMessage
                        id="signin"
                        defaultMessage="登录"
                      />
                        </Link>
                    </li>
                    <li><Link to="/sign-up">
                      <FormattedMessage
                        id="register"
                        defaultMessage="注册"
                      />
                        </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/*注册页*/}
        <div className="login-box">
          <div className="register-logo">
            <a href="/"><b>aibot Chat</b></a>
          </div>

          <div className="register-box-body">
            <p className="login-box-msg">
              <FormattedMessage
                id="register"
                defaultMessage="注册"
              />
            </p>
            {this.validator.message('notExist', this.state.notExist, 'accepted',{
              accepted: formatMessage({id: this.state.userOremail})+formatMessage({id: 'hasExist'}),
            })}
            <form onSubmit={this.onSubmit.bind(this)}>
              <div className="form-group has-feedback">
                <input
                  type="text"
                  onChange={this.handleOnChange.bind(this, 'username')}
                  value={this.state.username}
                  className="form-control"
                  placeholder="Username"
                />
                <span className="fa fa-user form-control-feedback" />
              </div>
              {this.validator.message('username', this.state.username, 'required|specialChar',{
                required: formatMessage({id: 'username'})+formatMessage({id: 'isRequired'}),
                specialChar: formatMessage({id: 'username'})+formatMessage({id: 'specialChar'}),
              })}
              <div className="form-group has-feedback">
                <input
                  type="email"
                  onChange={this.handleOnChange.bind(this, 'email')}
                  value={this.state.email}
                  className="form-control"
                  placeholder="Email"
                />
                <span className="fa fa-envelope form-control-feedback" />
              </div>
              {this.validator.message('email', this.state.email, 'required|email',{
                required: formatMessage({id: 'email'})+formatMessage({id: 'isRequired'}),
                email: formatMessage({id: 'isEmail'}),
              })}
              <div className="form-group has-feedback">
                <input
                  type="text"
                  onChange={this.handleOnChange.bind(this, 'phone')}
                  value={this.state.phone}
                  className="form-control"
                  placeholder="phone number"
                />
                <span className="fa fa-mobile form-control-feedback" />
              </div>
              {this.validator.message('phone', this.state.phone, 'required|phone',{
                required: formatMessage({id: 'MobilePhoneNo'})+formatMessage({id: 'isRequired'}),
                phone: formatMessage({id: 'isPhone'}),
              })}
              <div className="form-group has-feedback">
                <input
                  type="password"
                  onChange={this.handleOnChange.bind(this, 'password')}
                  value={this.state.password}
                  className="form-control"
                  placeholder="Password"
                />
                <span className="fa fa-lock form-control-feedback" />
              </div>
              {this.validator.message('password', this.state.password, 'required|min:6',{
                required: formatMessage({id: 'password'})+formatMessage({id: 'isRequired'}),
                min:
                  <FormattedMessage
                    id="minLength"
                    values={{count: '6'}}
                  />,
              })}
              <div className="form-group has-feedback">
                <input
                  type="password"
                  onChange={this.handleOnChange.bind(this, 'repeatPassword')}
                  value={this.state.repeatPassword}
                  className="form-control"
                  placeholder="Retype password"
                />
                <span className="fa fa-lock form-control-feedback" />
              </div>
              {this.validator.message('repeatPassword', this.state.repeatPassword, 'required|repeat:'+this.state.password,{
                required: formatMessage({id: 'password'})+formatMessage({id: 'isRequired'}),
                repeat: formatMessage({id: 'password'})+formatMessage({id: 'mismatch'}),
              })}
              <div className="row">
                <div className="col-xs-4">
                  <button type="submit" className="btn btn-primary btn-block btn-flat">
                    <FormattedMessage
                      id="register"
                      defaultMessage="注册"
                    />
                  </button>
                </div>
              </div>
            </form>

            <br />
            <Link to="/sign-in">
              <FormattedMessage
                id="havedAccount"
                defaultMessage="已拥有账户"
              />
            </Link>

          </div>
        </div>
        <DialogUpdate messageId="registerSuccess" />
        {/*footer*/}
        <Footer />
      </div>
    );
  }
}
