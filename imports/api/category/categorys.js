/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Category = new Mongo.Collection('categorys');

const rootCategory = {
  _id: new Mongo.ObjectID()._str,
  name: '所有分类',
  subClass: [],
  createdAt: new Date(),
  updateDate: new Date(),
};

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('categorys', function() {
    return Category.find();
  });

  if (!Category.findOne()) {
    Category.insert(rootCategory);
  }
}

// let newCategoryId;

Meteor.methods({
  'categorys.insert'(categoryInfo) {
    check(categoryInfo.id, String);
    check(categoryInfo.name, String);
    check(categoryInfo.subClass, Array);

    Category.insert({
      _id: categoryInfo.id,
      name: categoryInfo.name,
      subClass: categoryInfo.subClass,
      createdAt: new Date(),
      updateDate: new Date(),
    });
  },

  'categorys.delete'(categoryId) {
    check(categoryId, String);

    Category.remove(categoryId);
  },

  'categorys.addupdate'(categoryId, subNodeInfo) {
    check(categoryId, String);
    check(subNodeInfo, Object);

    const updateCategory = Category.find({_id: categoryId}).fetch();
    const updateNodeInfo = {
      id: subNodeInfo.id,
      name: subNodeInfo.name,
    }
    let subClass = updateCategory[0].subClass;
    subClass.push(updateNodeInfo);

    Category.update(categoryId,
      {$set:
          {
            subClass: subClass,
          },
      });
  },

  'categorys.deleteupdate'(categoryId, subNodeId) {
    check(categoryId, String);
    check(subNodeId, String);

    const updateCategory = Category.find({_id: categoryId}).fetch();

    let subClass = [];
    for(let eachItem of updateCategory[0].subClass) {
      if(subNodeId === eachItem.id){
        continue;
      }
      subClass.push(eachItem);
    }

    Category.update(categoryId,
      {$set:
          {
            subClass: subClass,
          },
      });
  },

  'categorys.update'(categoryId, categoryName) {
    check(categoryId, String);
    check(categoryName, String);

    Category.update(categoryId,
      {$set:
          {
            name: categoryName,
          },
      });
  },

});
