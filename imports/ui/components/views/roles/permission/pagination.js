import React from 'react';

class Pagination extends React.Component {
  constructor() {
    super();
    this.state = {
      pageStart: 1,
      pageEnd: 5,
      prev: -5,
      next: 5,
      pageDataLimit: 10, // 每页记录的条数
    }
  }

  // 分页，传递当前点击的页数
  changePages(event) {
    const skip = parseInt(event.target.innerText);
    if(this.props.changePage){
      this.props.changePage(this.state.pageDataLimit,(skip-1)*10)
    }
    if(this.props.clearCheckBox){
      this.props.clearCheckBox();
    }
  }

  // 渲染所以的分页控件的页数
  page() {
    let pageAry = new Array();
    const counts = this.props.counts
    let countPage = Math.ceil(counts / this.state.pageDataLimit)

    let i = this.state.pageStart;
    let pageEndNUm = this.state.pageEnd > countPage ? countPage : this.state.pageEnd;

    for (i; i <= pageEndNUm; i++) {
      pageAry.push(<li key={i}><a onClick={this.changePages.bind(this)}>{i}</a></li>);
    }
    return pageAry;
  }

  // 前一页
  prevPage(e) {
    e.preventDefault();
    let isPageStart = this.state.pageStart;
    let isPageEnd = this.state.pageEnd;
    if (isPageStart === 1 || isPageEnd === 5) {
      return;
    } else {
      this.setState(() => {
          return {
            pageStart: this.state.pageStart + this.state.prev,
            pageEnd: this.state.pageEnd + this.state.prev,
          }
        },
      )
    }
  }

  // 后一页
  nextPage(e) {
    e.preventDefault();
    const counts = this.props.counts
    let countPage = Math.ceil(counts / this.state.pageDataLimit)

    if(this.state.pageEnd >= countPage){
      return;
    }else {
      this.setState(() =>  {
          return {
            pageEnd: this.state.pageEnd + this.state.next,
            pageStart: this.state.pageStart + this.state.next,
          }
        },
      )
    }
  }

  render() {
    return(
      <ul className="pagination table-page">
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <li onClick={this.prevPage.bind(this)}><a>&laquo;</a></li>
        {this.page().map((e) => e)}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <li onClick={this.nextPage.bind(this)}><a>&raquo;</a></li>
      </ul>
    );
  }
}

export default Pagination;
