import '@/envConfig';
import puppeteer  from 'puppeteer-core';
import path from 'path';
import * as os from 'os';
import { saveToLog } from '../logger/log';

let browser: any;
let page: any;

export function restoreToinit(){
    browser = '';
    page = '';
}

async function login() {

    const username = String(process.env.ZABBIX_USER);
    const password = String(process.env.PASSWORD);
    
    //Check Os    
    const browserPath = pathToBrowser()
    
    try {
    browser = await puppeteer.launch({
        executablePath: browserPath, 
        args: [
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
        ],
        headless: true 
    });

    page = await browser.newPage();
    
    const response = await page.goto('http://10.3.0.254/zabbix/index.php', {
        waitUntil: 'networkidle2',
        timeout: 10000 
    });

    if (response && response.ok()) {
        //console.log('Page loaded successfully:', page.url());
    } else {
        console.log('Failed to load the page. Status code:', response ? response.status() : 'Unknown');
    }
    } catch (error) {
        console.error('Error connecting to the page:', error);
        saveToLog(`Error connecting to the page: ${getCurrentTimestamp()}`);
        return ("Cannot connect to the web");
    }

    await page.type('#name', username); 
    await page.type('#password', password);
    await page.click('#enter'); 

    await page.waitForNavigation();
}
export async function gatherMainData(pageLink: any) {
    if (!browser) {
        await login(); 
    }

    try {
        await page.goto(pageLink); 
    } catch (error) {
        console.log(`Error opening link ${pageLink}: check the JSON file`);
        saveToLog(`Error opening link ${pageLink}: check the JSON file ${getCurrentTimestamp()}`);
        console.error(`Error opening link ${pageLink}: check the JSON file`, error);
        return 'Navigation error'; 
    }

    let mainData = await page.evaluate(() => {
        const mainElement = document.querySelector('main');
        return mainElement ? mainElement.innerText : 'Main element not found';
    });

    return mainData; 
}

export async function closeBrowser() {
    if (browser) {
        await browser.close();
    }
}

export function getDownloadValue(logs: any, targetTime: any) {
    const MATCH_THRESHOLD_MS = 181000;

    if (typeof logs !== 'string') {
        console.error('The logs parameter should be a string.');
        return null;
    }

    const lines = logs.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
        console.error('Insufficient log data');
        return null;
    }
    const logLine = lines[1]; // Use the second line


    const parts = logLine.trim().split(' ');
    if (parts.length < 4) {
        console.error('Invalid log line format.');
        return null;
    }

    const logTime = new Date(`${parts[0]} ${parts[1]}`).getTime();
    const byteValue = parseInt(parts[3], 10);

    if (isNaN(logTime) || isNaN(byteValue)) {
        console.error('Failed to parse log time or byte value.');
        return null;
    }

    // Calculate time difference
    const diff = Math.abs(logTime - targetTime);
    
    // Check if the log time is within the match threshold
    if (diff < MATCH_THRESHOLD_MS) {
        return byteValue / 1e6; // Return the closest value in MB
    } else {
        saveToLog(`'No matching timestamp found within the threshold.' DIFF = ${diff} logtime = ${logTime} targetime = ${targetTime}`);
        console.log('No matching timestamp found within the threshold.');
        return null;
    }
}

export function getCurrentTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function pathToBrowser(): any {
    let winBrowser = path.join('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe');
    let linuxBrowser = path.join('/usr/bin/chromium');
    let pathToBrowser: any;
    if(isOS('windows')){
        pathToBrowser = winBrowser;
    } else{
        pathToBrowser = linuxBrowser;
    }
    return pathToBrowser;
}

function isOS(targetOS: 'windows' | 'linux'): boolean {
    const platform = os.platform();
    return (targetOS === 'windows' && platform === 'win32') || 
           (targetOS === 'linux' && platform === 'linux');
}