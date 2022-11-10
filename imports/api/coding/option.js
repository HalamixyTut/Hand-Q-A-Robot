/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Option = new Mongo.Collection('options');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('options', function() {
    return Option.find();
  });
}

Meteor.methods({
  'options.insert'(optionInfo) {
    check(optionInfo, Object);

    const {cname, name, mean, desc} = optionInfo;
    if(Option.findOne({cname, name})) {
      return 'Exist';
    }

    Option.insert({
      cname: cname,
      name: name,
      mean: mean,
      desc: desc,
      resource: [],
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'options.delete'(optionInfos) {
    check(optionInfos, Array);

    for(let eachItem of optionInfos) {
      if(eachItem.isChecked) {
        Option.remove(eachItem.optionInfo._id);
      }
    }
  },

  'options.update'(optionInfo) {
    check(optionInfo, Object);

    const {id, mean, desc} = optionInfo;

    Option.update(id,
      {$set:
          {
            mean: mean,
            desc: desc,
            updateDate: new Date(),
          },
      });
  },

  'options.batchImport'(options) {
    for(let option of options) {
      Option.insert({
        ...option,
        resource: [],
        createdAt: new Date(),
        updateDate: new Date(),
      });
    }
  },
});
