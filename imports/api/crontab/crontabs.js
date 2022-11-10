/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Crontab = new Mongo.Collection('crontabs');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('crontabs', function() {
    return Crontab.find();
  });
}

Meteor.methods({
  'crontabs.insert'(crontabInfo) {
    check(crontabInfo, Object);
    check(crontabInfo.cronName, String);
    check(crontabInfo.description, String);
    check(crontabInfo.className, String);
    check(crontabInfo.expression, String);
    check(crontabInfo.plan, String);

    const {cronName, description, className, expression, plan} = crontabInfo;
    if(Crontab.findOne({cronName})) {
      return 'Exist';
    }
    Crontab.insert({
      cronName, description, className, expression, plan,
      status: 'DEFAULT',
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'crontabs.updateStatus'(cronId, status) {
    Crontab.update(cronId,
      {$set:
          {
            status: status,
          },
      });
  },

  /*  'crontabs.updateStatusToStop'() {
      const runCrontabs = Crontab.find({status: 'Running'}).fetch();
      if(runCrontabs.length > 0) {
        for(let eachItem of runCrontabs) {
          Crontab.update(eachItem._id,
            {$set:
                {
                  status: 'Stopped',
                }
            });
        }
      }
    },*/

  'crontabs.delete'(crontabInfo) {
    for(let eachItem of crontabInfo) {
      if(eachItem.isChecked) {
        Crontab.remove(eachItem.crontabId);
      }
    }
  },

});
