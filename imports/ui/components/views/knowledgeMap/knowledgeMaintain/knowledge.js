import React from 'react';
import Add from './add_konwledge';
import KnowledgePoints from './knowledge_points';
import Update from './update_knowledge';
import UploadKnowledge from './upload_knowledge';

class Knowledge extends React.Component {
  constructor() {
    super();

    this.state = {
      pageNum: 1001,
      knowledgeInfo: [],
      categoryIds: '',
      searchKey: '',
      pageLimit: 10, // 初始化每页记录数
      pageSkip: 0, // 查询跳过的数目
      selectedNodeId: 0, //选中节点的id
    }
  }

  changePageNum(pageNum) {
    this.setState({pageNum})
  }

  updateKnowledgeInfo(knowledge) {
    this.setState({
      knowledgeInfo: knowledge[0].knowledgeInfo,
    })
    this.changePageNum(1003)
  }

  updateKnowledgeInfo1(knowledgeInfo) {
    this.setState({knowledgeInfo});
    this.changePageNum(1003)
  }

  changeCategoryId(categoryIds) {
    this.setState({categoryIds})
  }

  changeSearchKey(searchKey) {
    this.setState({searchKey})
  }

  // 更新分页条件
  changePageCondition(limit, skip) {
    this.setState({
      pageLimit: limit,
      pageSkip: skip,
    })
  }

  changeSelectedNode(selectedNodeId) {
    this.setState({selectedNodeId})
  }

  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            {
              this.state.pageNum === 1001 ?
                <KnowledgePoints
                  changePageNum={this.changePageNum.bind(this)}
                  updateKnowledgeInfo={this.updateKnowledgeInfo.bind(this)}
                  updateKnowledgeInfo1={this.updateKnowledgeInfo1.bind(this)}
                  searchCategoryId={this.changeCategoryId.bind(this)}
                  changeSearchKey={this.changeSearchKey.bind(this)}
                  categoryIds={this.state.categoryIds}
                  searchKey={this.state.searchKey}
                  changePageCondition={this.changePageCondition.bind(this)}
                  limit={this.state.pageLimit}
                  skip={this.state.pageSkip}
                  changeSelectedNode={this.changeSelectedNode.bind(this)}
                  selectedNodeId={this.state.selectedNodeId}
                />
                :
                this.state.pageNum === 1002 ?
                  <Add />
                  :
                  this.state.pageNum === 1003 ?
                    <Update
                      knowledge={this.state.knowledgeInfo}
                      changePage={this.changePageNum.bind(this)}
                    />
                    :
                    <UploadKnowledge />
            }
          </div>
        </section>
      </div>
    );
  }
}

export default Knowledge;
