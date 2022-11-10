/* eslint-disable import/no-unresolved */
import {Meteor} from 'meteor/meteor';
import LdapInfo from './ldap';
import {Ldap} from '../../../../api/ldap/ldap';

export default class LdapLogin {
  constructor() {
    this.ldapInfo = Ldap.findOne()
  }

  async loginAction(username, password) {
    let userInfo = {};

    const ldapConfig = {
      ldap_on: this.ldapInfo ? this.ldapInfo.isOpen : false, //switch, maybe, default '0', '0' => close, '1' => open
      ldap_url: this.ldapInfo ? this.ldapInfo.url : '', //ldap url, required，'ldap://xxx.xx.x.xx:xxx'
      ldap_connect_timeout: this.ldapInfo ? this.ldapInfo.timeout : 5000, // ldap connect timeout, maybe, default 20000ms
      ldap_baseDn: this.ldapInfo ? this.ldapInfo.baseDN : '', //ldap baseDn, required
      // ldap_whiteList: options.ldap_whiteList ? options.ldap_whiteList.split(',') : [], //sep by ",", accounts in this string will not be varified with LDAP when LDAP is opened, and these accounts can be edited by itself instead of LDAP administrator, required
      ldap_whiteList: this.ldapInfo ? this.ldapInfo.whiteList : [], //sep by ",", accounts in this string will not be varified with LDAP when LDAP is opened, and these accounts can be edited by itself instead of LDAP administrator, required
      // ldap_user_page: '', //url for ldap user to change userinfo, maybe, default ''
      // ldap_log: true //logconf, maybe, default '1', '0' => close, '1' => open
    };

    if(ldapConfig.ldap_on && !ldapConfig.ldap_whiteList.includes(username)) {
      userInfo = await this.ldapVarify(username, password, ldapConfig);
    }

    return userInfo;
  }

  async ldapVarify(username, password, ldapConfig) {
    const ldap = new LdapInfo(ldapConfig);
    const ldapRes = await ldap.validate(username, password);
    let ldapUserInfo = {};

    if(!ldapRes) {
      return ldapUserInfo;
    }

    if(ldapRes === 'timeout') {
      return ldapUserInfo;
    }

    //ldap校验通过后，在数据库中查询该用户是否存在，若不存在则新增该用户到数据库，若存在则更新用户信息后登录成功
    //从ldap中获取详细用户信息
    ldapUserInfo = await ldap.getUserInfo(username);
    let newData = {};

    if(Object.keys(ldapUserInfo).length === 0) {
      return ldapUserInfo;
    }else {
      newData = {
        username: username,
        email: ldapUserInfo.mail || username + '@hand-china.com',
        phone: ldapUserInfo.telephoneNumber || 12345678910,
        password: password,
        gender: ldapUserInfo.gender || 'unknown',
        isActivated: true,
        updateDate: new Date(),
      }
    }

    //校验数据库中帐号是否存在
    let userInfo = Meteor.users.findOne({username: username});

    if(!userInfo) {
      //新增该用户到数据库
      Meteor.call('ldap.insert.userinfo', newData)
    }

    return ldapUserInfo;
  }
}
