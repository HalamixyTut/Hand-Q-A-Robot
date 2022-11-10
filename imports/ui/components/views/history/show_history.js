import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import ListHistory from './list_history';
import Pagination from '../utils/pagination';
import {LoginHistory} from '../../../../api/users/login_history';
import {handleDelete as Delete} from '../utils/common';

class ShowHistory extends React.Component {
  constructor() {
    super();
    this.historyName = React.createRef();

    this.state = {
      historyList: [], // 存储用于更新或删除的记录
      clearCheck: false,
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  // 处理子组件传递过来的被点击的记录
  dealList(historyList) {
    let flag = 0;

    for(let eachItem of this.state.historyList) {
      if(eachItem.historyInfo._id === historyList.historyInfo._id) {
        this.state.historyList.splice(this.state.historyList.indexOf(eachItem),1);
        this.setState({
          historyList: this.state.historyList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.historyList.push(historyList);

      this.setState({
        historyList: this.state.historyList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete(e) {
    Delete('loginHistorys.delete', this.state.historyList, this, 'historyList');
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const historyName = this.historyName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(historyName);
    }

    if (this.props.historys.length >0) {
      this.setState({historyList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      historyList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  changeClear = () => this.setState({clearCheck: false});

  render() {
    return(
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
                id="loginHistory"
                defaultMessage="用户登录历史"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="history-form">
                {
                  Session.get('permission').includes('history_btn_d') ?
                    <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                      <FormattedMessage
                        id="delete"
                        defaultMessage="删除"
                      />
                    </button>
                    : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('history_btn_r') ?
                <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="username">
                    {(txt) => (
                      <input
                        type="text" ref={this.historyName} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form>
                : null
            }
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  ip
                </th>
                <th>
                  <FormattedMessage
                    id="username"
                    defaultMessage="用户名"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="clientSys"
                    defaultMessage="客户端操作系统"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="clientBrowser"
                    defaultMessage="客户端浏览器"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="loginTime"
                    defaultMessage="登录时间"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="logoutTime"
                    defaultMessage="登出时间"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.historys.map((history) => {
                  return (
                    <ListHistory
                      history={history}
                      key={history._id}
                      dealList={this.dealList.bind(this)}
                      clearCheck={this.state.clearCheck}
                      changeClear={this.changeClear}
                    />
                  )
                })
              }
              </tbody>
            </table>
          </div>
          <div className="box-footer">
            <Pagination count={this.props.counts} changePage={this.changePage.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('loginHistorys');
  if(queryKey === ''){
    return{
      historys: LoginHistory.find({}, {limit: limit, skip: skip, sort: {signInTime: -1}}).fetch(),
      counts: LoginHistory.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');

    return{
      historys: LoginHistory.find({'username': regExp}, {limit: limit, skip: skip, sort: {signInTime: -1}}).fetch(),
      counts: LoginHistory.find({'username': regExp}).count(),
    }
  }
})(ShowHistory);
