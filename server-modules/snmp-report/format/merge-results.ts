import { ITrafficData } from "../interfaces/traffic-data";

export function mergeResultSimplified(deviceList: ITrafficData, array1: any, array2: any): any {
    const finalArray: any = {};
    const namesSet: Set<string> = new Set(); // To track unique names

    for (const deviceKey in deviceList) {
        const device = deviceList[deviceKey];
        const type = device.type;

        // Check if the type exists in finalArray
        if (!finalArray[type]) {
            finalArray[type] = [];
        }

        // Check from array1
        const fromArray1 = array1[type]?.find((item: any) => item.group === device.group);
        if (fromArray1 && !namesSet.has(fromArray1.name)) {
            finalArray[type].push(fromArray1);
            namesSet.add(fromArray1.name); // Add name to the set
        }

        // Check from array2
        const fromArray2 = array2[type]?.find((item: any) => item.group === device.group);
        if (fromArray2 && !namesSet.has(fromArray2.name)) {
            finalArray[type].push(fromArray2);
            namesSet.add(fromArray2.name); // Add name to the set
        }
    }

    return finalArray;
}

export function mergeReportsDetailed(deviceList: ITrafficData, array1: any, array2: any): any {
    const finalArray: any = {};
    const namesSet: Set<string> = new Set(); // To track unique names

    for (const deviceKey in deviceList) {
        const device = deviceList[deviceKey];
        const type = device.type;

        // Check if the type exists in finalArray
        if (!finalArray[type]) {
            finalArray[type] = [];
        }

        // Check from array1
        const fromArray1 = array1[type]?.find((item: any) => item.name === device.name);
        if (fromArray1 && !namesSet.has(fromArray1.name)) {
            finalArray[type].push(fromArray1);
            namesSet.add(fromArray1.name); // Add name to the set
        }

        // Check from array2
        const fromArray2 = array2[type]?.find((item: any) => item.name === device.name);
        if (fromArray2 && !namesSet.has(fromArray2.name)) {
            finalArray[type].push(fromArray2);
            namesSet.add(fromArray2.name); // Add name to the set
        }
    }

    return finalArray;
}
