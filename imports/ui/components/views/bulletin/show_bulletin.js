import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Bulletin } from '../../../../api/bulletin/bulletins';
import ListBulletin from './listBulletin';
import Pagination from '../utils/pagination';
import {handleDelete as Delete} from '../utils/common';
import {DialogUpdate} from '../utils/modal_dialog'

class ShowBulletin extends React.Component {
  constructor() {
    super();
    this.queryKey = React.createRef();
    this.state = {
      bulletinList: [],
      clearCheck: false,
    }
  }

  // 处理子组件传递过来的被点击的记录
  dealList(bulletin) {
    let flag = 0;

    for(let eachItem of this.state.bulletinList) {
      if(eachItem.bulletinId === bulletin.bulletinId) {
        this.state.bulletinList.splice(this.state.bulletinList.indexOf(eachItem),1);
        this.setState({
          bulletinList: this.state.bulletinList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.bulletinList.push(bulletin);

      this.setState({
        bulletinList: this.state.bulletinList,
      });
    }
  }

  changePage(limit, skip) {
    this.setState({
      bulletinList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  handleUpdate() {
    if(this.state.bulletinList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.bulletinList.length === 1 ){
      if(this.props.setUpdateInfo){
        this.props.setUpdateInfo(this.state.bulletinList)
      }
      $('#bulletinUpdate').modal('show');
    }
  }

  handleDelete() {
    Delete('bulletins.delete', this.state.bulletinList, this, 'bulletinList');
  }

  handleSearch(e) {
    e.preventDefault();
    const queryKey = this.queryKey.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(queryKey);
    }

    if (this.props.bulletins.length >0) {
      this.setState({bulletinList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
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
                id="BulletinManagement"
                defaultMessage="公告管理"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form role="form" id="bulletin-form">
                {
                  Session.get('permission').includes('bulletin_btn_c') ?
                  <button
                    type="button" data-toggle="modal" data-target="#bulletinModal"
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
                  Session.get('permission').includes('bulletin_btn_u') ?
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
                  Session.get('permission').includes('bulletin_btn_d') ?
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
              Session.get('permission').includes('bulletin_btn_r') ?
                <form className="role-form" onSubmit={this.handleSearch.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearch.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="AnnouncementTitle">
                    {(txt) => (
                      <input
                        type="text" ref={this.queryKey} className="pull-right find-input"
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
                    id="AnnouncementTitle"
                    defaultMessage="公告标题"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="AnnouncementContent"
                    defaultMessage="公告内容"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="type"
                    defaultMessage="类型"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="ReleaseTime"
                    defaultMessage="发布时间"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.bulletins.map((bulletin) => {
                  return(
                    <ListBulletin
                      key={bulletin._id}
                      bulletin={bulletin}
                      dealList={this.dealList.bind(this)}
                      options={this.props.options}
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
  Meteor.subscribe('bulletins');

  if(queryKey === '') {
    return {
      bulletins: Bulletin.find({},{limit:limit,skip:skip}).fetch(),
      counts:Bulletin.find().count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return {
      bulletins: Bulletin.find({title: regExp},{limit:limit,skip:skip}).fetch(),
      counts:Bulletin.find({title: regExp}).count(),
    }
  }

})(ShowBulletin);
