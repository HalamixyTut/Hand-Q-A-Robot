/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import {Resource} from '../../../../../api/resource/resource';
import PermissionAddResource from './permission_add_resource';

class PermissionShowResource extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isChecked: false,
      resourceList: [],
      queryKey: '', //存储权限添加资源时，在拉取的页面资源中，对资源进行查询的关键字
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
    }
  }

  setQueryKey(queryKey) {
    this.setState({
      queryKey: queryKey,
    })
  }

  setTest(){
    if (this.props.setTest){
      this.props.setTest(Math.random()*100)
    }
  }

  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
  }

  toggleChecked(resource) {
    let flag = 0;

    for(let eachItem of this.state.resourceList) {
      if(eachItem === resource._id) {
        this.state.resourceList.splice(this.state.resourceList.indexOf(eachItem),1);
        this.setState({
          resourceList: this.state.resourceList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.resourceList.push(resource._id);

      this.setState({
        resourceList: this.state.resourceList,
      });
    }
  }

  handleClick(e) {
    if(this.state.resourceList.length === 0){
      e.preventDefault();
    }

    if(JSON.stringify(this.props.permissionInfo) !== '{}') {
      Meteor.call('permissions.delete.resources', this.props.permissionInfo._id, this.state.resourceList);
    }
  }

  render() {
    let resources = [];
    let resourcesId = [];
    let permissionName = '';
    let permissionId = '';
    const propsPermission = this.props.permissionInfo;

    if(JSON.stringify(propsPermission) !== '{}') {
      permissionName = propsPermission.name;
      permissionId = propsPermission._id;
      const permissionsId = propsPermission.resource;

      for(let eachItem of permissionsId) {
        const resource = Resource.findOne({_id: eachItem});
        resources.push(resource);
        resourcesId.push(resource._id);
      }
    }

    return(
      <div
        className="modal fade" id="PermissionShowResource" tabIndex="-1"
        role="dialog" aria-labelledby="permissionModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              ><span
                aria-hidden="true"
              >&times;
               </span>
              </button>
              <h4 className="modal-title" id="permissionModalLabel">
                <FormattedMessage
                  id="AllocatingResource"
                  defaultMessage="分配资源"
                />({permissionName})
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                {/*表单*/}
                <div className="box box-primary">
                  <div className="box-header with-border">
                  </div>
                  <div className="role-button">
                    <form className="role-form">
                      <button
                        onClick={this.setTest.bind(this)}
                        type="button"
                        className="btn btn-info pull-left"
                        data-toggle="modal"
                        data-target="#PermissionAddResource"
                      >
                        <i className="fa fa-plus-square" />
                        <FormattedMessage
                          id="new"
                          defaultMessage="新建"
                        />
                      </button>
                      <button type="submit" className="btn btn-info pull-left btn-trash" onClick={this.handleClick.bind(this)}><i className="fa fa-trash-o" />
                        <FormattedMessage
                          id="delete"
                          defaultMessage="删除"
                        />
                      </button>
                      <button type="submit" className="btn pull-left btn-default" data-dismiss="modal">
                        <FormattedMessage
                          id="cancel"
                          defaultMessage="取消"
                        />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              <div className="box-body">
                <table id="roles" className="table table-bordered table-hover">
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
                    resources.map((resource) => {
                      return (
                        <tr className="tr-title-space" key={permissionId + resource._id}>
                          <td className="check-box-position">
                            <div className="icheckbox_flat-blue checked" aria-checked="true" aria-disabled="false">
                              <input type="checkbox" onClick={this.toggleChecked.bind(this,resource)} />
                            </div>
                          </td>
                          <td>{resource.name}</td>
                          <td>{resource.type}</td>
                          <td>{resource.desc}</td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <PermissionAddResource
          permissionId={permissionId}
          showresource={resources}
          resourcesId={resourcesId}
          permissionInfo={this.props.permissionInfo}
          setQueryKey={this.setQueryKey.bind(this)}
          queryKey={this.state.queryKey}
          changePageCondition={this.changePageCondition.bind(this)}
          limit={this.state.pageLimit}
          skip={this.state.pageSkip}
        />
      </div>
    );
  }
}

export default PermissionShowResource;
