/*eslint-disable react/no-unused-state*/
import React from 'react';
import {FormattedMessage} from 'react-intl';

class SidebarUserStauts extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showStatusList: false,
      onLine: true,
      offLine: false,
      invisible: false,
      busy: false,

      statusDefaultMessage: '在线',
      statusClassName: 'fa fa-circle text-success',
      statusId: 'online',
    }
  }

  //在线
  userOnline(e) {
    e.preventDefault();
    const self = this;
    this.setState({
      showStatusList: this.props.showStatusList2,
      onLine: true,
      offLine: false,
      invisible: false,
      busy: false,

      statusDefaultMessage: '在线',
      statusClassName: 'fa fa-circle text-success',
      statusId: 'online',
    }, function () {
      self.props.passUserStatus2(!self.state.showStatusList);
      self.props.passUserStatus(this.state.onLine, this.state.offLine, this.state.invisible,
        this.state.busy, this.state.statusDefaultMessage, this.state.statusClassName,this.state.statusId,
      );
    });
  }

  //离线
  userOffline(e) {
    e.preventDefault();
    const self = this;
    this.setState({
      showStatusList: this.props.showStatusList2,
      onLine: false,
      offLine: true,
      invisible: false,
      busy: false,

      statusDefaultMessage: '离线',
      statusClassName: 'fa fa-circle text-warning',
      statusId: 'offline',
    }, function () {
      self.props.passUserStatus2(!self.state.showStatusList);
      self.props.passUserStatus(this.state.onLine, this.state.offLine, this.state.invisible,
        this.state.busy, this.state.statusDefaultMessage, this.state.statusClassName,this.state.statusId,
      );
    });

  }

  //隐身
  userInvisible(e) {
    e.preventDefault();
    const self = this;
    this.setState({
      showStatusList: this.props.showStatusList2,
      onLine: false,
      offLine: false,
      invisible: true,
      busy: false,

      statusDefaultMessage: '隐身',
      statusClassName: 'fa fa-circle text-info',
      statusId: 'invisible',
    }, function () {
      self.props.passUserStatus2(!self.state.showStatusList);
      self.props.passUserStatus(this.state.onLine, this.state.offLine, this.state.invisible,
        this.state.busy, this.state.statusDefaultMessage, this.state.statusClassName,this.state.statusId,
      );
    });

  }

  //忙碌
  userBusy(e) {
    e.preventDefault();
    const self = this;
    this.setState({
      showStatusList: this.props.showStatusList2,
      onLine: false,
      offLine: false,
      invisible: false,
      busy: true,

      statusDefaultMessage: '忙碌',
      statusClassName: 'fa fa-circle text-danger',
      statusId: 'busy',
    }, function () {
      self.props.passUserStatus2(!self.state.showStatusList);
      self.props.passUserStatus(this.state.onLine, this.state.offLine, this.state.invisible,
        this.state.busy, this.state.statusDefaultMessage, this.state.statusClassName,this.state.statusId,
      );
    });
  }

  render() {
    const borderStyle = {
      border: 'none',
    };

    return (
      <div className="list-group" style={{display: this.props.showStatusList2 ? 'block' : 'none'}}>
        <a
          href="#" className="list-group-item list-group-item-action list-group-item-light"
          style={borderStyle}
          onClick={this.userOnline.bind(this)}
        ><i className="fa fa-circle text-success" />
          <FormattedMessage
            id="online"
            defaultMessage="在线"
          />
        </a>
        <a
          href="#" className="list-group-item list-group-item-action list-group-item-light"
          style={borderStyle}
          onClick={this.userOffline.bind(this)}
        ><i className="fa fa-circle text-warning" />
          <FormattedMessage
            id="offline"
            defaultMessage="离线"
          />
        </a>
        <a
          href="#" className="list-group-item list-group-item-action list-group-item-light"
          style={borderStyle}
          onClick={this.userInvisible.bind(this)}
        ><i className="fa fa-circle text-info" />
          <FormattedMessage
            id="invisible"
            defaultMessage="隐身"
          />
        </a>

        <a
          href="#" className="list-group-item list-group-item-action list-group-item-light"
          style={borderStyle}
          onClick={this.userBusy.bind(this)}
        ><i className="fa fa-circle text-danger" />
          <FormattedMessage
            id="busy"
            defaultMessage="忙碌"
          />
        </a>
      </div>
    );
  }
}

export default SidebarUserStauts;
