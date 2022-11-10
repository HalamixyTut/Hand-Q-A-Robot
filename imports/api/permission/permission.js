/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Permission = new Mongo.Collection('permissions');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('permissions', function() {
    return Permission.find();
  });
}

Meteor.methods({
  'permissions.insert'(permissionInfo) {
    check(permissionInfo, Object);

    const {name, desc} = permissionInfo

    if(Permission.findOne({name})) {
      return 'Exist';
    }

    Permission.insert({
      name: name,
      desc: desc,
      resource: [],
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'permissions.batchImport'(permissionInfos) {
    for (let permission of permissionInfos) {
      check(permission.name, String);
      check(permission.desc, String);

      Permission.insert({
        name: permission.name,
        desc: permission.desc,
        resource: permission.resource,
        createdAt: new Date(),
        updateDate: new Date(),
      });
    }
  },

  'permissions.delete'(permissionInfos) {
    check(permissionInfos, Array);

    for(let eachItem of permissionInfos) {
      if(eachItem.isChecked) {
        Permission.remove(eachItem.permissionInfo._id);
      }
    }

    Meteor.call('role.delete.permission', permissionInfos);
  },

  'permissions.update'(permissionInfo) {
    check(permissionInfo, Object);

    const {id, name, desc} = permissionInfo;
    if(Permission.findOne({name, _id: {$ne: id}})) {
      return 'Exist';
    }
    Permission.update(id,
      {$set:
          {
            name: name,
            desc: desc,
            updateDate: new Date(),
          },
      });
  },

  'permissions.add.resources'(permissionId, resourceList) {
    check(resourceList, Array);

    Permission.update(permissionId,
      {$set:
          {
            resource: resourceList,
            updateDate: new Date(),
          },
      });
  },

  'permissions.delete.resources'(permissionId, resourceList) {
    check(resourceList, Array);

    let permissionResource = Permission.findOne({_id: permissionId}).resource;

    for(let eachItem of resourceList) {
      if(permissionResource.includes(eachItem)) {
        permissionResource.splice(permissionResource.indexOf(eachItem), 1);
      }
    }

    Permission.update(permissionId,
      {$set:
          {
            resource: permissionResource,
            updateDate: new Date(),
          },
      });
  },

  'permission.delete.resource'(resourceInfos) {
    for(let eachItem of resourceInfos) {
      if (eachItem.isChecked) {
        const permissions = Permission.find({resource: eachItem.resourceInfo._id}).fetch();

        for (let permission of permissions) {
          permission.resource.splice(permission.resource.indexOf(eachItem.resourceInfo._id), 1);
          Permission.update(permission._id,
            {
              $set:
                {
                  resource: permission.resource,
                },
            })
        }
      }
    }
  },

});
