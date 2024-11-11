import { fetchTrafficDataFromDB } from '@/modules/handlerDB/fetch';
import { autoGetReportSnmp } from '@/modules/snmp-report/main';
import { autoGetReportZabbix } from '@/modules/zabbix-report/main';
import { extractUsdValue } from '@/modules/getUSDValue/fetch';
import { saveToLog } from '@/modules/logger/log';
import cron from 'node-cron';
import schedule from 'node-schedule';

// Automatic execute functions
async function executeTwicePerHour() {
  await autoGetReportZabbix();
  await fetchTrafficDataFromDB();
  saveToLog(`Function executed at: ${new Date().toLocaleTimeString()}`);
}

function executeDailyAt8AM() {
  extractUsdValue();
  console.log("Daily function executed at:", new Date().toLocaleTimeString());
}

/*
async function executeEvery5Min() {
  await autoGetReportZabbix();
  await fetchTrafficDataFromDB();
  saveToLog(`Function executed at: ${new Date().toLocaleTimeString()}`);
}
*/
  // Schedule the function to run every 5 minutes
//cron.schedule('*/5 * * * *', executeEvery5Min);

export function scheduleExecution() {
  // Schedule the function to run twice per hour at 25 and 55 minutes past the hour
  cron.schedule('25,55 * * * *', executeTwicePerHour);

  // Schedule the function to run daily at 8:00 AM
  schedule.scheduleJob('0 8 * * *', executeDailyAt8AM);
}