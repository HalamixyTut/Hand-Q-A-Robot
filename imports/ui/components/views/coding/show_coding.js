import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import {Coding} from '../../../../api/coding/coding';
import ListCoding from './list_coding';
import Pagination from '../utils/pagination';
import ListCodingPermission from './list_coding_permission';
import {handleDelete as Delete} from '../utils/common';

class ShowCoding extends React.Component {
  constructor() {
    super();
    this.codingName = React.createRef();

    this.state = {
      codingList: [], // 存储用于更新或删除的记录
      clearCheck: false,
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  // 处理子组件传递过来的被点击的记录
  dealList(codingList) {
    let flag = 0;

    for(let eachItem of this.state.codingList) {
      if(eachItem.codingInfo._id === codingList.codingInfo._id) {
        this.state.codingList.splice(this.state.codingList.indexOf(eachItem),1);
        this.setState({
          codingList: this.state.codingList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.codingList.push(codingList);

      this.setState({
        codingList: this.state.codingList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete(e) {
    Delete('codings.delete', this.state.codingList, this, 'codingList');
  }

  // 更新记录
  handleUpdate() {
    if(this.state.codingList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.codingList.length === 1 ){
      if(this.props.setUpdateInfo1){
        this.props.setUpdateInfo1(this.state.codingList)
      }
      $('#codingUpdate').modal('show');
    }
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const codingName = this.codingName.current.value.trim();

    if(this.props.setQueryKey1){
      this.props.setQueryKey1(codingName);
    }

    if (this.props.codings.length >0) {
      this.setState({codingList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  handleEdit(cname){
    if (this.props.cname){
      this.props.cname(cname)
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      codingList: [],
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
                id="codingManage"
                defaultMessage="编码管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="coding-form">
                {
                  Session.get('permission').includes('coding_btn_c') ?
                  <button
                    type="button" data-toggle="modal" data-target="#codingAdd"
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
                  Session.get('permission').includes('coding_btn_u') ?
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
                  Session.get('permission').includes('coding_btn_d') ?
                    <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                    </button> : null
                }
              </form>
            </div>
            <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
              <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                <FormattedMessage
                  id="search"
                  defaultMessage="查询"
                />
              </button>
              <FormattedMessage id="codename">
                {(txt) => (
                  <input
                    type="text" ref={this.codingName} className="pull-right find-input"
                    placeholder={txt}
                  />
                )}
              </FormattedMessage>
            </form>
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="code"
                    defaultMessage="代码"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="meaning"
                    defaultMessage="含义"
                  />
                </th>
                {
                  Session.get('permission').includes('coding_edit') ?
                    <th>
                      <FormattedMessage
                        id="edit"
                        defaultMessage="编辑"
                      />
                    </th>
                    :
                    null
                }
              </tr>
              </thead>
               <tbody>
              {
                this.props.codings.map((coding) => {
                  return(
                    Session.get('permission').includes('coding_edit') ?
                      <ListCodingPermission
                        key={coding._id}
                        coding={coding}
                        cname={this.handleEdit.bind(this)}
                        dealList={this.dealList.bind(this)}
                        clearCheck={this.state.clearCheck}
                        changeClear={this.changeClear}
                      />
                      :
                      <ListCoding
                        key={coding._id}
                        coding={coding}
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
      </div>
    );
  }
}

export default withTracker(({queryKey1,limit,skip}) => {
  Meteor.subscribe('codings');

  if(queryKey1 === ''){
    return{
      codings: Coding.find({}, {limit: limit, skip: skip}).fetch(),
      counts: Coding.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey1, 'i');
    return{
      codings: Coding.find({name: regExp}, {limit: limit, skip: skip}).fetch(),
      counts: Coding.find({name: regExp}).count(),
    }
  }
})(ShowCoding);
