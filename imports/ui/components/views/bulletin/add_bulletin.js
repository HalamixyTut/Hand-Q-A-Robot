import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {Common, handleSbumit as Submit} from '../utils/common';
import {SelectOptions} from '../utils/select_options';

class AddBulletin extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      title: '',
      content: '',
      type: 'newFunction',
      typeText: '新功能发布',
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});

    if (key === 'type') {
      const typeText = Common.getCodeMeaningByValue(this.props.options, event.target.value);
      this.setState({typeText})
    }
  }

  handleSbumit(e) {
    const bulletinInfo = {
      title: this.state.title.trim(),
      content: this.state.content.trim(),
      type: this.state.type,
      typeText: this.state.typeText,
    };

    Submit(this, 'bulletins.insert', bulletinInfo);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="bulletinModal" tabIndex="-1"
        role="dialog" aria-labelledby="bulletinModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content modal-bulletin">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title" id="bulletinModalLabel">
                <FormattedMessage
                  id="AddAnnouncement"
                  defaultMessage="添加公告"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'title'})+formatMessage({id: 'hasExist'}),
              })}
            </div>
            <div className="modal-body">
              {/*表单*/}
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>
                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                <form role="form">
                  <div className="box-body">
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="title"
                          defaultMessage="标题"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.title}
                        onChange={this.handleOnChange.bind(this, 'title')}
                      />
                      {this.validator.message('title', this.state.title, 'required',{
                        required: formatMessage({id: 'title'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="content"
                          defaultMessage="内容"
                        />
                      </label>
                      <textarea
                        className="form-control bulletin-textarea"
                        value={this.state.content}
                        onChange={this.handleOnChange.bind(this, 'content')}
                      >
                      </textarea>
                      {this.validator.message('content', this.state.content, 'required',{
                        required: formatMessage({id: 'content'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="type"
                          defaultMessage="类型"
                        />
                      </label>
                      <SelectOptions
                        cname="bulletinType"
                        value={this.state.type}
                        onChange={this.handleOnChange.bind(this, 'type')}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage
                  id="cancel"
                  defaultMessage="取消"
                />
              </button>
              <button
                type="button" className="btn btn-info pull-right" form="bulletin-form"
                onClick={this.handleSbumit.bind(this)}
              >
                <FormattedMessage
                  id="save_publish"
                  defaultMessage="保存&发布"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddBulletin;
