/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { Crontab } from '../api/crontab/crontabs';
import { SearchEngine } from './search_engine';
import { SearchEngineBlock } from './search_engine_block';
import { HismsSendMail } from './hisms_send_mail';
import { HismsSpider } from './hisms_spider';
import { ClearRoomHistory } from './clear_room_history';
import { ClearKefuHistory } from './clear_kefu_history';
import { CustomerServiceAlgorithm } from './customer_service_algorithm';

if(Meteor.isServer) {
  Meteor.methods({
    'crontab.start'(crontabInfo) {
      if(crontabInfo.className === 'crontab.searchEngine') {
        SearchEngine(crontabInfo);
      }else if(crontabInfo.className === 'crontab.searchEngine.block') {
        SearchEngineBlock(crontabInfo);
      }else if(crontabInfo.className === 'crontab.hismsSendMail') {
        HismsSendMail(crontabInfo);
      }else if(crontabInfo.className === 'crontab.spider') {
        HismsSpider(crontabInfo);
      }else if(crontabInfo.className === 'crontab.clearRoomHistory') {
        ClearRoomHistory(crontabInfo);
      }else if(crontabInfo.className === 'crontab.clearKefuHistory') {
        ClearKefuHistory(crontabInfo);
      }else if(crontabInfo.className === 'crontab.customerServiceAlgorithm') {
        CustomerServiceAlgorithm(crontabInfo);
      }
      Meteor.call('crontabs.updateStatus', crontabInfo._id, 'Running');
    },

    'crontab.stop'(crontabInfo) {
      if(crontabInfo.className === 'crontab.searchEngine') {
        SearchEngine(crontabInfo, false);
      }else if(crontabInfo.className === 'crontab.searchEngine.block') {
        SearchEngineBlock(crontabInfo, false);
      }else if(crontabInfo.className === 'crontab.hismsSendMail') {
        HismsSendMail(crontabInfo, false);
      }else if(crontabInfo.className === 'crontab.spider') {
        HismsSpider(crontabInfo, false);
      }else if(crontabInfo.className === 'crontab.clearRoomHistory') {
        ClearRoomHistory(crontabInfo, false);
      }else if(crontabInfo.className === 'crontab.clearKefuHistory') {
        ClearKefuHistory(crontabInfo, false);
      }else if(crontabInfo.className === 'crontab.customerServiceAlgorithm') {
        CustomerServiceAlgorithm(crontabInfo, false);
      }
      Meteor.call('crontabs.updateStatus', crontabInfo._id, 'Stopped');
    },
  });

  Meteor.startup(function () {
    const runCrontabs = Crontab.find({status: 'Running'}).fetch();

    for(let eachItem of runCrontabs) {
      if(eachItem.className === 'crontab.searchEngine') {
        SearchEngine(eachItem);
      }else if(eachItem.className === 'crontab.searchEngine.block') {
        SearchEngineBlock(eachItem);
      }else if(eachItem.className === 'crontab.hismsSendMail') {
        HismsSendMail(eachItem);
      }else if(eachItem.className === 'crontab.spider') {
        HismsSpider(eachItem);
      }else if(eachItem.className === 'crontab.clearRoomHistory') {
        ClearRoomHistory(eachItem);
      }else if(eachItem.className === 'crontab.clearKefuHistory') {
        ClearKefuHistory(eachItem);
      }else if(eachItem.className === 'crontab.customerServiceAlgorithm') {
        CustomerServiceAlgorithm(eachItem);
      }
    }
    // eslint-disable-next-line no-undef
    SyncedCron.start();
  });
}
