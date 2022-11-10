import React from 'react';
import ShowRecord from './show_record';

class Record extends React.Component {
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      records: [],
    }
  }

  setQueryKey(queryKey) {
    this.setState({
      queryKey: queryKey,
      pageSkip: 0,
    })
  }

  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
  }

  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <ShowRecord
              queryKey={this.state.queryKey}
              setQueryKey={this.setQueryKey.bind(this)}
              changePageCondition={this.changePageCondition.bind(this)}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
              records={this.state.records}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default Record;
