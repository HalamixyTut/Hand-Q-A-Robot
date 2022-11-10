/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

/* eslint-disable react/prop-types */
export default class ForgetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      messageId: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value, messageId: ''});
  }

  handleClick() {
    const self = this;
    Meteor.call('forget.password', {email: this.state.email}, (err, resule) => {
      if (err) {
        console.log(err);
      } else {
        if (resule === 'noUser') {
          self.setState({messageId: 'enterRightInfo'});
        } else if (resule === 'setPassword') {
          self.setState({messageId: 'forgetPasswordMsg'});
        }
      }
    })
  }

  callbackMsg() {
    const {messageId} = this.state;
    return (
      messageId ?
        <div className="form-group has-feedback">
          <span style={{color: 'red', fontSize: '12px'}}><FormattedMessage id={messageId} /></span>
        </div>
        : null
    );
  }

  render() {
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

        {/*登陆页*/}
        <div className="login-box">
          <div className="login-logo">
            <a href="/"><b>aibot Chat</b></a>
          </div>

          <div className="login-box-body">
            <p className="login-box-msg">
              <FormattedMessage
                id="forgetPassword"
                defaultMessage="找回密码"
              />
            </p>

            <form>
              <div className="form-group has-feedback">
                <input
                  type="text"
                  className="form-control"
                  placeholder="邮箱"
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.eamil}
                />
                <span className="fa fa-envelope form-control-feedback" />
              </div>
              {this.callbackMsg()}
              <div className="row">
                <div className="pull-left col-xs-4">
                  <button type="button" className="btn btn-primary btn-block btn-flat" onClick={this.handleClick}>
                    <FormattedMessage
                      id="submit"
                      defaultMessage="提交"
                    />
                  </button>
                </div>
                <div className="pull-right col-xs-4">
                  <Link to="/sign-in">
                    <button type="submit" className="btn btn-primary btn-block btn-flat">
                      <FormattedMessage
                        id="cancel"
                        defaultMessage="取消"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
