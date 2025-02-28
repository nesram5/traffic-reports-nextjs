import logger from '@/config/logger';
import DatabaseManager from './database-manager';

import { 
    IItem, 
    ITrafficReport, 
    ITrafficReportDetails, 
    IType,
    ITrafficReportByItem,
    ITrafficReportByDateRange,
    IReport,
    IDate,
    ITrafficReportMap,
    TrafficAverage,
} from '@/types/IReports';

export default class TrafficTableManager {
    private db: DatabaseManager;

    constructor(db: DatabaseManager) {
        this.db = db;
    }

    // Insert a new type
    public async insertType(type: string): Promise<number> {
        const result = await this.db.insert('types', { type });
        return result.insertId;
    }

    // Insert a new item
    public async insertItem(item: Omit<IItem, 'id'>): Promise<number> {
        const result = await this.db.insert('items', item);
        return result.insertId;
    }

    // Insert a new date
    public async insertDate(report_date: string): Promise<number> {
        const result = await this.db.insert('dates', { report_date });
        return result.insertId;
    }

    // Insert a new traffic report
    public async insertTrafficReport(report: Omit<ITrafficReport, 'id'>): Promise<number> {
        const result = await this.db.insert('traffic_reports', report);
        return result.insertId;
    }
    // Get traffic reports for latest date
    public async getLatestTrafficReports(): Promise<{report: IReport, date: string} | null> {
        
        const sql = `
            SELECT 
                tr.mbps,
                i.name AS item_name,
                i.display_name,
                i.display_position,
                t.type
            FROM 
                traffic_reports tr
            JOIN 
                items i ON tr.item_id = i.id
            JOIN 
                types t ON i.type_id = t.id
            JOIN 
                dates d ON tr.report_date_id = d.id
            WHERE 
                d.id = ? 
            ORDER BY 
                i.display_position       
        `;
        try {
            const latestDate: IDate[] = 
                await this.db.query<IDate[]>(`
                SELECT 
                * 
                FROM dates 
                ORDER BY report_date 
                DESC LIMIT 1`
            );
            if (!latestDate) {
                throw new Error('No dates found');
            }
            let data: ITrafficReportDetails[] = await this.db.query<ITrafficReportDetails[]>(sql, [latestDate[0].id]);
            
            if (!data) {
                logger.error('No data found', data);
                return null;
            }
            const report: IReport = this.proccesData(data);
        
            return {report, date: latestDate[0].report_date};

        } catch (error) {
            logger.error('Error getting latest traffic reports', error);
            throw error;
        }
        
    }

    // Get traffic reports for a specific date
    public async getTrafficReportsByDate(date: string): Promise<{report: IReport, date: string} | null> {
        const sql = `
            SELECT 
                tr.mbps,
                i.name AS item_name,
                i.display_name,
                i.display_position,
                t.type,
                d.report_date
            FROM 
                traffic_reports tr
            JOIN 
                items i ON tr.item_id = i.id
            JOIN 
                types t ON i.type_id = t.id
            JOIN 
                dates d ON tr.report_date_id = d.id
            WHERE 
                d.report_date = ?
            ORDER BY 
                i.display_position        
        `;
        try {
            const data: ITrafficReportDetails[] = await this.db.query<ITrafficReportDetails[]>(sql, [date]);
            if (!data) {
                logger.error('No data found', data);
                return null;
            }
            const report: IReport = this.proccesData(data);
            return {report, date: date};

        } catch (error) {
            logger.error('Error getting traffic reports by date', error);
            throw error;
        }

    }

    public async getTrafficAverageAtPickHours(): Promise<TrafficAverage[]> {
        const sql = `
            SELECT 
                i.name AS item,
                AVG(CASE WHEN DATE_FORMAT(d.report_date, '%H:%i') BETWEEN '20:50' AND '21:00' THEN tr.mbps END) AS avg_9pm,
                AVG(CASE WHEN DATE_FORMAT(d.report_date, '%H:%i') BETWEEN '21:20' AND '21:30' THEN tr.mbps END) AS avg_930pm,
                AVG(CASE WHEN DATE_FORMAT(d.report_date, '%H:%i') BETWEEN '21:50' AND '22:00' THEN tr.mbps END) AS avg_10pm,
                CONCAT(MIN(DATE(d.report_date)), ' al ', MAX(DATE(d.report_date))) AS date_interval
            FROM 
                traffic_reports tr
            JOIN 
                items i ON tr.item_id = i.id
            JOIN 
                dates d ON tr.report_date_id = d.id
            GROUP BY 
                i.name
            ORDER BY 
                i.name;
        `;
        return await this.db.query<TrafficAverage[]>(sql);
    }

