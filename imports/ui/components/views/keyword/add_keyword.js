import React from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class AddKeyword extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      keywordName: '',
      keywordNum: '',
      keywordNature: '',
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSubmit(e) {
    Submit(this, 'keywords.insert', this.state);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="keywordAdd" tabIndex="-1"
        role="dialog" aria-labelledby="keywordModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title" id="keywordModalLabel">
                <FormattedMessage
                  id="addKeyword"
                  defaultMessage="添加关键字"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'keywordName'})+formatMessage({id: 'hasExist'}),
              })}
            </div>
            <div className="modal-body">
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>
                <form role="form">
                  <div className="box-body">
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="keywordName"
                          defaultMessage="关键字名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.keywordName}
                        onChange={this.handleOnChange.bind(this, 'keywordName')}
                      />
                      {this.validator.message('keywordName', this.state.keywordName, 'required',{
                        required: formatMessage({id: 'keywordName'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="frequency"
                          defaultMessage="频率"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.keywordNum}
                        onChange={this.handleOnChange.bind(this, 'keywordNum')}
                      />
                      {this.validator.message('keywordNum', this.state.keywordNum, 'required|number', {
                        required: formatMessage({id: 'frequency'})+formatMessage({id: 'isRequired'}),
                        number: formatMessage({id: 'frequency'})+formatMessage({id: 'isNumber'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="wordNature"
                          defaultMessage="词性"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.keywordNature}
                        onChange={this.handleOnChange.bind(this, 'keywordNature')}
                      />
                      {this.validator.message('keywordNature', this.state.keywordNature, 'required|char', {
                        required: formatMessage({id: 'wordNature'})+formatMessage({id: 'isRequired'}),
                        char: formatMessage({id: 'wordNature'})+formatMessage({id: 'isChar'}),
                      })}
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
                type="button" className="btn btn-info pull-right" form="keyword-form"
                onClick={this.handleSubmit.bind(this)}
              >
                <FormattedMessage
                  id="save"
                  defaultMessage="保存"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddKeyword;
