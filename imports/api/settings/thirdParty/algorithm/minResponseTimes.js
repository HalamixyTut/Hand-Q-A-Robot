import CustomerArray from './getCustomerArray';
import SendIMMsg from './sendIMMsg';

//最少接答次数	
const MinResponseTimes =  (roleName, company) => {
  let customerArray = CustomerArray(roleName);
  //判断对象是否为空
  const isEmpty = function() {
    for(var key in customerArray) {
      return false;
    }
    return true;
  }
  if (isEmpty()) {
    return;
  }

  //获取轮询的客服id
  let customerId;
  let minResponseTimes = 2^32-1;
  //存储最少接答次数的客服id
  let customers = [];
  //存储和最少接答次数相同的客服id
  let equals = [];
  let ids = Object.keys(customerArray);

  for (const key in customerArray) {
    if (customerArray[key].freeTime < minResponseTimes) {
      minResponseTimes = customerArray[key].freeTime;
      equals = [];
      customers = [];
      customers.push(key)
    } else if (customerArray[key].freeTime === minResponseTimes) {
      equals.push(key);
    }
  }
  if (equals.length > 0) {
    customers = [...customers, ...equals];
  }
  //有多个最少接答次数时，随机获取
  if (customers.length === 1) {
    customerId = customers[0];
  } else if (customers.length > 1) {
    customerId = customers[Math.floor(Math.random()*customers.length)];
  }
  if (!customerId) {
    customerId = ids[Math.floor(Math.random()*ids.length)];
  }

  //发送消息
  return SendIMMsg(customerId, company);
}

module.exports = MinResponseTimes;
