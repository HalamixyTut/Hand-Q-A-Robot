import React from 'react'
import { FormattedMessage } from 'react-intl';

class UpdateCategory extends React.Component{
  render() {
    return(
      <div
        className="modal fade" id="updateOperation-dialog" tabIndex="-1"
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
                  id="UpdateClassification"
                  defaultMessage="更新分类"
                />
              </h4>
            </div>
            <div className="modal-body">
              {/*表单*/}
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>
                <form role="form">
                  <div className="box-body">
                    <div className="form-group">
                      <label htmlFor="inputEmail1">
                        <FormattedMessage
                          id="name"
                          defaultMessage="名称"
                        />
                      </label>
                      <input
                        type="text"
                        id="editName"
                        className="form-control"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage
                  id="cancel"
                  defaultMessage="取消"
                />
              </button>
              <button id="Edit" type="button" className="btn btn-info pull-right">
                <FormattedMessage
                  id="save"
                  defaultMessage="保存"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateCategory;
