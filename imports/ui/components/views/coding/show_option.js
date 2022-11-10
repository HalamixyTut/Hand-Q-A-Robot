import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import {Option} from '../../../../api/coding/option';
import ListOption from './list_option';
import Pagination from '../utils/pagination';
import {handleDelete as Delete} from '../utils/common';

class ShowOption extends React.Component{
  constructor() {
    super();
    this.optionName = React.createRef();

    this.state = {
      optionList: [], // 存储用于更新或删除的记录
      clearCheck: false,
    }
  }

  // 处理子组件传递过来的被点击的记录
  dealList(optionList) {
    let flag = 0;

    for(let eachItem of this.state.optionList) {
      if(eachItem.optionInfo._id === optionList.optionInfo._id) {
        this.state.optionList.splice(this.state.optionList.indexOf(eachItem),1);
        this.setState({
          optionList: this.state.optionList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.optionList.push(optionList);

      this.setState({
        optionList: this.state.optionList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete(e) {
    Delete('options.delete', this.state.optionList, this, 'optionList');
  }

  // 更新记录
  handleUpdate() {
    if(this.state.optionList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.optionList.length === 1 ){
      if (this.props.options.length >0) {
        this.setState({optionList: [], clearCheck: true});
      } else {
        this.setState({clearCheck: false});
      }
      if(this.props.setUpdateInfo2){
        this.props.setUpdateInfo2(this.state.optionList)
      }
      $('#optionUpdate').modal('show');
    }
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const optionName = this.optionName.current.value.trim();

    if(this.props.setQueryKey2){
      this.props.setQueryKey2(optionName);
    }

    if (this.props.options.length >0) {
      this.setState({optionList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      optionList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  changeClear = () => this.setState({clearCheck: false});

  render() {
    return(
      <div
        className="modal fade" id="optionEdit" tabIndex="-1"
        role="dialog" aria-labelledby="optionModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content edit-modal">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title" id="optionModalLabel">
                <FormattedMessage
                  id="ValueSetList"
                  defaultMessage="值集列表"
                />
              </h4>
            </div>
            <div className="modal-body">
              <div className="box box-primary">
                <div className="box-header with-border">
                  <div className="box-body">
                    <div className="form-group">
                      <div className="col-xs-2">
                        <label htmlFor="inputUserName">
                          <FormattedMessage
                            id="ValueList"
                            defaultMessage="值列表"
                          />
                        </label>
                      </div>
                      <div className="role-button">
                        <div className="col-xs-10">
                          <form id="option-form">
                            <button
                              type="button" data-toggle="modal" data-target="#optionAdd"
                              className="btn btn-info pull-left"
                            >
                              <i className="fa fa-plus-square" />
                              <FormattedMessage
                                id="new"
                                defaultMessage="新建"
                              />
                            </button>
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
                            <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                              <FormattedMessage
                                id="delete"
                                defaultMessage="删除"
                              />
                            </button>
                          </form>
                        </div>
                        <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                          <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                            <FormattedMessage
                              id="search"
                              defaultMessage="查询"
                            />
                          </button>
                          <FormattedMessage id="value_set_name">
                            {(txt) => (
                              <input
                                type="text" ref={this.optionName} className="pull-right find-input"
                                placeholder={txt}
                              />
                            )}
                          </FormattedMessage>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="box-body col-xs-11 col-xs-offset-1">
                    <table className="table table-bordered table-hover">
                      <thead>
                      <tr>
                        <th></th>
                        <th>
                          <FormattedMessage
                            id="value"
                            defaultMessage="值"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="meaning"
                            defaultMessage="含义"
                          />
                        </th>
                        <th>
                          <FormattedMessage
                            id="desc"
                            defaultMessage="描述"
                          />
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        this.props.options.map((option) => {
                          return(
                            <ListOption
                              key={option._id}
                              option={option}
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
            </div>
            <div className="modal-footer">
              {/*<button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage
                  id='cancel'
                  defaultMessage='取消'
                />
              </button>
              <button type="submit" className="btn btn-info pull-right" form="coding-form"
                      // onClick={this.handleSubmit.bind(this)}
                >
                <FormattedMessage
                  id='save'
                  defaultMessage='保存'
                />
              </button>*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey2,cname,limit,skip}) => {
  Meteor.subscribe('options');
  if(queryKey2 === ''){
    return{
      options: Option.find({cname: cname}, {limit: limit, skip: skip}).fetch(),
      counts: Option.find({cname: cname}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey2, 'i');
    return{
      options: Option.find({name: regExp,cname:cname}, {limit: limit, skip: skip}).fetch(),
      counts: Option.find({name: regExp,cname:cname}).count(),
    }
  }
})(ShowOption);
