import React from 'react';
import {Meteor} from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import {FormattedMessage} from 'react-intl';
import Cookies from 'universal-cookie';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Room} from '../../../../api/rooms/rooms';

class SideBarMenu extends React.Component {

  // 数据分析(DM)   1:dashboard 2.satisfaction
  // 即时通讯(IM)   1:channel 2:private 3:direct
  // 知识图谱(KM)   1:knowledge 2:question 3:keyword
  // 系统管理(SM)   1:users 2:roles 3:permissions 4.resources 5.codings 6:rooms 7:bulletin 8:setting 9:history
  // 开发者中心(DC) 1:api
  // 计划任务(CJ)   1:crontab 2:record

  constructor(props) {
    super(props);
    let url = window.location.href;
    // eslint-disable-next-line no-useless-escape
    let index = url.lastIndexOf('\/');
    let uri = url.substring(index + 1, url.length);
    const cookies = new Cookies();
    cookies.set('uri', uri, { path: '/' });

    let DA = ['dashboard','satisfaction'];
    let IM = ['channel','private','direct'];
    let KM = ['knowledge','question','category','keyword'];
    let SM = ['users','roles','permissions','resources','codings','rooms','bulletin','setting','ldap','history'];
    let DC = ['api'];
    let CJ = ['crontab','record'];

    // DAA = DA IS ACTIVE ?
    // ...
    // DCA = DC IS ACTIVE ?

    let DAA = true;
    let IMA = false;
    let KMA = false;
    let SMA = false;
    let DCA = false;
    let CJA = false;

    if(DA.includes(cookies.get('uri'))) {
      DAA = true;
      IMA = false;
      KMA = false;
      SMA = false;
      DCA = false;
      CJA = false;
    }

    if(IM.includes(cookies.get('uri'))) {
      DAA = false;
      IMA = true;
      KMA = false;
      SMA = false;
      DCA = false;
      CJA = false;
    }

    if(KM.includes(cookies.get('uri'))) {
      DAA = false;
      IMA = false;
      KMA = true;
      SMA = false;
      DCA = false;
      CJA = false;
    }

    if(SM.includes(cookies.get('uri'))) {
      DAA = false;
      IMA = false;
      KMA = false;
      SMA = true;
      DCA = false;
      CJA = false;
    }

    if(DC.includes(cookies.get('uri'))) {
      DAA = false;
      IMA = false;
      KMA = false;
      SMA = false;
      DCA = true;
      CJA = false;
    }

    if(CJ.includes(cookies.get('uri'))) {
      DAA = false;
      IMA = false;
      KMA = false;
      SMA = false;
      DCA = false;
      CJA = true;
    }

    this.state={
      DAA:DAA,
      IMA:IMA,
      KMA:KMA,
      SMA:SMA,
      DCA:DCA,
      CJA:CJA,
      uri:cookies.get('uri'),
      currentMenu:localStorage.getItem('roomName'),
    }

  }

  componentDidUpdate() {
    $(function () {
      $('.sidebar-menu >li > ul').on('click', function () {
        var $parent = $(this).parent().addClass('active');
        $parent.siblings('.sidebar-menu.active').find('> ul').trigger('click');
        $parent.siblings().removeClass('active').find('li').removeClass('active');
      });

      $('.sidebar-menu li:not(.treeview) > a').on('click', function () {
        var $parent = $(this).parent().addClass('active');
        $parent.siblings('.treeview.active').find('> a').trigger('click');
        $parent.siblings().removeClass('active').find('li').removeClass('active');
      });
    });
  }

  menuStore(roomName,e) {
    e.preventDefault();
    localStorage.setItem('roomName',  roomName);
    this.setState({
      currentMenu:localStorage.getItem('roomName'),
    })
  }

