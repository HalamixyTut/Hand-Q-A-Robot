import React from 'react';
import ShowCrontab from './show_crontab';
import AddCrontab from './add_crontab';

class Crontab extends React.Component {
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
    }
  }

  // 更新查询条件，同时将查询跳过的数目置为0
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
            <AddCrontab />
            <ShowCrontab
              setQueryKey={this.setQueryKey.bind(this)}
              queryKey={this.state.queryKey}
              changePageCondition={this.changePageCondition.bind(this)}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default Crontab;
