import React from 'react';
import ShowBulletin from './show_bulletin';
import AddBulletin from './add_bulletin';
import UpdateBulletin from './update_bulletin';
import {getOptions} from '../utils/select_options';

class Bulletin extends React.Component {
  constructor() {
    super();

    this.state = {
      queryKey: '', // 查询条件
      bulletinInfo: [], // 用于更新时，保存要更新的数据
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      options: [], //存储快码
    }
  }

  componentDidMount() {
    getOptions('bulletinType').then(data => this.setState({options: data}));
  }

  setUpdateInfo(bulletin) {
    this.setState({
      bulletinInfo: bulletin,
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
    });
  }

  render() {
    return(
      <div className="statistic-content">
       <section className="content">
          <div className="row">
            <AddBulletin options={this.state.options} />
            <UpdateBulletin bulletin={this.state.bulletinInfo[0]} options={this.state.options} />
            <ShowBulletin
              setUpdateInfo={this.setUpdateInfo.bind(this)}
              setQueryKey={this.setQueryKey.bind(this)}
              queryKey={this.state.queryKey}
              changePageCondition={this.changePageCondition.bind(this)}
              limit={this.state.pageLimit}
              skip={this.state.pageSkip}
              options={this.state.options}
            />
          </div>
       </section>
      </div>
    );
  }
}

export default Bulletin;
