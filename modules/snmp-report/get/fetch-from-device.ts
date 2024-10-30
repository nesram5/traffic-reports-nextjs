import { ITrafficData, ISplitReport, iTrafficReport } from '../interfaces/traffic-data';
import { getAll } from './traffic-data';
import { calculateTraffic } from '../calculate/traffic';

export async function fechReport(
    expectedTime: number,
    samplesInterval: number,
    deviceList: ITrafficData 
): Promise<ISplitReport>  
{
    let samplesNumber = Math.round(expectedTime / samplesInterval);
    
    if (samplesNumber % 2) samplesNumber+=1;

    let detailedReport: iTrafficReport = {};

    let { simpleReport: simpleReport, trafficReportTypes } = initializeSimpleReport(deviceList);
   
    let rawOutput = createEmptyArray(samplesNumber);
    await getAll(deviceList, rawOutput, samplesNumber, samplesInterval);

    calculateTraffic(deviceList, rawOutput, detailedReport, simpleReport, samplesNumber);
    const endTime = new Date().toLocaleTimeString();

    console.log(`Process started at: ${endTime}`);
    return { simpleReport , detailedReport};
}

export function initializeSimpleReport(data: ITrafficData): { simpleReport: iTrafficReport, trafficReportTypes: string[] } {
    const simpleReport: iTrafficReport = {};
    const trafficReportTypes = []
    for (const key in data) {
        const { type, group, name, substract } = data[key];
        
        if (!simpleReport[type]) {
            simpleReport[type] = [];
            trafficReportTypes.push(type);
            simpleReport[type].push({
                group,
                name,
                mbps: 0,
                substract
            });
        }
    }
    return { simpleReport, trafficReportTypes };
}

export function createEmptyArray(n: number): Array<any[]> {
    return Array.from({ length: n }, () => []);
}