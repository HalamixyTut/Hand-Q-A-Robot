import CustomerArray from './getCustomerArray';
import SendIMMsg from './sendIMMsg';

//循环排队
const Circle =  (roleName, company) => {
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
  let ids = Object.keys(customerArray);
  for (const key in customerArray) {
    if (customerArray[key].assigned) {
      customerId = key;
      break;
    }
  }
  if (!customerId) {
    customerId = ids[Math.floor(Math.random()*ids.length)];
  }

  //发送消息
  return SendIMMsg(customerId, company);
}

module.exports = Circle;
