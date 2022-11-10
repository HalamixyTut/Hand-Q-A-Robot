import React from 'react';
import {FormattedMessage} from 'react-intl';

class AppHeaderShowBulletins extends React.Component {
  getBulletinContent(contents) {
    const content = contents.split('\n');

    return content.map((item, index) => (
      <dd key={index}>{item}</dd>
    ))
  }

  render() {
    let bulletin;
    if(this.props.bulletinInfo.length > 0) {
      bulletin = this.props.bulletinInfo[0];
    }

    return(
      <div
        className="modal fade" id="appHeaderBulletin" tabIndex="-1"
        role="dialog" aria-labelledby="bulletinModalLabel" aria-hidden="true"
        data-backdrop="false"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title" id="bulletinModalLabel">
                <i className="fa fa-bullhorn" />&nbsp;
                <FormattedMessage
                  id="TheLatestAnnouncement"
                  defaultMessage="最新公告:"
                />
              </h4>
            </div>
            <div className="modal-body">
              {
                bulletin ?
                  <div className="box-body">
                    <dl className="dl-horizontal">
                      <dt>
                        <FormattedMessage
                          id="AnnouncementTopic"
                          defaultMessage="公告主题"
                        />
                      </dt>
                      <dd>{bulletin.title}</dd>
                      <dt>
                        <FormattedMessage
                          id="AnnouncementType"
                          defaultMessage="公告类型"
                        />
                      </dt>
                      <dd>
                        {
                          bulletin.type === 'A1' ?
                            '新功能发布'
                            :
                            bulletin.type === 'A2' ?
                              '系统维护'
                              :
                              '市场活动'
                        }
                      </dd>
                      <dt>
                        <FormattedMessage
                          id="AnnouncementContent"
                          defaultMessage="公告内容"
                        />
                      </dt>
                      {this.getBulletinContent(bulletin.content)}
                    </dl>
                  </div>
                  :
                  ''
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-info pull-right" data-dismiss="modal">
                <FormattedMessage
                  id="Gotit"
                  defaultMessage="我知道了"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AppHeaderShowBulletins;
