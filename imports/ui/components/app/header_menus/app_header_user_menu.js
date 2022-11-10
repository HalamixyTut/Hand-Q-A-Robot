/* eslint-disable import/no-unresolved */
import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

export default class AppHeaderUserMenu extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.state = { url: ''}
  }

  componentWillMount() {
    const self = this;
    Meteor.call('get.img.url', Meteor.userId(), function (err, result) {
      if(!err && result) {
        self.setState({url: result})
      }
    })
  }

  logout() {
    Meteor.call('loginHistorys.sign.out', Meteor.userId(), new Date());
    Meteor.logout(() => {
      localStorage.removeItem(Meteor.userId() + 'permission');
      this.props.history.push('/');
    });
  }

  userDisplayName() {
    const currentUser = this.props.user;
    let name = 'Alexander Pierce';

    if (currentUser) {
      //name = currentUser.emails[0].address;
      name = currentUser.username;
    }

    return name;
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/user_img/default.jpg';
  }

  render() {
    return (
      <li className="dropdown user user-menu">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <img
            src={this.state.url}
            className="user-image"
            alt="User"
            onError={this.handleOnError.bind(this)}
          />
          <span className="hidden-xs">{this.userDisplayName()}</span>
        </a>

        <ul className="dropdown-menu">

          <li className="user-header">
            <img
              src={'/user_img/' + Meteor.userId() + '.jpg'}
              className="img-circle"
              alt="User"
              onError={this.handleOnError.bind(this)}
            />
            <p>
              {this.userDisplayName()} {/*- Admin*/}{/*待定后续开发*/}{/* <small>Admin since Jun. 2016</small>*/}
            </p>
          </li>

          <li className="user-footer">
            <div className="pull-left">
              <Link to="/dashboard/profile">
                <p className="btn btn-default btn-flat">
                  <FormattedMessage
                    id="account"
                    defaultMessage="个人账户"
                  />
                </p>
              </Link>
            </div>
            <div className="pull-right">
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
              <a className="btn btn-default btn-flat" onClick={this.logout}>
                <FormattedMessage
                  id="signout"
                  defaultMessage="退出"
                />
              </a>
            </div>
          </li>

        </ul>
      </li>
    );
  }
}

AppHeaderUserMenu.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
};
