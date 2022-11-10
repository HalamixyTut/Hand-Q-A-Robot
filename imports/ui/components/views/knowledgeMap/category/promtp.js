import React from 'react'
import { FormattedMessage } from 'react-intl';

class Prompt extends React.Component{
  render() {
    return(
      <div
        className="modal fade" id="promptOperation-dialog" tabIndex="-1"
        role="dialog" aria-labelledby="myModalLabel"
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
              <h4 className="modal-title" id="myModalLabel">
                <FormattedMessage
                  id="prompt"
                  defaultMessage="提示 :"
                />
              </h4>
            </div>
            <div className="modal-body">
              <p className="dialog-content">
                <FormattedMessage
                  id="selectNode"
                  defaultMessage="请选择节点！"
                />
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-info pull-right" data-dismiss="modal">
                <FormattedMessage
                  id="determine"
                  defaultMessage="确定"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Prompt;
