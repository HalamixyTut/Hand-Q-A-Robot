import React from 'react'
import { FormattedMessage, intlShape } from 'react-intl';
import Validator from '../utils/validator';
import {handleSbumit as Submit} from '../utils/common'
import {SelectOptions} from '../utils/select_options';

class AddRoom extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      roomName: '',
      roomType: 'public',
      saveTime: 30,
      notExist: true,
    };
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  // 点击保存，更新往集合中插入数据
  handleSbumit(e) {
    Submit(this, 'rooms.insert', this.state);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;

    return(
      <div
        className="modal fade" id="roomModal" tabIndex="-1"
        role="dialog" aria-labelledby="roomModalLabel"
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
              <h4 className="modal-title" id="roomModalLabel">
                <FormattedMessage
                  id="addRoom"
                  defaultMessage="添加通讯组"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'communication_name'})+formatMessage({id: 'hasExist'}),
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
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="name"
                          defaultMessage="名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.roomName}
                        onChange={this.handleOnChange.bind(this, 'roomName')}
                      />
                      {this.validator.message('roomName', this.state.roomName, 'required',{
                        required: formatMessage({id: 'name'})+formatMessage({id: 'isRequired'}),
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
                        cname="roomType"
                        value={this.state.roomType}
                        onChange={this.handleOnChange.bind(this, 'roomType')}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="msgSaveTime"
                          defaultMessage="消息保留天数"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.saveTime}
                        onChange={this.handleOnChange.bind(this, 'saveTime')}
                      />
                      {this.validator.message('saveTime', this.state.saveTime, 'required|number', {
                        required: formatMessage({id: 'msgSaveTime'})+formatMessage({id: 'isRequired'}),
                        number: formatMessage({id: 'msgSaveTime'})+formatMessage({id: 'isNumber'}),
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

export default AddRoom;
