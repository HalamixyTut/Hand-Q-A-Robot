import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import ListQuestion from './list_question';
import Pagination from '../utils/pagination';
import {Question} from '../../../../api/question/question';
import AddSameKnowledge from './add_sameknowledge';
import {handleDelete as Delete} from '../utils/common';

class ShowQuestion extends React.Component {
  constructor() {
    super();
    this.questionName = React.createRef();

    this.state = {
      questionList: [], // 存储用于更新或删除的记录
      queryKey: '', // 查询条件
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      questionName: '',
      clearCheck: false,
    }
  }

  componentWillMount() {
    Meteor.call('getQuestion', function (err) {
      if (err) {
        throw err;
      }
    });
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  setQueryKey(queryKey) {
    this.setState({
      queryKey: queryKey,
      pageSkip: 0,
    })
  }

  changeName(questionName) {
    this.setState({questionName:questionName})
  }

  // 处理子组件传递过来的被点击的记录
  dealList(questionList) {
    let flag = 0;

    for(let eachItem of this.state.questionList) {
      if(eachItem.questionInfo._id === questionList.questionInfo._id) {
        this.state.questionList.splice(this.state.questionList.indexOf(eachItem),1);
        this.setState({
          questionList: this.state.questionList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.questionList.push(questionList);

      this.setState({
        questionList: this.state.questionList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete() {
    Delete('message.delete1', this.state.questionList);
    Delete('questions.delete', this.state.questionList, this, 'questionList');
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();
    const questionName = this.questionName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(questionName);
    }

    if (this.props.questions.length >0) {
      this.setState({questionList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      questionList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
  }

  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
  }

  changeClear = () => this.setState({clearCheck: false});

  render() {
    return(
      <div className="col-xs-12">
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">
              <FormattedMessage
                id="knowledgeMap"
                defaultMessage="知识图谱"
              />
              /
              <FormattedMessage
                id="UnknownQuestionMaintenance"
                defaultMessage="未知问题维护"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form>
                {
                  Session.get('permission').includes('question_btn_d') ?
                    <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                      <FormattedMessage
                        id="delete"
                        defaultMessage="删除"
                      />
                    </button>
                    : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('question_btn_r') ?
                <form className="role-form"  id="question-form" onSubmit={this.handleSearchClick.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="QuestionName">
                    {(txt) => (
                      <input
                        type="text" ref={this.questionName} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form>
                : null
            }
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr className="tr-title-space">
                <th></th>
                <th>
                  <FormattedMessage
                    id="UnknownQuestion"
                    defaultMessage="未知问题"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="stkb"
                    defaultMessage="同步到知识库"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="RecordSimilarityQuestion"
                    defaultMessage="记录相似问题"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.questions.map((question) => {
                  return(
                    <ListQuestion
                      key={question._id}
                      question={question}
                      dealList={this.dealList.bind(this)}
                      changeName={this.changeName.bind(this)}
                      clearCheck={this.state.clearCheck}
                      changeClear={this.changeClear}
                    />
                  );
                })
              }
              </tbody>
            </table>
          </div>
          <div className="box-footer">
            <Pagination counts={this.props.counts} changePage={this.changePage.bind(this)} />
          </div>
          <AddSameKnowledge
            queryKey={this.state.queryKey}
            setQueryKey={this.setQueryKey.bind(this)}
            changePageCondition={this.changePageCondition.bind(this)}
            limit={this.state.pageLimit}
            skip={this.state.pageSkip}
            questionName={this.state.questionName}
          />
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('questions');

  if(queryKey === ''){
    return{
      questions: Question.find({}, {limit: limit, skip: skip}).fetch(),
      counts: Question.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      questions: Question.find({name: regExp}, {limit: limit, skip: skip}).fetch(),
      counts: Question.find({name: regExp}).count(),
    }
  }
})(ShowQuestion);
