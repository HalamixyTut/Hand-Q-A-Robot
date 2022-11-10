import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import {CSVLink} from 'react-csv';
import { FormattedMessage } from 'react-intl';
import {Category} from '../../../../../api/category/categorys';
import {DialogUpdate} from '../../utils/modal_dialog'

global.Buffer = global.Buffer || require("buffer").Buffer;

class UploadKnowledge extends React.Component {
  constructor() {
    super();

    this.uploadFile = React.createRef();
    this.state = {
      messageId: 'updateMessageContent',
    }
  }

  handleChange(e) {
    const file = e.target.files[0];
    if(file) {
      const fileTypes = '.csv';
      const nameEnd = file.name.substr(file.name.lastIndexOf('.'));
      if(fileTypes !== nameEnd) {
        this.setState({messageId: 'UnSupportFileType'}, () => $('#modal-default').modal('show'));
      }
    }else {
      this.setState({messageId: 'fileEmpty'}, () => $('#modal-default').modal('show'));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const file = this.uploadFile.current.files[0];
    let  inputFile = this.uploadFile.current;
    const mergeSimilar = (arr) => {
      let resData = [];
      let eachData = {
        standard: '',
        similar: [],
        categoryPath: '',
        solution: '',
      };
      for(let i = 0; i < arr.length;) {
        if(resData.length === 0) {
          resData.push(arr[i]);
          arr.splice(arr.indexOf(arr[i]),1);
          continue;
        }
        if(arr[i].standard === resData[0].standard) {
          resData.push(arr[i]);
          arr.splice(arr.indexOf(arr[i]),1);
          continue;
        }
        i++;
      }

      for(let eachItem of resData) {
        if(eachItem.categoryPath !== '') {
          eachData.standard = eachItem.standard;
          eachData.categoryPath = eachItem.categoryPath;
        }
        if(eachItem.solution !== '') {
          eachData.solution = eachItem.solution;
        }
        eachData.similar.push(eachItem.similar);
      }

      return eachData;
    };
    const getParentCategory = (categoryId, categoryArr) => {
      let category;
      for(let eachItem of categoryArr) {
        if(categoryId === eachItem._id) {
          category = eachItem;
        }
      }
      return category;
    };
    const getCategoryInfo = (path, parentCategory) => {
      let categoryInfo = {
        parentId: '',
        isExist: false,
      };

      let categotyId = '';
      for(let eachItem of parentCategory.subClass) {
        if(eachItem.name === path) {
          categotyId = eachItem.id;
          break;
        }
      }
      if(categotyId === '') {
        categoryInfo.parentId = parentCategory._id;
      }else {
        categoryInfo.isExist = true;
        categoryInfo.parentId = categotyId;
      }
      return categoryInfo;
    };

    if(file) {
      const fileTypes = '.csv';
      const nameEnd = file.name.substr(file.name.lastIndexOf('.'));
      if(fileTypes !== nameEnd) {
        this.setState({messageId: 'UnSupportFileType'}, () => $('#modal-default').modal('show'));
      }else {
        const reader = new FileReader();
        const self = this;

        reader.onload = function(e) {
          let contents = reader.result;
          let subStr = contents.match(/(\S*)\r\n/);
          if(!subStr && typeof(subStr)!='undefined' && subStr!=0){
            subStr = contents.match(/(\S*)\n/);
          }
          if(!subStr && typeof(subStr)!='undefined' && subStr!=0) {
            self.setState({messageId: 'fileError'}, () => $('#modal-default').modal('show'));
            return;
          }
          subStr = subStr[1];
          subStr = subStr.replace(/"/g,'');
          subStr = subStr.split(',');
          if(subStr.indexOf('标准问句') === -1 || subStr.indexOf('相似问句') === -1 ||
            subStr.indexOf('分类') === -1 || subStr.indexOf('问题答案') === -1) {

            self.setState({messageId: 'fileFormatError'}, () => $('#modal-default').modal('show'));
            return;
          }
          contents = contents.replace('标准问句','standard');
          contents = contents.replace('相似问句','similar');
          contents = contents.replace('分类','categoryPath');
          contents = contents.replace('问题答案','solution');
          const parse = require('csv-parse/lib/sync');
          contents = parse(contents,{ columns: true, auto_parse: true });
          let mergeData = [];
          //合并相似问句
          while (contents.length !== 0) {
            let returnData = mergeSimilar(contents);
            if(returnData.standard !== '' && returnData.categoryPath !== '' && returnData.solution !== '') {
              mergeData.push(returnData)
            }
          }

          //获取问题所处的分类id，如果存在，直接保存，如果不存在，需先创建分类，然后保存
          for(let eachItem of mergeData) {
            let path = eachItem.categoryPath.split('/');
            const rootCategory = Category.find({name: '所有分类'}).fetch();
            const categorys = Category.find({}).fetch();
            let parentCategory = rootCategory[0];
            let categoryInfo, k;

            if(path.length > 4) {
              self.setState({messageId: 'levelTooMany'}, () => $('#modal-default').modal('show'));
              return;
            }
            for(let i = 1; i < path.length; i++) {
              categoryInfo = getCategoryInfo(path[i], parentCategory);
              if(categoryInfo.isExist) {
                parentCategory = getParentCategory(categoryInfo.parentId, categorys);
              }else {
                k = i;
                break;
              }
            }

            if(categoryInfo && categoryInfo.isExist) {
              eachItem.category = categoryInfo.parentId;
            }else {
              let tmpCategoryInfo = categoryInfo;
              for(let i = k; i < path.length; i++ ){
                const newCategoryId = new Mongo.ObjectID()._str;
                const categoryInfo = {
                  id: newCategoryId,
                  name: path[i],
                  subClass: [],
                };

                Meteor.call('categorys.insert',categoryInfo);
                Meteor.call('categorys.addupdate',tmpCategoryInfo.parentId, categoryInfo);
                if(i === path.length - 1) {
                  eachItem.category = newCategoryId;
                }else {
                  tmpCategoryInfo.parentId = newCategoryId;
                }
              }
            }
          }

          Meteor.call('knowledges.batchImport', mergeData);
          inputFile.value = '';

          self.setState({messageId: 'fileUploadSuccess'}, () => $('#modal-default').modal('show'));
        };

        reader.readAsText(file,'UTF-8');
      }
    }else {
      this.setState({messageId: 'fileUploadFile'}, () => $('#modal-default').modal('show'));
    }
  }

  render() {
    const headers = [
      {label: '标准问句', key: 'standard'},
      {label: '相似问句', key: 'similar'},
      {label: '分类', key: 'categoryPath'},
      {label: '问题答案', key: 'solution'},
    ];

    const data = [
      {standard: '如何去火车站？', similar: '请问火车站怎么走？', categoryPath: '/一级分类/二级分类', solution: '您可以乘坐地铁四号线。'},
      {standard: '如何去火车站？', similar: '我想去火车站，怎么过去呢？', categoryPath: '', solution: ''},
      {standard: '如何购买火车票？', similar: '请问怎么买火车票？', categoryPath: '/一级分类/二级分类/三级分类', solution: '请登录12306购买。'},
      {standard: '如何购买火车票？', similar: '怎么才能购买火车票呢？', categoryPath: '', solution: ''},
      {standard: '如何购买火车票？', similar: '在哪里可以买到火车票？', categoryPath: '', solution: ''},
    ];

    return(
      <div className="col-xs-12 knowledge">
        <div className="box box-info">
          <div className="box-header with-border">
            <h3 className="box-title">
              <i className="fa fa-pencil" />
              <FormattedMessage
                id="uploadKnowledge"
                defaultMessage="上传知识点"
              />
            </h3>
          </div>
          <form className="form-horizontal">
            <div className="box-body">
              <div className="form-group">
                <label htmlFor="inputEmail3" className="col-sm-2 control-label">
                  <FormattedMessage
                    id="selectFile"
                    defaultMessage="选择文件"
                  />
                </label>
                <div className="col-sm-10">
                  <input
                    type="file" ref={this.uploadFile} id="exampleInputFile"
                    onChange={this.handleChange.bind(this)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputPassword3" className="col-sm-2 control-label">
                  <FormattedMessage
                    id="UploadRules"
                    defaultMessage="上传规则"
                  />
                </label>
                <div className="col-sm-10">
                  <p>1. 上传文件格式为.csv {/*<button type="button" className="btn btn-info">下载CSV模板</button>*/}
                    <CSVLink
                      data={data}
                      headers={headers}
                      filename="知识模板.csv"
                      className="btn btn-info"
                      target="_blank"
                    >
                      下载CSV模板
                    </CSVLink>
                  </p>
                  <p>2. CSV文件编码格式为UTF-8</p>
                  <p>3. 第1列为标准问句，第2列为相似问句，第3列为分类(分类最多支持三级，格式为：/一级分类/二级分类/三级分类)，第4列为问题答案。</p>
                </div>
              </div>
            </div>
            <div className="box-footer col-button">
              <button type="submit" className="btn btn-info pull-right" onClick={this.handleSubmit.bind(this)}>
                <FormattedMessage
                  id="saveknowledge"
                  defaultMessage="保存知识点"
                />
              </button>
              <button type="submit" className="btn btn-default pull-right">
                <FormattedMessage
                  id="return"
                  defaultMessage="返回"
                />
              </button>
            </div>
          </form>
        </div>

        <DialogUpdate messageId={this.state.messageId} />
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('categorys');

  return {
    categorys: Category.find({}).fetch(),
  };
})(UploadKnowledge);
