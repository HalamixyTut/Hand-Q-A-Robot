import React from 'react'
import { FormattedMessage, intlShape } from 'react-intl';
import Validator from '../../utils/validator';
import { handleSbumit as Submit } from '../../utils/common'
import { SelectOptions } from '../../utils/select_options';

class AddParty extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      code: '',
      name: '',
      algorithm: 'circle',
      roleName: '',
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSbumit(e) {
    Submit(this, 'third.party.insert', this.state);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;

    return(
      <div
        className="modal fade" id="addPartyModal" tabIndex="-1"
        role="dialog" aria-labelledby="addPartyModal"
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
              <h4 className="modal-title" id="roomModalLabel">添加第三方服务</h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: '编码名称'+formatMessage({id: 'hasExist'}),
              })}
            </div>
            <div className="modal-body">
              {/*表单*/}
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>
                <form role="form">
                  <div className="box-body">
                    <div className="form-group">
                      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                      <label htmlFor="inputEmail1">
                        编码
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.code}
                        onChange={this.handleOnChange.bind(this, 'code')}
                      />
                      {this.validator.message('name', this.state.code, 'required',{
                        required: '编码'+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="name"
                          defaultMessage="名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.name}
                        onChange={this.handleOnChange.bind(this, 'name')}
                      />
                      {this.validator.message('name', this.state.name, 'required',{
                        required: formatMessage({id: 'name'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                      <label htmlFor="inputUserName">
                        算法
                      </label>
                      <SelectOptions
                        cname="customerServiceAlgorithm"
                        value={this.state.algorithm}
                        onChange={this.handleOnChange.bind(this, 'algorithm')}
                      />
                    </div>

                    <div className="form-group">
                      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                      <label htmlFor="inputEmail1">
                        关联角色
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.roleName}
                        onChange={this.handleOnChange.bind(this, 'roleName')}
                      />
                      {this.validator.message('roleName', this.state.roleName, 'required',{
                        required: '关联角色'+formatMessage({id: 'isRequired'}),
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
                type="button" className="btn btn-info pull-right" form="room-form"
                onClick={this.handleSbumit.bind(this)}
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

export default AddParty;
