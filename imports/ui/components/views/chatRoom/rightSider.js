import React from 'react';

class RightSider extends React.Component {

  constructor () {
    super();
    this.state = {
      linked1: 'none',
      linked2: 'none',
      linked3: 'none',
      linked4: 'none',
    }
  }

  handClick1(e) {
    e.preventDefault();
    if (this.state.linked1 === 'block') {
      this.setState({linked1: 'none'});
    } else {
      this.setState({
        linked1:'block',
        linked2:'none',
        linked3:'none',
        linked4:'none',
      });
    }
  }

  handClick2(e) {
    e.preventDefault();
    if (this.state.linked2 === 'block') {
      this.setState({linked2: 'none'});
    } else {
      this.setState({
        linked1:'none',
        linked2:'block',
        linked3:'none',
        linked4:'none',
      });
    }
  }

  handClick3(e) {
    e.preventDefault();
    if (this.state.linked3 === 'block') {
      this.setState({
        linked3: 'none',
      });
    } else {
      this.setState({
        linked1:'none',
        linked2:'none',
        linked3:'block',
        linked4:'none',
      });
    }
  }

  handClick4(e) {
    e.preventDefault();
    if (this.state.linked4 === 'block') {
      this.setState({linked4: 'none'});
    } else {
      this.setState({
        linked1:'none',
        linked2:'none',
        linked3:'none',
        linked4:'block',
      });
    }
  }


  render() {
    let text1 = this.state.linked1;
    let style1 = {
      display: text1,
    };

    let text2 = this.state.linked2;
    let style2 = {
      display: text2,
    };

    let text3 = this.state.linked3;
    let style3 = {
      display: text3,
    };

    let text4 = this.state.linked4;
    let style4 = {
      display: text4,
    };


    return (
      <div className="col-md-4 right-side-window">
        <div className="nav-tabs-custom">
          <ul className="nav nav-tabs">
            <li className="active">
              {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
              <a href="#tab_1" data-toggle="tab">常见问题</a>
            </li>
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <li><a href="#tab_2" data-toggle="tab">问题模板</a></li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane active" id="tab_1">
              <div className="right-tab-nav">
                <div className="box-body">
                  <div id="accordion" className="box-group">
                    <div className="panel box box-primary">
                      <div className="box-header with-border">
                        <h4 className="box-title" onClick={this.handClick1.bind(this)}>
                          <i className={this.state.linked1==='none'?'fa fa-fw fa-angle-double-right':'fa fa-fw fa-angle-double-down'}></i><span>1:</span>如何提问？
                        </h4>
                      </div>
                      {/* id="collapseOne" */}
                      <div
                        id="collapseOne" className="panel-collapse collapse in" aria-expanded="true"
                        style={style1}
                      >
                        <div className="box-body">
                          aibot+空格+您想问的问题！<br />
                          <br />
                          例如：aibot 公司资质去哪里下载?<br />
                        </div>
                      </div>

                      <div className="box-header with-border">
                        <h4 className="box-title" onClick={this.handClick2.bind(this)}>
                          <i className={this.state.linked2==='none'?'fa fa-fw fa-angle-double-right':'fa fa-fw fa-angle-double-down'}></i><span>2:</span>机器人答复不了我的问题?
                        </h4>
                      </div>

                      {/* id="collapseTwo" */}
                      <div   className="panel-collapse collapse in" aria-expanded="true" style={style2}>
                        <div className="box-body">
                          1.多数情况下是因为该问题未被收录，不过我们会记录机器人答不上的问题，并尽快添加答案！<br />
                          <br />
                          2.如果您急需答案，可以转向我们的人工客服提问！<br />
                        </div>
                      </div>

                      <div className="box-header with-border">
                        <h4 className="box-title" onClick={this.handClick3.bind(this)}>
                          <i className={this.state.linked3==='none'?'fa fa-fw fa-angle-double-right':'fa fa-fw fa-angle-double-down'}></i><span>3:</span>如何购买产品？
                        </h4>
                      </div>

                      {/* id="collapseThree" */}
                      <div  className="panel-collapse collapse in" aria-expanded="true" style={style3}>
                        <div className="box-body">
                          感谢您对我们的产品的信任，您可以邮件联系aibot@aibot-cloud.com或者电话联系1008000000和我们进一步沟通！<br />
                        </div>
                      </div>
                      <div className="box-header with-border">
                        <h4 className="box-title" onClick={this.handClick4.bind(this)}>
                          <i className={this.state.linked4==='none'?'fa fa-fw fa-angle-double-right':'fa fa-fw fa-angle-double-down'}></i><span>4:</span>我的网站如何对接螺钉机器人？
                        </h4>
                      </div>
                      <div  className="panel-collapse collapse in" aria-expanded="true" style={style4}>
                        <div className="box-body">
                          如要对接网站，请联系咨询我们的技术人员！<br />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tab-pane" id="tab_2">
              功能暂未开放！
            </div>
            <div className="tab-pane" id="tab_3">
              功能暂未开放！
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default RightSider;
