import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class AddCoding extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      codingName: '',
      codingDesc: '',
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSubmit(e) {
    Submit(this, 'codings.insert', {
      name: this.state.codingName,
      desc: this.state.codingDesc,
    });
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="codingAdd" tabIndex="-1"
        role="dialog" aria-labelledby="codingModalLabel"
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
              <h4 className="modal-title" id="codingModalLabel">
                <FormattedMessage
                  id="addCode"
                  defaultMessage="添加编码"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'code'})+formatMessage({id: 'hasExist'}),
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
                          id="code"
                          defaultMessage="代码"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.codingName}
                        onChange={this.handleOnChange.bind(this, 'codingName')}
                      />
                      {this.validator.message('codingName', this.state.codingName, 'required',{
                        required: formatMessage({id: 'code'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="desc"
                          defaultMessage="描述"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.codingDesc}
                        onChange={this.handleOnChange.bind(this, 'codingDesc')}
                      />
                      {this.validator.message('codingDesc', this.state.codingDesc, 'required',{
                        required: formatMessage({id: 'desc'})+formatMessage({id: 'isRequired'}),
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
                type="button" className="btn btn-info pull-right" form="coding-form"
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

export default AddCoding;
