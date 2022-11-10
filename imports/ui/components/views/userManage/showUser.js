import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {FormattedMessage, intlShape} from 'react-intl';
import Select from 'react-select';
import Pagination from '../utils/pagination';
import {Common, handleDelete as Delete} from '../utils/common';
import {getOptions, SelectOptions} from '../utils/select_options';

class ShowUser extends React.Component {
  static contextTypes = {
    intl: intlShape,
  };

  constructor(props) {
    super(props);



    this.userName = React.createRef();
    this.state = ({
      //删除时用于存储用户id
      value: [],
      e: {},
      //更新时用于存储email对应的用户id和gender对应的用户id
      userEIdAry: [],
      userPhoneIdAry: [],
      userGIdAry: [],
      userRIdAry: [],
      userTypeIdAry: [],
      updateEInfo: [],
      updatePhoneInfo: [],
      updateGInfo: [],
      updateRInfo: [],
      updateTypeInfo: [],
      options: [], //存储快码
      typeOptions: [], //存储快码
    });
  }

  componentDidMount() {
    getOptions('gender').then(data => this.setState({options: data}));
    getOptions('userType').then(data => this.setState({typeOptions: data}));
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  getCurrentPaginationData(limit, skip) {
    this.props.getDataRange(limit, skip);
  }

  handleCheckbox(pos, e) {
    let item = e.target.value;
    let items = this.state.value.slice();
    items.includes(item) ? items[pos] = undefined : items[pos] = item;

    this.setState({value: items});
  }

  handleAllCheckbox(e) {
    let value = [];
    if(e.target.checked) {
      for (let user of this.props.allUser) {
        value.push(user._id);
      }
    }
    this.setState({value});
  }

  handleEOnChange(userid, e) {
    let userIdAry = this.state.userEIdAry.slice();
    let updateInfo = this.state.updateEInfo.slice();
    let isExistId = userIdAry.indexOf(userid);
    if (isExistId === -1) {
      userIdAry.push(userid);
    }
    let existPos = userIdAry.indexOf(userid);

    const email = e.target.value || e.target.placeholder;
    updateInfo[existPos] = {
      _id: userid,
      email: email,
    };

    this.setState({
      userEIdAry: userIdAry,
      updateEInfo: updateInfo,
    });
  }

  handlePhoneOnChange(userid, e) {
    let phoneIdAry = this.state.userPhoneIdAry.slice();
    let updateInfo = this.state.updatePhoneInfo.slice();
    let isExistId = phoneIdAry.indexOf(userid);
    if (isExistId === -1) {
      phoneIdAry.push(userid);
    }
    let existPos = phoneIdAry.indexOf(userid);

    const phone = e.target.value || e.target.placeholder;
    updateInfo[existPos] = {
      _id: userid,
      phone: phone,
    };

    this.setState({
      userPhoneIdAry: phoneIdAry,
      updatePhoneInfo: updateInfo,
    });
  }

  handleROnChange(userid, userroles, e) {
    let userIdAry = this.state.userRIdAry.slice();
    let updateInfo = this.state.updateRInfo.slice();
    let isExistId = userIdAry.indexOf(userid);
    if (isExistId === -1) {
      userIdAry.push(userid);
    }
    let existPos = userIdAry.indexOf(userid);
    let roles = [];

    if (e) {
      for (let role of e) {
        roles.push(role.value)
      }
      if (roles.length === 0) {
        roles = userroles;
      }
    }

    updateInfo[existPos] = {
      _id: userid,
      roles: roles,
    };

    this.setState({
      userRIdAry: userIdAry,
      updateRInfo: updateInfo,
    });
  }

  handleGOnChange(userid, e) {
    let userIdAry = this.state.userGIdAry.slice();
    let updateInfo = this.state.updateGInfo.slice();
    let isExistId = userIdAry.indexOf(userid);
    if (isExistId === -1) {
      userIdAry.push(userid);
    }
    let existPos = userIdAry.indexOf(userid);

    const gender = e.target.value || e.target.placeholder;
    updateInfo[existPos] = {
      _id: userid,
      gender: gender,
    };

    this.setState({
      userGIdAry: userIdAry,
      updateGInfo: updateInfo,
    });
  }

  handleTypeOnChange(userid, e) {
    let userTypeIdAry = this.state.userTypeIdAry.slice();
    let updateTypeInfo = this.state.updateTypeInfo.slice();
    let isExistId = userTypeIdAry.indexOf(userid);
    if (isExistId === -1) {
      userTypeIdAry.push(userid);
    }
    let existPos = userTypeIdAry.indexOf(userid);

    const type = e.target.value || e.target.placeholder;
    updateTypeInfo[existPos] = {
      _id: userid,
      type,
    };

    this.setState({
      userTypeIdAry,
      updateTypeInfo,
    });
  }

  updateBatch(e) {
    e.preventDefault();
    Meteor.call('update.userinfo',this.state.value, this.state.updateEInfo, this.state.updatePhoneInfo, this.state.updateRInfo, this.state.updateGInfo, this.state.updateTypeInfo);
    window.location.reload();
  }

  deleteUser() {
    Delete('delete.userinfo', this.state.value, this, 'value');
  }

  queryUser(e) {
    e.preventDefault();
    const queryKey = this.userName.current.value.trim();
    this.props.stateUp(queryKey || '');
  }

  clearCheckBox() {
    this.setState({
      value: [],
    });
  }

  //更改帐号状态
  activateAccount(userid, status, e) {
    e.preventDefault();
    Meteor.call('accountStatus.userinfo', userid, status);
    Meteor.call('sendEmail',userid);
  }

  render() {
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
    return (
      <div className="col-xs-12">
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="sysManage"
                defaultMessage="系统管理"
              />
              /
              <FormattedMessage
                id="userManage"
                defaultMessage="用户管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form role="form" id="user-form">
                {
                  <button
                    type="button" className="btn btn-info pull-left " data-toggle="modal"
                    data-target="#myModal"
                  ><i className="fa fa-plus-square" />
                    <FormattedMessage
                      id="new"
                      defaultMessage="新建"
                    />
                  </button>
                }
                {
                   Session.get('permission').includes('user_btn_u') ?
                    <button type="button" className="btn btn-info pull-left btn-edit" onClick={this.updateBatch.bind(this)}><i className="fa fa-edit" />
                      <FormattedMessage
                        id="update"
                        defaultMessage="更新"
                      />
                    </button> : null
                }
                {
                   Session.get('permission').includes('user_btn_d') ?
                    <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.deleteUser.bind(this)}><i className="fa fa-trash-o" />
                      <FormattedMessage
                        id="delete"
                        defaultMessage="删除"
                      />
                    </button> : null
                }
              </form>
            </div>
            {
               Session.get('permission').includes('user_btn_r') ?
                <form className="role-form" onSubmit={this.queryUser.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.queryUser.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="username">
                    {(txt) => (
                      <input
                        type="text" ref={this.userName} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form> : null
            }
          </div>
          <div className="box-body">
            <div id="udmiddle">
              <table className="table table-bordered table-hover">
                <thead>
                <tr className="tr-title-space">
                  <th className="check-box-position">
                    <input
                      className="allChecked"
                      type="checkbox"
                      checked={this.state.value.length === this.props.allUser.length ? true : false}
                      onChange={this.handleAllCheckbox.bind(this)}
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="username"
                      defaultMessage="用户名称"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="email"
                      defaultMessage="Email"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="MobilePhoneNo"
                      defaultMessage="手机号"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="role"
                      defaultMessage="角色"
                    />
                  </th>
                  <th>
                    <FormattedMessage
                      id="gender"
                      defaultMessage="性别"
                    />
                  </th>
                  <th>
                    用户类型
                  </th>
                  <th>
                    <FormattedMessage
                      id="status"
                      defaultMessage="帐号状态"
                    />
                  </th>
                </tr>
                </thead>
                <tbody>
                {
                  this.props.allUser.map((user, i) => {
                    const showRoles = user.profile.roles.concat();
                    if(showRoles.length > 0) {
                      for(let eachItem of showRoles) {
                        const role = Meteor.roles.findOne({_id: eachItem});
                        if(role) {
                          showRoles.splice(showRoles.indexOf(eachItem), 1, role.name);
                        }
                      }
                    }

                    return (
                      <tr className="tr-title-space" key={user._id}>
                        <td className="check-box-position">
                          <div className="icheckbox_flat-blue checked" aria-checked="true" aria-disabled="false">
                            <input
                              type="checkbox"
                              checked={this.state.value.includes(user._id) ? true : false}
                              name={user}
                              value={user._id}
                              onChange={this.handleCheckbox.bind(this, i)}
                            />
                          </div>
                        </td>
                        <td>{user.username}</td>
                        <td>{user._id !== this.state.value[i] ?
                          user.emails[0].address :
                          <input type="text" placeholder={user.emails[0].address} onChange={this.handleEOnChange.bind(this, user._id)} />}
                        </td>
                        <td>
                          {
                            user._id !== this.state.value[i] ?
                              user.profile.phone
                              :
                              <input type="text" placeholder={user.profile.phone} onChange={this.handlePhoneOnChange.bind(this, user._id)} />
                          }
                        </td>
                        <td>
                          {
                            user._id !== this.state.value[i] ?
                              showRoles.toString()
                              :
                              <Select
                                isMulti
                                options={roles}
                                placeholder="select roles"
                                onChange={this.handleROnChange.bind(this, user._id, user.profile.roles)}
                              >
                              </Select>
                          }
                        </td>
                        <td>
                          {
                            user._id !== this.state.value[i] ?
                              Common.getCodeMeaningByValue(this.state.options, user.profile.gender)
                              :
                              <SelectOptions
                                cname="gender"
                                defaultValue={user.profile.gender}
                                onChange={this.handleGOnChange.bind(this, user._id)}
                              />
                          }
                        </td>
                        <td>
                          {
                            user._id !== this.state.value[i] ?
                              Common.getCodeMeaningByValue(this.state.typeOptions, user.profile.type)
                              :
                              <SelectOptions
                                cname="userType"
                                defaultValue={user.profile.type}
                                onChange={this.handleTypeOnChange.bind(this, user._id)}
                              />
                          }
                        </td>
                        {/* 账户状态 */}
                        <td>
                          <button
                            id={user._id}
                            type="button"
                            className={user.profile.isActivated ? 'btn btn-success' : 'btn btn-danger'}
                            onClick={this.activateAccount.bind(this, user._id, !user.profile.isActivated)}
                          >
                            {user.profile.isActivated ? '已激活' : '未激活'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
              {this.state.dataCount}
            </div>
          </div>
          <div className="box-footer">
            <Pagination
              changePage={this.getCurrentPaginationData.bind(this)}
              count={this.props.dataCount}
              clearCheckBox={this.clearCheckBox.bind(this)}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withTracker(
  ({queryKey, limit, skip}) => {
    Meteor.subscribe('all.user');
    Meteor.subscribe('roles');

    if (queryKey !== 'none') {
      const regExp = new RegExp(queryKey, 'i');
      return {
        allUser: Meteor.users.find({username: regExp}, {
          sort: {profile: {updateDate: -1}},
          limit: limit,
          skip: skip,
        }).fetch(),
        dataCount: Meteor.users.find({username: regExp}, {sort: {profile: {updateDate: -1}}}).count(),
        roles: Meteor.roles.find({}, {fields: {name: 1}}).fetch(),
      }
    } else {
      return {
        allUser: Meteor.users.find({}, {sort: {profile: {updateDate: -1}}, limit: limit, skip: skip}).fetch(),
        dataCount: Meteor.users.find({}, {sort: {profile: {updateDate: -1}}}).count(),
        roles: Meteor.roles.find({}, {fields: {name: 1}}).fetch(),
      }
    }
  },
)(ShowUser);
