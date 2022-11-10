import React from 'react'
import {FormattedMessage, intlShape} from 'react-intl';
import Validator from '../../utils/validator';
import {handleSbumit as Submit} from '../../utils/common';

class AddCrontab extends React.Component{
  static contextTypes = {
    intl: intlShape,
  };

  constructor() {
    super();

    this.validator = new Validator();
    this.state = {
      cronName: '',
      desc: '',
      plan: '',
      expr: '',
      notExist: true,
    };
    this.className = React.createRef();
  }

  handleOnChange(key, event) {
    this.setState({[key]: event.target.value, notExist: true});
  }

  handleSbumit(e) {
    const crontabInfo = {
      cronName: this.state.cronName,
      description: this.state.desc,
      className: this.className.current.value.trim(),
      expression: this.state.expr,
      plan: this.state.plan,
    };
    Submit(this, 'crontabs.insert', crontabInfo);
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    return(
      <div
        className="modal fade" id="crontabModal" tabIndex="-1"
        role="dialog" aria-labelledby="crontabModalLabel"
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
              <h4 className="modal-title" id="crontabModalLabel">
                <FormattedMessage
                  id="add_cron_task"
                  defaultMessage="添加Cron任务"
                />
              </h4>
              {this.validator.message('notExist', this.state.notExist, 'accepted',{
                accepted: formatMessage({id: 'taskname'})+formatMessage({id: 'hasExist'}),
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
                          id="taskname"
                          defaultMessage="任务名称"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.cronName}
                        onChange={this.handleOnChange.bind(this, 'cronName')}
                      />
                      {this.validator.message('cronName', this.state.cronName, 'required',{
                        required: formatMessage({id: 'taskname'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="taskdesc"
                          defaultMessage="任务描述"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.desc}
                        onChange={this.handleOnChange.bind(this, 'desc')}
                      />
                      {this.validator.message('desc', this.state.desc, 'required',{
                        required: formatMessage({id: 'taskdesc'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="tasktype"
                          defaultMessage="任务类名"
                        />
                      </label>
                      <select className="form-control" defaultValue="" ref={this.className}>
                        <option value="crontab.searchEngine">
                          crontab.searchEngine
                        </option>
                        <option value="crontab.searchEngine.block">
                          crontab.searchEngineBlock
                        </option>
                        <option value="crontab.hismsSendMail">
                          crontab.hismsSendMail
                        </option>
                        <option value="crontab.spider">
                          crontab.spider
                        </option>
                        <option value="crontab.clearRoomHistory">
                          crontab.clearRoomHistory
                        </option>
                        <option value="crontab.clearKefuHistory">
                          crontab.clearKefuHistory
                        </option>
                        <option value="crontab.customerServiceAlgorithm">
                          crontab.customerServiceAlgorithm
                        </option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="executionplan"
                          defaultMessage="执行计划"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.plan}
                        onChange={this.handleOnChange.bind(this, 'plan')}
                      />
                      {this.validator.message('plan', this.state.plan, 'required',{
                        required: formatMessage({id: 'executionplan'})+formatMessage({id: 'isRequired'}),
                      })}
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputUserName">
                        <FormattedMessage
                          id="Cronexpression"
                          defaultMessage="Cron表达式"
                        />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={this.state.expr}
                        onChange={this.handleOnChange.bind(this, 'expr')}
                      />
                      {this.validator.message('expr', this.state.expr, 'required',{
                        required: formatMessage({id: 'Cronexpression'})+formatMessage({id: 'isRequired'}),
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
                type="button" className="btn btn-info pull-right" form="crontab-form"
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

export default AddCrontab;
