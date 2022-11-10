import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FormattedMessage } from 'react-intl';
import AddCategory from './add_category';
import UpdateCategory from './update_category';
import DeleteCategory from './delete_category';
import Prompt from './promtp';
import {DialogUpdate} from '../../utils/modal_dialog'

class KgCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categorys: this.props.categorys || '',
      currentSelectedNodeId: -1,
      currentSelectedParentNodeId: -1,
      isExtend: true,
    }
  }

  componentDidMount() {
    const categorys = this.state.categorys;
    let resCategoryIds = [];
    const getDeleteCategoryIds = (node) => {
      resCategoryIds.push(node.id);

      if(node.nodes) {
        for(let eachItem of node.nodes) {
          getDeleteCategoryIds(eachItem)
        }
      }else {
        return resCategoryIds;
      }
      return resCategoryIds;
    };

    const setNodeId = (nodeId) => {
      this.setState({
        currentSelectedNodeId: nodeId,
      });
    };

    const setState = (value) => {
      this.setState({
        isExtend: value,
      })
    };

    const setParentNodeId = (nodeId) => {
      this.setState({
        currentSelectedParentNodeId: nodeId,
      })
    };

    $(function(){
      // eslint-disable-next-line no-use-before-define
      onLoad();

      // eslint-disable-next-line no-use-before-define
      BindEvent();
      //页面加载
      function onLoad() {
        //渲染树
        $('#left-tree').treeview({
          data: categorys,
          levels: 2,
          onNodeSelected:function(event, node){
            $('#editName').val(node.text);
          },
          showCheckbox:false,//是否显示多选
        });

        $('#left-tree').click(function(){
          const node = $('#left-tree').treeview('getSelected');
          if(node.length > 0) {
            setNodeId(node[0].nodeId);
          }
        });
      }
      //事件注册
      function BindEvent() {
        //保存-新增
        $('#Save').click(function () {
          // $('#addOperation-dialog').modal('hide');
          //静态添加节点
          const parentNode = $('#left-tree').treeview('getSelected');
          const node = {
            text: $('#addName').val(),
          };
          if(node.text === '') {
            $('#category-node-null').modal('show');
            return;
          }
          let subNodes = parentNode[0].nodes;
          if(subNodes) {
            for(let eachItem of subNodes) {
              if(eachItem.text === node.text) {
                $('#category-node-repeat').modal('show');
                return;
              }
            }
          }

          const newCategoryId = new Mongo.ObjectID()._str;
          const categoryInfo = {
            id: newCategoryId,
            name: node.text,
            subClass: [],
          };

          Meteor.call('categorys.insert',categoryInfo);
          Meteor.call('categorys.addupdate',parentNode[0].id, categoryInfo);

          setState(true);
        });

        //保存-编辑
        $('#Edit').click(function(){
          $('#updateOperation-dialog').modal('hide');
          const node = $('#left-tree').treeview('getSelected');
          const parentNode = $('#left-tree').treeview('getParent',node[0].nodeId);

          const newNode={
            text:$('#editName').val(),
          };
          if(newNode.text === '') {
            $('#category-node-null').modal('show');
            return;
          }
          let subNodes = parentNode.nodes;
          if(subNodes) {
            for(let eachItem of subNodes) {
              if(eachItem.text === newNode.text) {
                $('#category-node-repeat').modal('show');
                return;
              }
            }
          }

          Meteor.call('categorys.update',node[0].id, newNode.text);
          setState(true);
        });

        //刪除
        $('#Delete').click(function () {
          const node = $('#left-tree').treeview('getSelected');
          const parentNode = $('#left-tree').treeview('getParent',node[0].nodeId);
          let categoryIds = getDeleteCategoryIds(node[0]);

          Meteor.call('categorys.deleteupdate',parentNode.id, node[0].id);
          for(let eachItem of categoryIds) {
            Meteor.call('categorys.delete', eachItem);
          }
          setState(false);
          setParentNodeId(parentNode.nodeId);
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    let nodes = [];
    const expandNode = (nodeId) => {
      const parentNode = $('#left-tree').treeview('getParent',nodeId);
      nodes.push(nodeId);
      if(parentNode.nodeId === 0) {
        return;
      }else {
        expandNode(parentNode.nodeId)
      }
    };
    //重新渲染树
    $('#left-tree').treeview({
      data: nextProps.categorys,
      levels: 2,
      onNodeSelected:function(event, node){
        $('#editName').val(node.text);
      },
      showCheckbox:false,//是否显示多选
    });

    if(this.state.isExtend && this.state.currentSelectedNodeId > -1) {
      if(this.state.currentSelectedNodeId > 0) {
        expandNode(this.state.currentSelectedNodeId);
      }
      if(nodes.length > 0) {
        for(let i = nodes.length -1; i >= 0 ; i--) {
          $('#left-tree').treeview('expandNode', [nodes[i], { levels: 1, silent: true } ]);
        }
      }
      $('#left-tree').treeview('selectNode', [ this.state.currentSelectedNodeId, { levels: 1, silent: true } ]);
    }

    if(!this.state.isExtend && this.state.currentSelectedParentNodeId > -1) {
      if(this.state.currentSelectedParentNodeId > 0) {
        expandNode(this.state.currentSelectedParentNodeId);

        if(nodes.length > 0) {
          for(let i = nodes.length -1; i >= 0 ; i--) {
            $('#left-tree').treeview('expandNode', [nodes[i], { levels: 1, silent: true } ]);
          }
          $('#left-tree').treeview('selectNode', [this.state.currentSelectedParentNodeId, { levels: 1, silent: true } ]);
        }
      } else {
        $('#left-tree').treeview('selectNode', [this.state.currentSelectedParentNodeId, { levels: 1, silent: true } ]);
      }
    }

    this.setState({
      categorys: nextProps.categorys || '',
    })
  }

  componentWillUpdate() {
    const setNodeId = (nodeId) => {
      this.setState({
        currentSelectedNodeId: nodeId,
      });
    };
    $('#left-tree').click(function(){
      const node = $('#left-tree').treeview('getSelected');
      if(node.length > 0) {
        setNodeId(node[0].nodeId);
      }
    });
  }

  componentDidUpdate() {
    //显示-添加
    $('#btnAdd').click(function(){
      const node = $('#left-tree').treeview('getSelected');
      if (node.length == 0) {
        $('#promptOperation-dialog').modal('show');
        return;
      }
      $('#addName').val('');
      $('#addOperation-dialog').modal('show');
    });

    //显示-update
    $('#btnUpdate').click(function(){
      const node = $('#left-tree').treeview('getSelected');
      if (node.length == 0) {
        $('#promptOperation-dialog').modal('show');
        return;
      }
      $('#updateOperation-dialog').modal('show');
    });
    //删除
    $('#btnDel').click(function(){
      const node = $('#left-tree').treeview('getSelected');
      if (node.length == 0) {
        $('#promptOperation-dialog').modal('show');
        return;
      }
      if(node[0].nodeId == 0) {
        $('#category-node-delete').modal('show');
        return;
      }
      $('#deleteOperation-dialog').modal('show');
    });
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  render() {
    return(
      <div className="col-xs-12">
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="knowledgeMap"
                defaultMessage="知识图谱"
              />
              /
              <FormattedMessage
                id="KnowledgeClassification"
                defaultMessage="知识分类"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form>
                {
                  Session.get('permission').includes('category_btn_c') ?
                  <button
                    id="btnAdd" name="category_btn_c" type="button"
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
                  Session.get('permission').includes('category_btn_u') ?
                  <button
                    id="btnUpdate"
                    name="category_btn_u"
                    type="button"
                    className="btn btn-info pull-left btn-edit"
                  >
                    <i className="fa fa-edit" />
                    <FormattedMessage
                      id="update"
                      defaultMessage="更新"
                    />
                  </button> : null
                }
                {
                  Session.get('permission').includes('category_btn_d') ?
                    <button
                      id="btnDel" name="category_btn_d" type="button"
                      className="btn btn-info pull-left btn-trash"
                    ><i className="fa fa-trash-o" />
                    <FormattedMessage
                      id="delete"
                      defaultMessage="删除"
                    />
                    </button> : null
                }
              </form>
            </div>
          </div>
          <div className="box-body">
            <div id="left-tree"></div>
          </div>
          <AddCategory />
          <UpdateCategory />
          <DeleteCategory />
          <Prompt />

          <DialogUpdate id="category-node-null" messageId="nodeNOtNull" />
          <DialogUpdate id="category-node-repeat" messageId="nodtNotRepeat" />
          <DialogUpdate id="category-node-delete" messageId="rootNode" />
        </div>
      </div>
    );
  }
}

export default KgCategory;

