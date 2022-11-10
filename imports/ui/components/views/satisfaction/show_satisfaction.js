import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FormattedMessage } from 'react-intl';
import ListSatisfaction from './list_satisfaction';
import Pagination from '../utils/pagination';
import {Satisfaction} from '../../../../api/satisfaction/satisfaction';
import {handleDelete as Delete} from '../utils/common';

class ShowSatisfaction extends React.Component {
  constructor() {
    super();
    this.satisfactionName = React.createRef();

    this.state = {
      satisfactionList: [], // 存储用于更新或删除的记录
      clearCheck: false,
    }
  }

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  // 处理子组件传递过来的被点击的记录
  dealList(satisfactionList) {
    let flag = 0;

    for(let eachItem of this.state.satisfactionList) {
      if(eachItem.satisfactionInfo._id === satisfactionList.satisfactionInfo._id) {
        this.state.satisfactionList.splice(this.state.satisfactionList.indexOf(eachItem),1);
        this.setState({
          satisfactionList: this.state.satisfactionList,
        });
        flag = 1;
      }
    }

    if (flag === 0) {
      this.state.satisfactionList.push(satisfactionList);

      this.setState({
        satisfactionList: this.state.satisfactionList,
      });
    }
  }

  // 删除被选中的记录
  handleDelete() {
    Delete('message.delete2', this.state.satisfactionList);
    Delete('satisfactions.delete', this.state.satisfactionList, this, 'questionList');
  }

  // 查询，传递查询条件给父组件
  handleSearchClick(e) {
    e.preventDefault();

    const satisfactionName = this.satisfactionName.current.value.trim();

    if(this.props.setQueryKey){
      this.props.setQueryKey(satisfactionName);
    }

    if (this.props.satisfactions.length >0) {
      this.setState({satisfactionList: [], clearCheck: true});
    } else {
      this.setState({clearCheck: false});
    }
  }

  // 分页，将分页条件传递给父组件
  changePage(limit, skip) {
    this.setState({
      satisfactionList: [],
    });

    if(this.props.changePageCondition) {
      this.props.changePageCondition(limit, skip)
    }
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
                id="robotSatisfaction"
                defaultMessage="机器人问答满意度"
              />
            </h3>
          </div>
          <div className="box-header">
            <div className="role-button">
              <form>
                {
                  Session.get('permission').includes('satisfaction_btn_d') ?
                    <button type="button" className="btn btn-info pull-left btn-trash" onClick={this.handleDelete.bind(this)}><i className="fa fa-trash-o" />
                      <FormattedMessage
                        id="delete"
                        defaultMessage="删除"
                      />
                    </button> : null
                }
              </form>
            </div>
            {
              Session.get('permission').includes('satisfaction_btn_r') ?
                <form className="role-form"  id="satisfaction-form" onSubmit={this.handleSearchClick.bind(this)}>
                  <button type="button" className="btn btn-info pull-right" onClick={this.handleSearchClick.bind(this)}><i className="fa fa-search" />
                    <FormattedMessage
                      id="search"
                      defaultMessage="查询"
                    />
                  </button>
                  <FormattedMessage id="QuestionName">
                    {(txt) => (
                      <input
                        type="text" ref={this.satisfactionName} className="pull-right find-input"
                        placeholder={txt}
                      />
                    )}
                  </FormattedMessage>
                </form> : null
            }
          </div>
          <div className="box-body">
            <table id="example2" className="table table-bordered table-hover">
              <thead>
              <tr>
                <th></th>
                <th className="questh">
                  <FormattedMessage
                    id="question"
                    defaultMessage="问题"
                  />
                </th>
                <th>
                  <FormattedMessage
                    id="answer"
                    defaultMessage="答案"
                  />
                </th>
                <th className="satisth">
                  <FormattedMessage
                    id="satisfaction"
                    defaultMessage="满意度"
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {
                this.props.satisfactions.map((satisfaction) => {
                  return(
                    <ListSatisfaction
                      key={satisfaction._id}
                      satisfaction={satisfaction}
                      dealList={this.dealList.bind(this)}
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
        </div>
      </div>
    );
  }
}

export default withTracker(({queryKey,limit,skip}) => {
  Meteor.subscribe('satisfactions');

  if(queryKey === ''){
    return{
      satisfactions: Satisfaction.find({}, {limit: limit, skip: skip}).fetch(),
      counts: Satisfaction.find({}).count(),
    }
  }else {
    const regExp = new RegExp(queryKey, 'i');
    return{
      satisfactions: Satisfaction.find({ques: regExp}, {limit: limit, skip: skip}).fetch(),
      counts: Satisfaction.find({ques: regExp}).count(),
    }
  }
})(ShowSatisfaction);
