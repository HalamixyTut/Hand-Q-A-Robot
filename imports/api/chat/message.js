import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {Room} from '../rooms/rooms';
import {Satisfaction} from '../satisfaction/satisfaction';

export const Message = new Mongo.Collection('message');

if (Meteor.isServer) {
  Meteor.publish('message', () => Message.find({}));
}

Meteor.methods({
  'insert.message'(message, roomName) {
    const roomid = Room.findOne({roomName: roomName}, {_id: 1});

    if (roomid) {
      Message.insert(
        {
          message: message,
          roomName: roomName,
          roomId: roomid._id,
        },
      );
    }
  },

  'robot.insert.jMessage'(message, roomName) {
    const { userMsg, userName, date } = message;
    let user;
    //判断用户信息
    if (typeof userName === 'string') {
      if (userName.indexOf('@') === -1)
        user = Accounts.findUserByUsername(userName);
      else
        user = Accounts.findUserByEmail(userName);
    }

    if (user) {
      const replyMsg = Message.find({thirdParty: 'jHubot'}, {sort: {createAt: -1}}).fetch()[0];
      const room = Room.findOne({roomName});
      //判断询问和回复的消息的room是否对应
      if (room) {
        if (replyMsg.roomId === room._id) {
          let resultMsg;
          if (Array.isArray(replyMsg.message)) {
            resultMsg = [...replyMsg.message, {
              userId: user._id,
              userName: user.username,
              userMsg,
              date,
            }];
          } else {
            resultMsg = [replyMsg.message, {
              userId: user._id,
              userName: user.username,
              userMsg,
              date,
            }]
          }

          Message.update({_id: replyMsg._id},{$set: {message: resultMsg}});
        } else {
          Message.insert({
            message: {
              userId: user._id,
              userName: user.username,
              userMsg,
              date,
            },
            roomName,
            roomId: room._id,
            thirdParty: 'jenkins',
            createAt: new Date(),
          })
        }
      }
    }
  },

  'robot.insert.message'(message, roomName, roomId, thirdParty) {
    const userMsg = Message.findOne({'message.frmmsg': message.frmmsg});
    const user = Meteor.users.findOne({_id: message.userId});

    if (roomId && !userMsg) {
      const doc = thirdParty ?
        {
          message: {userName: user.username, ...message},
          roomName: roomName,
          roomId,
          thirdParty,
          createAt: new Date(),
        }
        :
        {
          message: {userName: user.username, ...message},
          roomName: roomName,
          roomId,
          createAt: new Date(),
        };
      Message.insert(doc);
    }
  },

  'message.delete'(msgId){
    Message.remove({_id:msgId});
  },

  'message.delete1'(questionInfos){
    check(questionInfos, Array);

    for(let eachItem of questionInfos) {
      Message.remove({'message.frmmsg':eachItem.questionInfo.msgId});
      Message.remove({_id:eachItem.questionInfo.msgId});
    }
  },

  'message.delete2'(satisfactionInfos){
    check(satisfactionInfos, Array);

    for(let eachItem of satisfactionInfos) {
      const msgId = '-'+eachItem.satisfactionInfo.msgId;
      Message.remove({'message.frmmsg':msgId});
      Message.remove({_id:eachItem.satisfactionInfo.msgId});
    }
  },

  'message.delete.batch'(msgIds){
    check(msgIds, Array);

    for(let eachItem of msgIds) {
      Message.remove({_id:eachItem});
    }
  },

  'api.insert.message'(messageId, message, roomName, roomId) {
    const roomid = Room.findOne({roomName: roomName}, {_id: 1});
    if (roomid) {
      Message.insert(
        {
          _id: messageId,
          message: message,
          roomName: roomName,
          roomId: roomid._id,
          satisfaction: 0,
        },
      );
    }
  },

  'api.satisfaction'(satInfo) {
    const messsage = Message.findOne({_id: satInfo.messageId});
    const satisfaction = Satisfaction.findOne({msgId:satInfo.messageId});
    if(messsage) {
      Message.update(
        {_id: satInfo.messageId},
        {
          $set: {
            satisfaction: satInfo.isSatisfied,
          },
        },
      );
    }
    if (satisfaction) {
      Satisfaction.update(
        {msgId: satInfo.messageId},
        {
          $set: {
            satisfaction: satInfo.isSatisfied,
          },
        },
      );
    }
  },
});
