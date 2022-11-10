import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import { Profile } from '../../../../api/account/user_profile';

class UserLanguage extends React.Component{
  constructor() {
    super();

    this.language = React.createRef();
  }

  currentLanguage(){
    const currentUserId = this.props.currentUser;
    let currentUserProfile;

    for(let eachUserProfile of this.props.userProfile) {
      if(currentUserId && currentUserId._id === eachUserProfile.userId) {
        currentUserProfile = eachUserProfile.language;
      }
    }

    return currentUserProfile;
  }

  handleOnSubmit() {
    const userId = this.props.currentUser._id;
    const language = this.language.current.value.trim();
    let profileId;
    let flag = 0;

    for(let profile of this.props.userProfile){
      if(profile && profile.userId === userId){
        flag = 1;
        profileId = profile._id;
      }
    }

    if(flag === 1) {
      if(userId !== '' && language !== ''){
        Meteor.call('profiles.update', profileId, language)
      }
    }else {
      if(userId !== '' && language !== ''){
        Meteor.call('profiles.insert', userId, language)
      }
    }
  }

  render() {
    return(
      <div className="col-md-6">
        <div className="box box-primary">
          <div className="box-header with-border">
            <h3 className="box-title">
              <FormattedMessage
                id="local"
                defaultMessage="本地化"
              />
            </h3>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <form role="form">
            <div className="box-body">
              <div className="form-group">
                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label>
                  <FormattedMessage
                    id="language"
                    defaultMessage="语言"
                  />
                </label>
                {
                  this.currentLanguage() === 'zh' ?
                    <select className="form-control" ref={this.language}>
                      <option value="zh">中文</option>
                      <option value="en">English</option>
                    </select>
                    :
                    <select className="form-control" ref={this.language}>
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                    </select>
                }
              </div>
            </div>
            <div className="box-footer">
              <button type="submit" className="btn btn-primary pull-right" onClick={this.handleOnSubmit.bind(this)}>
                <FormattedMessage
                  id="save"
                  defaultMessage="保存"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('users');
  Meteor.subscribe('profiles');

  return{
    currentUser: Meteor.user(),
    userProfile: Profile.find({}).fetch(),
  }
})(UserLanguage);
