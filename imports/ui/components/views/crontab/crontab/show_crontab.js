import React from 'react';
import {Meteor} from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import {Crontab} from '../../../../../api/crontab/crontabs';
import ListCrontab from './list_crontab';
import Pagination from '../../utils/pagination';
import {handleDelete as Delete} from '../../utils/common';
import {DialogUpdate} from '../../utils/modal_dialog'

class ShowCrontab extends React.Component {
  constructor() {
    super();
    this.queryKey = React.createRef();
    this.state = {
      crontabList: [],
      clearCheck: false, //是否情况选择的状态
    }
  }

  handleDelete() {
    Delete('crontabs.delete', this.state.crontabList, this, 'crontabList');
  }

  handleSearch(e) {
    e.preventDefault();
    const queryKey = this.queryKey.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(queryKey);
    }

    if (this.props.crontabs.length >0) {
      this.setState({crontabList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  changePage(limit, skip) {
    this.setState({
      crontabList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  dealList(crontab) {
    let flag = 0;

    for(let eachItem of this.state.crontabList) {
      if(eachItem.crontabId === crontab.crontabId) {
        this.state.crontabList.splice(this.state.crontabList.indexOf(eachItem),1);
        this.setState({
          crontabList: this.state.crontabList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.crontabList.push(crontab);

      this.setState({
        crontabList: this.state.crontabList,
      });
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
                id="scheduleTask"
                defaultMessage="计划任务"
              />
              /
              <FormattedMessage
                id="TaskDetail"
                defaultMessage="任务明细"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form role="form" id="crontab-form">
                {
                  Session.get('permission').includes('crontab_btn_c') ?
                  <button
                    type="button" data-toggle="modal" data-target="#crontabModal"
                    className="btn btn-info pull-left"
                  >
                    <i className="fa fa-plus-square" />
                    <FormattedMessage
                      id="new"
                      defaultMessage="新建"
                    />
                  </button> : null
                }
                {
                  Session.get('permission').includes('crontab_btn_d') ?
                  <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                  </button> : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('crontab_btn_r') ?
                <form className="role-form" onSubmit={this.handleSearch.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearch.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="taskname">
                    {(txt) => (
                      <input
                        type="text" ref={this.queryKey} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form>
                :
                null
            }
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="taskname"
                    defaultMessage="任务名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="taskstatus"
                    defaultMessage="任务状态"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="tasktype"
                    defaultMessage="任务类名"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="taskdesc"
                    defaultMessage="任务描述"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="executionplan"
                    defaultMessage="执行计划"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="operation"
                    defaultMessage="操作"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.crontabs.map((crontab) => {
                  return(
                    <ListCrontab
                      key={crontab._id}
                      crontab={crontab}
                      dealList={this.dealList.bind(this)}
                      clearCheck={this.state.clearCheck}
                      changeClear={this.changeClear}
                    />
                  );
                })
              }
              </tbody>
            </table>
          </div>
          <div className="box-footer">
            <Pagination count={this.props.counts} changePage={this.changePage.bind(this)} />
          </div>
        </div>

        <DialogUpdate id="cronStart" messageId="cronStart" />
        <DialogUpdate id="cronStop" messageId="cronStop" />
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('crontabs');
  if(queryKey === '') {
    return {
      crontabs: Crontab.find({},{limit:limit,skip:skip}).fetch(),
      counts:Crontab.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');

    return {
      crontabs: Crontab.find({cronName: regExp},{limit:limit,skip:skip}).fetch(),
      counts:Crontab.find({cronName: regExp}).count(),
    }
  }
})(ShowCrontab);
