import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common';
import {SelectOptions} from '../utils/select_options';


class UpdateResource extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      resourceName: '',
      resourceDesc: '',
      resourceType: '',
    };

    this.resourceName = React.createRef();
  }

  componentWillReceiveProps(props) {
    if(props.resourceInfo && Object.keys(props.resourceInfo).length > 0) {
      const resourceName = props.resourceInfo.name;
      const resourceDesc = props.resourceInfo.desc;
      const resourceType = props.resourceInfo.type;
      this.setState({resourceName, resourceDesc, resourceType});
    }
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value});
  }

  // 更新记录
  handleSubmit(e) {
    Submit(this, 'resources.update', {
      id: this.props.resourceInfo._id,
      type: this.state.resourceType,
      desc: this.state.resourceDesc,
    });
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="resourceUpdate" tabIndex="-1"
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
                  id="updateResource"
                  defaultMessage="更新资源"
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
                          id="resName"
                          defaultMessage="资源名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.resourceName}
                        readOnly
                      />
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

export default UpdateResource;
