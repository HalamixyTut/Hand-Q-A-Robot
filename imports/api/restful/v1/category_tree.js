import { Meteor } from 'meteor/meteor';
import express from 'express';
import {Category} from '../../category/categorys';

const app = express();

if (Meteor.isServer){
  WebApp.connectHandlers.use(Meteor.bindEnvironment(app));
  app.get('/api/category/tree', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');

    const alCategorys = Category.find({}).fetch();
    const getCategory = (categoryId, arr) => {
      let currentCategory, resData = [];
      let currentData = arr;
      for (let eachItem of alCategorys) {
        if (eachItem._id === categoryId) {
          currentCategory = eachItem;
        }
      }
      if (currentCategory) {
        currentData.text = currentCategory.name;
        currentData.id = currentCategory._id
      }

      if (currentCategory && currentCategory.subClass.length > 0) {
        currentData.nodes = [];
        for (let eachItem of currentCategory.subClass) {
          let tmp = {};
          getCategory(eachItem.id, tmp);
          currentData.nodes.push(tmp);
        }
      }
      resData.push(currentData)
      return resData;
    };

    const rootCategoryId = Category.findOne({name: '所有分类'}, {fields: {_id: 1}});
    const rootId = rootCategoryId ? rootCategoryId._id : '';

    let arr = {
      text: '',
    };

    res.end(JSON.stringify(getCategory(rootId, arr)));
  });
}
