import React from 'react';
import AllocationRules from './allocationRules';

export default function Settings() {
  return(
    <div className="statistic-content">
      <section className="content">
        <div className="row">
          <div className="col-xs-12">
            <div className="nav-tabs-custom">
              <ul className="nav nav-tabs">
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <li className="active"><a href="#allocationRules" data-toggle="tab">客服分配规则</a></li>
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <li><a href="#settings" data-toggle="tab">设置</a></li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane active" id="allocationRules">
                  <AllocationRules />
                </div>

                <div className="tab-pane" id="settings">
                  功能暂未开放！
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
