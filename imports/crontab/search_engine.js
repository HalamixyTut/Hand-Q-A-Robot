const task = (crontabInfo) => {
  const job = {
    name: crontabInfo.cronName,
    schedule: function(parser) {
      // parser is a later.parse object
      return parser.cron(crontabInfo.expression, true);
    },
    job: function() {
      Meteor.call('invertedIndex.build');
      // console.log('job\'s name: ', crontabInfo.cronName)
    },
  };

  // eslint-disable-next-line no-undef
  return SyncedCron.add(job);
};

export function SearchEngine(crontabInfo, command = true) {
  if (Meteor.isServer) {
    task(crontabInfo);

    if(!command) {
      // eslint-disable-next-line no-undef
      SyncedCron.remove(crontabInfo.cronName);
    }
  }
}

