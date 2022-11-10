import React from 'react';
import {FormattedMessage} from 'react-intl';

//更新数据的模态框： messageId和titleId为要传递数据的i8n的ID
const DialogUpdate = ({id='modal-default', messageId='updateMessageContent', titleId='prompt'}) => {
  return (
    <div className="modal fade" id={id}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button" className="close" data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title"><FormattedMessage id={titleId} /></h4>
          </div>
          <div className="modal-body dialog-content">
            <p><FormattedMessage id={messageId} /></p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal">
              <FormattedMessage
                id="determine"
                defaultMessage="确定"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

//更新数据的模态框： message为需要展示的消息信息
const DialogMessage = ({id='modal-default', message='UNKNOW', titleId='prompt'}) => {
  return (
    <div className="modal fade" id={id}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button" className="close" data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 className="modal-title"><FormattedMessage id={titleId} /></h4>
          </div>
          <div className="modal-body dialog-content">
            <p>{message}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-dismiss="modal">
              <FormattedMessage
                id="determine"
                defaultMessage="确定"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
};

export {DialogUpdate, DialogMessage}
