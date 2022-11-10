import React from 'react'

const utils = {
  testRegex: (value, regex) => value.toString().match(regex),
  rules: {
    required: {
      message: 'The :attribute field is required',
      rule: val => utils.testRegex(val, /.+/),
    },
    max: {
      message: 'The :attribute may not be greater than :max characters',
      rule: (val, options) => val.length <= options[0],
      messageReplace: (message, options) => message.replace(':max', options[0]),
    },
    min: {
      message: 'The :attribute may not be less than :mix characters',
      rule: (val, options) => val.length >= options[0],
      messageReplace: (message, options) => message.replace(':min', options[0]),
    },
    email: {
      message: 'The :attribute must be a valid email address',
      rule: val => utils.testRegex(val, /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i),
    },
    number: {
      message: 'The :attribute must be a number',
      rule: (val) => utils.testRegex(val, /^[0-9]*$/),
    },
    phone: {
      message: 'The :attribute must be a valid phone number',
      rule: (val) => utils.testRegex(val, /^1[0-9]{10}$/),
    },
    url: {
      message: 'The :attribute must be a valid url',
      // eslint-disable-next-line no-useless-escape
      rule: (val) => utils.testRegex(val, /^(https?|ftp):\/\/(-\.)?([^\s/?\.#-]+\.?)+(\/[^\s]*)?$/i),
    },
    char: {
      message: 'The :attribute must be a character',
      rule: (val) => utils.testRegex(val, /^[A-Z]+$/i),
    },
    accepted: {
      message: 'The :attribute must be a accepted',
      rule: (val) => val === true,
    },
    repeat: {
      message: 'data mismatch',
      rule: (val, options) => val === options[0],
    },
    specialChar: {
      message: 'The field contains special characters',
      // eslint-disable-next-line no-useless-escape
      rule: (val) => !utils.testRegex(val, /[^a-zA-Z0-9\_\u4e00-\u9fa5]/),
    },
  },
};

//表单验证
export default class Validator {
  constructor() {
    this.fileds = []; //存储要验证的字段，key为字段名称，值为boolean，为true则表明要显示验证不通过的提示信息
    this.rules = utils.rules;
    this.isShow = false; //是否显示验证不通过的提示信息
  }

  hideMessage() {
    this.isShow = false;
  }

  showMessage() {
    this.isShow = true;
  }

  //有不通过验证的就要显示提示信息
  allValid() {
    for(let key in this.fileds) {
      if(this.fileds.hasOwnProperty(key) && this.fileds[key]) {
        // console.warn(`field ${key} result not match rule`)
        return false;
      }
    }
    return true;
  }

  //验证的主逻辑： rulesStr示例： required|max:4|phone|abc:4,5,6
  message(filed, value, rulesStr, customMsg={}, customClass='error-message') {
    this.fileds[filed] = false;
    let rules = this.filterEmpty(rulesStr.split('|'));
    let options, errorMsg;
    for(let i = 0; i < rules.length; i++) {
      let split = rules[i].split(':');
      let rule = split[0];
      options = split[1] ? split[1].split(',') : [];

      if(!this.isValid(value, rule, options)) {
        this.fileds[filed] = true;
        if(this.isShow) {
          errorMsg = customMsg[rule] || customMsg.default || this.rules[rule].message.replace(':attribute', filed);
          if(!customMsg[rule] && options.length > 0 && this.rules[rule].hasOwnProperty('messageReplace')) {
            errorMsg = this.rules[rule].messageReplace(errorMsg, options);
          }
          return this.createErrorMeg(errorMsg, customClass);
        }
      }
    }
  }

  //过滤为空的数据
  filterEmpty(arr) {
    return arr.filter((x) => x && x.trim());
  }

  //验证是否符合规则
  isValid(value, rule, options) {
    try {
      return this.rules[rule].rule(value, options);
    } catch (e) {
      // console.log('The rule you set was not found');
    }
  }

  //创建错误消息组件
  createErrorMeg(message, customClass) {
    const style = {
      color: '#d64106',
    };
    return React.createElement('div', { className: customClass, style}, message);
  }
}
