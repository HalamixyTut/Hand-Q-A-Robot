const task_send_mail = (crontabInfo) => {
  const job = {
    name: crontabInfo.cronName,
    schedule: function(parser) {
      return parser.cron(crontabInfo.expression, true);
    },
    job: function() {
      Meteor.call('accident.list');
    },
  };

  // eslint-disable-next-line no-undef
  return SyncedCron.add(job);
};

export function HismsSendMail(crontabInfo, command = true) {
  if (Meteor.isServer) {
    task_send_mail(crontabInfo);

    if(!command) {
      // eslint-disable-next-line no-undef
      SyncedCron.remove(crontabInfo.cronName);
    }
  }
}
