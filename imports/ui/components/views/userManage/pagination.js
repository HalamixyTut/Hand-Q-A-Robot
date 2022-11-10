import React from 'react';

class Pagination extends React.Component{
  constructor(){
    super();
    this.state={
      pageStart:1,
      pageEnd:5,
      prev:-5,
      next:5,
    }
  }

  page() {
    let pageAry = new Array();
    let i = this.state.pageStart;

    if (this.state.pageEnd > this.props.dataCount) {
      for (i ; i<=this.props.dataCount ; i++) {
        pageAry.push(<li key={i}> <a href={i} onClick={this.paginationStateUp.bind(this)}>{i}</a></li>);
      }
    } else {
      for (i ; i <=this.state.pageEnd ; i++) {
        pageAry.push(<li key={i}> <a href={i} onClick={this.paginationStateUp.bind(this)}>{i}</a></li>);
      }
    }
    return pageAry;
  }

  prevPage(e) {
    e.preventDefault();
    let isPageStart = this.state.pageStart;
    let isPageEnd = this.state.pageEnd;
    if (isPageStart === 1) {
      return ;
    } else {
      if ((isPageEnd-isPageStart) < 5 ) {
        this.setState(()=>{
          return {
            pageStart:this.state.pageStart + this.state.prev,
            pageEnd:this.state.pageEnd + (this.state.pageStart - this.state.pageEnd-1),
          }
        })
      } else {
        this.setState(()=> {
          return {
            pageStart:this.state.pageStart + this.state.prev,
            pageEnd:this.state.pageEnd + this.state.prev,
          }
        });
      }
    }
  }


  nextPage(e) {
    e.preventDefault();

    if (this.state.pageEnd >= this.props.dataCount) {
      return;
    } else {
      if ( (this.state.pageEnd < this.props.dataCount) && ((this.state.pageEnd + this.state.next) > this.props.dataCount)) {
        this.setState(()=>{
          return {
            pageEnd:this.state.pageEnd + (this.props.dataCount - this.state.pageEnd),
            pageStart:this.state.pageStart + this.state.next,
          }
        });
      } else {
        this.setState(()=>{
          return {
            pageEnd:this.state.pageEnd + this.state.next,
            pageStart:this.state.pageStart + this.state.next,
          }});
      }
    }
  }

  paginationStateUp(e) {
    e.preventDefault();
    const str = e.target.toString();
    // eslint-disable-next-line no-useless-escape
    const index = str.lastIndexOf('\/');
    const skip = parseInt(str.substring(index+1,e.target.length));
    this.props.getCurrentPaginationData(10,(skip-1)*10);
    this.props.clearCheckBox();
  }

  render(){
    return(
      <ul className="pagination table-page">
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <li onClick={this.prevPage.bind(this)}><a>&laquo;</a></li>
        {this.page().map((e)=>e)}
        {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
        <li onClick={this.nextPage.bind(this)}><a>&raquo;</a></li>
      </ul>
    )
  }
}

export default Pagination;
