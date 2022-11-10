import { Meteor } from 'meteor/meteor';
import express from 'express';
import {Message} from '../../chat/message';
import {Satisfaction} from '../../satisfaction/satisfaction';
import {LoginHistory} from '../../users/login_history';

const app = express();

if (Meteor.isServer){
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
  app.get('/api/chat/message', (req, res)=>{
    let response;

    res.setHeader('Content-Type', 'application/json');

    let base = +new Date(2020, 5, 1);
    const eight = 8 * 3600 * 1000;
    let base1 = base + eight;
    const oneDay = 24 * 3600 * 1000;
    let accessTrend = [];

    for (let i = 1; i < 20000; i++) {
      let now = new Date(base1);
      let tomorrow = new Date(base1 += oneDay);
      const today = new Date();
      if (now > today){
        break;
      } else {
        const count = LoginHistory.find({'signInTime':{$gte:now,$lt:tomorrow}}).count();
        const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
        accessTrend.push({count, date})
      }
    }

    const unanswered = Message.find({'message.frmmsg':{$exists:true},'message.userMsg':'问题未收录！'}).count();
    const allAnswer = Message.find({'message.frmmsg':{$exists:true}}).count();
    const satisfied = Satisfaction.find({'satisfaction':1}).count();
    const disatisfied = Satisfaction.find({'satisfaction':-1}).count();
    const uncommented = Satisfaction.find({'satisfaction':0}).count();
    response = {
      accessTrend,
      answered : allAnswer - unanswered,
      unanswered,
      satisfied,
      disatisfied,
      uncommented,
    };
    res.end(JSON.stringify(response));

  });
}
