import React from 'react';
import ShowCoding from './show_coding';
import AddCoding from './add_coding';
import ShowOption from './show_option';
import AddOption from './add_option';
import UpdateCoding from './update_coding';
import UpdateOption from './update_option';
import {DialogUpdate} from '../utils/modal_dialog'

class CodingManage extends React.Component{
  constructor() {
    super();

    this.state = {
      queryKey1: '', // 查询条件
      queryKey2: '',
      updateInfo1: [], // 用于更新时，保存要更新的数据
      updateInfo2: [],
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
    }
  }

  // 更新查询条件，同时将查询跳过的数目置为0
  setQueryKey1(queryKey1) {
    this.setState({
      queryKey1: queryKey1,
      pageSkip: 0,
    })
  }

  setQueryKey2(queryKey2) {
    this.setState({
      queryKey2: queryKey2,
      pageSkip: 0,
    })
  }

  // 更新要更新的数据
  setUpdateInfo1(info) {
    this.setState({
      updateInfo1: info[0].codingInfo,
    })
  }

  setUpdateInfo2(info) {
    this.setState({
      updateInfo2: info[0].optionInfo,
    })
  }

  // 更新分页条件
  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    });
  }

  handleEdit(cname){
    this.setState({cname:cname})
  }

  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <ShowOption
              queryKey2={this.state.queryKey2}
              setQueryKey2={this.setQueryKey2.bind(this)}
              changePageCondition={this.changePageCondition.bind(this)}
              cname={this.state.cname}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
              setUpdateInfo2={this.setUpdateInfo2.bind(this)}
            />
            <AddCoding />
            <AddOption
              cname={this.state.cname}
            />
            <UpdateCoding codingInfo={this.state.updateInfo1} />
            <UpdateOption optionInfo={this.state.updateInfo2} />
            <ShowCoding
              queryKey1={this.state.queryKey1}
              setQueryKey1={this.setQueryKey1.bind(this)}
              changePageCondition={this.changePageCondition.bind(this)}
              cname={this.handleEdit.bind(this)}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
              setUpdateInfo1={this.setUpdateInfo1.bind(this)}
            />
            <DialogUpdate />
          </div>
        </section>
      </div>
    );
  }
}

export default CodingManage;
