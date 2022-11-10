import { Meteor } from 'meteor/meteor';
import express from 'express';
import getIPAdress from '../utils/get_address';
import Jwt from '../utils/Jwt';
import Circle from '../../settings/thirdParty/algorithm/circle';
import MaxFreeTime from '../../settings/thirdParty/algorithm/maxFreeTime';
import MinResponseTimes from '../../settings/thirdParty/algorithm/minResponseTimes';
import {ThirdParty} from "../../settings/thirdParty/third_party";

const app = express();
if (Meteor.isServer) {
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));

  app.all('*',function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, X-CSRF-Token');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.setHeader('X-Powered-By',' 3.2.1') ;
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    }
    else {
      next();
    }
  });

  // LdSupport、AiBoTSupport
  app.post('/api/v1/auth/cs', (req, res)=>{
    let response;
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST') {
      req.on('data', Meteor.bindEnvironment((chunk)=>{
        chunk = JSON.parse(chunk);

        const {code, userName, userPassword} = chunk;

        if(userName && userPassword) {
          const user = Meteor.users.findOne({username: userName});
          if(user) {
            const company = ThirdParty.findOne({code});
            if (company) {
              const { roleName, algorithm, name} = company;
              // eslint-disable-next-line import/no-dynamic-require
              let component = require(`../../settings/thirdParty/algorithm/${algorithm}`);
              const userId = component(roleName, name);

              if(userId) {
                let jwt = new Jwt(userId)
                const token = jwt.getToken();
                response = {
                  success : true,
                  url: 'http://' + getIPAdress() + ':3017/kefu/' + token,
                };
              } else {
                response = {
                  success : false,
                  code : 'ERR_INF005',
                  message: '无在线客服',
                };
              }
            } else {
              response = {
                success : false,
                code : 'ERR_INF004',
                message: '公司编码不正确',
              };
            }
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

        res.end(JSON.stringify(response));
      }));
    }
  });
}
