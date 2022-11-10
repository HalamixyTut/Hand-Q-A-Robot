/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Ldap = new Mongo.Collection('ldaps');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('ldaps', function() {
    return Ldap.find();
  });
}

Meteor.methods({
  'ldaps.insertOrUpdate'(info) {
    check(info, Object);
    check(info.whiteList, Array);

    const ldap = Ldap.findOne();
    if(ldap) {
      Ldap.update(ldap._id,
        {$set:
            {
              isOpen: info.isOpen,
              url: info.url,
              timeout: info.timeout,
              baseDN: info.baseDN,
              whiteList: info.whiteList,
            },
        });
    }else {
      Ldap.insert({
        isOpen: info.isOpen,
        url: info.url,
        timeout: info.timeout,
        baseDN: info.baseDN,
        whiteList: info.whiteList,
      });
    }
  },

  'ldaps.updateIsOpen'(info) {
    check(info, Object);
    check(info.isOpen, Boolean);

    const ldap = Ldap.findOne();
    if(ldap) {
      Ldap.update(ldap._id,
        {$set:
            {isOpen: info.isOpen},
        });
    }else {
      Ldap.insert({
        isOpen: info.isOpen,
      });
    }
  },
});
