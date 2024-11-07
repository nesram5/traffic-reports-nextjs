import puppeteer  from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import * as os from 'os';
import { saveToLog } from '../logger/log';


export async function extractUsdValue() {
    const usdFile = path.join(process.cwd(), 'data/usd_bcv.json');
    const browserPath = pathToBrowser(); // Assuming this function is defined elsewhere

    let browser, page;

    try {
        browser = await puppeteer.launch({
            executablePath: browserPath,
            args: [
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--ignore-certificate-errors'
            ],
            headless: true
        });

        page = await browser.newPage();

        // Navigate to the website
        const response = await page.goto('https://monitordolarvenezuela.com', {
            waitUntil: 'domcontentloaded',
            timeout: 10000,
        });

        if (response && response.ok()) {
            console.log('Page loaded successfully:', page.url());
        } else {
            console.log('Failed to load the page. Status code:', response ? response.status() : 'Unknown');
        }
    } catch (error) {
        console.error('Error connecting to the page:', error);
        saveToLog(`Error connecting to the page: ${getCurrentTimestamp()}`); // Assuming this function is defined elsewhere
        return "Cannot connect to the web";
    }
    await page.waitForNavigation();

    const usdValue = await page.evaluate(() => {
        // Select the <p> element that contains the BS value
        const usdElement = document.querySelector('p.font-bold.text-xl');
        if (usdElement) {
            // Extract the text content and remove the 'Bs = ' part
            const textContent = usdElement.textContent!.trim();
            const value = textContent.replace('Bs = ', '').replace(/,/g, '.'); // Replace comma with period
            const parsedValue = parseFloat(value);            
            return parsedValue
        }
        return null;
    });

    await browser.close();

    fs.writeFile(usdFile, JSON.stringify({ usdValue }), (err) => {
        if (err) {
            console.error('Error writing file', err);
        } else {
            console.log('File written successfully');
        }
    });
}

function pathToBrowser(): any {
    let winBrowser = path.join('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe');
    let linuxBrowser = path.join('/usr/bin/chromium-browser');
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