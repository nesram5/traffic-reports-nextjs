import { ITrafficData, iTrafficReport } from '../interfaces/traffic-data';

export function calculateTraffic(
    data: ITrafficData,
    sampleData: Array<Record<string, any>>,
    detailedReport: iTrafficReport,
    simpleReport: iTrafficReport,
    samplesNumber: number) {
    for (const device of Object.values(data)) {
        const name: string = device.name;
        const group: string = device.group;
        const deviceType: string = device.type;
        const ip = device.ip;
        const substract = device.substract;

       //Check if values exists in the array
        let allSamplesExist = true;
        for (let i = 0; i < samplesNumber; i++) {
            if (!sampleData[i][name]) {
                allSamplesExist = false;
                break; 
            }
        }
        if (!allSamplesExist) {
            addDetailedReportError(detailedReport, deviceType, group, name, ip, substract);
            continue;
        }
        //Process Data
        const result:any = [];
        for (let i = 0; i < samplesNumber; i += 2) {
            if (sampleData[i] && sampleData[i + 1]) { // Ensure that both elements exist
                
                result.push(convertToMbps(sampleData[i][name], sampleData[i + 1][name]));
            }
        }
        
        let avgResult: number = calculateAverage(result) ;     
       
        //Export processed data
        pushDetailedReport(detailedReport, deviceType, group, name, avgResult, substract);
        pushSimpleReport(simpleReport, deviceType, group, name, avgResult, substract);
    }
}

function addDetailedReportError(
    detailedReport: iTrafficReport,
    deviceType: string,
    group: string,
    name: string,
    ip: string,
    substract: string
) {
    if (!detailedReport[deviceType]) {
        detailedReport[deviceType] = [];
    }
    detailedReport[deviceType].push({
        group,
        name,
        mbps: `Error: No access to ${ip} ${name}`,
        substract,
    });
}

function calculateAverage(result: Array<number | string>): number {
      
    let total = 0;
    let validSamples = 0;  // Count of valid (non-zero, non-invalid) samples
    const validValues: number[] = []; // Store valid numeric values

    // First pass: filter valid values and store them
    for (let value of result) {
        // Ensure numeric value, otherwise treat as 0
        let numericValue = typeof value === 'string' ? parseFloat(value) : value;

        // If value is invalid (NaN) or zero, skip it
        if (!isNaN(numericValue) && numericValue !== 0) {
            validValues.push(numericValue);
        }
    }

    // If no valid samples, return 0
    if (validValues.length === 0) {
        return 0;
    }

    // Calculate the average of valid values for comparison
    const totalValid = validValues.reduce((sum, val) => sum + val, 0);
    const averageValid = totalValid / validValues.length;

    // Second pass: calculate the total excluding any values more than 50% larger than the average
    for (let value of validValues) {
        // If the value is more than 50% larger than the average of the rest, skip it
        if (value > 1.5 * averageValid) {
            continue;
        }

        total += value;
        validSamples++;
    }

    // If all valid values were excluded, return 0
    if (validSamples === 0) {
        return 0;
    }

    // Calculate the final average
    let finalAverage = total / validSamples;

    return finalAverage;
}

function pushDetailedReport(
    detailedReport: iTrafficReport,
    deviceType: string,
    group: string,
    name: string,
    mbps: number,
    substract: string
) {
    if (!detailedReport[deviceType]) {
        detailedReport[deviceType] = [];
    }
    //Convert value to negative for be substracted at the message function
    if (substract === "yes") {        
        mbps = mbps * -1;
    }
    detailedReport[deviceType].push({ group, mbps, name, substract });
}

function pushSimpleReport(
    simpleReport: iTrafficReport,
    deviceType: string,
    group: string,
    name: string,
    mbps: number,
    substract: string
) {
    if (!simpleReport[deviceType]) {
        simpleReport[deviceType] = [];
    }
      let existing = simpleReport[deviceType].find(item => item.group === group);
        
    if (existing) {
        //Convert value to negative for be substracted
        if (substract === "yes") {
            mbps = mbps * -1;
        }
        existing.mbps = (existing.mbps as number) + mbps;
       
    } else {
        simpleReport[deviceType].push({ group, name, mbps, substract });
    }

}

function convertToMbps(firstPass: any[], secondPass: any[]): number | string {
    try {
        const milliseconds = compareTimestamps(firstPass[1], secondPass[1]); 
        const counter1 = BigInt(Number(firstPass[0]));
        const counter2 = BigInt(Number(secondPass[0]));
        const deltaCounter = counter2 - counter1;
        const deltaBits = deltaCounter * 8n;
        
        // Divide by milliseconds and then scale to bits per millisecond -> Mbps
        const mbps = (deltaBits * 1000n) / milliseconds / 1000000n;
        return Number(mbps);
    } catch (error: any) {
        return `Error: ${error.message}`;
    }
}

function compareTimestamps(timestamp1: number, timestamp2: number): bigint {
    const differenceInMilliseconds = Math.abs(Number(timestamp1) - Number(timestamp2));
    return BigInt(differenceInMilliseconds); 
}