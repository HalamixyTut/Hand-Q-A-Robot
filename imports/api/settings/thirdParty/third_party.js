/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {check} from 'meteor/check';

export const ThirdParty = new Mongo.Collection('thirdParty');

if (Meteor.isServer) {

  Meteor.publish('third.party', function () {
    return ThirdParty.find();
  });

  Meteor.methods({
    'third.party.insert'(party) {
      check(party, Object);

      const { code, name, algorithm, roleName } = party;
      if(ThirdParty.findOne({code})) {
        return 'Exist'
      }

      ThirdParty.insert({
        code,
        name,
        algorithm,
        roleName,
        createdAt: new Date(),
      });
    },

    'third.party.update'(party) {
      check(party, Object);

      const { partyId, code, name, algorithm, roleName } = party;
      if(ThirdParty.findOne({code, _id: {$ne: partyId}})) {
        return 'Exist'
      }

      ThirdParty.update(partyId, {$set: {code, name, algorithm, roleName}});
    },

    'third.party.delete'(party) {
      check(party, Array);

      for (const eachItem of party) {
        ThirdParty.remove(eachItem.partyId);
      }
    },

    'customer.server.algorithm'() {
    },
  });
}