    public async getTrafficAverageAtPickHoursBetweenDates(startDate: string, endDate: string): Promise<TrafficAverage[]> {
        const sql = `
            SELECT 
                i.name AS item,
                AVG(CASE WHEN DATE_FORMAT(d.report_date, '%H:%i') BETWEEN '20:50' AND '21:00' THEN tr.mbps END) AS avg_9pm,
                AVG(CASE WHEN DATE_FORMAT(d.report_date, '%H:%i') BETWEEN '21:20' AND '21:30' THEN tr.mbps END) AS avg_930pm,
                AVG(CASE WHEN DATE_FORMAT(d.report_date, '%H:%i') BETWEEN '21:50' AND '22:00' THEN tr.mbps END) AS avg_10pm,
                CONCAT(MIN(DATE(d.report_date)), ' al ', MAX(DATE(d.report_date))) AS date_interval
            FROM 
                traffic_reports tr
            JOIN 
                items i ON tr.item_id = i.id
            JOIN 
                dates d ON tr.report_date_id = d.id
            WHERE 
                DATE(d.report_date) BETWEEN ? AND ?
            GROUP BY 
                i.name
            ORDER BY 
                i.name;
        `;
        return await this.db.query<TrafficAverage[]>(sql, [startDate, endDate]);
    }

    // Get all types
    public async getAllTypes(): Promise<IType[]> {
        return await this.db.select<IType>('types');
    }

    // Get all items
    public async getAllItems(): Promise<IItem[]> {
        const sql = `
            SELECT *
            FROM items
            ORDER BY display_position
        `;
        return await this.db.query<IItem[]>(sql);
    }

    // Get all dates
    public async getAllDates(): Promise<IDate[]> {
        return await this.db.select<IDate>('dates');
    }

    // Get all traffic reports
    public async getAllTrafficReports(): Promise<ITrafficReport[]> {
        return await this.db.select<ITrafficReport>('traffic_reports');
    }

    public async updateItem(item: IItem): Promise<boolean> {
        try {            
            const data = {
                zabbix_item: item.zabbix_item,
                name: item.name,
                type_id: item.type_id,
                display_name: item.display_name,
                display_position: item.display_position
            };
            const condition = `id = ${item.id}`;

            const result = await this.db.update('items', data, condition);
            return result.affectedRows > 0; // Returns true if the item was updated
        } catch (error) {
            logger.error(`Error updating item with ID ${item.id}:`, error);
            throw error;
        }
    }

    // Delete an item by ID
    public async deleteItem(itemId: number): Promise<boolean> {
        try {
            const condition = `id = ${itemId}`;

            const result = await this.db.delete('items', condition);
            return result.affectedRows > 0; // Returns true if the item was deleted
        } catch (error) {
            logger.error(`Error deleting item with ID ${itemId}:`, error);
            throw error;
        }
    }

    public proccesData(data: ITrafficReportDetails[]): IReport {
       //Proccess the data
      
        const summarizedData: ITrafficReportMap = {};
        const uniqueTypesSet: Set<string> = new Set();
        let fallbackMbps: string = 'No se encontro este valor en Zabbix'
        for (const item of data) {
            let { type, display_name: group, mbps, item_name } = item;

          
            // Añadir el tipo al conjunto de tipos únicos
            uniqueTypesSet.add(type);

            // Inicializar la estructura para el tipo si no existe
            if (!summarizedData[type]) {
                summarizedData[type] = {};
            }

            // Inicializar la estructura para el grupo si no existe
            if (!summarizedData[type][group]) {
                summarizedData[type][group] = {
                    group: group,
                    mbps: 0,
                };
            }
            if (mbps === null){
                //Zabbix item sin valores
                logger.error("No se encontro data en el ZabbixItem ", item_name )
                summarizedData[type][group].mbps = fallbackMbps;
            }
            
            else if (typeof mbps !== 'string' 
                && typeof summarizedData[type][group].mbps != 'string'                             
            ) {
                summarizedData[type][group].mbps += mbps;
            }

            
        }
        // Convertir el Set de tipos únicos a un array
        const uniqueTypes = Array.from(uniqueTypesSet);

        let result = {
            reportValues: summarizedData,
            types: uniqueTypes,
        };

        return result;
    }
}