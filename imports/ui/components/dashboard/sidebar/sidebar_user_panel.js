import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
//.text-success 绿色 在线
//.text-info 黄色 隐身
//.text-warning 灰色 离线
//.text-danger 红色 忙碌


class SideBarUserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      userStatus: {
        message: '在线',
        style: 'fa fa-circle text-success',
        // statusId: 'online',
      },
    }
  }

  componentWillMount() {
    const self = this;
    Meteor.call('get.img.url', Meteor.userId(), function (err, result) {
      if(!err && result) {
        self.setState({url: result})
      }
    })
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/user_img/default.jpg';
  }

  changeStatus(message, styleContent) {
    const style = `fa fa-circle text-${styleContent}`;
    let { userStatus } = this.state;
    userStatus = {...userStatus, message, style};

    this.setState({userStatus});
  }

  render() {
    const { userStatus } = this.state;

    return (
      <div className="user-panel" style={{overflow: 'visible'}}>
        <div className="pull-left image">
          <img
            alt="User"
            src={this.state.url}
            className="img-circle"
            onError={this.handleOnError.bind(this)}
            style={{width: '45px', height: '45px',}}
          />
        </div>
        <div className="pull-left info">
          <p>{this.props.userName}</p>
          <div className="dropdown">
            <i className={userStatus.style} />
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a
              id="dLabel" data-target="#" data-toggle="dropdown"
              role="button"
              aria-haspopup="true" aria-expanded="false"
            >
              {userStatus.message}
            </a>

            <ul className="dropdown-menu" aria-labelledby="dLabel">
              <li className="list-group-item list-group-item-action list-group-item-light" onClick={this.changeStatus.bind(this, '在线', 'success')}>
                <i className="fa fa-circle text-success" />
                <FormattedMessage id="online" defaultMessage="在线" />
              </li>
              <li className="list-group-item list-group-item-action list-group-item-light" onClick={this.changeStatus.bind(this, '离线', 'warning')}>
                <i className="fa fa-circle text-warning" />
                <FormattedMessage id="offline" defaultMessage="离线" />
              </li>
              <li href="#" className="list-group-item list-group-item-action list-group-item-light" onClick={this.changeStatus.bind(this, '隐身', 'info')}>
                <i className="fa fa-circle text-info" />
                <FormattedMessage id="invisible" defaultMessage="隐身" />
              </li>

              <li href="#" className="list-group-item list-group-item-action list-group-item-light" onClick={this.changeStatus.bind(this, '忙碌', 'danger')}>
                <i className="fa fa-circle text-danger" />
                <FormattedMessage id="busy" defaultMessage="忙碌" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
SideBarUserPanel.propTypes = {
  userName: PropTypes.string,
};

export default SideBarUserPanel;
