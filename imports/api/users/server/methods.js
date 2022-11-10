/* eslint-disable import/no-unresolved */
import {Meteor} from 'meteor/meteor';
import LdapLogin from '../../../ui/components/views/ldap/ldap_login';

if(Meteor.isServer) {
  Meteor.methods({
    'ldap.userInfo': async function(username, password) {
      const ldapUser = new LdapLogin();
      const ldapUserInfo = await ldapUser.loginAction(username, password);

      return ldapUserInfo
    },
  })
}