  render() {
    return (
      <ul className="sidebar-menu tree" data-widget="tree" data-animation-speed="250">
        <li className="header">
          <FormattedMessage
            id="navigation"
            defaultMessage="导航栏"
          />
        </li>

        {/*数据分析*/}
        <li className={this.state.DAA ? 'treeview active' : 'treeview'}>  {/* treeview active */}
          {
            Session.get('permission') &&  Session.get('permission').includes('data_analysis') ?
              <a href="#">
                <i className="fa fa-bar-chart" />
                <span>
                <FormattedMessage
                  id="dataAnalysis"
                  defaultMessage="数据分析"
                />
                </span>
                <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right" />
                </span>
              </a> : null
          }
          <ul className="treeview-menu">
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard') ?
                <li className={this.state.uri === 'dashboard' ? 'active' : ''}> {/*  active */}
                  <Link to="/dashboard">
                    <i className="fa fa-dashboard" />
                    <FormattedMessage
                      id="dashboard"
                      defaultMessage="仪表盘"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/satisfaction') ?
                <li className={this.state.uri === 'satisfaction' ? 'active':''}>
                  <Link to="/dashboard/satisfaction">
                    <i className="fa fa-smile-o" />
                    <FormattedMessage
                      id="robotSatisfaction"
                      defaultMessage="机器人问答满意度"
                    />
                  </Link>
                </li> : null
            }
          </ul>
        </li>

        {/*即时通讯*/}
        <li className={this.state.IMA?'treeview active':'treeview'}>
          {
            Session.get('permission') &&  Session.get('permission').includes('im_message') ?
              <a href="#">
                <i className="fa fa-comments-o" />
                <FormattedMessage
                  id="instantMsg"
                  defaultMessage="即时通讯"
                />
                <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right" />
                </span>
              </a> : null
          }

          <ul className={this.state.uri==='channel'?'treeview-menu active':'treeview-menu'}>
            <li className={this.state.uri==='channel'?'treeview menu-open':'treeview'}>
              {
                Session.get('permission') &&  Session.get('permission').includes('public_channel') ?
                <a href="#">
                  <i className="fa fa-phone" />
                  <FormattedMessage
                    id="pubChannel"
                    defaultMessage="公共通讯组"
                  />
                  <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right" />
                  </span>
                </a> : null
              }
              <ul className="treeview-menu" style={{display:this.state.uri==='channel'?'block':''}}>
                {this.props.publicChannel.map((publicChannel) => {
                  return (
                    <li
                      key={publicChannel._id} className={this.state.currentMenu===publicChannel.roomName?'active':''}
                      onClick={this.menuStore.bind(this,publicChannel.roomName)}
                    >
                      <Link to={{
                        pathname: '/dashboard/channel/#',
                        state: {roomId: publicChannel._id, roomName: publicChannel.roomName},
                      }}
                      > {publicChannel.roomName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className={this.state.uri==='private'?'treeview menu-open':'treeview'}>
              {
                Session.get('permission') &&  Session.get('permission').includes('private_channel') ?
                  <a href="#">
                    <i className="fa fa-headphones" />
                    <FormattedMessage
                      id="privateChannel"
                      defaultMessage="私有通讯组"
                    />
                    <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a> : null
              }
              <ul className="treeview-menu"  style={{display:this.state.uri==='private'?'block':''}}>
                {this.props.privateChannel.map((privateChannel) => {
                  return (
                    <li
                      key={privateChannel._id} className={this.state.currentMenu===privateChannel.roomName?'active':''}
                      onClick={this.menuStore.bind(this,privateChannel.roomName)}
                    >
                      <Link to="/dashboard/private"> {privateChannel.roomName}</Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className={this.state.uri==='direct'?'active':''}>
              {
                Session.get('permission') &&  Session.get('permission').includes('direct_channel') ?
                  <Link to="/dashboard/direct"><i className="fa fa-mobile-phone" />
                    <FormattedMessage
                      id="dirtMsg"
                      defaultMessage="点对点通讯"
                    />
                  </Link> : null
              }
            </li>
          </ul>
        </li>

        {/*知识图谱*/}
        <li className={this.state.KMA?'treeview active' : 'treeview'}>
          {
            Session.get('permission') &&  Session.get('permission').includes('knowledge_map') ?
              <a href="#">
                <i className="fa fa-mortar-board" />
                <FormattedMessage
                  id="knowledgeMap"
                  defaultMessage="知识图谱"
                />
                <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right" />
                </span>
              </a> : null
          }
          <ul className="treeview-menu">
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/knowledge') ?
                <li className={this.state.uri === 'knowledge' ? 'active':''}>
                  <Link to="/dashboard/knowledge"><i className="fa  fa-wrench" />
                    <FormattedMessage
                      id="KnowledgeMaintenance"
                      defaultMessage="知识维护"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/category') ?
                <li className={this.state.uri === 'category' ? 'active':''}>
                  <Link to="/dashboard/category"><i className="fa fa-th-large" />
                    <FormattedMessage
                      id="KnowledgeClassification"
                      defaultMessage="知识分类"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/keyword') ?
                <li className={this.state.uri === 'keyword' ? 'active':''}>
                  <Link to="/dashboard/keyword"><i className="fa fa-tag" />
                    <FormattedMessage
                      id="KeywordMaintenance"
                      defaultMessage="关键字维护"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/question') ?
                <li className={this.state.uri === 'question' ? 'active':''}>
                  <Link to="/dashboard/question"><i className="fa fa-meh-o" />
                    <FormattedMessage
                      id="UnknownQuestionMaintenance"
                      defaultMessage="未知问题维护"
                    />
                  </Link>
                </li> : null
            }

          </ul>
        </li>

        {/*系统管理*/}
        <li className={this.state.SMA ? 'treeview active' : 'treeview'}>
          {
            Session.get('permission') &&  Session.get('permission').includes('system_management') ?
              <a href="#">
                <i className="fa fa-unlock-alt" />
                <FormattedMessage
                  id="sysManage"
                  defaultMessage="系统管理"
                />
                <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right" />
                </span>
              </a> : null
          }
          <ul className="treeview-menu">
            {/* 用户管理： 2018-6-19 */}
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/users') ?
                <li className={this.state.uri==='users' ? 'active':''}>
                  <Link to="/dashboard/users"><i className="fa fa-user-plus" />
                    <FormattedMessage
                      id="userManage"
                      defaultMessage="用户管理"
                    />
                  </Link>
                </li> : null
            }
            {/* 角色管理： 2018-6-22 */}
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/roles') ?
                <li className={this.state.uri==='roles' ? 'active':''}>
                  <Link to="/dashboard/roles"><i className="fa fa-users" />
                    <FormattedMessage
                      id="roleManage"
                      defaultMessage="角色管理"
                    />
                  </Link>
                </li> : null
            }
            {/* 权限管理： 2018-11-20 */}
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/permissions') ?
                <li className={this.state.uri==='permissions' ? 'active':''}>
                  <Link to="/dashboard/permissions"><i className="fa fa-key" />
                    <FormattedMessage
                      id="permManage"
                      defaultMessage="权限管理"
                    />
                  </Link>
                </li>
                  : null
            }
            {/* 资源管理： 2018-11-20 */}
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/resources') ?
                <li className={this.state.uri==='resources' ? 'active':''}>
                  <Link to="/dashboard/resources"><i className="fa fa-toggle-on" />
                    <FormattedMessage
                      id="resManage"
                      defaultMessage="资源管理"
                    />
                  </Link>
                </li> : null
            }
            {/* 编码管理： 2018-11-21 */}
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/codings') ?
                <li className={this.state.uri==='codings' ? 'active':''}>
                  <Link to="/dashboard/codings"><i className="fa fa-cube" />
                    <FormattedMessage
                      id="codingManage"
                      defaultMessage="编码管理"
                    />
                  </Link>
                </li> : null
            }
            {/* 通讯管理： 2018-6-22 */}
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/rooms') ?
                <li className={this.state.uri==='rooms' ? 'active':''}>
                  <Link to="/dashboard/rooms"><i className="fa fa-comments" />
                    <FormattedMessage
                      id="commManage"
                      defaultMessage="通讯组管理"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/bulletin') ?
                <li className={this.state.uri==='bulletin' ? 'active':''}>
                  <Link to="/dashboard/bulletin"><i className="fa fa-bell" />
                    <FormattedMessage
                      id="BulletinManagement"
                      defaultMessage="公告管理"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/setting') ?
                <li className={this.state.uri==='setting' ? 'active':''}>
                  <Link to="/dashboard/setting"><i className="fa fa-gear" />
                    <FormattedMessage
                      id="robotSetting"
                      defaultMessage="机器人设置"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/ldap') ?
                <li className={this.state.uri==='ldap' ? 'active':''}>
                  <Link to="/dashboard/ldap"><i className="fa fa-sign-in" />
                    <FormattedMessage
                      id="LdapSetup"
                      defaultMessage="ldap设置"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/history') ?
                <li className={this.state.uri==='history' ? 'active':''}>
                  <Link to="/dashboard/history"><i className="fa fa-history" />
                    <FormattedMessage
                      id="loginHistory"
                      defaultMessage="用户登录历史"
                    />
                  </Link>
                </li> : null
            }
          </ul>
        </li>

        {/*开发者中心*/}
        <li className={this.state.DCA ? 'treeview active' : 'treeview'}>
          {
            Session.get('permission') &&  Session.get('permission').includes('developer_center') ?
              <a href="#">
                <i className="fa fa-connectdevelop" />
                <FormattedMessage
                  id="developCenter"
                  defaultMessage="开发者中心"
                />
                <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right" />
                </span>
              </a> : null
          }
          <ul className={this.state.DCA?'treeview-menu active':'treeview-menu'}>
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/api') ?
                <li className={this.state.uri === 'api' ? 'active':''}>
                  <Link to="/dashboard/api"><i className="fa fa-gift" />
                    API
                    <FormattedMessage
                      id="accessRequest"
                      defaultMessage="接入申请"
                    />
                  </Link>
                </li> : null
            }
          </ul>
        </li>

        {/*计划任务*/}
        <li className={this.state.CJA ? 'treeview active' : 'treeview'}>
          {
            Session.get('permission') &&  Session.get('permission').includes('schedule') ?
              <a href="#">
                <i className="fa fa-clock-o" />
                <FormattedMessage
                  id="scheduleTask"
                  defaultMessage="计划任务"
                />
                <span className="pull-right-container">
                <i className="fa fa-angle-left pull-right" />
                </span>
              </a> : null
          }
          <ul className={this.state.CJA?'treeview-menu active':'treeview-menu'}>
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/crontab') ?
                <li className={this.state.uri === 'crontab' ? 'active':''}>
                  <Link to="/dashboard/crontab"><i className="fa fa-indent" />
                    <FormattedMessage
                      id="TaskDetail"
                      defaultMessage="任务明细"
                    />
                  </Link>
                </li> : null
            }
            {
              Session.get('permission') &&  Session.get('permission').includes('/dashboard/record') ?
                <li className={this.state.uri === 'record' ? 'active':''}>
                  <Link to="/dashboard/record"><i className="fa fa-list" />
                    <FormattedMessage
                      id="ExecutionRecords"
                      defaultMessage="执行记录"
                    />
                  </Link>
                </li> : null
            }
          </ul>
        </li>
      </ul>
    );
  }
}


SideBarMenu.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  userCount: PropTypes.number,
};

export default withTracker(() => {
  Meteor.subscribe('rooms');

  return {
    publicChannel: Room.find({roomType: 'public'}, {sort: {roomName: 1}}).fetch(),
    privateChannel: Room.find({roomType: 'private'}, {sort: {roomName: 1}}).fetch(),
  }
})(SideBarMenu);
