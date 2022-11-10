/* eslint-disable import/no-unresolved */
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import ListKnowledge from './list_knowledge';
import {Knowledge} from '../../../../../api/knowledge/knowledges';
import {Category} from '../../../../../api/category/categorys';
import Pagination from '../../utils/pagination';
import DownloadKnowledge from './download_knowledge';
import {handleDelete as Delete} from '../../utils/common';
import {DialogUpdate} from '../../utils/modal_dialog'

class KnowledgePoints extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      knowledgeList: [],
      pageStart: false,
      pageEnd: false,
      isRender: true,
      allCount: 0,
      searchKey: props.searchKey || '',
      selectedNodeId: props.selectedNodeId || 0,
      clearCheck: false,
    };
  }

  componentDidMount() {
    fetch('/api/category/tree',{
      method:'GET',
      headers:{
        'Content-Type':'application/json;charset=UTF-8',
      },
      mode:'cors',
      cache:'default',
    })
      .then(res =>res.json())
      .then((data) => {
        if(this.state.isRender) {
          const self = this;

          $('#left-tree').treeview({
            data: data,
            levels: 2,
            showCheckbox:false,//是否显示多选
          });

          this.randerSelectedNode();
          this.setState({
            isRender: false,
          });

          $('#left-tree').click(function(){
            const node = $('#left-tree').treeview('getSelected');

            if(node.length > 0) {
              if(node[0].nodeId === 0) {
                self.changeCategoryId('');
              }else {
                self.changeCategoryId(node[0].id);
              }

              self.changePage(10,0);
              self.changePageStartEnd();
              self.changeSelectedNode(node[0].nodeId)
            }
          });
        }
      })
    const self = this;

    Meteor.call('kg.count', function (err, result) {
      if (!err){
        self.setState({
          allCount: result,
        });
      }
    });
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  getCategoryIds(categoryId) {
    let currentCategory, resData = [];
    currentCategory = this.props.categorys.find((c) => c._id === categoryId);


    if(currentCategory) {
      resData.push(currentCategory._id);
      if(currentCategory.subClass.length > 0) {
        for(let eachItem of currentCategory.subClass) {
          resData = [...this.getCategoryIds(eachItem.id), ...resData];
        }
      }
    } else {
      return [];
    }

    return resData;
  }

  changeCategoryId(categoryId) {
    let ids = '';
    if(categoryId) {
      ids = this.getCategoryIds(categoryId);
    }

    if(this.props.searchCategoryId) {
      this.props.searchCategoryId(ids);
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      pageStart: false,
      pageEnd: false,
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  changePageStartEnd() {
    this.setState({
      pageStart: true,
      pageEnd: true,
    });
  }

  changeSelectedNode(nodeId) {
    if(this.props.changeSelectedNode) {
      this.props.changeSelectedNode(nodeId)
    }
  }

  //渲染选中的节点
  randerSelectedNode() {
    const selectedNodeId = this.state.selectedNodeId;
    let nodes = [];
    //获取选中的节点的父节点集合
    const expandNode = (nodeId) => {
      const parentNode = $('#left-tree').treeview('getParent',nodeId);
      nodes.push(nodeId);
      if(parentNode.nodeId === 0) {
        return;
      }else {
        expandNode(parentNode.nodeId)
      }
    };
    if(selectedNodeId === 0 ) {
      $('#left-tree').treeview('selectNode', [selectedNodeId, {silent: true}]);
      return
    } else {
      expandNode(selectedNodeId);
    }

    if(nodes.length > 1) {
      for(let i = nodes.length -1; i >= 0 ; i--) {
        $('#left-tree').treeview('expandNode', [nodes[i], {silent: true}]);
      }
    }
    $('#left-tree').treeview('selectNode', [this.state.selectedNodeId, {silent: true}]);
  }

  handleNewKnowledge(number) {
    if(this.props.changePageNum) {
      this.props.changePageNum(number)
    }
  }

  handleKnowledgeList(knowledgeList) {
    let flag = 0;

    for (let eachItem of this.state.knowledgeList) {
      if (eachItem.knowledgeInfo._id === knowledgeList.knowledgeInfo._id) {
        this.state.knowledgeList.splice(this.state.knowledgeList.indexOf(eachItem), 1);
        this.setState({
          knowledgeList: this.state.knowledgeList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.knowledgeList.push(knowledgeList);

      this.setState({
        knowledgeList: this.state.knowledgeList,
      });
    }
  }

  handleOnChange(searchKey, event) {
    this.setState({[searchKey]: event.target.value})
  }

  handleUpdateKnowledge() {
    if(this.state.knowledgeList.length > 1 ){
      $('#modal-default').modal('show');
    }else if(this.state.knowledgeList.length === 1 ){
      if(this.props.updateKnowledgeInfo){
        this.props.updateKnowledgeInfo(this.state.knowledgeList);
      }
    }
  }

  handleUpdateKnowledge1(knowledgeInfo) {
    if(this.props.updateKnowledgeInfo1){
      this.props.updateKnowledgeInfo1(knowledgeInfo);
    }
  }

  handleDeleteKnowledge(e) {
    // Meteor.call('knowledges.delete', this.state.knowledgeList);
    Delete('knowledges.delete', this.state.knowledgeList, this, 'knowledgeList');
  }

  handleSearchClick(e) {
    e.preventDefault();
    let searchKey = this.state.searchKey.trim();
    this.changePage(10,0);
    this.changePageStartEnd();
    if(this.props.searchCategoryId && this.props.changeSearchKey) {
      this.props.changeSearchKey(searchKey);
    }

    if (this.props.knowledges.length >0) {
      this.setState({knowledgeList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  changeClear = () => this.setState({clearCheck: false});

  render(){
    return (
      <div className="col-xs-12 tree-content">
        <div className="col-xs-2 box class-box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="KnowledgeClassification"
                defaultMessage="知识分类"
              />
            </h3>
          </div>
          <div id="left-tree"></div>
        </div>

        <div className="box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="knowledgeMap"
                defaultMessage="知识图谱"
              />
              /
              <FormattedMessage
                id="KnowledgeMaintenance"
                defaultMessage="知识维护"
              />
              {this.props.categoryIds ? `(${this.props.countNum})` : this.state.allCount ? `(${this.state.allCount})` : ''}
            </h3>
            {
              Session.get('permission').includes('knowledge_btn_download') ?
              <DownloadKnowledge allknowledges={this.props.knowledges} /> : null
            }
            {
              Session.get('permission').includes('knowledge_btn_upload') ?
              <button
                type="button"
                className="btn btn-info pull-right"
                style={{marginRight:10}}
                onClick={this.handleNewKnowledge.bind(this,1004)}
              >
                <i className="fa fa-upload" />
                <FormattedMessage
                  id="uploadKnowledge"
                  defaultMessage="上传知识点"
                />
              </button> : null
            }
          </div>
          <div className="box-header">
            <div className="role-button">
              <form role="form">
                {
                  Session.get('permission').includes('knowledge_btn_c') ?
                  <button type="button" className="btn btn-info pull-left" onClick={this.handleNewKnowledge.bind(this,1002)}>
                    <i className="fa fa-plus-square" />
                    <FormattedMessage
                      id="new"
                      defaultMessage="新建"
                    />
                  </button> : null
                }
                {
                  Session.get('permission').includes('knowledge_btn_u') ?
                  <button
                    type="button"
                    className="btn btn-info pull-left btn-edit"
                    onClick={this.handleUpdateKnowledge.bind(this)}
                  >
                    <i className="fa fa-edit" />
                    <FormattedMessage
                      id="update"
                      defaultMessage="更新"
                    />
                  </button> : null
                }
                {
                  Session.get('permission').includes('knowledge_btn_d') ?
                  <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDeleteKnowledge.bind(this)}><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                  </button> : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('knowledge_btn_r') ?
              <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                  <FormattedMessage
                    id="search"
                    defaultMessage="查询"
                  />
                </button>
                <FormattedMessage id="KnowledgeQuestions">
                  {(txt) => (
                    <input
                      type="text"
                      value={this.state.searchKey}
                      className="pull-right find-input"
                      placeholder={txt}
                      onChange={this.handleOnChange.bind(this, 'searchKey')}
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
                    id="StandardQuestions"
                    defaultMessage="标准问句"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="QuestionNum"
                    defaultMessage="问句数量"
                  />
                </th>
                {/*待定后续开发*/}
                {/*<th>
                  <FormattedMessage
                      id='answer'
                      defaultMessage='答案'
                    />答案
                </th>
                <th>
                  <FormattedMessage
                      id='source'
                      defaultMessage='来源'
                    />来源
                </th>*/}
              </tr>
              </thead>
              <tbody>
              {
                this.props.knowledges.map((question) => {
                  return(
                    <ListKnowledge
                      key={question._id}
                      question={question}
                      dealKnowledgeList={this.handleKnowledgeList.bind(this)}
                      dealKnowledgeList1={this.handleUpdateKnowledge1.bind(this)}
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
            <Pagination count={this.props.countNum} changePage={this.changePage.bind(this)} />
          </div>
        </div>
        <DialogUpdate />
      </div>
    );
  }
}

export default withTracker(({categoryIds, searchKey, limit, skip}) => {
  Meteor.subscribe('knowledges');
  Meteor.subscribe('categorys');

  const regExp = new RegExp(searchKey, 'i');
  return {
    knowledges: categoryIds ? Knowledge.find({category:{$in: categoryIds },standard: regExp}, {limit: limit, skip: skip}).fetch() : Knowledge.find({standard: regExp}, {limit: limit, skip: skip}).fetch(),
    countNum: categoryIds? Knowledge.find({category:{$in: categoryIds },standard: regExp}).count() : Knowledge.find({standard: regExp}).count(),
    rootCategory: Category.find({name: '所有分类'}).fetch(),
    categorys: Category.find({}).fetch(),
  };
})(KnowledgePoints);

