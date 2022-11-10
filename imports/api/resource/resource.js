/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Resource = new Mongo.Collection('resources');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('resources', function() {
    return Resource.find();
  });
}

Meteor.methods({
  'resources.insert'(resourceInfo) {
    check(resourceInfo, Object);

    const {name, type, desc} = resourceInfo;
    if(Resource.findOne({name})) {
      return 'Exist';
    }

    Resource.insert({
      name: name,
      type: type,
      desc: desc,
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'resources.batchImport'(resourceInfos) {
    for (let resource of resourceInfos) {
      check(resource.name, String);
      check(resource.type, String);
      check(resource.desc, String);

      Resource.insert({
        name: resource.name,
        type: resource.type,
        desc: resource.desc,
        createdAt: new Date(),
        updateDate: new Date(),
      });
    }
  },

  'resources.delete'(resourceInfos) {
    check(resourceInfos, Array);

    for(let eachItem of resourceInfos) {
      if(eachItem.isChecked) {
        Resource.remove(eachItem.resourceInfo._id);
      }
    }

    Meteor.call('permission.delete.resource', resourceInfos);
  },

  'resources.update'(resourceInfo) {
    check(resourceInfo, Object);

    const {id, type, desc} = resourceInfo;
    Resource.update(id,
      {$set:
          {
            type: type,
            desc: desc,
            updateDate: new Date(),
          },
      });
  },

});
