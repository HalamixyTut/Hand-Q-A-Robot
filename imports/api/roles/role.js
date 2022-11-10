/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

if (Meteor.isServer) {
  Meteor.publish('roles', function() {
    return Meteor.roles.find();
  });
}

Meteor.methods({
  'roles.insert'(roleInfo) {
    check(roleInfo, Object);

    const {roleName, roleDesc} = roleInfo;

    if(Meteor.roles.findOne({name: roleName})) {
      return 'Exist';
    }

    Meteor.roles.insert({
      name: roleName,
      desc: roleDesc,
      permission: [],
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'roles.batchImport'(roleInfos) {
    for (let role of roleInfos) {
      check(role.name, String);
      check(role.desc, String);

      Meteor.roles.insert({
        name: role.name,
        desc: role.desc,
        permission: role.permission,
        createdAt: new Date(),
        updateDate: new Date(),
      });
    }
  },

  'roles.remove'(roleInfos) {
    check(roleInfos, Array);

    for (let eachItem of roleInfos) {
      if (eachItem.isChecked) {
        Meteor.roles.remove(eachItem.roleInfo._id);
      }
    }

    Meteor.call('user.delete.role', roleInfos);
  },

  'roles.update'(roleInfo) {
    check(roleInfo, Object);

    const {roleId, roleName, roleDesc} = roleInfo;

    if(Meteor.roles.findOne({name: roleName, _id: {$ne: roleId}})) {
      return 'Exist';
    }

    Meteor.roles.update(roleId,
      {$set:
          {
            name: roleName,
            desc: roleDesc,
            updateDate: new Date(),
          },
      });
  },

  'roles.add.permissions'(roleId, permissionList) {
    check(permissionList, Array);

    Meteor.roles.update(roleId,
      {$set:
          {
            permission: permissionList,
            updateDate: new Date(),
          },
      });
  },

  'roles.delete.permissions'(roleId, permissionList) {
    check(permissionList, Array);

    let rolePermission = Meteor.roles.findOne({_id: roleId}).permission;

    for(let eachItem of permissionList) {
      if(rolePermission.includes(eachItem)) {
        rolePermission.splice(rolePermission.indexOf(eachItem), 1);
      }
    }

    Meteor.roles.update(roleId,
      {$set:
          {
            permission: rolePermission,
            updateDate: new Date(),
          },
      });
  },

  // 权限删除时，删除关联角色拥有的改权限
  'role.delete.permission'(permissionInfos) {
    for(let eachItem of permissionInfos) {
      if (eachItem.isChecked) {
        const roles = Meteor.roles.find({permission: eachItem.permissionInfo._id}).fetch();

        for (let role of roles) {
          role.permission.splice(role.permission.indexOf(eachItem.permissionInfo._id), 1);
          Meteor.roles.update(role._id,
            {
              $set:
                {
                  permission: role.permission,
                },
            })
        }
      }
    }
  },

});
