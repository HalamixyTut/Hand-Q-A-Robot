import { Meteor } from 'meteor/meteor';
import express from 'express';
import {Message} from '../../chat/message';

/**
 *
 *  RESETFul Api
 *  message:
 *    GET: http://location:3000/api/v1/message
 *    return: message collection
 *
 *    POST: http://localhost:3000/api/v1/message -d "userName=" -d "userPassword="
 *    return: user._id
 */


const app = express();

if (Meteor.isServer) {
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));

  app.all('*',function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X-CSRF-Token');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.setHeader('X-Powered-By',' 3.2.1') ;
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    }
    else {
      next();
    }
  });

  app.get('/api/v1/message/S', (req, res) => {
    let response;
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'GET') {
      req.on('data', Meteor.bindEnvironment((chunk) => {
        chunk = JSON.parse(chunk);

        let userName = chunk.userName;
        let userPassword = chunk.userPassword;

        if (userName !== undefined && userPassword !== undefined) {
          let user = Meteor.users.findOne({username: userName});
          if (user) {
            let userMsg = [];
            const myInterval = Meteor.setInterval(() => {
              userMsg = Message.find({'message.frmmsg': '-' + chunk.frmmsg}, {fields: {message: 1, _id: 0}}).fetch();

              if(userMsg.length > 0) {
                response = {
                  success: true,
                  message: userMsg[userMsg.length-1].message,
                };

                res.end(JSON.stringify((response)));
                Meteor.clearInterval(myInterval);
              }
            }, 500);

            Meteor.setTimeout(() => {
              Meteor.clearInterval(myInterval);

              response = {
                success: false,
                code: 'ERR_INF003',
                message: '未查找到数据',
              };
              res.end(JSON.stringify((response)));
            }, 3000);

          }else {
            response = {
              success : false,
              code : 'ERR_INF001',
              message : '用户名或密码错误',
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          }
        } else {
          response = {
            success : false,
            code : 'ERR_INF002',
            message : '用户名或密码缺失',
          };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
        }
      }));
    }
  });

  app.post('/api/v1/message/S', (req, res)=>{
    let response;

    if (req.method === 'POST') {
      req.on('data', Meteor.bindEnvironment((chunk)=>{
        chunk = JSON.parse(chunk);

        let userName = chunk.userName;
        let userPassword = chunk.userPassword;

        if (userName !== undefined && userPassword !== undefined) {
          let user = Meteor.users.findOne({username: userName}, {fields: {_id: 1}});

          if (user) {
            let message = {
              'userId':user._id,
              'userName':userName,
              'userMsg':chunk.userMsg,
              'date': new Date().toISOString(),
            };

            let roomName = chunk.roomName ;
            let roomId = chunk.roomId;

            const messageId = new Mongo.ObjectID()._str;
            Meteor.call('api.insert.message',messageId, message, roomName, roomId);
            // const ques = message.userMsg.split(' ')[1];
            // Meteor.call('satisfactions.insert',messageId,ques,answer,satisfaction)

            response = {
              success : true,
              message: messageId,
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify((response)));
          } else {
            response = {
              success : false,
              code : 'ERR_INF001',
              message : '用户名或密码错误',
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
          }
        } else {
          response = {
            success : false,
            code : 'ERR_INF002',
            message : '用户名或密码缺失',
          };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
        }
      }));
    }
  });

  app.post('/api/v1/message/G', (req, res) => {
    let response;
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST') {
      req.on('data', Meteor.bindEnvironment((chunk) => {
        chunk = JSON.parse(chunk);

        let userName = chunk.userName;
        let userPassword = chunk.userPassword;

        if (userName !== undefined && userPassword !== undefined) {
          let userMsg = [];

          const myInterval = Meteor.setInterval(() => {
            userMsg = Message.find({'message.frmmsg': '-' + chunk.frmmsg}, {fields: {message: 1, _id: 0}}).fetch();

            if(userMsg.length > 0) {
              response = {
                success: true,
                message: userMsg[userMsg.length-1].message,
              };

              res.end(JSON.stringify((response)));
              Meteor.clearInterval(myInterval);
            }
          }, 500);

          Meteor.setTimeout(() => {
            Meteor.clearInterval(myInterval);

            response = {
              success: false,
              code: 'ERR_INF003',
              message: '未查找到数据',
            };
            res.end(JSON.stringify((response)));
          }, 3000);
        } else {
          response = {
            success : false,
            code : 'ERR_INF002',
            message : '用户名或密码缺失',
          };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(response));
        }
      }));
    }
  });
}
