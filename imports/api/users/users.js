import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Accounts} from 'meteor/accounts-base';
import nodemailer from 'nodemailer';
import {Permission} from '../permission/permission';
import {Resource} from '../resource/resource';

let transporter = nodemailer.createTransport({
  host: 'smtphm.qiye.163.com',
  secureConnection: false, // use SSL
  port: 25,
  secure: false, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'haojie.zhang@hand-china.com',
    pass: '(zhj123)', // QQ邮箱需要使用授权码
  },
});

//export const UserInfo = new Mongo.Collection("userinfo");
//export const Users = new Mongo.Collection("users");
//const smtp_default_login = "postmaster@sandbox45abd7dea6f04aeb8a1dfed5a0dd5f40.mailgun.org";
//const smtp_default_password = "4941ac10ec9aec7e5ada4aefa812747a-a5d1a068-c12a96b3";
//process.env.MAIL_URL = "smtp://" +smtp_default_login + ":" +smtp_default_password +"@smtp.mailgun.org:587";

//随机密码生成
function create_pwd() {
  let new_pwd = '';
  let j = 0;
  const c = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-\\/.!@#$%^&()_';
  for (let i = 0; i < 8; i++) {
    j = Math.floor(Math.random() * c.length);
    new_pwd += c.charAt(j);
  }

  return new_pwd;
}

