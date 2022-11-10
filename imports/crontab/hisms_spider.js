const task_spider = (crontabInfo) => {
  const job = {
    name: crontabInfo.cronName,
    schedule: function(parser) {
      return parser.cron(crontabInfo.expression, true);
    },
    job: function() {
      const child_process = require('child_process');
      const currentDir = process.cwd();

      try {
        process.chdir('/u05/haibot.chat-spy/');
      } catch (err) {
        console.error(`chdir: ${err}`);
      }

      const workerProcess = child_process.exec('python3 /u05/haibot.chat-spy/hisms_batch_spider.py ' ,
        function (error, stdout, stderr) {
          if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
          }
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
        });

      workerProcess.on('exit', function (code) {
        console.log('子进程已退出，退出码 '+code);
      });

      try {
        process.chdir(currentDir);
      } catch (err) {
        console.error(`chdir: ${err}`);
      }
    },
  };

  // eslint-disable-next-line no-undef
  return SyncedCron.add(job);
};

export function HismsSpider(crontabInfo, command = true) {
  if (Meteor.isServer) {
    task_spider(crontabInfo);

    if(!command) {
      // eslint-disable-next-line no-undef
      SyncedCron.remove(crontabInfo.cronName);
    }
  }
}
