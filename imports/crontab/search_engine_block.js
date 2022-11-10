const task1 = (crontabInfo) => {
  const job = {
    name: crontabInfo.cronName,
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.cron(crontabInfo.expression, true);
    },
    job: function() {
      Meteor.call('invertedIndex.build.block');
    },
  };

  // eslint-disable-next-line no-undef
  return SyncedCron.add(job);
};

export function SearchEngineBlock(crontabInfo, command = true) {
  if (Meteor.isServer) {
    task1(crontabInfo);

    if(!command) {
      // eslint-disable-next-line no-undef
      SyncedCron.remove(crontabInfo.cronName);
    }
  }
}
