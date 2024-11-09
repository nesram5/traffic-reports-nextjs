import { fetchTrafficDataFromDB } from '../handlerDB/fetch';
import { autoGetReportSnmp } from '../snmp-report/main';
import { autoGetReportZabbix } from '../zabbix-report/main';
import { extractUsdValue } from '../getUSDValue/fetch';
import { saveToLog } from '../logger/log';
import { setCurrentModtime } from '../checkChange/check';

// Automatic execute functions
async function executeTwicePerHour() {
  await autoGetReportZabbix();
  setInterval(fetchTrafficDataFromDB, 1000);
  setCurrentModtime();
  saveToLog(`Function executed at: ${new Date().toLocaleTimeString()}`);
}

async function executeEvery5Min() {
  //fetchTrafficDataFromDB();
  //console.log("Function executed at:", new Date().toLocaleTimeString());
}

function executeDailyAt8AM() {
  extractUsdValue();
  console.log("Daily function executed at:", new Date().toLocaleTimeString());
}

function getTimeUntilNextExecution(hourlyMinutes: number) {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Calculate minutes remaining until the next target time (hourlyMinutes)
  const minutesRemaining = (60 + hourlyMinutes - minutes) % 60;
  const total = (minutesRemaining * 60 * 1000) - (seconds * 1000 + milliseconds);

  return total;
}

function getTimeUntilNext8AM() {
  const now = new Date();
  const target = new Date();
  target.setHours(8, 0, 0, 0); // Set target time to 8:00 AM

  if (now > target) {
    target.setDate(target.getDate() + 1); // If current time is past 8:00 AM, set target to next day
  }

  return target.getTime() - now.getTime();
}

export function scheduleExecution() {
  const firstTargetMinutes = 25; // 5 minutes before :25
  const secondTargetMinutes = 55; // 5 minutes before :55

  // Schedule the first execution of the function 9 minutes before :25
  const timeUntilNextFirstExecution = getTimeUntilNextExecution(firstTargetMinutes);
  setTimeout(() => {
    executeTwicePerHour();
    setInterval(() => {
      executeTwicePerHour();
      const nextExecutionTime = getTimeUntilNextExecution(firstTargetMinutes);
      setTimeout(() => {
        executeTwicePerHour();
      }, nextExecutionTime);
    }, 60 * 60 * 1000); // Repeat every hour
  }, timeUntilNextFirstExecution);

  // Schedule the second execution of the function 9 minutes before :55
  const timeUntilNextSecondExecution = getTimeUntilNextExecution(secondTargetMinutes);
  setTimeout(() => {
    executeTwicePerHour();
    setInterval(() => {
      executeTwicePerHour();
      const nextExecutionTime = getTimeUntilNextExecution(secondTargetMinutes);
      setTimeout(() => {
        executeTwicePerHour();
      }, nextExecutionTime);
    }, 60 * 60 * 1000); // Repeat every hour
  }, timeUntilNextSecondExecution);

  // Schedule the 5-minute execution
  const timeUntilNext5MinExecution = getTimeUntilNextExecution(5);
  setTimeout(() => {
    executeEvery5Min();
    setInterval(() => {
      executeEvery5Min();
      const nextExecutionTime = getTimeUntilNextExecution(5);
      setTimeout(() => {
        executeEvery5Min();
      }, nextExecutionTime);
    }, 5 * 60 * 1000); // Run every 5 minutes
  }, timeUntilNext5MinExecution);

  // Schedule the daily execution at 8:00 AM
  const timeUntilNext8AMExecution = getTimeUntilNext8AM();
  setTimeout(() => {
    executeDailyAt8AM();
    setInterval(() => {
      executeDailyAt8AM();
      const nextExecutionTime = getTimeUntilNext8AM();
      setTimeout(() => {
        executeDailyAt8AM();
      }, nextExecutionTime);
    }, 24 * 60 * 60 * 1000); // Repeat every 24 hours
  }, timeUntilNext8AMExecution);
}