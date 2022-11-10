/* eslint-disable import/no-unresolved */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';


export const Knowledge = new Mongo.Collection('knowledges');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('knowledges', function () {
    return Knowledge.find();
  });
}

Meteor.methods({
  'kg.count'() {
    let kgCount = 0;
    if(Meteor.isServer) {
      kgCount = Knowledge.find().count()
    }

    return kgCount;
  },

  'knowledges.insert'(knowledgeInfo) {
    check(knowledgeInfo.standard, String);
    check(knowledgeInfo.similar, Array);
    check(knowledgeInfo.related, Array);
    check(knowledgeInfo.solution, String);
    check(knowledgeInfo.category, String);
    check(knowledgeInfo.categoryPath, String);
    check(knowledgeInfo.api, String);
    check(knowledgeInfo.source, String);

    Knowledge.insert({
      standard: knowledgeInfo.standard,
      similar: knowledgeInfo.similar,
      related: knowledgeInfo.related,
      solution: knowledgeInfo.solution,
      category: knowledgeInfo.category,
      categoryPath: knowledgeInfo.categoryPath,
      api: knowledgeInfo.api,
      source: knowledgeInfo.source,
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'knowledges.batchImport'(knowledgeInfos) {
    for (let knowledgeInfo of knowledgeInfos) {
      check(knowledgeInfo.standard, String);
      check(knowledgeInfo.similar, Array);
      check(knowledgeInfo.solution, String);
      check(knowledgeInfo.category, String);
      check(knowledgeInfo.categoryPath, String);

      Knowledge.insert({
        standard: knowledgeInfo.standard,
        similar: knowledgeInfo.similar,
        related: [],
        solution: knowledgeInfo.solution,
        category: knowledgeInfo.category,
        categoryPath: knowledgeInfo.categoryPath,
        api: '',
        source: '用户',
        createdAt: new Date(),
        updateDate: new Date(),
      });
    }
  },

  'knowledges.delete'(knowledgeInfos) {
    for (let eachItem of knowledgeInfos) {
      if (eachItem.isChecked) {
        Knowledge.remove(eachItem.knowledgeInfo._id);
      }
    }
  },

  'knowledges.updatesimilar'(knowledgeId, similar) {
    check(knowledgeId, String);
    check(similar, Array);

    Knowledge.update(knowledgeId,
      {
        $set:{
          similar: similar,
        },
      });
  },

  'knowledges.update'(knowledgeInfo) {
    check(knowledgeInfo.id, String);
    check(knowledgeInfo.standard, String);
    check(knowledgeInfo.related, Array);
    check(knowledgeInfo.solution, String);
    check(knowledgeInfo.category, String);
    check(knowledgeInfo.categoryPath, String);
    check(knowledgeInfo.api, String);
    check(knowledgeInfo.source, String);

    Knowledge.update(knowledgeInfo.id,
      {
        $set:
          {
            standard: knowledgeInfo.standard,
            similar: knowledgeInfo.similar,
            related: knowledgeInfo.related,
            solution: knowledgeInfo.solution,
            category: knowledgeInfo.category,
            categoryPath: knowledgeInfo.categoryPath,
            api: knowledgeInfo.api,
            source: knowledgeInfo.source,
            updateDate: new Date(),
          },
      });
  },

});
