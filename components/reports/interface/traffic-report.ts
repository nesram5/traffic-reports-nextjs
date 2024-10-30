export interface iTrafficReport {
    deviceId: string;
    data: {
        timestamp: string;
        simpleReport: string;
        detaildReport: string;
    }[];
}

export interface ITrafficReportProps {
    data: iTrafficReport[]; 
}