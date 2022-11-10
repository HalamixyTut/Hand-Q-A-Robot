import { Meteor } from 'meteor/meteor';
import express from 'express';
import {Option} from '../../coding/option';

const app = express();

if (Meteor.isServer){
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
  app.post('/api/options', (req, res)=>{
    if (req.method === 'POST') {
      req.on('data', Meteor.bindEnvironment((chunk)=>{
        chunk = JSON.parse(chunk);

        if (Object.keys(chunk).length > 0 && chunk.cname) {
          const options = Option.find(chunk).fetch();
          res.end(JSON.stringify(options));
        } else {
          res.end(JSON.stringify([]));
        }
      }));
    } else {
      res.end(JSON.stringify([]));
    }
  });
}
