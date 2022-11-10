import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {FormattedMessage} from 'react-intl';
import {Resource} from '../../../../api/resource/resource';
import ListResource from './list_resource';
import Pagination  from '../utils/pagination';
import {handleDelete as Delete} from '../utils/common';
import {DialogUpdate} from '../utils/modal_dialog'
import {getOptions} from '../utils/select_options';

class ShowResource extends React.Component {
  constructor() {
    super();
    this.resourceName = React.createRef();

    this.state = {
      resourceList: [], // 存储用于更新或删除的记录
      options: [], //存储快码
      clearCheck: false,
    }
  }

  componentDidMount() {
    getOptions('resourceType').then(data => this.setState({options: data}));
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  // 处理子组件传递过来的被点击的记录
  dealList(resourceList) {
    let flag = 0;

    for(let eachItem of this.state.resourceList) {
      if(eachItem.resourceInfo._id === resourceList.resourceInfo._id) {
        this.state.resourceList.splice(this.state.resourceList.indexOf(eachItem),1);
        this.setState({
          resourceList: this.state.resourceList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.resourceList.push(resourceList);

      this.setState({
        resourceList: this.state.resourceList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete(e) {
    Delete('resources.delete', this.state.resourceList, this, 'resourceList');
  }

  // 更新记录
  handleUpdate() {
    if(this.state.resourceList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.resourceList.length === 1 ){
      if(this.props.setUpdateInfo){
        this.props.setUpdateInfo(this.state.resourceList)
      }
      $('#resourceUpdate').modal('show');
    }
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const resourceName = this.resourceName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(resourceName);
    }

    if (this.props.resources.length >0) {
      this.setState({resourceList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      resourceList: [],
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
                id="resManage"
                defaultMessage="资源管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form id="resource-form">
                {
                  Session.get('permission').includes('resource_btn_c') ?
                  <button
                    type="button" data-toggle="modal" data-target="#resourceAdd"
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
                  Session.get('permission').includes('resource_btn_u') ?
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
                  Session.get('permission').includes('resource_btn_d') ?
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
              Session.get('permission').includes('resource_btn_r') ?
              <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                  <FormattedMessage
                    id="search"
                    defaultMessage="查询"
                  />
                </button>
                <FormattedMessage id="resName">
                  {(txt) => (
                    <input
                      type="text" ref={this.resourceName} className="pull-right find-input"
                      placeholder={txt}
                    />
                  )}
                </FormattedMessage>
              </form> : null
            }
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="resName"
                    defaultMessage="资源名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="resType"
                    defaultMessage="资源类型"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="resDesc"
                    defaultMessage="资源描述"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.resources.map((resource) => {
                  return(
                    <ListResource
                      key={resource._id}
                      resource={resource}
                      dealList={this.dealList.bind(this)}
                      options={this.state.options}
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
        <DialogUpdate />
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('resources');
  if(queryKey === ''){
    return{
      resources: Resource.find({}, {limit: limit, skip: skip}).fetch(),
      counts: Resource.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      resources: Resource.find({name: regExp}, {limit: limit, skip: skip}).fetch(),
      counts: Resource.find({name: regExp}).count(),
    }
  }
})(ShowResource);
