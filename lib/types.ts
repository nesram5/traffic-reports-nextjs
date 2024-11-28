export interface IItem {
  first: string;
  second: string;
};

export interface IGroupItem {
  hour: string;
  items: IItem[];
};

export interface IDayGroup {
  day: string;
  groupItems: IGroupItem[];
};

export interface IMonthGroup {
  month: string;
  dayGroups: IDayGroup[];
};

export interface IYearGroup {
  year: string;
  monthGroups: IMonthGroup[];
};
export interface ICheckValues { 
  [key: string] : { 
    main: string, 
    secondary: string, 
    sum: boolean, 
    percentage: number 
  }
};
export interface ICheckedValues { 
  [key: string] : { 
    main: number, 
    secondary: number, 
    sum: boolean, 
    percentage: number 
  }
};