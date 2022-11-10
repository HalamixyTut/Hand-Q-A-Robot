import React from 'react';
import UserLanguage from './user_language';
import UserInfo from './user_info';

class UserProfile extends React.Component{
  render() {
    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            <UserInfo />
            <UserLanguage />
          </div>
        </section>
      </div>
    );
  }
}

export default UserProfile;
