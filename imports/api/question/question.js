/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import {Message} from '../chat/message';

export const Question = new Mongo.Collection('questions');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('questions', function() {
    return Question.find();
  });

  Meteor.methods({
    'questions.insert'(name,msgId) {
      check(name, String);

      Question.insert({
        name: name,
        msgId:msgId,
        createdAt: new Date(),
        updateDate: new Date(),
      });
    },

    getQuestion(){
      if (Message.find({'message.userMsg':'问题未收录！'}).fetch().length !== 0){
        const messages = Message.find({'message.userMsg':'问题未收录！'}).fetch();
        for (let m of messages) {
          const messageId = m.message.frmmsg;
          const message1 = Message.find({_id:messageId}).fetch();
          for (let m1 of message1){
            const msg = m1.message.userMsg;
            const msgId = m1._id;
            const ques = msg.split(' ')[1];
            if (Question.find({name:ques}).fetch().length == 0) {
              Meteor.call('questions.insert',ques,msgId);
            }
          }
        }
      }
    },

    'questions.delete'(questionInfos) {
      check(questionInfos, Array);

      for(let eachItem of questionInfos) {
        if(eachItem.isChecked) {
          Question.remove(eachItem.questionInfo._id);
        }
      }

    },


  });

}


