import React from 'react';
import {Meteor} from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';

class ShowRecord extends React.Component {
  constructor() {
    super();
    this.queryKey = React.createRef();
    this.state = {
      records: [],
      rawData: [],
    }
  }

  componentDidMount() {
    const setState = (result) => {
      this.setState({
        records: result,
        rawData: result,
      });
    };

    Meteor.call('records.search', function (err, result) {
      if(!err) {
        setState(result) ;
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();
    const keyWord = this.queryKey.current.value.trim();
    const regExp = new RegExp(keyWord);
    if(keyWord === '') {
      this.setState({
        records: this.state.rawData,
      });

      return;
    }

    let records = [];
    for(let eachItem of this.state.records) {
      if(regExp.test(eachItem.name)) {
        records.push(eachItem)
      }
    }
    this.setState({
      records: records,
    });
  }

  render() {
    return(
      <div className="col-xs-12">
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="scheduleTask"
                defaultMessage="计划任务"
              />
              /
              <FormattedMessage
                id="ExecutionRecords"
                defaultMessage="执行记录"
              />
            </h3>
          </div>
          <div className="box-header">
            <form className="role-form" onSubmit={this.handleSearch.bind(this)}>
              <button type="button" className="btn btn-info pull-right" onClick={this.handleSearch.bind(this)}><i className="fa fa-search" />
                <FormattedMessage
                  id="search"
                  defaultMessage="查询"
                />
              </button>
              <FormattedMessage id="taskname">
                {(txt) => (
                  <input
                    type="text" ref={this.queryKey} className="pull-right find-input"
                    placeholder={txt}
                  />
                )}
              </FormattedMessage>
            </form>
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="taskname"
                    defaultMessage="任务名称"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="starttime"
                    defaultMessage="开始时间"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="endtime"
                    defaultMessage="结束时间"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.state.records.map((record, index) => {
                  return(
                    <tr key={index}>
                      <td className="check-box-position">
                        <input
                          type="checkbox"
                        />
                      </td>
                      <td>{record.name}</td>
                      <td>{new Date(record.startedAt).toLocaleString()}</td>
                      <td>{new Date(record.finishedAt).toLocaleString()}</td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default ShowRecord;
