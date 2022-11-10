import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FormattedMessage } from 'react-intl';
import { withTracker } from 'meteor/react-meteor-data';
import {Category} from '../../../../../api/category/categorys';

class Categorys extends React.Component {
  componentDidMount() {
    let arr = {
      text: '',
    };
    let categorys;
    if(this.props.rootCategory.length > 0) {
      categorys = this.getCategory(this.getRootCategoryId(), arr)
    }
    //渲染树
    $('#left-tree').treeview({
      data: categorys,
      levels: 2,
      showCheckbox:false,//是否显示多选
    });
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
    return(
      <div
        className="modal fade" id="category" tabIndex="-1"
        role="dialog" aria-labelledby="roomModalLabel"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button" className="close" data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              <h4 className="modal-title" id="roomModalLabel">
                <FormattedMessage
                  id="ClassificationManagement"
                  defaultMessage="分类管理"
                />
              </h4>
            </div>
            <div className="modal-body">
              {/*表单*/}
              <div className="box box-primary">
                <div className="box-header with-border">
                </div>

                <div className="box-body">
                  <div id="left-tree"></div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">
                <FormattedMessage
                  id="cancel"
                  defaultMessage="取消"
                />
              </button>
              <button
                id="SelectCategory" type="button" className="btn btn-info pull-right"
                form="room-form"
              >
                <FormattedMessage
                  id="determine"
                  defaultMessage="确定"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('categorys');

  return {
    rootCategory: Category.find({name: '所有分类'}).fetch(),
    categorys: Category.find({}).fetch(),
  };
})(Categorys);
