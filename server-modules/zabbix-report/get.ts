import '@/envConfig';
import puppeteer  from 'puppeteer-core';
import path from 'path';
import * as os from 'os';
import { saveToLog } from '@/server-modules/logger/log';
import { exec } from "child_process";
let browser: any;
let page: any;

export function restoreToinit(){
    browser = '';
    page = '';
    exec("killall chromium", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
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
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--ignore-certificate-errors',
            '--ignore-certificate-errors-spki-list',
            '--single-process'
          ],
          headless: true,
          acceptInsecureCerts: true 
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
export async function gatherMainData(pageLink: any): Promise<any> {
    if (!browser) {
        await login(); 
    }

    try {
        await page.goto(pageLink); 
    } catch (error) {
        saveToLog(`Error opening link ${pageLink}: check the JSON file ${getCurrentTimestamp()}`);
        restoreToinit();
        await new Promise(resolve => setTimeout(resolve, 15000));
        return gatherMainData(pageLink)
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

export function getDownloadValue(logs: string, targetTime: any): number | null {
    if (typeof logs !== 'string') {
        console.error('The logs parameter should be a string.');
        return null; // Return null if logs is not a string
    }

    const lines = logs.split('\n').filter(line => line.trim() !== '');
    let closestValue: number | null = null;
    let closestDiff = Infinity;
    const threshold = 240000; // 4 minutes in milliseconds
    
    let found = false;
    lines.forEach(line => {
        if (found) return;
        const parts = line.split(' ');
        if (parts.length < 4) return; // Skip lines that don't have enough data

        const logTime = new Date(parts[0] + ' ' + parts[1]).getTime();
        const byteValue = parseInt(parts[3], 10); // The download value in bytes

        const diff = Math.abs(logTime - targetTime);

        if (diff < closestDiff && diff <= threshold) {
            closestDiff = diff;
            closestValue = byteValue;
            found = true; //break the loop
        }
    });

    if (closestValue !== null) {
        return closestValue / 1e6; // Convert bytes to MBps and return
    } else {
        saveToLog(`No matching timestamp found within the threshold. ${closestDiff}`);
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