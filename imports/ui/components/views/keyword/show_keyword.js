import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import {Keyword} from '../../../../api/keyword/keyword';
import ListKeyword from './list_keyword';
import Pagination from '../utils/pagination';
import {handleDelete as Delete} from '../utils/common';
import {DialogUpdate} from '../utils/modal_dialog'

class ShowKeyword extends React.Component {
  constructor() {
    super();
    this.keywordName = React.createRef();

    this.state = {
      keywordList: [], // 存储用于更新或删除的记录
      clearCheck: false,
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  // 处理子组件传递过来的被点击的记录
  dealList(keywordList) {
    let flag = 0;

    for(let eachItem of this.state.keywordList) {
      if(eachItem.keywordInfo._id === keywordList.keywordInfo._id) {
        this.state.keywordList.splice(this.state.keywordList.indexOf(eachItem),1);
        this.setState({
          keywordList: this.state.keywordList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.keywordList.push(keywordList);

      this.setState({
        keywordList: this.state.keywordList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete(e) {
    Delete('keywords.delete', this.state.keywordList, this, 'keywordList');
  }

  // 更新记录
  handleUpdate() {
    if(this.state.keywordList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.keywordList.length === 1 ){
      if(this.props.setUpdateInfo){
        this.props.setUpdateInfo(this.state.keywordList)
      }
      $('#keywordUpdate').modal('show');
    }
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const keywordName = this.keywordName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(keywordName);
    }

    if (this.props.keywords.length >0) {
      this.setState({keywordList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      keywordList: [],
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
                id="knowledgeMap"
                defaultMessage="知识图谱"
              />/
              <FormattedMessage
                id="KeywordMaintenance"
                defaultMessage="关键字维护"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="keyword-form">
                {
                  Session.get('permission').includes('keyword_btn_c') ?
                    <button
                      type="button" data-toggle="modal" data-target="#keywordAdd"
                      className="btn btn-info pull-left"
                    >
                      <i className="fa fa-plus-square" />
                      <FormattedMessage
                        id="new"
                        defaultMessage="新建"
                      />
                    </button>
                  : null
                }
                {
                  Session.get('permission').includes('keyword_btn_u') ?
                    <button
                      type="button"
                      className="btn btn-info pull-left btn-edit"
                      onClick={this.handleUpdate.bind(this)}
                    >
                      <i className="fa fa-edit" />
                      <FormattedMessage
                        id="update"
                        defaultMessage="更新"
                      />
                    </button>
                    : null
                }
                {
                  Session.get('permission').includes('keyword_btn_d') ?
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
              Session.get('permission').includes('keyword_btn_r') ?
                <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="keywordName">
                    {(txt) => (
                      <input
                        type="text" ref={this.keywordName} className="pull-right find-input"
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
                  <FormattedMessage
                    id="keywordName"
                    defaultMessage="关键字名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="frequency"
                    defaultMessage="频率"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="wordNature"
                    defaultMessage="词性"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="hasSynchronousDictionary"
                    defaultMessage="是否同步词典"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="SynchronousDictionary"
                    defaultMessage="同步到词典"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.keywords.map((keyword) => {
                  return(
                    <ListKeyword
                      key={keyword._id}
                      keyword={keyword}
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
            <Pagination counts={this.props.counts} changePage={this.changePage.bind(this)} />
          </div>
        </div>
        <DialogUpdate />
        <DialogUpdate id="addSuccess" messageId="addSuccess" />
        <DialogUpdate id="keyword-repeat" messageId="entryRepeat" />
        <DialogUpdate id="keyword-added" messageId="addRepeat" />
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('keywords');

  if(queryKey === ''){
    return{
      keywords: Keyword.find({}, {limit: limit, skip: skip}).fetch(),
      counts: Keyword.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      keywords: Keyword.find({name: regExp}, {limit: limit, skip: skip}).fetch(),
      counts: Keyword.find({name: regExp}).count(),
    }
  }
})(ShowKeyword);
