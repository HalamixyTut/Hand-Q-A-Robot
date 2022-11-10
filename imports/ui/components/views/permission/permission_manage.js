import React from 'react';
import ShowPermission from './show_permission';
import AddPermission from './add_permission';
import UpdatePermission from './update_permission';

class PermissionManage extends React.Component{
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      updateInfo: [], // 用于更新时，保存要更新的数据
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      // eslint-disable-next-line react/no-unused-state
      test: 0,
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
      updateInfo: info[0].permissionInfo,
    })
  }

  setTest(num){
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      test: num,
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
            <AddPermission />
            <UpdatePermission permissionInfo={this.state.updateInfo} />
            <ShowPermission
              setTest={this.setTest.bind(this)}
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

export default PermissionManage;
