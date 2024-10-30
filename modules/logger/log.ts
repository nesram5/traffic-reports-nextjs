import fs from 'fs';
import path from 'path';

export function saveToLog(line: string) {
    let filePath = path.join(process.cwd(), 'data/traffic-reports.log');
    fs.appendFile(filePath, `${line}\n`, (err) => {
        if (err) {
            console.error(`Error appending to file: ${err}`);
        } else {
            console.log('Line added successfully.');
        }
    });
}