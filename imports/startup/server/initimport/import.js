/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {Resource} from '../../../api/resource/resource';
import {Permission} from '../../../api/permission/permission';

const fs = require('fs');
const parse = require('csv-parse/lib/sync');

const getData = (fileName) => {
  let data = fs.readFileSync(Assets.absoluteFilePath('initimport/' + fileName), {encoding:'utf-8'});
  data = parse(data,{ columns: true, auto_parse: true });

  return data;
};

if(Meteor.isServer) {
  Meteor.startup(() => {
    if(!Meteor.users.findOne()) {
      // 初始化资源
      let data = getData('data_resource');
      Meteor.call('resources.batchImport', data);

      // 初始化权限
      data = getData('data_permission');
      let permissionData = [];

      for(let eachItem of data) {
        const resourceNames = eachItem.resource.split(';');
        let resources = [];

        for(let name of resourceNames) {
          const resource = Resource.findOne({name: name});
          if(resource) {
            resources.push(resource._id);
          }
        }

        const permission = {
          name: eachItem.name,
          desc: eachItem.desc,
          resource: resources,
        };
        permissionData.push(permission);
      }

      Meteor.call('permissions.batchImport', permissionData);

      // 初始化角色
      data = getData('data_role');
      let roleData = [];

      for(let eachItem of data) {
        const permissionNames = eachItem.permission.split('/');
        let permissions = [];

        for (let name of permissionNames) {
          const permission = Permission.findOne({name: name});
          if(permission) {
            permissions.push(permission._id);
          }
        }

        const role = {
          name: eachItem.name,
          desc: eachItem.desc,
          permission: permissions,
        };

        roleData.push(role);
      }

      Meteor.call('roles.batchImport', roleData);

      // 初始化用户
      const user_system = getData('user_system');
      const user_aibot = getData('user_aibot_support');
      data = user_system.concat(user_aibot);

      for(let eachItem of data) {
        const role = Meteor.roles.findOne({name: eachItem.roles});

        const user = {
          username: eachItem.username,
          email: eachItem.email,
          password: eachItem.password.toString(),
          profile: {
            phone: eachItem.phone,
            gender: eachItem.gender,
            roles: [role._id],
            isActivated: eachItem.isActivated === 'Y' ? true : false,
            type: 'normal',
            updateDate: new Date(),
          },
        };

        Accounts.createUser(user);
      }

      // 初始化公共通讯组
      data = getData('data_rooms');
      Meteor.call('rooms.batchImport', data);

      // 初始化快速编码
      data = getData('data_coding');
      Meteor.call('codings.batchImport', data);

      data = getData('data_option')
      Meteor.call('options.batchImport', data);
    }
  });
}
