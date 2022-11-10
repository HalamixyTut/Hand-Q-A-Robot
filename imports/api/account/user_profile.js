/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Profile = new Mongo.Collection('profiles');

if (Meteor.isServer) {

  Meteor.publish('profiles', function () {
    return Profile.find();
  });

  Meteor.publish('user.profiles', userId => Profile.find({userId: new RegExp(userId)} ));

  Meteor.methods({
    'profiles.insert'(userId, language) {
      check(userId, String);
      check(language, String);

      Profile.insert({
        userId: userId,
        language: language,
        createdAt: new Date(),
      });
    },

    'profiles.update'(profileId, language) {
      check(profileId, String);
      check(language, String);

      Profile.update(profileId, {$set: {language: language}});
    },
  });
}

