import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import Jwt from '../restful/utils/Jwt'

export const Immsg = new Mongo.Collection('immsgs');

if (Meteor.isServer) {
  Meteor.publish('immsgs', (userId) => Immsg.find({_id: new RegExp(userId)}));

  Meteor.methods({
    'immsgs.insert'(_id, imMsg, customServer='客服') {
      check(_id, String);
      check(customServer, String);
      check(imMsg, Object);

      const isExist = Immsg.findOne({_id});
      if(isExist) {
        const oldMsgs = isExist.messages;
        Immsg.update({_id}, {$set: {messages: [...oldMsgs, imMsg], updateAt: new Date()}});
      }else {
        Immsg.insert({
          _id,
          messages:[imMsg],
          customServer: customServer,
          isActive:true,
          createAt: new Date(),
          updateAt: new Date(),
        });
      }
    },

    'update.immsg.to.read'(imMsg) {
      Immsg.update(
        {_id: imMsg._id, 'messages.isRead': false, 'messages.sourceId': imMsg.userId},
        {$set: {'messages.$[].isRead': true}},
        )
    },

    'change.active.status'(thirdId) {
      if(!thirdId) return;

      const msg = Immsg.findOne({_id: new RegExp(thirdId)}, {fields: {_id: 1}});
      if(msg) {
        Immsg.update({_id: msg._id}, {$set: {isActive: false}});
      }
    },

    'clear.kefu.history'() {
      const saveTime = 18;
      const compareTime = new Date(new Date() - saveTime*86400*1000);

      Immsg.remove({createAt: {$lt: compareTime}})
    },

    'get.thirdId'(token) {
      const jwt = new Jwt(token);
      let result = jwt.verifyToken();
      if (result === 'error') {
        return ''
      } else {
        return result;
      }
    },
  });
}
