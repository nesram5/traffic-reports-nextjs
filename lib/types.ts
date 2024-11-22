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

export interface IYearGroup {
  year: string;
  monthGroups: IMonthGroup[];
}