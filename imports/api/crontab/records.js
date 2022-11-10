/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  Meteor.methods({
    'records.search'() {
      // eslint-disable-next-line no-undef
      return SyncedCron._collection.find({}).fetch();
    },
  });
}
