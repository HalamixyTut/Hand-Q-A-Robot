import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const LoginHistory = new Mongo.Collection('loginHistorys');

if (Meteor.isServer) {
  Meteor.publish('loginHistorys', function () {
    return LoginHistory.find();
  });

  const OSAndBrowser = userAgent => {
    let data = {
      os: undefined,
      browser: undefined,
    };
    let regs = {};
    let terminal = {
      'windows nt 10': 'Windows 10',
      'windows nt 6.3': 'Windows 8.1',
      'windows nt 6.2': 'Windows 8',
      'windows nt 6.1': 'Windows 7',
      'windows nt 6.0': 'Windows Vista',
      'windows nt 5.2': 'Windows Server 2003XP x64',
      'windows nt 5.1': 'Windows XP',
      'windows xp': 'Windows XP',
      'windows nt 5.0': 'Windows 2000',
      'windows me': 'Windows ME',
      'win98': 'Windows 98',
      'win95': 'Windows 95',
      'win16': 'Windows 3.11',
      'macintosh|mac os x': 'Mac OS X',
      'mac_powerpc': 'Mac OS 9',
      'linux': 'Linux',
      'ubuntu': 'Ubuntu',
      'phone': 'iPhone',
      'pod': 'iPod',
      'pad': 'iPad',
      'android': 'Android',
      'blackberry': 'BlackBerry',
      'webos': 'Mobile',
      'freebsd': 'FreeBSD',
      'sunos': 'Solaris',
    };

    for (let key in terminal) {
      if (new RegExp(key).test(userAgent.toLowerCase())) {
        data.os = terminal[key];
        break;
      }
    }

    /*eslint-disable-next-line no-cond-assign*/
    if (regs = userAgent.match(/MSIE\s(\d+)\..*/)) {
      // ie 除11
      data.browser = 'ie ' + regs['1'];
      // eslint-disable-next-line no-cond-assign
    } else if (regs = userAgent.match(/Firefox\/(\d+)\..*/)) {
      data.browser = 'firefox ' + regs['1'];
      // eslint-disable-next-line no-cond-assign,no-useless-escape
    } else if (regs = userAgent.match(/Opera[\s|\/](\d+)\..*/)) {
      data.browser = 'opera ' + regs['1'];
      // eslint-disable-next-line no-cond-assign
    } else if (regs = userAgent.match(/Chrome\/(\d+)\..*/)) {
      data.browser = 'chrome ' + regs['1'];
      // eslint-disable-next-line no-cond-assign
    } else if (regs = userAgent.match(/Safari\/(\d+)\..*$/)) {
      // chrome浏览器都声明了safari
      data.browser = 'safari ' + regs['1'];
      // eslint-disable-next-line no-cond-assign
    } else if (regs = userAgent.match(/rv:(\d+)\..*/)) {
      // ie 11
      data.browser = 'ie ' + regs['1'];
    }

    return data;
  }

  Meteor.methods({
    'loginHistorys.sign.in'(userId, signInTime) {
      const {clientAddress: ip, httpHeaders}= this.connection;
      const {'user-agent': userAgent} = httpHeaders;
      const {os, browser} = OSAndBrowser(userAgent);
      const username = Meteor.users.findOne({_id: userId}, {fields: {username: 1, _id: 0}}).username;

      LoginHistory.insert({userId, username, ip, os, browser, signInTime, createAt: new Date()});
      Meteor.call('is.online', userId, true)
    },

    'loginHistorys.sign.out'(userId, signOutTime) {
      const {clientAddress: ip, httpHeaders}= this.connection;
      const {'user-agent': userAgent} = httpHeaders;
      const {os, browser} = OSAndBrowser(userAgent);


      const history = LoginHistory.find({userId, ip, os, browser}, {sort: {createAt: -1}}).fetch()[0];

      LoginHistory.update({_id: history._id}, {$set: {signOutTime}});
      Meteor.call('is.online', userId, false)
    },

    'loginHistorys.delete'(historyInfos) {
      check(historyInfos, Array);

      for(let eachItem of historyInfos) {
        if(eachItem.isChecked) {
          LoginHistory.remove(eachItem.historyInfo._id);
        }
      }
    },
  })
}
