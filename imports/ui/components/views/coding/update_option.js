import React from 'react'
import {Meteor} from 'meteor/meteor';
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';

class UpdateOption extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      name: '',
      optionMean: '',
      optionDesc: '',
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.optionInfo) {
      const {name, mean, desc} = nextProps.optionInfo;
      this.setState({name, optionMean: mean, optionDesc: desc});
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value});
  }

  // 更新记录
  handleSubmit(e) {
    if(this.validator.allValid()){
      const self = this;
      const optionInfo = {
        id: this.props.optionInfo._id,
        mean: this.state.optionMean.trim(),
        desc: this.state.optionDesc.trim(),
      };
      Meteor.call('options.update', optionInfo, function (err, result) {
        if(!err) {
          $('#optionUpdate').modal('hide');
          self.setState({
            optionMean: '',
            optionDesc: '',
          }, ()=>{
            self.validator.hideMessage();
          });
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
        className="modal fade" id="optionUpdate" tabIndex="-1"
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
              <h4 className="modal-title" id="optionModalLabel">
                <FormattedMessage
                  id="updateValue"
                  defaultMessage="更新值"
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
                          id="valueName"
                          defaultMessage="值名称"
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
                          id="valueMeaning"
                          defaultMessage="值含义"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.optionMean || ''}
                        onChange={this.handleOnChange.bind(this, 'optionMean')}
                      />
                      {this.validator.message('optionMean', this.state.optionMean, 'required',{
                        required: '含义'+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="valueDesc"
                          defaultMessage="值描述"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.optionDesc || ''}
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
              <button type="submit" className="btn btn-info pull-right" onClick={this.handleSubmit.bind(this)}>
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

export default UpdateOption;
