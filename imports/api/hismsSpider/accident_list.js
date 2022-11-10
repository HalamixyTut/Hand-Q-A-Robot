/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import nodemailer from 'nodemailer';

export const LineDatas = new Mongo.Collection('h_incident_line');
export const HeaderDatas = new Mongo.Collection('h_incident');


if (Meteor.isServer) {
  Meteor.methods({
    'sendmail.to.hisms'(to_list, subject, text) {
      let transporter = nodemailer.createTransport({
        host: 'mail.hand-china.com',
        secureConnection: false, // use SSL
        port: 25,
        secure: false, // secure:true for port 465, secure:false for port 587
        auth: {
          user: 'haojie.zhang@hand-china.com',
          pass: '(zhj123)', // QQ邮箱需要使用授权码
        },
      });

      let mailOptions = {
        from: '螺钉机器人 <haojie.zhang@hand-china.com>',
        to: to_list,
        subject: subject,
        text: text,
        html: `<b>${text}</b>`,
      };
      transporter.sendMail(mailOptions, err=>{
        if (err)
        {
          return err;
        }
      });
    },

    'accident.list'() {
      const subject = '超七天未回复问题';
      const unnsweredLine = LineDatas.find({reptime: {$lt: new Date(new Date() - 7*24*3600*1000).toLocaleString()}}, {fields: {num: 1, supporter: 1, _id: 0}}).fetch();

      for(let eachItem of unnsweredLine) {
        const unnsweredHeader = HeaderDatas.findOne({num: eachItem.num}, {fields: {code: 1, application: 1, _id: 0}});
        const userMail = Meteor.users.findOne({username: eachItem.supporter}, {fields: {emails: 1 , _id: 0}});
        let to_list, text;

        if(userMail) {
          to_list = userMail.emails[0].address;
          text = unnsweredHeader.code + unnsweredHeader.application;
        }else {
          to_list = ['haojie.zhang@hand-china.com'];
          text = '系统无该用户: ' + eachItem.supporter + '<br />' + unnsweredHeader.code + unnsweredHeader.application;
        }

        Meteor.call('sendmail.to.hisms', to_list, subject, text)
      }
    },
  });
}
