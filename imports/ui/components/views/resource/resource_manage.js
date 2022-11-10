import React from 'react';
import ShowResource from './show_resource';
import AddResource from './add_resource';
import UpdateResource from './update_resource';

class ResourceManage extends React.Component{
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      updateInfo: {}, // 用于更新时，保存要更新的数据
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
      updateInfo: info[0].resourceInfo,
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
            <AddResource />
            <UpdateResource resourceInfo={this.state.updateInfo} />
            <ShowResource
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

export default ResourceManage;
