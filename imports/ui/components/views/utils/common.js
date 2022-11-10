import {Meteor} from 'meteor/meteor';

const handleDelete = (funName, dataList, self=undefined, updateList=undefined) => {
  if(dataList && dataList.length > 0){
    Meteor.call(funName, dataList);
    if(self && updateList) {
      self.setState({[updateList]: []});
    }
  }
};

const handleSbumit = (self, funcName, data) => {
  if(self.validator.allValid()){
    Meteor.call(funcName, data, function (err, result) {
      if(!err) {
        if(result === 'Exist') {
          self.setState({notExist: false}, ()=>{
            self.validator.showMessage();
            self.forceUpdate();
          });
        }else {
          window.location.reload();
        }
      }
    });
  } else {
    self.validator.showMessage();
    self.forceUpdate();
  }
};

class CommonFunc {
  getCodeMeaningByValue(data, value) {
    const resule = data.find((d) => d.name === value);
    if (resule) {
      return resule.mean;
    } else {
      return value;
    }
  }
}

const Common = new CommonFunc();

export {handleDelete, handleSbumit, Common}