if (Meteor.isServer) {
  Meteor.publish('all.user', () => Meteor.users.find());
  Meteor.methods(
    {
      'insert.userinfo'(user) {
        check(user, Object);

        if (user.username !== 'admin') {
          const newUser = {
            username: user.username,
            email: user.email,
            password: user.password,
            profile: {
              phone:user.phone || null,
              gender: user.gender,
              roles: user.roles,
              isActivated: user.isActivated || false,
              type: user.type || 'normal',
              updateDate: new Date(),
            },
          };

          if (Meteor.users.findOne({emails: {$elemMatch: {'address': user.email}}})) {
            return 'emailExists'
          } else if (Meteor.users.findOne({username: user.username})) {
            return 'userExists'
          } else {
            Accounts.createUser(newUser); //创建用户
            //this.unblock();
            let mailOptions = {
              from:'螺钉机器人 <haojie.zhang@hand-china.com>',
              to:user.email,
              subject:'帐号状态',
              text:'您的帐号创建成功但是未激活，请联系管理员！',
              html:'<b>您的帐号创建成功但是未激活，请联系管理员！</b>',
            };
            transporter.sendMail(mailOptions, err => {
              if (err)
              {
                return err;
              }
            });
          }
        }
      },

      'sign.insert.userinfo'(user) {
        check(user, Object);

        if (user.username !== 'admin') {
          if (Meteor.users.findOne({emails: {$elemMatch: {'address': user.email}}})) {
            return 'emailExists'
          } else if (Meteor.users.findOne({username: user.username})) {
            return 'userExists'
          }

          const role = Meteor.roles.findOne({name: 'user'});

          const newUser = {
            username: user.username,
            email: user.email,
            password: user.password,
            profile: {
              phone:user.phone || null,
              gender: user.gender,
              roles: [role._id],
              isActivated: user.isActivated || false,
              type: 'normal',
              updateDate: new Date(),
            },
          };
          Accounts.createUser(newUser); //创建用户
          // this.unblock();
          let mailOptions = {
            from:'螺钉机器人 <haojie.zhang@hand-china.com>',
            to:user.email,
            subject:'帐号状态',
            text:'您的帐号创建成功但是未激活，请联系管理员！',
            html:'<b>您的帐号创建成功但是未激活，请联系管理员！</b>',
          };
          transporter.sendMail(mailOptions, err => {
            if (err)
            {
              return err;
            }
          });
        }
      },

      'ldap.insert.userinfo'(user) {
        check(user, Object);

        const role = Meteor.roles.findOne({name: 'user'}, {fields: {_id: 1}});

        if (user.username !== 'admin') {
          const newUser = {
            username: user.username,
            email: user.email,
            password: user.password,
            profile: {
              phone:user.phone || null,
              gender: user.gender,
              roles: [role._id],
              isActivated: user.isActivated || false,
              updateDate: new Date(),
            },
          };
          Accounts.createUser(newUser); //创建用户
        }
      },

      // const rawUsers = Meteor.users.rawCollection();
      // rawUsers.findOnesync = Meteor.wrapAsync(Meteor.users.find);
      // const myUser = rawUsers.findOnesync({_id:Meteor.userId()});

      'delete.userinfo'(userIdList) {
        for(let i = 0; i < userIdList.length; i++) {
          if(userIdList[i] !== 0) {
            Meteor.users.remove({_id: userIdList[i]}); //删除用户*/
          }
        }
      },

      'hasPermission'(){
        if(!Meteor.user()) {
          return [];
        }
        const c = [];
        if (Meteor.isServer){
          const rawUsers = Meteor.users.rawCollection();
          rawUsers.findOnesync = Meteor.wrapAsync(rawUsers.findOne);
          const myUser = rawUsers.findOnesync({_id:Meteor.userId()});

          const rawRoles = Meteor.roles.rawCollection();
          rawRoles.findOnesync = Meteor.wrapAsync(rawRoles.findOne);
          const myRole = rawRoles.findOnesync({_id:myUser.profile.roles[0]});

          const rawPermissions = Permission.rawCollection();
          rawPermissions.findOnesync = Meteor.wrapAsync(rawPermissions.findOne);
          for (let a of myRole.permission){
            const myPermission = rawPermissions.findOnesync({_id:a});
            for (let b of myPermission.resource){
              const rawResources = Resource.rawCollection();
              rawResources.findOnesync = Meteor.wrapAsync(rawResources.findOne);
              const myResource = rawResources.findOnesync({_id:b});
              c.push(myResource.name);
            }
          }
        }
        return c;
      },

      'update.userinfo'(idArray,email, phone, roles, gender, type){
        check(idArray, Array);
        check(email, Array);
        check(gender, Array);

        if (email.length !== 0) {
          email.map((e) => {
            if (e._id !== undefined && idArray.includes(e._id)) {
              Meteor.users.update({_id: e._id},
                {
                  $set: {
                    emails: [{'address': e.email, 'verified': false}],
                    'profile.updateDate': new Date(),
                  },
                });
            }
          });
        }

        if (phone.length !== 0) {
          phone.map((e) => {
            if (e._id !== undefined && idArray.includes(e._id)) {
              Meteor.users.update({_id: e._id},
                {
                  $set: {
                    'profile.phone': e.phone,
                    'profile.updateDate': new Date(),
                  },
                });
            }
          });
        }

        if (roles.length !== 0) {
          roles.map((e) => {
            if (e._id !== undefined && idArray.includes(e._id)){
              Meteor.users.update({_id: e._id}, {
                $set: {
                  'profile.roles': e.roles,
                  'profile.updateDate': new Date(),
                },
              });
            }
          });
        }

        if (gender.length !== 0) {
          gender.map((e) => {
            if (e._id !== undefined && idArray.includes(e._id)){
              Meteor.users.update({_id: e._id}, {
                $set: {
                  'profile.gender': e.gender,
                  'profile.updateDate': new Date(),
                },
              });
            }
          });
        }

        if (type.length !== 0) {
          type.map((e) => {
            if (e._id !== undefined && idArray.includes(e._id)){
              Meteor.users.update({_id: e._id}, {
                $set: {
                  'profile.type': e.type,
                  'profile.updateDate': new Date(),
                },
              });
            }
          });
        }
      },

      'bulletins.sendEmail'(bulletinInfo) {
        const rs = Meteor.users.find({},{'emails.address':1,'profile.isActivated':1}).fetch();
        const fromEmail = '"Admin" <haojie.zhang@hand-china.com>';
        let toEmails = '';
        for(let eachItem of rs) {
          const toEmail = eachItem.emails[0].address;
          const isActivated = eachItem.profile.isActivated;

          if(isActivated) {
            toEmails = toEmails + ',' + toEmail;
          }
        }

        if(toEmails === '') {
          return;
        }

        // eslint-disable-next-line no-control-regex
        const regExp = new RegExp('\n', 'g');
        bulletinInfo.content = bulletinInfo.content.replace(regExp, '<br />');
        const htmlContent = `<p style="text-align:left;font-size:16px;"><span><b>${bulletinInfo.title}</b></span></p>` +
          `<p style="text-align:left;font-size:14px;">类型: ${bulletinInfo.typeText}</p>` +
          `<p style="text-align:left;font-size:14px;">${bulletinInfo.content}</p>`;
        let mailOptions = {
          from: fromEmail,
          to: toEmails,
          subject: '螺钉机器人最新公告',
          // text:"1234",
          html: htmlContent,
        };

        transporter.sendMail(mailOptions, err => {
          if (err)
          {
            return err;
          }
        });
      },

      'findByemailOrUsername.userinfo'(selector) {
        if (typeof selector === 'string')
          if (selector.indexOf('@') === -1)
            selector = {username: selector};
          else
            selector = {'emails.address': selector};

        let userInfo = Meteor.users.findOne(selector, {fields: {_id: 0, profile: 1}});

        if(userInfo) {
          return userInfo.profile.isActivated;
        }else {
          return 'NoUser';
        }
      },

      //更改帐号状态
      'accountStatus.userinfo'(userid, status) {
        Meteor.users.update({_id: userid}, {
          $set: {
            'profile.isActivated': status,
            'profile.updateDate': new Date(),
          },
        });
      },

      //发送邮件
      'sendEmail'(userid) {
        const rs = Meteor.users.findOne({_id:userid},{'emails.address':1,'profile.isActivated':1});
        const toEmail = rs.emails[0].address;
        const isActivated = rs.profile.isActivated;
        const fromEmail = '"Admin" <haojie.zhang@hand-china.com>';
        const subject = '帐号状态';
        let text;
        if (isActivated) {
          text = '您的帐号已经激活！';
        } else {
          text = '您的帐号未激活，请联系管理员！';
        }
        //this.unblock();
        let mailOptions = {
          from:fromEmail,
          to:toEmail,
          subject:subject,
          text:text,
          html:`<b>${text}</b>`,
        };
        transporter.sendMail(mailOptions, err => {
          if (err)
          {
            return err;
          }
        });
      },

      //通过id查找登录邮箱
      'findEmail.userinfo'(userid) {
        const account = Meteor.users.findOne({_id:userid},{'emails.address':1});
        return account.emails[0].address;
      },

      //找回密码
      'forget.password'(option) {
        const {email} = option;
        const user = Accounts.findUserByEmail(email);
        if (user) {
          const userId = user._id;
          const newPassword = create_pwd();
          Accounts.setPassword(userId, newPassword);

          const fromEmail = '"Admin" <haojie.zhang@hand-china.com>';
          const subject = '找回密码';
          const text = `密码已修改为:${newPassword}`;
          let mailOptions = {
            from: fromEmail,
            to: email,
            subject: subject,
            text:text,
            html:`<b>${text}</b>`,
          };
          transporter.sendMail(mailOptions);

          return 'setPassword';
        } else {
          return 'noUser';
        }
      },

      //角色删除时，删除相关联的用户下的角色
      'user.delete.role'(roleInfos) {
        for(let eachItem of roleInfos) {
          if (eachItem.isChecked) {
            const users = Meteor.users.find({'profile.roles': eachItem.roleInfo._id}).fetch();

            for (let user of users) {
              user.profile.roles.splice(user.profile.roles.indexOf(eachItem.roleInfo._id), 1);
              Meteor.users.update(user._id,
                {
                  $set:
                    {
                      'profile.roles': user.profile.roles,
                    },
                })
            }
          }
        }
      },

      'is.online'(userId, onLine) {
        Meteor.users.update(userId, {$set: {'profile.online': onLine}})
      },
    },
  );
}
