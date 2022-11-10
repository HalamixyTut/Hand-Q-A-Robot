import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import KgCategory from './kgCategory';
import {Category} from '../../../../../api/category/categorys';

class Categorys extends React.Component {
  constructor(props) {
    super(props);
  }

  getRootCategoryId() {
    const rootCategory = this.props.rootCategory;
    return rootCategory[0]._id;
  }

  getCategory(categoryId, arr) {
    let currentCategory, resData = [];
    let currentData = arr;
    for(let eachItem of this.props.categorys) {
      if(eachItem._id === categoryId) {
        currentCategory = eachItem;
      }
    }
    if(currentCategory) {
      currentData.text = currentCategory.name;
      currentData.id = currentCategory._id
    }

    if(currentCategory && currentCategory.subClass.length > 0) {
      currentData.nodes = [];
      for(let eachItem of currentCategory.subClass) {
        let tmp = {};
        this.getCategory(eachItem.id, tmp);
        currentData.nodes.push(tmp);
      }
    }
    resData.push(currentData)
    return resData;
  }

  render() {

    let arr = {
      text: '',
    };

    return(
      <div className="statistic-content">
        <section className="content">
          <div className="row">
            {
              this.props.rootCategory.length != 0 ?
                <KgCategory categorys={this.getCategory(this.getRootCategoryId(), arr)} />
                :
                ''
            }
          </div>
        </section>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('categorys');

  return {
    rootCategory: Category.find({name: '所有分类'}).fetch(),
    categorys: Category.find({}).fetch(),
  }
})(Categorys);
