const task_customer_service_algorithm = (crontabInfo) => {
  const job = {
    name: crontabInfo.cronName,
    schedule: function(parser) {
      return parser.cron(crontabInfo.expression, true);
    },
    job: function() {
      Meteor.call('customer.server.algorithm');
      // console.log('job\'s name: ', crontabInfo.cronName)
    },
  };

  // eslint-disable-next-line no-undef
  return SyncedCron.add(job);
};

export function CustomerServiceAlgorithm(crontabInfo, command = true) {
  if (Meteor.isServer) {
    task_customer_service_algorithm(crontabInfo);

    if(!command) {
      // eslint-disable-next-line no-undef
      SyncedCron.remove(crontabInfo.cronName);
    }
  }
}

