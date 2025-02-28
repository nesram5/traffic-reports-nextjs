import logger from "@/config/logger";
import { IReport } from "@/types/IReports";

export default class TextMessageReport {
    private report: IReport | null = null;
    constructor(_report: IReport) {        
        this.report = _report   
    }

    public generateMessage(report: IReport): string {
        try{
            const { reportValues, types } = report;    
            const startTime = this.formattedDate();
            let resultText = `------🌐 _Estado actual del tráfico_ 🌐 -------\n`;
            let footer = `\n-------- *Estadísticas a la hora ${startTime}* ---------\n`;
            for (const type of types) {
                let typeText = `\n*${type}:*\n\n ---------------------------------------\n`;
                
                let totalType = 0;

                if (reportValues[type]) {
                    for (const group in reportValues[type]) {
                        const { group: groupName, mbps } = reportValues[type][group];
                        let mbpsValue: string | number = 0;
                        if (typeof mbps === 'number' ) {
                            mbpsValue = Math.abs(Math.round(mbps)); 
                            typeText += `▪️ *${groupName}:*  \`\`\`${this.formatNumberWithDot(mbpsValue)} Mbps\`\`\`\n`;
                            totalType += mbpsValue; 
                        }
                        //Show error message
                        else if (typeof mbps === 'string') {
                            mbpsValue = mbps;
                            typeText += `▪️ *${groupName}:*  \`\`\`${mbpsValue} Mbps\`\`\`\n`;
                        }
                    }
                }
                if (type === "Proveedores"){
                    typeText += `▪️ *Total ${type}:*  \`\`\`${this.formatNumberWithDot(Math.round(totalType))} Mbps\`\`\`\n`;
                    typeText += `---------------------------------------\n`;
                }
                resultText += typeText;
            }

            return `${resultText}${footer}`;
        }
        catch (error) {
            logger.error('Error generating message:', error);
            return 'Error generating message';
        }
    }

    private formatNumberWithDot(num: number): string {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    private formattedDate() {
        const now = new Date();
        // Create a new date object set to UTC -4:00
        const utcMinus4 = new Date(now.getTime() - (4 * 60 * 60 * 1000));

        const options: any = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true, 
            timeZone: 'UTC',
        };

        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(utcMinus4);
        
        const timeParts = formattedTime.split(' ');
        const time = timeParts[0];
        const period = timeParts[1].toLowerCase();

        return `${time} ${period}`; 
    }
}