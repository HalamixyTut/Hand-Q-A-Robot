import React from 'react';

const Dashboard2 = () => (
  <div className="statistic-content">
    <section className="content">

      <div className="row">
        <div className="col-lg-3 col-xs-6">

          <div className="small-box bg-aqua">
            <div className="inner">
              <h3>150</h3>

              <p>New Orders</p>
            </div>
            <div className="icon">
              <i className="ion ion-bag"></i>
            </div>
            <a href="#" className="small-box-footer">More info <i className="fa fa-arrow-circle-right"></i></a>
          </div>
        </div>

        <div className="col-lg-3 col-xs-6">

          <div className="small-box bg-green">
            <div className="inner">
              <h3>53<sup style={{fontSize: 20}}>%</sup></h3>

              <p>Bounce Rate</p>
            </div>
            <div className="icon">
              <i className="ion ion-stats-bars"></i>
            </div>
            <a href="#" className="small-box-footer">More info <i className="fa fa-arrow-circle-right"></i></a>
          </div>
        </div>

        <div className="col-lg-3 col-xs-6">

          <div className="small-box bg-yellow">
            <div className="inner">
              <h3>44</h3>

              <p>User Registrations</p>
            </div>
            <div className="icon">
              <i className="ion ion-person-add"></i>
            </div>
            <a href="#" className="small-box-footer">More info <i className="fa fa-arrow-circle-right"></i></a>
          </div>
        </div>

        <div className="col-lg-3 col-xs-6">

          <div className="small-box bg-red">
            <div className="inner">
              <h3>65</h3>

              <p>Unique Visitors</p>
            </div>
            <div className="icon">
              <i className="ion ion-pie-graph"></i>
            </div>
            <a href="#" className="small-box-footer">More info <i className="fa fa-arrow-circle-right"></i></a>
          </div>
        </div>

      </div>


      <div className="row">

        <section className="col-lg-7 connectedSortable">
          <div className="box box-primary">
            <div className="box-header">
              <i className="ion ion-clipboard"></i>

              <h3 className="box-title">To Do List</h3>

              <div className="box-tools pull-right">
                <ul className="pagination pagination-sm inline">
                  <li><a href="#">&laquo;</a></li>
                  <li><a href="#">1</a></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">&raquo;</a></li>
                </ul>
              </div>
            </div>

            <div className="box-body">

              <ul className="todo-list">
                <li>

                  <span className="handle">
                    <i className="fa fa-ellipsis-v"></i>
                    <i className="fa fa-ellipsis-v"></i>
                  </span>

                  <input type="checkbox" />

                  <span className="text">Design a nice theme</span>

                  <small className="label label-danger"><i className="fa fa-clock-o"></i> 2 mins</small>

                  <div className="tools">
                    <i className="fa fa-edit"></i>
                    <i className="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                      <span className="handle">
                        <i className="fa fa-ellipsis-v"></i>
                        <i className="fa fa-ellipsis-v"></i>
                      </span>
                  <input type="checkbox" />
                  <span className="text">Make the theme responsive</span>
                  <small className="label label-info"><i className="fa fa-clock-o"></i> 4 hours</small>
                  <div className="tools">
                    <i className="fa fa-edit"></i>
                    <i className="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                      <span className="handle">
                        <i className="fa fa-ellipsis-v"></i>
                        <i className="fa fa-ellipsis-v"></i>
                      </span>
                  <input type="checkbox" />
                  <span className="text">Let theme shine like a star</span>
                  <small className="label label-warning"><i className="fa fa-clock-o"></i> 1 day</small>
                  <div className="tools">
                    <i className="fa fa-edit"></i>
                    <i className="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                      <span className="handle">
                        <i className="fa fa-ellipsis-v"></i>
                        <i className="fa fa-ellipsis-v"></i>
                      </span>
                  <input type="checkbox" />
                  <span className="text">Let theme shine like a star</span>
                  <small className="label label-success"><i className="fa fa-clock-o"></i> 3 days</small>
                  <div className="tools">
                    <i className="fa fa-edit"></i>
                    <i className="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                      <span className="handle">
                        <i className="fa fa-ellipsis-v"></i>
                        <i className="fa fa-ellipsis-v"></i>
                      </span>
                  <input type="checkbox" />
                  <span className="text">Check your messages and notifications</span>
                  <small className="label label-primary"><i className="fa fa-clock-o"></i> 1 week</small>
                  <div className="tools">
                    <i className="fa fa-edit"></i>
                    <i className="fa fa-trash-o"></i>
                  </div>
                </li>
                <li>
                      <span className="handle">
                        <i className="fa fa-ellipsis-v"></i>
                        <i className="fa fa-ellipsis-v"></i>
                      </span>
                  <input type="checkbox" />
                  <span className="text">Let theme shine like a star</span>
                  <small className="label label-default"><i className="fa fa-clock-o"></i> 1 month</small>
                  <div className="tools">
                    <i className="fa fa-edit"></i>
                    <i className="fa fa-trash-o"></i>
                  </div>
                </li>
              </ul>
            </div>

            <div className="box-footer clearfix no-border">
              <button type="button" className="btn btn-default pull-right"><i className="fa fa-plus"></i> Add item
              </button>
            </div>
          </div>

        </section>


        <section className="col-lg-5 connectedSortable">

          <div className="box box-solid bg-teal-gradient">
            <div className="box-header">
              <i className="fa fa-th"></i>

              <h3 className="box-title">Sales Graph</h3>

              <div className="box-tools pull-right">
                <button type="button" className="btn bg-teal btn-sm" data-widget="collapse">
                  <i
                    className="fa fa-minus"
                  >
                  </i>
                </button>
                <button type="button" className="btn bg-teal btn-sm" data-widget="remove">
                  <i
                    className="fa fa-times"
                  >
                  </i>
                </button>
              </div>
            </div>
            <div className="box-body border-radius-none">
              <div className="chart" id="line-chart" style={{height: 250}}></div>
            </div>

            <div className="box-footer no-border">
              <div className="row">
                <div className="col-xs-4 text-center" style={{borderRight: '1 solid #f4f4f4'}}>
                  <input
                    type="text" className="knob" data-readonly="true"
                    defaultValue="20" data-width="60" data-height="60"
                  />

                  <div className="knob-label">Mail-Orders</div>
                </div>

                <div className="col-xs-4 text-center" style={{borderRight: '1 solid #f4f4f4'}}>
                  <input
                    type="text" className="knob" data-readonly="true"
                    defaultValue="50" data-width="60" data-height="60"
                  />

                  <div className="knob-label">Online</div>
                </div>

                <div className="col-xs-4 text-center">
                  <input
                    type="text" className="knob" data-readonly="true"
                    defaultValue="30" data-width="60" data-height="60"
                  />

                  <div className="knob-label">In-Store</div>
                </div>

              </div>

            </div>

          </div>


          <div className="box box-solid bg-green-gradient">
            <div className="box-header">
              <i className="fa fa-calendar"></i>

              <h3 className="box-title">Calendar</h3>

              <div className="pull-right box-tools">

                <div className="btn-group">
                  <button type="button" className="btn btn-success btn-sm dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-bars"></i>
                  </button>
                  <ul className="dropdown-menu pull-right" role="menu">
                    <li><a href="#">Add new event</a></li>
                    <li><a href="#">Clear events</a></li>
                    <li className="divider"></li>
                    <li><a href="#">View calendar</a></li>
                  </ul>
                </div>
                <button type="button" className="btn btn-success btn-sm" data-widget="collapse">
                  <i
                    className="fa fa-minus"
                  >
                  </i>
                </button>
                <button type="button" className="btn btn-success btn-sm" data-widget="remove">
                  <i
                    className="fa fa-times"
                  >
                  </i>
                </button>
              </div>

            </div>

            <div className="box-body no-padding">

              <div id="calendar" style={{width: '100%'}}></div>
            </div>

            <div className="box-footer text-black">
              <div className="row">
                <div className="col-sm-6">

                  <div className="clearfix">
                    <span className="pull-left">Task #1</span>
                    <small className="pull-right">90%</small>
                  </div>
                  <div className="progress xs">
                    <div className="progress-bar progress-bar-green" style={{width: 90}}></div>
                  </div>

                  <div className="clearfix">
                    <span className="pull-left">Task #2</span>
                    <small className="pull-right">70%</small>
                  </div>
                  <div className="progress xs">
                    <div className="progress-bar progress-bar-green" style={{width: 90}}></div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="clearfix">
                    <span className="pull-left">Task #3</span>
                    <small className="pull-right">60%</small>
                  </div>
                  <div className="progress xs">
                    <div className="progress-bar progress-bar-green" style={{width: 90}}></div>
                  </div>

                  <div className="clearfix">
                    <span className="pull-left">Task #4</span>
                    <small className="pull-right">40%</small>
                  </div>
                  <div className="progress xs">
                    <div className="progress-bar progress-bar-green" style={{width: 90}}></div>
                  </div>
                </div>

              </div>

            </div>
          </div>


        </section>

      </div>


    </section>

  </div>

);

export default Dashboard2;
