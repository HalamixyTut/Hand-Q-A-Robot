/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Coding = new Mongo.Collection('codings');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('codings', function() {
    return Coding.find();
  });
}

Meteor.methods({
  'codings.insert'(codingInfo) {
    check(codingInfo, Object);

    const {name, desc} = codingInfo;
    if(Coding.findOne({name})) {
      return 'Exist';
    }

    Coding.insert({
      name: name,
      desc: desc,
      resource: [],
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'codings.delete'(codingInfos) {
    check(codingInfos, Array);

    for(let eachItem of codingInfos) {
      if(eachItem.isChecked) {
        Coding.remove(eachItem.codingInfo._id);
      }
    }
  },

  'codings.update'(codingInfo) {
    check(codingInfo, Object);

    const {id, desc} = codingInfo;

    Coding.update(id,
      {$set:
          {
            desc: desc,
            updateDate: new Date(),
          },
      });
  },

  'codings.batchImport'(codings) {
    for(let coding of codings) {
      Coding.insert({
        ...coding,
        resource: [],
        createdAt: new Date(),
        updateDate: new Date(),
      });
    }
  },
});
