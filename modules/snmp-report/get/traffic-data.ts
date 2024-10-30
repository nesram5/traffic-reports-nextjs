import '@/envConfig.ts';
import fs from 'fs';
import path from 'path';
import snmp from 'snmp-native';
import { ITrafficData, ITrafficDataSplit } from '../interfaces/traffic-data';


export function readDeviceListComplete(): ITrafficData | string {
    const filePath = path.join(process.cwd(), 'data/snmp_list_devices.json');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        
        try {
            return JSON.parse(data) as ITrafficData;
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            let err = "Can't access to the traffic_data file"
            return err; 
        }

    } catch (fileError) {
        console.error('Error reading file:', fileError);
        let err = "Can't access to the traffic_data file"
        return err; 
    }
}


export function readDeviceListByTimeInterval(): ITrafficDataSplit | string {
    const filePath = path.join(process.cwd(), 'data/snmp_list_devices.json');

    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let interval01: number = 0;
        let interval02: number = 0;
        try {
            const parsedData: ITrafficData = JSON.parse(data) as ITrafficData;
            
            const deviceListTime01: ITrafficData = {};
            const deviceListTime02: ITrafficData = {};

            // Separate devices based on 'prefered-interval' or other criteria
            for (const [key, device] of Object.entries(parsedData)) {
                device.prefered_interval
                if (device.prefered_interval < 29999) {
                    deviceListTime01[key] = device;
                    interval01 = device.prefered_interval
                } else {
                    deviceListTime02[key] = device;
                    interval02 = device.prefered_interval
                }
            }

            return { deviceListTime01, interval01, deviceListTime02, interval02 };

        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            return "Can't parse the traffic_data file"; 
        }

    } catch (fileError) {
        console.error('Error reading file:', fileError);
        return "Can't access the traffic_data file";
    }
}


async function get(oids: string[], target: string): Promise<[number]>{
    return new Promise((resolve, reject) => {
        let result:any = [];

        let community_name = process.env.COMUNNITY;
        const options = {
            port: 161,
            host: target,
            community: community_name,
            timeouts: [1000, 1000, 1000],
            version: 1   
        };

        const session = new snmp.Session(options);
        session.getAll({ oids: oids }, function (error, varbinds) {
            session.close();
            if (error) {
                reject(error);  
            } else {
                result = []; 
                varbinds.forEach(function (vb) {                    
                    result.push(vb.value);
                    result.push(vb.receiveStamp);
                });
                resolve(result); 
            }
        });
    });
}

export async function getAll(data: ITrafficData, sampleData: Array<Record<string, any>>, samplesNumber: number, sampleInterval: number) {
    for (let i = 0; i < samplesNumber; i++) {
        for (const device of Object.values(data)) {
            try {
                               
                const result = await get(device.oid, device.ip);     
                sampleData[i][device.name] = result;
            } catch (error) {
                console.log(error);
                sampleData[i][device.name] = [`Error in GET ${device.name}  ${device.ip}`, 0];
                console.log("Error in GET ", device.name, device.ip)
            }
        }
        if (i < samplesNumber - 1) {
            await new Promise(resolve => setTimeout(resolve, sampleInterval));
        }
    }
}
