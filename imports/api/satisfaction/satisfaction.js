/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Satisfaction = new Mongo.Collection('satisfactions');

if (Meteor.isServer) {
  Meteor.publish('satisfactions', function() {
    return Satisfaction.find();
  });

  Meteor.methods({
    'satisfactions.insert'(msgId,ques,answer,satisfaction) {
      check(msgId,String);
      check(ques, String);
      check(answer, String);

      const has = Satisfaction.findOne({msgId:msgId});
      if (!has){
        Satisfaction.insert({
          msgId:msgId,
          ques:ques,
          answer:answer,
          satisfaction:satisfaction,
          createdAt: new Date(),
          updateDate: new Date(),
        });
      }
    },

    'satisfactions.delete'(satisfactionInfos) {
      check(satisfactionInfos, Array);

      for(let eachItem of satisfactionInfos) {
        if(eachItem.isChecked) {
          Satisfaction.remove(eachItem.satisfactionInfo._id);
        }
      }
    },
  });
}


