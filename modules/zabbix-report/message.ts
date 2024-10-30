export function simplified_report(summarizedData: any, trafficReportTypes: any, startTime: any) {
    
    let resultText = `------ _Estado actual del tráfico_ -------\n`;
    let footer = `\n-------- _Estadísticas a la hora ${startTime}_ ---------\n`;

    for (const type of trafficReportTypes) {
        let typeText = `\n*${type}:*\n\n`;
        let totalType = 0;

        if (summarizedData[type]) {
            for (const group in summarizedData[type]) {
                const { group: groupName, mbps } = summarizedData[type][group];
                let mbpsValue = Math.abs(Math.round(mbps)); 

                typeText += `📌 *${groupName}:*  \`\`\`${mbpsValue} Mbps\`\`\`\n`;
                totalType += mbpsValue; 
            }
        }

        if (type === "Proveedores"){
            typeText += `📌 *Total ${type}:*  \`\`\`${Math.round(totalType)} Mbps\`\`\`\n`;
        }

        resultText += typeText;
    }

    return `${resultText}${footer}`;
}

export function detailed_report(detailedData: any, trafficReportTypes: any, startTime: any) {

    let resultText = `------ _Reporte Detallado_ -------\n`;
    let footer = `\n-------- _Estadísticas a la hora ${startTime}_ ---------\n`;

    for (const type of trafficReportTypes) {
        let typeText = `\n*${type}:*\n\n`;
        let totalType = 0;

        if (detailedData[type]) {
            for (const name in detailedData[type]) {
                const { name: deviceName, mbps } = detailedData[type][name];
                let mbpsValue = Math.abs(Math.round(mbps)); 

                typeText += `📌 *${deviceName}:*  \`\`\`${mbpsValue} Mbps\`\`\`\n`;
                totalType += mbpsValue; 
            }
        }

        if (type === "Proveedores" || type === "FTTH"){
            typeText += `📌 *Total ${type}:*  \`\`\`${Math.round(totalType)} Mbps\`\`\`\n`;
        }

        resultText += typeText;
    }

    return `${resultText}${footer}`;
}
export function getCurrentTimeInUTCMinus4() {
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