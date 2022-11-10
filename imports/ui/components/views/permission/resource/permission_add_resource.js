/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import {Resource} from '../../../../../api/resource/resource';
import Pagination from './pagination';

class PermissionAddResource extends React.Component {
  constructor(props) {
    super(props);

    this.resourceName = React.createRef();

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      isChecked: false,
      resourceList: [],
      nowList: [],
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.resourcesId.length > 0){
      if (this.state.nowList.sort().toString() !== nextProps.resourcesId.sort().toString()){
        this.setState({
          nowList: this.props.resourcesId,
          resourceList: nextProps.resourcesId,
        });
      }
    }
  }

  handleSbumit(e) {
    if(this.state.resourceList.length === 0){
      e.preventDefault();
    }

    if(JSON.stringify(this.props.permissionInfo) !== '{}') {
      Meteor.call('permissions.add.resources', this.props.permissionInfo._id, this.state.resourceList);
    }
  }

  handleSearch(e) {
    e.preventDefault();
    const resourceName = this.resourceName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(resourceName);
    }
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

  changePage(limit, skip) {
    // this.setState({
    //   resourceList: this.state.resourceList,
    // });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  render() {
    let showresource = [];
    if (this.props.showresource.length > 0){
      this.props.showresource.map((resource) => {
        showresource.push(resource._id);
      });
    }

    return(
      <div
        className="modal fade" id="PermissionAddResource" tabIndex="-1"
        role="dialog" aria-labelledby="permissionModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title" id="permissionModalLabel">
                <FormattedMessage
                  id="SelectResource"
                  defaultMessage="选择资源"
                />
              </h4>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                {/*表单*/}
                <div className="box box-primary">
                  <div className="box-header with-border">
                  </div>
                  <div className="role-button">
                    <form>
                      <button type="submit" className="btn btn-info pull-left" onClick={this.handleSbumit.bind(this)}>
                        <FormattedMessage
                          id="save"
                          defaultMessage="保存"
                        />
                      </button>
                      <button type="button" className="btn pull-left btn-default" data-dismiss="modal">
                        <FormattedMessage
                          id="cancel"
                          defaultMessage="取消"
                        />
                      </button>
                    </form>
                  </div>
                  <form className="role-form" onSubmit={this.handleSearch.bind(this)}>
                    <button type="button" className="btn btn-info pull-right" onClick={this.handleSearch.bind(this)}><i className="fa fa-search" />
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
                  </form>
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
                    this.props.resources.map((resource) => {
                      return(
                        <tr className="tr-title-space" key={this.props.permissionId + resource._id}>
                          <td className="check-box-position">
                            <div className="icheckbox_flat-blue checked" aria-checked="true" aria-disabled="false">
                              <input type="checkbox" checked={this.state.resourceList.indexOf(resource._id)>=0 ? true : false} onChange={this.toggleChecked.bind(this,resource)} />
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
              <div className="box-footer">
                <Pagination counts={this.props.counts} changePage={this.changePage.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('resources');
  if(queryKey === '') {
    return{
      resources: Resource.find({},{limit:limit,skip:skip}).fetch(),
      counts: Resource.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');

    return{
      resources: Resource.find({name: regExp},{limit:limit,skip:skip}).fetch(),
      counts: Resource.find({name: regExp}).count(),
    }
  }
})(PermissionAddResource);
