export interface ITrafficData {
    [key: string]: {
        ip: string;
        oid: string[];
        name: string;
        type: string;
        group: string;
        substract: string
        prefered_interval: number;
    };
}
export interface ITrafficType {
    group: string;
    name: string;
    mbps: number | string;
    substract: string 
}

export interface ITrafficDataSplit {
    deviceListTime01: ITrafficData;
    interval01: number;
    deviceListTime02: ITrafficData;
    interval02: number;
}

export interface ISplitReport{
    simpleReport: iTrafficReport;
    detailedReport: iTrafficReport;
}

export interface iTrafficReport {
    [key: string]: ITrafficType[];
}

export interface IMonthGroup {
    month: string;
    dayGroups: IDayGroup[];
}

export interface IDayGroup {
    day: string;
    groupItems: IGroupItem[];
}

export interface IGroupItem {
    hour: string;
    items: IItem[];
}

export interface IItem {
    first: string;
    second: string;
}