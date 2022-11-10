import React from 'react';
import ShowSatisfaction from './show_satisfaction';

class SatisfactionManage extends React.Component{
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      updateInfo: [], // 用于更新时，保存要更新的数据
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

  // 更新要更新的数据
  setUpdateInfo(info) {
    this.setState({
      updateInfo: info[0].satisfactionInfo,
    })
  }

  // 更新分页条件
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
            <ShowSatisfaction
              queryKey={this.state.queryKey}
              setQueryKey={this.setQueryKey.bind(this)}
              changePageCondition={this.changePageCondition.bind(this)}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
              setUpdateInfo={this.setUpdateInfo.bind(this)}
            />
          </div>
        </section>
      </div>
    );
  }
}

export default SatisfactionManage;
