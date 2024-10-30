export interface IItem {
    first: string;
    second: string;
}

export interface IGroupItem {
    hour: string;
    items: IItem[];
}

export interface IDayGroup {
    day: string;
    groupItems: IGroupItem[];
}

export interface IMonthGroup {
    month: string;
    dayGroups: IDayGroup[];
}

export interface IDateGroupProps {
    data: IMonthGroup[];  // This ensures the data is correctly typed as an array of month groups
}