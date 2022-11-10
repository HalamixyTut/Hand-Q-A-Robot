const task_clear_kefu_history = (crontabInfo) => {
  const job = {
    name: crontabInfo.cronName,
    schedule: function(parser) {
      return parser.cron(crontabInfo.expression, true);
    },
    job: function() {
      Meteor.call('clear.kefu.history');
      // console.log('job\'s name: ', crontabInfo.cronName)
    },
  };

  // eslint-disable-next-line no-undef
  return SyncedCron.add(job);
};

export function ClearKefuHistory(crontabInfo, command = true) {
  if (Meteor.isServer) {
    task_clear_kefu_history(crontabInfo);

    if(!command) {
      // eslint-disable-next-line no-undef
      SyncedCron.remove(crontabInfo.cronName);
    }
  }
}

