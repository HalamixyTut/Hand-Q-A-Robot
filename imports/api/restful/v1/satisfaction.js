import { Meteor } from 'meteor/meteor';
import express from 'express';

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

  app.post('/api/v1/satisfaction/S', (req, res)=>{
    let response;

    if (req.method === 'POST') {
      req.on('data', Meteor.bindEnvironment((chunk)=>{
        chunk = JSON.parse(chunk);

        const {userName, userPassword} = chunk;

        if (userName !== undefined && userPassword !== undefined) {
          if(Meteor.users.findOne({username: userName})){
            const {messageId, isSatisfied} = chunk;
            Meteor.call('api.satisfaction', {messageId, isSatisfied});
            response = {
              success : true,
            };
          }else {
            response = {
              success : false,
              code : 'ERR_INF001',
              message : '用户名或密码错误',
            };
          }
        }else {
          response = {
            success : false,
            code : 'ERR_INF002',
            message : '用户名或密码缺失',
          };
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify((response)));
      }));
    }
  });

}
