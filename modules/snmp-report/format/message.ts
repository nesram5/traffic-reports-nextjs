import { iTrafficReport } from '@/modules/snmp-report/interfaces/traffic-data';

export function detailed_report(detailedReport: iTrafficReport, startTime: string, trafficReportTypes: string[]): string {
    let resultText = `\n\n\n\n------ _Reporte detallado_ -------\n`;
    let footer = `\n-------- _Estadísticas a la hora ${startTime}_ ---------\n`;
    
    for (const type of trafficReportTypes) {
        let typeText = `\n*${type}:*\n\n`;
        let totalType = 0;

        
        for (const item of detailedReport[type]) {
            const { name, mbps } = item;
            let mbpsValue = typeof mbps === 'string' ? mbps : Math.round(mbps);

            
            typeText += `📌 *${name}:*  \`\`\`${mbpsValue} Mbps\`\`\`\n`;
            totalType += Number(mbps);
        }
        
        typeText += `📌 *Total ${type}:*  \`\`\`${Math.round(totalType)} Mbps\`\`\`\n`;

        resultText += typeText;
    }

    return `${resultText}${footer}`;
}

export function simplified_report(trafficReport: iTrafficReport, startTime: string, trafficReportTypes: string[]): string {
    let resultText = `------ _Estado actual del tráfico_ -------\n`;
    let footer = `\n-------- _Estadísticas a la hora ${startTime}_ ---------\n`;

    for (const type of trafficReportTypes) {
        let typeText = `\n*${type}:*\n\n`;
        let totalType = 0;
        
        for (const item of trafficReport[type]) {
            const { group, mbps } = item;
            let mbpsValue = typeof mbps === 'string' ? mbps : Math.round(mbps);

            typeText += `📌 *${group}:*  \`\`\`${mbpsValue} Mbps\`\`\`\n`;
            totalType += Number(mbps);
        }

        typeText += `📌 *Total ${type}:*  \`\`\`${Math.round(totalType)} Mbps\`\`\`\n`;

        resultText += typeText;
        
    }

    return `${resultText}${footer}`;
}