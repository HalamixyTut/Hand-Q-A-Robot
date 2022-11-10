/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Categorys from './category';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

let uuid = 0;
class QAddKnowledge extends React.Component {
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.categoryPath = React.createRef();
    this.state = {
      keys: [],
      items: [],
      categoryId: '',
      standard: '',
      quill: '',
    };
  }

  componentDidMount() {
    const categoryId = (id) => {
      this.setCategoryId(id)
    };
    let text = '';
    const getLevelText = (node, bool) => {
      if(bool) {
        text = '';
      }
      text = '/' + node.text + text;
      if(node.nodeId === 0) {
        return;
      }else {
        const parentNode = $('#left-tree').treeview('getParent',node.nodeId);
        if(parentNode.nodeId !== 0) {
          getLevelText(parentNode, false);
        }
      }

      return text;
    };

    $('#SelectCategory').click(function(){
      $('#category').modal('hide');
      const node = $('#left-tree').treeview('getSelected');
      let leveltext = getLevelText(node[0], true);
      $('#category-input').val(leveltext);
      categoryId(node[0].id);
    });
  }

  setCategoryId(id) {
    this.setState({
      categoryId: id,
    });
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value});
  }

  handleQuillChange(key, value) {
    this.setState({[key]: value});
  }

  handleAdd() {
    const keys = this.state.keys;
    const nextKeys = keys.concat(uuid);
    uuid++;
    this.setState({keys: nextKeys})
  }

  handleChange(k, e) {
    const items = this.state.items;
    items[k] = e.target.value.trim();

    this.setState({items: items})
  }

  handleRemove(k) {
    const keys = this.state.keys;
    let items = this.state.items;

    items[k] = null;
    this.setState({
      keys: keys.filter(key => key !== k),
      items: items,
    })
  }

  handleSubmit(e) {
    let items = this.state.items;
    items = items.filter(value => value !== null && value !== '');
    const knowledgeInfo = {
      standard: this.state.standard,
      similar: items,
      related: [],
      solution: this.state.quill,
      category: this.state.categoryId,
      categoryPath: this.categoryPath.current.value,
      api: '',
      source: '用户',
    };

    Submit(this, 'knowledges.insert', knowledgeInfo);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    const formItem = this.state.keys.map((k, index) => {
      return (
        <div key={k} className="form-group">
          <label className="col-sm-2 control-label"></label>

          <div className="col-sm-10 form-item">
            <input
              type="text"
              className="form-control"
              placeholder="请输入相似问句..."
              onChange={this.handleChange.bind(this,k)}
            />
            <span>
              <button type="button" className="btn btn-danger"  onClick={this.handleRemove.bind(this,k)}>
                <i className="fa fa-close" />
              </button>
            </span>
          </div>
        </div>
      );
    });

    return (
      <section className="content">
        <div className="row">
          <div className="col-xs-12 knowledge">
            <div className="box box-info">
              <div className="box-header with-border">
                <h3 className="box-title">
                  <i className="fa fa-pencil" />
                  <FormattedMessage
                    id="addeditknowledge"
                    defaultMessage="添加/编辑知识"
                  />
                </h3>
              </div>
              <form className="form-horizontal">
                <div className="box-body">
                  <div className="form-group">
                    <label htmlFor="question" className="col-sm-2 control-label">
                      <FormattedMessage
                        id="StandardQuestions"
                        defaultMessage="标准问句"
                      />
                    </label>

                    <div className="col-sm-10">
                      <FormattedMessage id="pesq">
                        {(txt) => (
                          <input
                            type="text"
                            className="form-control"
                            id="question"
                            value={this.state.standard}
                            onChange={this.handleOnChange.bind(this, 'standard')}
                            placeholder={txt}
                          />
                        )}
                      </FormattedMessage>
                      {this.validator.message('standard', this.state.standard, 'required',{
                        required: formatMessage({id: 'StandardQuestions'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                  </div>
                  {formItem}
                  <div className="form-group">
                    <label className="col-sm-2 control-label"></label>

                    <div className="col-sm-10 col-button">
                      <button type="button" className="btn btn-info pull-left" onClick={this.handleAdd.bind(this)}>
                        <FormattedMessage
                          id="AddSimilarQuestions"
                          defaultMessage="新增相似问句"
                        />
                      </button>
                      <button type="button" className="btn btn-info pull-left">
                        <FormattedMessage
                          id="AddAssociatedProblems"
                          defaultMessage="新增关联问题"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label"></label>

                    <div className="col-sm-10">
                      <ReactQuill
                        className="wysi-text"
                        value={this.state.quill}
                        onChange={this.handleQuillChange.bind(this, 'quill')}
                      />
                      {this.validator.message('quill', this.state.quill.replace(/<[^>]+>/g,'').trim(), 'required',{
                        required: '答案'+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">
                      <FormattedMessage
                        id="ChooseClassification"
                        defaultMessage="选择分类"
                      />
                    </label>

                    <div className="col-sm-10 input-button">
                      <FormattedMessage id="PleaseScategory">
                        {(txt) => (
                          <input
                            id="category-input" ref={this.categoryPath} type="text"
                            className="form-control" placeholder={txt} readOnly="readonly"
                          />
                        )}
                      </FormattedMessage>
                      {this.validator.message('categoryId', this.state.categoryId, 'required',{
                        required: '分类'+formatMessage({id: 'isRequired'}),
                      })}
                      <button
                        type="button" data-toggle="modal" data-target="#qcategory"
                        className="btn btn-info pull-left"
                      >
                        <FormattedMessage
                          id="ChooseClassification"
                          defaultMessage="选择分类"
                        />
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">
                      <FormattedMessage
                        id="APIinterface"
                        defaultMessage="api接口"
                      />
                    </label>

                    <div className="col-sm-10">
                      <select className="form-control">
                        <option></option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="box-footer col-button">
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSubmit.bind(this)}>
                    <FormattedMessage
                      id="saveknowledge"
                      defaultMessage="保存知识点"
                    />
                  </button>
                  <a href="/dashboard/question">
                    <button type="button" className="btn btn-default pull-right" style={{marginRight: '10px'}}>
                      <FormattedMessage
                        id="cancel"
                        defaultMessage="取消"
                      />
                    </button>
                  </a>
                </div>
              </form>

              <Categorys />
            </div>
          </div>
        </div>
      </section>

    );
  }
}

export default QAddKnowledge;
