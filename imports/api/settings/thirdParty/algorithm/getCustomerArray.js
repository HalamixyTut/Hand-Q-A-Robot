import Session from 'meteor/session';
import {Immsg} from '../../../chat/im_msg';


//根据角色获取所有在线客服的ID，按照ID从小到大排序
const getIds = roleName => {
  let ids = [];
  const role = Meteor.roles.find({'name': roleName}).fetch();

  const customers = Meteor.users.find({'profile.roles': {$all: [role[0]._id]}, 'profile.online': true}, {sort: {_id: 1}}).fetch();
  if (customers.length > 0) {
    for (let c of customers){
      ids.push(c._id);
    }
  }
  return ids;
}

/*
* 获取每个客服对应的用户数量
* 格式：
* {
*   a: { count: 1 },
*   b: { count: 2 },
* }
*/
const getCustomCount = customerIds => {
  let countIds = customerIds.concat();
  let array = [];

  for (let id of customerIds) {
    const regExp = new RegExp(id,'g');
    const messages = Immsg.find({'isActive': true, '_id': regExp}).fetch();

    for (let message of messages) {
      const id = message.messages[0].sourceId;
      countIds.push(id);
    }
  }

  for(let i = 0; i < countIds.length; i++){
    let key = countIds[i];
    if(array[key] || array[key] === 0){
      array[key]['count']++;
    }else{
      array[key] = {count: 0};
    }
  }

  return array;
}

/*
* 获取每个客服对应最长空闲时间,单位ms
* 格式：
* {
*   a: { count: 1, freeTime: 521 },
*   b: { count: 2, freeTime: 44 },
* }
*/
const getMaxTreeTime = (array, customerIds) => {
  for (let id of customerIds) {
    const regExp = new RegExp(id,'g');
    const messages = Immsg.findOne({'isActive': true, '_id': regExp}, {sort: {updateAt: -1}});

    if (messages) {
      let updateDate = messages.updateAt;
      array[id].freeTime = new Date() - updateDate;
    } else {
      array[id].freeTime = 0;
    }
  }

  return array;
}

/*
* 获取循环排队的次序
* 格式：
* {
*   a: { count: 1, freeTime: 521 },
*   b: { count: 2, freeTime: 44 },
*   c: { count: 20, freeTime: 24, last: true },
* }
*/
const getlastAnswer = (array, count) => {
  //判断对象是否为空
  const isEmpty = function() {
    for(var key in array) {
      return false;
      break;
    }
    return true;
  }
  if (isEmpty()) {
    return array;
  }

  let ids = Object.keys(array);
  let index = count % ids.length;
  array[ids[index]].assigned = true;
  return array;
}

//获取客服数组详细数据
export default function (roleName) {
  let count = Session && Session.customerAnswerCount || 0;
  Session.customerAnswerCount = ++count;

  // Session.set('customerAnswerCount', count++)
  let customerIds = getIds(roleName);
  let array = getCustomCount(customerIds.concat());
  array = getMaxTreeTime(array, customerIds.concat());
  array = getlastAnswer(array, count);
  return array;
}
