import React from 'react';
import { Meteor } from 'meteor/meteor';

class ListKeyword extends React.Component{
  constructor() {
    super();

    this.state = {
      isChecked: false,
    }
  }

  componentDidMount() {
    if(this.props.clearCheck) {
      this.setState({isChecked: false});
      this.props.changeClear();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.clearCheck) {
      this.setState({isChecked: false});
      this.props.changeClear();
    }
  }

  // 点击每条记录的checxbox，首先更改当前isChecked的值，然后传递当前记录的值给父组件
  toggleCheck() {
    this.setState({
      isChecked: !this.state.isChecked,
    });

    if(this.props.dealList){
      const {isChecked, keywordInfo} =
        {
          isChecked: !this.state.isChecked,
          keywordInfo: this.props.keyword,
        };

      this.props.dealList({isChecked, keywordInfo});
    }
  }

  submitKeyword(){
    const id = this.props.keyword._id;
    const name = this.props.keyword.name;
    const number = this.props.keyword.number;
    const nature = this.props.keyword.nature;
    const upload = this.props.keyword.upload;
    const content = '\n'+name+' '+number+' '+nature;
    if (upload == 'no'){
      Meteor.call('keywords.update3',id);

      let path = '';
      if(Meteor.isProduction) {
        path = '../web.browser/app/dict';
      }else {
        path = '../../../../../public/dict';
      }

      const get1 = () => {
        return new Promise(function (resolve,reject) {
          Meteor.call('hasSameContent',path + '/userDict.utf8',function(err,result1){
            if (err){
              return reject(err);
            } else {
              resolve(result1);
            }
          })
        });
      };
      const get2 = (result1) => {
        return new Promise(function (resolve,reject) {
          Meteor.call('hasSameContent',path + '/jieba.dict.utf8',function(err,result2){
            if (err){
              return reject(err);
            } else {
              const names = result1.concat(result2);
              resolve(names);
            }
          })
        });
      };
      get1()
        .then(function (result1) {
          return get2(result1)
        })
        .then(function (names) {
          if (!names.includes(name)){
            Meteor.call('addKeyword',path + '/userDict.utf8',content,function (err) {
              if (err){
                throw err;
              } else {
                Meteor.call('keywords.update1',id);
                $('#addSuccess').modal('show');
              }
            });
            return;
          } else {
            Meteor.call('keywords.update2',id);
            $('#keyword-repeat').modal('show');
            return;
          }
        })
    } else {
      Meteor.call('keywords.update1',id);
      $('#keyword-added').modal('show');
    }
    return;
  }

  render() {
    return(
      <tr>
        <td className="check-box-position">
          <input
            type="checkbox"
            checked={this.state.isChecked}
            onChange={this.toggleCheck.bind(this)}
          />
        </td>
        <td>{this.props.keyword.name}</td>
        <td>{this.props.keyword.number}</td>
        <td>{this.props.keyword.nature}</td>
        <td>
          {this.props.keyword.upload == 'yes' ? '是' : this.props.keyword.upload == 'no' ? '否' : '同步中...'}
        </td>
        <td>
          <a>
            <i
              onClick={this.submitKeyword.bind(this)}
              className="fa fa-mail-forward"
            />
          </a>
        </td>
      </tr>
    );
  }
}

export default ListKeyword;
