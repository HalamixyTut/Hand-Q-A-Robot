import uuid from '../../../restful/utils/uuid';

export default function (customerId, company) {
  const userId = uuid(16);

  const imId = customerId < userId ? customerId + userId : userId + customerId;
  const customServer = company + '客服';
  const imMsg = {
    sourceId: customerId,
    sourceName: customServer,
    msg: '欢迎咨询,请问你有什么问题吗?',
    isRead: true,
    data: new Date(),
  };
  Meteor.call('immsgs.insert',imId, imMsg, customServer);
  return userId;
}
