import React from 'react'
import {Meteor} from 'meteor/meteor';
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';

class AddOption extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      optionName: '',
      optionMean: '',
      optionDesc: '',
      notExist: true,
    };
  }

 handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSubmit(e) {
    if(this.validator.allValid()){
      const self = this;
      const optionInfo = {
        cname: this.props.cname,
        name: this.state.optionName.trim(),
        mean: this.state.optionMean.trim(),
        desc: this.state.optionDesc.trim(),
      };
      Meteor.call('options.insert', optionInfo, function (err, result) {
        if(!err) {
          if(result === 'Exist') {
            self.setState({notExist: false}, ()=>{
              self.validator.showMessage();
              self.forceUpdate();
            });
          } else {
            $('#optionAdd').modal('hide');
            self.setState({
              optionName: '',
              optionMean: '',
              optionDesc: '',
              notExist: true,
            }, ()=>{
              self.validator.hideMessage();
            });
          }
        }
      });
    } else {
      this.validator.showMessage();
      this.forceUpdate();
    }
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="optionAdd" tabIndex="-1"
        role="dialog" aria-labelledby="optionModalLabel"
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
              {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
              <h4 className="modal-title" id="optionModalLabel">
                添加值
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: '值'+formatMessage({id: 'hasExist'}),
              })}
            </div>
            <div className="modal-body">
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>
                <form onSubmit={this.handleSubmit.bind(this)}>
                  <div className="box-body">
                    <div className="form-group">
                      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                      <label htmlFor="inputEmail1">
                        值
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.optionName}
                        onChange={this.handleOnChange.bind(this, 'optionName')}
                      />
                      {this.validator.message('optionName', this.state.optionName, 'required',{
                        required: 'value'+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                      <label htmlFor="inputUserName">
                        含义
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.optionMean}
                        onChange={this.handleOnChange.bind(this, 'optionMean')}
                      />
                      {this.validator.message('optionMean', this.state.optionMean, 'required',{
                        required: '含义'+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                      <label htmlFor="inputUserName">
                        描述
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.optionDesc}
                        onChange={this.handleOnChange.bind(this, 'optionDesc')}
                      />
                      {this.validator.message('optionDesc', this.state.optionDesc, 'required',{
                        required: '描述'+formatMessage({id: 'isRequired'}),
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
              <button type="button" className="btn btn-info pull-right" onClick={this.handleSubmit.bind(this)}>
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

export default AddOption;
