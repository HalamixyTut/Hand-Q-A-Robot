import React, {Component} from 'react';
import {CSVLink} from 'react-csv';
import { FormattedMessage } from 'react-intl';

export default class DownloadKnowledge extends Component {
  render() {
    const headers = [
      {label: '标准问句', key: 'standard'},
      {label: '相似问句', key: 'similar'},
      {label: '分类', key: 'categoryPath'},
      {label: '问题答案', key: 'solution'},
    ];
    let data = [];
    if(this.props.allknowledges.length > 0) {
      for (let eachItem of this.props.allknowledges) {
        let kgSimilar = eachItem.similar;
        if(kgSimilar.length > 0) {
          for(let i = 0; i< kgSimilar.length; i++) {
            let eachKg = {
              standard: '',
              similar: '',
              categoryPath: '',
              solution: '',
            };
            if(i === 0) {
              eachKg.standard = eachItem.standard;
              eachKg.similar = kgSimilar[i];
              eachKg.categoryPath = eachItem.categoryPath;
              eachKg.solution = eachItem.solution;
              data.push(eachKg)
              eachKg
            }else {
              eachKg.standard = eachItem.standard;
              eachKg.similar = kgSimilar[i];
              eachKg.categoryPath = '';
              eachKg.solution = '';
              data.push(eachKg)
            }

          }
        }else {
          let eachKg = {
            standard: '',
            similar: '',
            categoryPath: '',
            solution: '',
          };
          eachKg.standard = eachItem.standard;
          eachKg.similar = eachItem.standard;
          eachKg.categoryPath = eachItem.categoryPath;
          eachKg.solution = eachItem.solution;
          data.push(eachKg)
        }
      }
    }

    return (
      <CSVLink
        data={data}
        headers={headers}
        filename="知识库.csv"
        className="btn btn-info pull-right"
        target="_blank"
      >
        <i className="fa  fa-download" />
        <FormattedMessage
          id="downloadKnowledge"
          defaultMessage="下载知识点"
        />
      </CSVLink>
    )
  }
}
