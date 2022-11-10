/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const fs = require('fs');

export const Keyword = new Mongo.Collection('keywords');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('keywords', function() {
    return Keyword.find();
  });

  Meteor.methods({

    'addKeyword'(path,content){

      fs.appendFileSync(path,content,function (err) {
        if (err){
          throw err;
        }
      });
    },

    'hasSameContent'(path){
      const names = [];
      const LineReaderSync = require('line-reader-sync');
      const lrs = new LineReaderSync(path);
      // eslint-disable-next-line no-constant-condition
      while (true){
        let line = lrs.readline();
        if(line === null){
          return names;
        }else{
          names.push(line.split(' ')[0]);
        }
      }
    },

    'keywords.insert'(wordsInfo) {
      check(wordsInfo, Object);

      const {keywordName, keywordNum, keywordNature} = wordsInfo;
      if(Keyword.findOne({name: keywordName})) {
        return 'Exist'
      }

      Keyword.insert({
        name: keywordName,
        number: keywordNum,
        nature: keywordNature,
        upload: 'no',
        createdAt: new Date(),
        updateDate: new Date(),
      });
    },

    'keywords.batchImport'(keywordInfos) {
      for (let keyword of keywordInfos) {
        check(keyword.name, String);
        check(keyword.number, String);
        check(keyword.nature, String);

        Keyword.insert({
          name: keyword.name,
          number: keyword.number,
          nature: keyword.nature,
          createdAt: new Date(),
          updateDate: new Date(),
        });
      }
    },

    'keywords.delete'(keywordInfos) {
      check(keywordInfos, Array);

      for(let eachItem of keywordInfos) {
        if(eachItem.isChecked) {
          Keyword.remove(eachItem.keywordInfo._id);
        }
      }
    },

    'keywords.update'(wordsInfo) {
      check(wordsInfo, Object);

      const {keywordId, keywordName, keywordNum, keywordNature} = wordsInfo;
      if(Keyword.findOne({name: keywordName, _id: {$ne: keywordId}})) {
        return 'Exist'
      }

      Keyword.update(keywordId,
        {$set:
            {
              name: keywordName,
              number: keywordNum,
              nature: keywordNature,
              upload: 'no',
              updateDate: new Date(),
            },
        });
    },

    'keywords.update1'(id) {
      check(id, String);

      Keyword.update(id,
        {$set:
            {
              upload: 'yes',
            },
        });
    },

    'keywords.update2'(id) {
      check(id, String);

      Keyword.update(id,
        {$set:
            {
              upload: 'no',
            },
        });
    },

    'keywords.update3'(id) {
      check(id, String);

      Keyword.update(id,
        {$set:
            {
              upload: 'running',
            },
        });
    },

  });
}
