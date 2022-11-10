import React from 'react';
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';
import {SelectOptions} from '../utils/select_options';

class AddResource extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      resourceName: '',
      resourceDesc: '',
      resourceType: 'button',
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSubmit(e) {
    Submit(this, 'resources.insert', {
      name: this.state.resourceName.trim(),
      type: this.state.resourceType,
      desc: this.state.resourceDesc.trim(),
    });
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="resourceAdd" tabIndex="-1"
        role="dialog" aria-labelledby="resourceModalLabel"
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
              <h4 className="modal-title" id="resourceModalLabel">
                <FormattedMessage
                  id="addResource"
                  defaultMessage="添加资源"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'resName'})+formatMessage({id: 'hasExist'}),
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
                          id="resName"
                          defaultMessage="资源名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.resourceName}
                        onChange={this.handleOnChange.bind(this, 'resourceName')}
                      />
                      {this.validator.message('resourceName', this.state.resourceName, 'required',{
                        required: formatMessage({id: 'resName'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="resType"
                          defaultMessage="资源类型"
                        />
                      </label>
                      <SelectOptions
                        cname="resourceType"
                        value={this.state.resourceType}
                        onChange={this.handleOnChange.bind(this, 'resourceType')}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="resDesc"
                          defaultMessage="资源描述"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.resourceDesc}
                        onChange={this.handleOnChange.bind(this, 'resourceDesc')}
                      />
                      {this.validator.message('resourceDesc', this.state.resourceDesc, 'required',{
                        required: formatMessage({id: 'resDesc'})+formatMessage({id: 'isRequired'}),
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
                type="button" className="btn btn-info pull-right" form="resource-form"
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

export default AddResource;
