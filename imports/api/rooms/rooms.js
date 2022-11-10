/* eslint-disable import/no-unresolved */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Message} from '../chat/message';

export const Room = new Mongo.Collection('rooms');

if (Meteor.isServer) {
  Meteor.publish('rooms', function () {
    return Room.find();
  });
}

Meteor.methods({
  'rooms.insert'(roomInfo) {
    check(roomInfo, Object);

    const {roomName, roomType, saveTime} = roomInfo;
    if(Room.findOne({roomName})) {
      return 'Exist'
    }

    Room.insert({
      roomName: roomName,
      roomType: roomType,
      saveTime: saveTime,
      countUser: 0,
      countMsg: 0,
      createdAt: new Date(),
    });
  },

  'rooms.remove'(roomInfos) {
    check(roomInfos, Array);

    for(let eachItem of roomInfos) {
      if (eachItem.isChecked) {
        Room.remove(eachItem.roomId);
      }
    }
  },

  'rooms.update'(roomInfo) {
    check(roomInfo, Object);

    const {roomId, roomName, roomType, saveTime} = roomInfo;
    if(Room.findOne({roomName, _id: {$ne: roomId}})) {
      return 'Exist'
    }

    Room.update(roomId, {$set: {roomName: roomName, roomType: roomType, saveTime: saveTime}});
    Message.update(roomId, {$set: {roomName: roomName}});
  },

  'rooms.findRoomId'(roomname) {
    check(roomname, String);
    const roomdId = Room.findOne({roomName:roomname},{_id:1});
    return roomdId;
  },

  'clear.room.history'() {
    const rooms = Room.find({}, {fields: {saveTime: 1}}).fetch();
    for(let eachItem of rooms) {
      const roomId = eachItem._id;
      const saveTime = eachItem.saveTime;
      const compareTime = new Date(new Date() - saveTime*86400*1000).toISOString();

      Message.remove({roomId: roomId, 'message.date': {$lt: compareTime}});
    }
  },

  'rooms.batchImport'(rooms) {
    for (let room of rooms) {
      Room.insert({
        ...room,
        countUser: 0,
        countMsg: 0,
        createdAt: new Date(),
      });
    }
  },
});
