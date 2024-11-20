import fs from 'fs';
import path from 'path';
import { saveToLog } from '@/modules/logger/log';
import { submitToDB } from '@/modules/handlerDB/submit';
import {gatherMainData, getDownloadValue, getCurrentTimestamp,closeBrowser, restoreToinit } from '@/modules/zabbix-report/get';
import { summarizeMbpsAndExtractTypes } from '@/modules/zabbix-report/process';
import { simplified_report, getCurrentTimeInUTCMinus4, detailed_report} from '@/modules/zabbix-report/message';




function readJsonFile(filePath: any) {
    const data: any = fs.readFileSync(filePath);
    return JSON.parse(data);
}


export async function getReportZabbix(attempt = 0 , test = false): Promise<{simpleResult: string, detailedResult: string}>{
    
    let file = path.join(process.cwd(), 'data/zabbix_list_devices.json');
    if (test) {
        file = path.join(process.cwd(), 'data/test-zabbix_list_devices.json');
    }
    
    const providers = readJsonFile(file);

    const MAX_ATTEMPTS = 3;
    
    const currentTimestamp = getCurrentTimestamp();
    const startTime = getCurrentTimeInUTCMinus4()
    const results: any = {}; 


    for (const key in providers) {
        const provider = providers[key];
        const mainData = await gatherMainData(provider.link);         
        const targetTime = new Date(currentTimestamp).getTime();
        const mbpsValue = getDownloadValue(mainData, targetTime); 
        if (mbpsValue === null && attempt < MAX_ATTEMPTS) {
            saveToLog(`Cannot connect to ${provider.link} value is NULL at ${startTime}\n` )
            await new Promise(resolve => setTimeout(resolve, 15000));
            closeBrowser();
            return getReportZabbix(attempt + 1);
        }

        results[key] = {
            ...provider,
            mbps: mbpsValue 
        };
    }
    closeBrowser();
    const { summarizedData, detailedData, uniqueTypes } = summarizeMbpsAndExtractTypes(results);
    const simpleResult = (simplified_report(summarizedData, uniqueTypes, startTime));
    const detailedResult = (detailed_report(detailedData, uniqueTypes, startTime));
    
    return {simpleResult, detailedResult}
        
}   


export async function autoGetReportZabbix() {

    let {simpleResult: simpleResult, detailedResult: detailedResult} = await getReportZabbix();
    submitToDB(simpleResult, detailedResult);
    restoreToinit();
}

