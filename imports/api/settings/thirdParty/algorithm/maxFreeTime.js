import CustomerArray from './getCustomerArray';
import SendIMMsg from './sendIMMsg';

//最长空闲时间
const MaxFreeTime =  (roleName, company) => {
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
  let maxFreeTime = 0;
  //存储最大空闲时间的客服id
  let customers = [];
  //存储和最大空闲时间相同的客服id
  let equals = [];
  let ids = Object.keys(customerArray);

  for (const key in customerArray) {
    if (customerArray[key].freeTime > maxFreeTime) {
      maxFreeTime = customerArray[key].freeTime;
      equals = [];
      customers = [];
      customers.push(key)
    } else if (customerArray[key].freeTime === maxFreeTime) {
      equals.push(key);
    }
  }
  if (equals.length > 0) {
    customers = [...customers, ...equals];
  }
  //有多个最大空闲时间时，随机获取
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

module.exports = MaxFreeTime;
