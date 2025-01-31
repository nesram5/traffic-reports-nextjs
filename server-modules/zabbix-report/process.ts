export function summarizeMbpsAndExtractTypes(data: any) {

    const summarizedData: any = {};
    const detailedData: any = {};
    const uniqueTypesSet: any = new Set();

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const { type, group, mbps, name } = data[key]; 

            if (!summarizedData[type]) {
                summarizedData[type] = {};
            }

            if (!summarizedData[type][group]) {
                summarizedData[type][group] = {
                    group: group,
                    mbps: 0
                };
            }

            summarizedData[type][group].mbps += mbps;

            if (!detailedData[type]) {
                detailedData[type] = {};
            }

            if (!detailedData[type][name]) {
                detailedData[type][name] = {
                    name: name,
                    mbps: 0
                };
            }

            detailedData[type][name].mbps += mbps;

            uniqueTypesSet.add(type);
        }
    }

    const uniqueTypes = Array.from(uniqueTypesSet);

    return { summarizedData, detailedData, uniqueTypes };
}
export function summarizeVoltage(data: any) {

    const summarizedData: any = {};
    const uniqueTypesSet: any = new Set();

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const { type, group, voltage, name } = data[key]; 

            if (!summarizedData[type]) {
                summarizedData[type] = {};
            }

            if (!summarizedData[type][group]) {
                summarizedData[type][group] = {
                    group: group,
                    voltage: 0
                };
            }

            summarizedData[type][group].voltage += voltage;

            uniqueTypesSet.add(type);
        }
    }

    const uniqueTypes = Array.from(uniqueTypesSet);

    return { summarizedData, uniqueTypes };
}