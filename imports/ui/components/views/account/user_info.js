import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import PasswdUpdate from './passwd_update';
import {DialogUpdate, DialogMessage} from '../utils/modal_dialog'
import {Images} from '../../../../api/account/images';
import {Option} from '../../../../api/coding/option';

class UserInfo extends React.Component{
  constructor() {
    super();
    this.uploadFile = React.createRef();

    this.state = {
      userUploadImg: '',
      url: '',
      errMessage: '',
    }
  }

  componentWillMount() {
    const self = this;
    Meteor.call('get.img.url', Meteor.userId(), function (err, result) {
      if(!err && result) {
        self.setState({url: result})
      }
    });

    Meteor.subscribe('options');
  }

  handleSubmit(e) {
    e.preventDefault();
    let storagePath = Option.find({cname: 'AVATAR_PATH'}).fetch();
    if(!(storagePath && storagePath.length === 1)) {
      $('#avatar-set-path').modal('show');
      return
    }

    const file = this.uploadFile.current.files[0];

    if(file) {
      const self = this;
      const upload = Images.insert({
        file: file,
        fileId: Meteor.userId(),
        streams: 'dynamic',
        chunkSize: 'dynamic',
      }, false);

      upload.on('start', function () {
        Meteor.call('save.user.img', Meteor.userId(), file);
      });

      upload.on('end', function (err, fileObj) {
        if (err) {
          self.setState({errMessage: err.reason}, ()=>$('#upload-Pic-Error').modal('show'));
        } else {
          window.location.reload();
        }
      });

      upload.start();
    }else {
      $('#modal-default').modal('show');
    }
  }

  handleOnError(e) {
    e.preventDefault();
    e.target.src = '/user_img/default.jpg';
  }

  render() {
    return(
      <div className="col-md-6">
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">
              <FormattedMessage
                id="avatar"
                defaultMessage="个性头像"
              />
            </h3>
          </div>
          <div className="user-picture">
            {this.state.userUploadImg ?
              // eslint-disable-next-line no-undef
              <div className="user-image" style={{backgroundImage: url(this.state.userUploadImg)}}>
              </div>
              :
              <div className="user-image">
                <img src={this.state.url} onError={this.handleOnError.bind(this)} alt="" />
              </div>
            }
            <div className="upload-image">
              {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
              <form role="form">
                <div className="box-body">
                  <div className="form-group">
                    <label htmlFor="fileItem">
                      <FormattedMessage
                        id="uploadFile"
                        defaultMessage="上传文件"
                      />
                    </label>
                    <input type="file" ref={this.uploadFile} id="fileItem" />

                    <p className="help-block">
                      <FormattedMessage
                        id="uploadPrompt"
                        defaultMessage="请上传png/jpg/jpeg图片,且尺寸不超过1M!"
                      />
                    </p>
                  </div>
                </div>

                <div className="box-footer">
                  <button
                    type="submit"
                    className="btn btn-primary pull-right"
                    onClick={this.handleSubmit.bind(this)}
                  >
                    <FormattedMessage
                      id="save"
                      defaultMessage="保存"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <PasswdUpdate />
        <DialogUpdate messageId="selectPicture" />
        <DialogUpdate id="avatar-set-path" messageId="setStoragePath" />
        <DialogMessage id="upload-Pic-Error" message={this.state.errMessage} />
      </div>
    );
  }
}

export default UserInfo;
