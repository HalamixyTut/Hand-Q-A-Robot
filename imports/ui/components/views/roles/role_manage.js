import React from 'react';
import CreateRole from './create_role';
import Roles from './roles';
import UpdateRole from './update_role';

class RoleManage extends React.Component {
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      updateInfo: [], // 用于更新时，保存要更新的数据
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      test: 0,
    }
  }

  setUpdateInfo(info) {
    this.setState({
      updateInfo: info[0].roleInfo,
    })
  }

  setTest(num){
    this.setState({
      test: num,
    })
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
    })
  }

  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <CreateRole />
            <UpdateRole roleInfo={this.state.updateInfo} />
            <Roles
              setTest={this.setTest.bind(this)}
              setQueryKey={this.setQueryKey.bind(this)}
              changePageCondition={this.changePageCondition.bind(this)}
              queryKey={this.state.queryKey}
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

export default RoleManage;
