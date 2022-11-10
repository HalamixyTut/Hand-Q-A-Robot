import React, { Component } from 'react';

export default class Pagination extends Component{
  constructor(props){
    super(props)

    const { groupCount } = this.props;

    // 设置当前页码，默认为第一页
    this.state = {
      pageCurr: 1,
      startPage: 1,
      groupCount: groupCount || 5,
      pageCount: 10,
    }
  }

  componentDidMount() {
    this.setState({
      pageCountEle:document.querySelector('#pageCount'),
    });

    setTimeout(()=>{
      document.addEventListener('click',(e)=>{
        if(e.target.id !== 'pageCount'){
          this.state.pageCountEle.parentNode.className = 'page-hide';
        }
      },false);
    },0)
  }

  choosePageCount(e){
    const parentUI = this.state.pageCountEle.parentNode;
    parentUI.className = (parentUI.className === 'page-hide') ? '' : 'page-hide';
  }

  confirmPageCount(pageCount){
    const {
      pageCountEle,
      pageCurr,
    } = this.state;

    if(pageCountEle.innerHTML == pageCount) {
      return;
    }

    // 设置每页显示条数
    this.setState({
      pageCount,
    });
    pageCountEle.innerHTML = pageCount;
    pageCountEle.parentNode.className = 'page-hide';

    setTimeout(()=>{
      this.go(pageCurr, true);
    },0);
  }

  create() {
    const { pageCurr, startPage, groupCount, pageCount } = this.state;
    const totalPage = Math.ceil((this.props.count || 0) / pageCount);

    if(totalPage <= 0) {
      return (
        <React.Fragment>
          <li key={0} className="nomore">上一页</li>
          <li key={1} className="nomore">下一页</li>
        </React.Fragment>
      )
    }

    let pages = [];
    if(totalPage < groupCount) {
      pages.push(<li key={0} onClick={this.goPrev.bind(this)} className={pageCurr === 1 ? 'nomore' : ''}>上一页</li>)
      for(let i = 1; i <= totalPage; i++){
        // 点击页码时调用 go 方法，根据 state 判断是否应用 active 样式
        pages.push(<li key={i} onClick={this.go.bind(this, i)} className={pageCurr === i ? 'pagination-active' : ''}>{i}</li>)
      }
      pages.push(<li key={totalPage + 1} onClick={this.goNext.bind(this)} className={pageCurr === totalPage ? 'nomore' : ''}>下一页</li>)
    } else {
      pages.push(<li key={0} onClick={this.goPrev.bind(this)} className={pageCurr === 1 ? 'nomore' : ''}>上一页</li>)
      for(let i = startPage; i < groupCount + startPage; i++){
        if(i <= totalPage - 2){
          pages.push(<li key={i} onClick={this.go.bind(this, i)} className={pageCurr === i ? 'pagination-active' : ''}>{i}</li>)
        }
      }

      // 分页中间的省略号
      if(totalPage - startPage >= groupCount + 2) {
        pages.push(<li className="ellipsis" key={-1}>···</li>)
      }
      // 倒数第一、第二页
      pages.push(<li className={pageCurr === totalPage -1 ? 'pagination-active' : ''} key={totalPage - 1} onClick={this.go.bind(this,totalPage - 1)}>{totalPage -1}</li>)
      pages.push(<li className={pageCurr === totalPage ? 'pagination-active' : ''} key={totalPage} onClick={this.go.bind(this,totalPage)}>{totalPage}</li>)

      // 下一页
      pages.push(<li key={totalPage + 1} onClick={this.goNext.bind(this)} className={pageCurr === totalPage ? 'nomore' : ''}>下一页</li>)
    }
    return pages;
  }

  goPrev() {
    let { pageCurr } = this.state;
    if(--pageCurr === 0) {
      return;
    }
    this.go(pageCurr);
  }

  goNext() {
    let { pageCurr, pageCount } = this.state;
    const totalPage = Math.ceil(this.props.count / pageCount);
    if(++pageCurr > totalPage) {
      return;
    }
    this.go(pageCurr);
  }

  go(pageCurr, reset= false) {
    const { groupCount, pageCount } = this.state;
    const { count, changePage } = this.props;
    const totalPage = Math.ceil(count / pageCount);

    // 处理下一页的情况
    if(pageCurr % groupCount === 1) {
      this.setState({startPage:pageCurr})
    }

    // 处理上一页的情况
    if(pageCurr % groupCount === 0){
      this.setState({startPage: pageCurr - groupCount + 1})
    }

    // 点击最后两页时重新计算 startPage
    if(totalPage - pageCurr < 2){
      this.setState({
        startPage:totalPage - groupCount - 1 > 0 ? totalPage - groupCount - 1 : 1,
      })
    }

    // 选择每页条数后重新分页
    if(reset === true){
      this.setState({
        pageCurr:1,
        startPage:1,
      });
    } else {
      this.setState({pageCurr});
    }

    setTimeout(()=>{
      const { pageCurr, pageCount } = this.state;
      changePage(pageCount, (pageCurr -1) * pageCount);
    });
  }

  render(){
    let { count } = this.props;
    count = count || 0;
    const { pageCurr, pageCount } = this.state;
    const start = (pageCurr -1) * pageCount + 1 < count ? (pageCurr -1) * pageCount + 1 : 0;
    const end = pageCurr * pageCount < count ? pageCurr * pageCount : count;

    return(
      <div className="pagination-main">
        <div className="pagination-bar">
          <span>{`显示条目 ${start} - ${end} 共 ${count}`}</span>
        </div>
        <div className="pagination-bar">
          <span>每页显示</span>
          <div className="pagination-select">
            <ul className="page-hide">
              <li id="pageCount" onClick={this.choosePageCount.bind(this)}>10</li>
              <li onClick={this.confirmPageCount.bind(this,5)}>5</li>
              <li onClick={this.confirmPageCount.bind(this,10)}>10</li>
              <li onClick={this.confirmPageCount.bind(this,20)}>20</li>
              <li onClick={this.confirmPageCount.bind(this,50)}>50</li>
            </ul>
          </div>
        </div>
        <ul className="pagination-page">
          {this.create()}
        </ul>
      </div>
    );
  }
}
