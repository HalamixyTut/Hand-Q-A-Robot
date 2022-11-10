/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Bulletin = new Mongo.Collection('bulletins');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('bulletins', function() {
    return Bulletin.find();
  });
}

Meteor.methods({
  'bulletins.insert'(bulletinInfo) {
    check(bulletinInfo, Object);

    const {title, content, type} = bulletinInfo;
    if(Bulletin.findOne({title})) {
      return 'Exist';
    }

    Bulletin.insert({
      title, content, type,
      createdAt: new Date(),
      updateDate: new Date(),
    });

    Meteor.call('bulletins.sendEmail',bulletinInfo);
  },

  'bulletins.delete'(bulletinInfo) {
    for(let eachItem of bulletinInfo) {
      if(eachItem.isChecked) {
        Bulletin.remove(eachItem.bulletinId);
      }
    }
  },

  'bulletins.update'(bulletinInfo) {
    check(bulletinInfo, Object);

    const {id, title, content, type} = bulletinInfo;
    if(Bulletin.findOne({title, _id: {$ne: id}})) {
      return 'Exist';
    }

    Bulletin.update(id,
      {$set:
          {
            title, content, type,
            updateDate: new Date(),
          },
      });

    Meteor.call('bulletins.sendEmail',bulletinInfo);
  },

});
