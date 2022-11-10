import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Switch } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import zh from 'react-intl/locale-data/zh';
import en from 'react-intl/locale-data/en';
import AuthRoute from './authRoute';
import SignIn from '../../ui/components/sign_in';
import SignUp from '../../ui/components/sign_up';
import ForgetPassword from '../../ui/components/forget_password';
import Kefu from '../../ui/components/views/kefu/kefu_room';
import Dashboard from '../../ui/components/dashboard/dashboard';
import NotFound from '../../ui/pages/not_found/not_found';
import zh_CN from '../../locales/zh_CN';
import en_US from '../../locales/en_US';
import { Profile } from '../../api/account/user_profile';

addLocaleData([...zh,...en]);

/*const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" name="home" component={Home} />
      <Route path="/sign-in" name="signIn" component={SignIn} />
      <Route path="/sign-up" name="signUp" component={SignUp} />
      <AuthRoute path="/dashboard" name="dashboard" component={Dashboard} />
      <Route name="not-found" component={NotFound} />
    </Switch>
  </Router>
);*/

class Routes extends React.Component{
  chooseLanguage(){
    const currentUserId = this.props.currentUser;
    const currentUserProfile ={locale: '', msg: ''};

    if (currentUserId == null) {
      currentUserProfile.locale = 'zh';
      currentUserProfile.msg = zh_CN;
    } else {
      for(let eachUserProfile of this.props.userProfile) {

        if(currentUserId === eachUserProfile.userId) {
          currentUserProfile.locale = eachUserProfile.language;
        }

        if (eachUserProfile.language === 'en') {
          currentUserProfile.msg = en_US;
        } else {
          currentUserProfile.msg = zh_CN;
        }

      }
    }
    return currentUserProfile;
  }

  render() {
    return(
      <IntlProvider locale={this.chooseLanguage().locale || 'zh'} messages={this.chooseLanguage().msg || zh_CN}>
        <Router>
          <Switch>
            <Route exact path="/" name="home" component={SignIn} />
            <Route path="/sign-in" name="signIn" component={SignIn} />
            <Route path="/sign-up" name="signUp" component={SignUp} />
            <Route path="/forget-password" name="forgetPassword" component={ForgetPassword} />
            <Route path="/kefu/:token" name="kefu" component={Kefu} />
            <AuthRoute path="/dashboard" name="dashboard" component={props => <Dashboard {...props}/>} />
            <Route name="not-found" component={NotFound} />
          </Switch>
        </Router>
      </IntlProvider>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('users');
  //Meteor.subscribe('profiles');
  Meteor.subscribe('user.profiles');

  return {
    currentUser: Meteor.userId(),
    userProfile: Profile.find({ userId:  Meteor.userId() }).fetch(),
  }
})(Routes);
