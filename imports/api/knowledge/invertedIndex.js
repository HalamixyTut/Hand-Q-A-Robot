import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Knowledge} from './knowledges';

export const InvertedIndex = new Mongo.Collection('invertedindex');

if (Meteor.isServer) {
  const concat_array = (arr1, arr2) => {
    let arr1DocId = arr1.docId.concat();
    let arr2DocId = arr2.docId.concat();

    for(let i = 0; i < arr2DocId.length; i++){
      // arr1DocId.indexOf(arr2DocId[i]) === -1 ? arr1DocId.push(arr2DocId[i]) : 0;
      let index = arr1DocId.indexOf(arr2DocId[i]);
      if(index === -1) {
        arr1.docId.push(arr2.docId[i]);
        arr1.times.push(arr2.times[i]);
        arr1.index.push(arr2.index[i]);
      }else {
        arr1.times[index] = arr2.times[i];
        arr1.index[index] = arr2.index[i];
      }
    }

    return arr1;
  };

  Meteor.methods({
    'invertedIndex.build'() {
      InvertedIndex.remove({});
      let nodejieba = require('nodejieba');
      const rs = Knowledge.find({}, {fields: {standard: 1}}).fetch();
      if(Meteor.isProduction) {
        nodejieba.load({
          userDict: '../web.browser/app/dict/userDict.utf8',
        });
      }else {
        nodejieba.load({
          userDict: '../../../../../public/dict/userDict.utf8',
        });
      }

      let data = new Map();
      let answer = new Array();
      let indexTable = new Map();
      let _idArray = new Array();

      for (let k in rs) {
        // eslint-disable-next-line no-useless-escape
        rs[k].standard = (rs[k].standard).replace(/[\ |\（|\）|\，|\、|\？|\。|\！|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '');
        data.set(rs[k]._id, nodejieba.cut(rs[k].standard));
        answer.push(rs[k].standard);
        _idArray.push(rs[k]._id);
      }

      answer = answer.join('');
      // eslint-disable-next-line no-useless-escape
      answer = answer.replace(/[\ |\（|\）|\，|\、|\？|\。|\！|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '');

      //构建倒排索引表
      answer = new Set(nodejieba.cut(answer));
      answer = Array.from(answer);

      for (let k = 0; k < answer.length; k++) {
        let times = new Array();

        let _ids = new Array();

        let indexesArray = new Array();

        for (let j = 0; j < _idArray.length; j++) {
          let time = 0;
          let indexArray = new Array();
          for (let i = 0; i < data.get(_idArray[j]).length; i++) {
            if (answer[k] === data.get(_idArray[j])[i]) {
              time++;
              indexArray.push(i);
            }
          }
          if (time > 0) {
            _ids.push(_idArray[j]);
            times.push(time);
            indexesArray.push(indexArray);
          }
        }
        indexTable.set(answer[k], {docId: _ids, times: times, index: indexesArray});
        InvertedIndex.insert({'keyword':answer[k],'docId':_ids,'times':times,'index':indexesArray});
      }
    },

    'invertedIndex.build.block'() {
      let nodejieba = require('nodejieba');

      if(Meteor.isProduction) {
        nodejieba.load({
          userDict: '../web.browser/app/dict/userDict.utf8',
        });
      }else {
        nodejieba.load({
          userDict: '../../../../../public/dict/userDict.utf8',
        });
      }
      const rs = Knowledge.find({updateDate: {$gte: new Date(new Date().valueOf() -3600000)}}, {fields: {standard: 1}}).fetch();

      if(rs.length === 0) {
        return;
      }

      let data = new Map();
      let answer = new Array();
      let indexTable = new Map();
      let _idArray = new Array();

      for (let k in rs) {
        // eslint-disable-next-line no-useless-escape
        rs[k].standard = (rs[k].standard).replace(/[\ |\（|\）|\，|\、|\？|\。|\！|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '');
        data.set(rs[k]._id, nodejieba.cut(rs[k].standard));
        answer.push(rs[k].standard);
        _idArray.push(rs[k]._id);
      }


      answer = answer.join('');
      // eslint-disable-next-line no-useless-escape
      answer = answer.replace(/[\ |\（|\）|\，|\、|\？|\。|\！|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g, '');

      //构建倒排索引表
      answer = new Set(nodejieba.cut(answer));
      answer = Array.from(answer);

      for (let k = 0; k < answer.length; k++) {
        let times = new Array();

        let _ids = new Array();

        let indexesArray = new Array();

        for (let j = 0; j < _idArray.length; j++) {
          let time = 0;
          let indexArray = new Array();
          for (let i = 0; i < data.get(_idArray[j]).length; i++) {
            if (answer[k] === data.get(_idArray[j])[i]) {
              time++;
              indexArray.push(i);
            }
          }
          if (time > 0) {
            _ids.push(_idArray[j]);
            times.push(time);
            indexesArray.push(indexArray);
          }
        }
        indexTable.set(answer[k], {docId: _ids, times: times, index: indexesArray});
      }

      for(let [keys] of indexTable) {
        const rs = InvertedIndex.findOne({keyword: keys});

        if(rs) {
          let updateData = concat_array(rs, indexTable.get(keys));
          InvertedIndex.update(updateData._id,
            {
              $set:
                {
                  docId: updateData.docId,
                  times: updateData.times,
                  index: updateData.index,
                },
            });
        }else {
          const result = indexTable.get(keys);
          InvertedIndex.insert({'keyword':keys,'docId':result.docId,'times':result.times,'index':result.index});
        }
      }
    },

  });
}
