import React from 'react';
import { Line, Pie } from '@antv/g2plot';
import {FormattedMessage} from 'react-intl';

class StatisticView extends React.Component {
  constructor(){
    super();
  }

  componentDidMount(){
    fetch('/api/chat/message')
      .then(res =>res.json())
      .then(result => {
        const { accessTrend, answered, unanswered, satisfied, disatisfied, uncommented } = result;
        if (answered === 0 && unanswered === 0) {
        }

        if (satisfied === 0 && disatisfied === 0 && uncommented === 0) {
        }

        this.mainlineConfig(accessTrend);
        this.qaPieConfig([{name: '已答', count: answered}, {name: '未答', count: unanswered}]);
        this.satisfactionPieConfig( [
          {name: '满意', count: satisfied},
          {name: '不满意', count: disatisfied},
          {name: '未评价', count: uncommented},
        ]);
      })
  }

  mainlineConfig(data) {
    const linePlot = new Line('mainline', {
      title: {
        visible: true,
        text: '访问趋势',
      },
      data,
      xField: 'date',
      yField: 'count',
      forceFit: true,
      meta: {
        date: {
          alias:'日期',
          range: [0, 1],
        },
        count: {
          alias: '访问量',
        },
      },
      xAxis: {
        type: 'dateTime',
      },
      yAxis: {
        visible: true,
        line: {
          visible: true,
        },
      },
      point: {
        visible: true,
      },
      label: {
        visible: true,
        type: 'point',
      },
      interactions: [
        {
          type: 'slider',
          cfg: {
            start: 0.5,
            end: 1,
          },
        },
      ],
    });

    linePlot.render();
  }

  qaPieConfig(data) {
    const piePlot = new Pie('qaPie', {
      forceFit: true,
      radius: 0.8,
      data,
      angleField: 'count',
      colorField: 'name',
      title: {
        visible: true,
        text: '问答比例',
      },
      label: {
        visible: true,
        type: 'inner',
      },
    });

    piePlot.render();
  }

  satisfactionPieConfig(data) {
    const piePlot = new Pie('satisfactionPie', {
      forceFit: true,
      radius: 0.8,
      data,
      angleField: 'count',
      colorField: 'name',
      title: {
        visible: true,
        text: '满意度',
      },
      label: {
        visible: true,
        type: 'inner',
      },
    });

    piePlot.render();
  }

  render(){
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="box">
                <div className="box-header with-border">
                  <h3 className="box-title">
                    <FormattedMessage
                      id="AccessTrendStatistics"
                      defaultMessage="访问趋势信息统计"
                    />
                  </h3>
                  {/*<div className="box-tools pull-right">
                    <button type="button" className="btn btn-box-tool" data-widget="collapse">
                      <i className="fa fa-minus">
                      </i>
                    </button>
                    <button type="button" className="btn btn-box-tool" data-widget="remove">
                      <i className="fa fa-times">
                      </i>
                    </button>
                  </div>*/}
                </div>
                <div className="box-body">
                  <div className="row">
                    <div id="mainline" style={{width:900,height:350,marginLeft:70}}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="col-md-6">
              <div className="box">
                <div className="box-header with-border">
                  <h3 className="box-title">
                    <FormattedMessage
                      id="RQARS"
                      defaultMessage="机器人问答比例统计"
                    />
                  </h3>
                  {/*<div className="box-tools pull-left">
                    <button type="button" className="btn btn-box-tool" data-widget="collapse">
                      <i className="fa fa-minus">
                      </i>
                    </button>
                    <button type="button" className="btn btn-box-tool" data-widget="remove">
                      <i className="fa fa-times">
                      </i>
                    </button>
                  </div>*/}
                </div>
                <div className="box-body">
                  <div className="row">
                    <div id="qaPie" style={{width:400,height:320,marginLeft:70}}>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="box">
                <div className="box-header with-border">
                  <h3 className="box-title">
                    <FormattedMessage
                      id="RQASS"
                      defaultMessage="机器人问答满意度统计"
                    />
                  </h3>
                  {/*<div className="box-tools pull-right">
                    <button type="button" className="btn btn-box-tool" data-widget="collapse">
                      <i className="fa fa-minus">
                      </i>
                    </button>
                    <button type="button" className="btn btn-box-tool" data-widget="remove">
                      <i className="fa fa-times">
                      </i>
                    </button>
                  </div>*/}
                </div>
                <div className="box-body">
                  <div className="row">
                    <div id="satisfactionPie" style={{width:400,height:320,marginLeft:70}}>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </div>
    );
  }
}

export default StatisticView;
