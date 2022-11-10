/*eslint-disable react/no-unused-state*/
import React from 'react';
import {Meteor} from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import { withTracker } from 'meteor/react-meteor-data';
import {Knowledge} from '../../../../api/knowledge/knowledges';
import Pagination from '../utils/pagination';
import ListAllKnowledge from './list_allknowledge';
import {DialogUpdate} from '../utils/modal_dialog'

class addSameKnowledge extends React.Component{
  constructor() {
    super();
    this.knowledgeName = React.createRef();

    this.state = {
      knowledgeList: [], // 存储用于更新或删除的记录
      questionInfo: {},
      records: [],
      questions: [],
    }
  }

  handleSearchClick(e) {
    e.preventDefault();

    const knowledgeName = this.knowledgeName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(knowledgeName);
    }
  }

  changePage(limit, skip) {
    this.setState({
      knowledgeList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  render() {
    return(
      <div
        className="modal fade" id="addSameKnowledge" tabIndex="-1"
        role="dialog" aria-labelledby="knowledgeModalLabel"
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
              <h4 className="modal-title" id="knowledgeModalLabel">
                <FormattedMessage
                  id="RecordSimilarityQuestion"
                  defaultMessage="记录相似问题"
                />
              </h4>
            </div>
            <div className="modal-body">
              <div className="box box-primary">
                <div className="box-header with-border">
                  <form className="role-form" onSubmit={this.handleSearchClick.bind(this)}>
                    <button type="button" className="btn btn-default" data-dismiss="modal">
                      <FormattedMessage
                        id="cancel"
                        defaultMessage="取消"
                      />
                    </button>
                    <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                      <FormattedMessage
                        id="search"
                        defaultMessage="查询"
                      />
                    </button>
                    <FormattedMessage id="knowledgename">
                      {(txt) => (
                        <input
                          type="text" ref={this.knowledgeName} className="pull-right find-input"
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
                      <th>
                        <FormattedMessage
                          id="QuestionName"
                          defaultMessage="问题名称"
                        />
                      </th>
                      <th>
                        <FormattedMessage
                          id="RecordProblem"
                          defaultMessage="记录到该问题"
                        />
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                      this.props.knowledges.map((knowledge) => {
                        return(
                          <ListAllKnowledge
                            key={knowledge._id}
                            knowledge={knowledge}
                            questionName={this.props.questionName}
                          />
                        );
                      })
                    }
                    </tbody>
                  </table>
                </div>
                <div className="box-footer">
                  <Pagination count={this.props.counts} changePage={this.changePage.bind(this)} />
                </div>
              </div>

              <DialogUpdate id="list-know-success" messageId="addSuccess" />
              <DialogUpdate id="list-know-fail" messageId="addFail" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('knowledges');

  if(queryKey === ''){
    return{
      knowledges: Knowledge.find({}, {limit: limit, skip: skip}).fetch(),
      counts: Knowledge.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      knowledges: Knowledge.find({standard: regExp}, {limit: limit, skip: skip}).fetch(),
      counts: Knowledge.find({standard: regExp}).count(),
    }
  }
})(addSameKnowledge);
