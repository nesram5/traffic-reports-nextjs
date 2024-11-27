import { ISplitReport } from "./interfaces/traffic-data";
import { readDeviceListComplete, readDeviceListByTimeInterval } from '@/server-modules/snmp-report/get/traffic-data';
import { initializeSimpleReport, fechReport } from '@/server-modules/snmp-report/get/fetch-from-device';
import { submitToDB } from '@/server-modules/handlerDB/submit';
import { mergeResultSimplified , mergeReportsDetailed} from "@/server-modules/snmp-report/format/merge-results";
import { simplified_report, detailed_report } from '@/server-modules/snmp-report/format/message';


export async function getReportSnmp(): Promise<{ simpleResult:string, detailedResult:string}>  {
    //Set max total time for the report
    const expectedTime = 180000;

    const startTime = new Date().toLocaleTimeString();
    console.log(`Process getReport started at: ${startTime}`);
    
    //Principal devicelist
    const deviceListComplete = readDeviceListComplete();

    if (typeof deviceListComplete === 'string') {
        return {simpleResult: deviceListComplete, detailedResult: deviceListComplete}
    }

    let { simpleReport, trafficReportTypes } = initializeSimpleReport(deviceListComplete);

    //Divided devicelist
    let list_devices = readDeviceListByTimeInterval();
    if (typeof list_devices === 'string') {
        return {simpleResult: list_devices, detailedResult: list_devices}
    }

    let {
        deviceListTime01: deviceList01,
        interval01: samplesInterval01,
        deviceListTime02: deviceList02,
        interval02: samplesInterval02
    } = list_devices;

    // Execute two `fechReport` functions in parallel
    let results = await Promise.allSettled([
        fechReport(expectedTime, samplesInterval01, deviceList01),
        fechReport(expectedTime, samplesInterval02, deviceList02)
    ]);

    // Destructure results with appropriate checks
    let simpleReport01: ISplitReport | null = null;
    let simpleReport02: ISplitReport | null = null;
    
    if (results[0].status === 'fulfilled') {
        simpleReport01 = results[0].value;
    } else {
        console.error('Error in fetching report for deviceList01:', results[0].reason);
    }

    if (results[1].status === 'fulfilled') {
        simpleReport02 = results[1].value;
    } else {
        console.error('Error in fetching report for deviceList02:', results[1].reason);
    }

    if (!simpleReport01 || !simpleReport02) {
        return {simpleResult: "error", detailedResult: "error"}
    }

    const unifiedSimpleReport = mergeResultSimplified(deviceListComplete, simpleReport01.simpleReport, simpleReport02.simpleReport);
   
    const unifiedDetailedReport = mergeReportsDetailed(deviceListComplete, simpleReport01.detailedReport, simpleReport02.detailedReport);


    // Process the unified reports as needed
    let simpleResult = simplified_report(unifiedSimpleReport, startTime, trafficReportTypes);
    let detailedResult = detailed_report(unifiedDetailedReport, startTime, trafficReportTypes);

    const endTime = new Date().toLocaleTimeString();

    console.log(`Process end at: ${endTime}`);
    return { simpleResult, detailedResult}
}

export async function autoGetReportSnmp() {

    let {simpleResult: simpleResult, detailedResult: detailedResult} = await getReportSnmp();
    submitToDB(simpleResult, detailedResult);
}