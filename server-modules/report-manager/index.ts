import DatabaseManager from './traffic-table-manager/database-manager';
import TrafficTableManager from './traffic-table-manager';
import { IReport, IItem, ITrafficReport, ITrafficReportMap, ITrafficReportDetails, IType} from '@/types/IReports';
import logger  from '@/config/logger';
import TextMessageReport from './text-message-report';
import ZabbixApiManager from './zabbix-api-manager';

export default class ReportManager {
    private databaseManager: DatabaseManager;
    private trafficTableManager: TrafficTableManager;
    private zabbixManager?: ZabbixApiManager;

    
    constructor(
        dbUsername: string,
        dbPassword: string,
        dbHost: string,
        dbName: string,
        token?: string,
        apiUrl?: string,
        ) 
    {
        this.databaseManager = new DatabaseManager(dbUsername, dbPassword, dbHost, dbName);

        if (token && apiUrl) {
            this.zabbixManager = new ZabbixApiManager(apiUrl,token);  
        }
                
        this.trafficTableManager = new TrafficTableManager(this.databaseManager);     
    }

    public async getMessage(date?: string): Promise<{message: string, date: string}>{ 
            if (!date) {
                this.trafficTableManager = new TrafficTableManager(this.databaseManager);
                const report: {report: IReport, date: string} | null = await this.trafficTableManager.getLatestTrafficReports()
                if (!report) {
                    logger.error('No report found');              
                    return {message:'No se encontraron reportes en la base de datos', date:''};
                }

                const message = new TextMessageReport(report.report).generateMessage(report.report);
                return {message, date:report.date};
            }
            else if (date) {
                this.trafficTableManager = new TrafficTableManager(this.databaseManager);
                const report = await this.trafficTableManager.getTrafficReportsByDate(date)
                if (!report) {
                    logger.error(`No se encontraron reportes de la fecha ${date} en la base de datos`);             
                    return {message:'No se encontraron reportes en la base de datos', date:date};
                }

                const message = new TextMessageReport(report.report).generateMessage(report.report);
                return {message, date:report.date};
                
            }    
            return {message:'No se encontraron reportes en la base de datos', date:''};
      
    }
    
    public async  getReportNow(): Promise<{message: string, date: string}>{  
          
        if (!this.zabbixManager) {
            logger.error('No zabbix manager found', this.zabbixManager);
            return {message:'No se encontraron items en la base de datos', date:''};            
        }
        const items: IItem[] = await this.trafficTableManager.getAllItems();            
        
        if (items.length === 0) {
            logger.error('No items found', items);
            return {message:'No se encontraron items en la base de datos', date:''};            
        }        
        const date = new Date().toISOString().slice(0, 16);
        const result: ITrafficReportDetails[] = [];

        for (const item of items) {
            try {
                const itemValue = await this.zabbixManager.getItemValue(item.zabbix_item);
                const typeName: IType[] = await this.trafficTableManager.getAllTypes()                 ;
                let mbps: number | null = null;
                let itemTypeName: string = '';

                if (itemValue) {                    
                    mbps = (Number(itemValue)) / 1_000_000; 
                } 
                else {
                    logger.error(`No value found for item ${item.name} Zabbix ItemId ${item.zabbix_item}`, itemValue);
                }
                
                for (const type of typeName) {
                    if (type.id === item.type_id) {
                        itemTypeName = type.type;
                    }
                    else {
                        logger.error(`No type found for item ${item.name} Zabbix ItemId ${item.zabbix_item}`, type);
                        continue;
                    }
                }
                const report: ITrafficReportDetails = { 
                    item_name: item.name,   
                    display_name: item.display_name,
                    display_position: item.display_position.toString(),
                    type: itemTypeName,
                    mbps: mbps,
                }

                result.push(report); 

            } catch (error) {
                logger.error(`Error processing item ${item.name}: ${error}`, error);
            }
        }
        const processedData: IReport = this.trafficTableManager.proccesData(result);
      
        const message = new TextMessageReport(processedData).generateMessage(processedData);

        return { message, date };
    }
            
    



}


