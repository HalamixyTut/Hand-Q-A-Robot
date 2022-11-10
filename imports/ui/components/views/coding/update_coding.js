import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';

class UpdateCoding extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      name: '',
      codingDesc: '',
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.codingInfo) {
      const {name, desc} = nextProps.codingInfo;
      this.setState({name, codingDesc: desc});
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value});
  }

  // 更新记录
  handleSubmit(e) {
    Submit(this, 'codings.update', {
      id: this.props.codingInfo._id,
      desc: this.state.codingDesc,
    });
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="codingUpdate" tabIndex="-1"
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
                  id="UpdateCode"
                  defaultMessage="更新编码"
                />
              </h4>
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
                        value={this.state.name || ''}
                        readOnly
                      />
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
                        value={this.state.codingDesc || ''}
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

export default UpdateCoding;
