import { IMonthGroup } from './date-group';
import { CompTrafficData } from './schema';
import fs from 'fs';
import path from 'path';
const cacheFile = path.join(process.cwd(), 'cache/trafficDataCache.json');

export async function fetchTrafficDataFromDB() {
    try {
        const trafficData = await CompTrafficData.find().sort({ 'data.deviceId': 1 });

        // Structure to hold transformed data
        const monthData: IMonthGroup[] = [];

        // Array for month names
        const monthNames = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        // Process each traffic data entry
        for (const entry of trafficData) {
            for (const record of entry.data) {
                const timestamp = new Date(record.timestamp);
                const month = timestamp.getMonth(); // getMonth() is zero-based
                const day = timestamp.getDate();
                const hour = timestamp.getHours();
                const minute = timestamp.getMinutes();

                // Convert numeric month, day, and hour to string formats
                const monthStr = monthNames[month]; // Convert month number to string
                const dayStr = day.toString().padStart(2, '0'); // Ensure day has two digits
                const hourStr = hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0'); // Format hour as "HH:mm"

                // Check if the month group already exists
                let monthGroup = monthData.find(m => m.month === monthStr);
                if (!monthGroup) {
                    monthGroup = { month: monthStr, dayGroups: [] };
                    monthData.push(monthGroup);
                }

                // Check if the day group already exists
                let dayGroup = monthGroup.dayGroups.find(d => d.day === dayStr);
                if (!dayGroup) {
                    dayGroup = { day: dayStr, groupItems: [] };
                    monthGroup.dayGroups.push(dayGroup);
                }

                // Check if the hour group already exists
                let hourGroup = dayGroup.groupItems.find(h => h.hour === hourStr);
                if (!hourGroup) {
                    hourGroup = { hour: hourStr, items: [] };
                    dayGroup.groupItems.push(hourGroup);
                }

                // Push the item to the hour group
                hourGroup.items.push({
                    first: record.simpleReport,
                    second: record.detaildReport,
                });
            }
        }

        // Write to cache file
        fs.writeFileSync(cacheFile, JSON.stringify(monthData, null, 2));
        //console.log('Traffic data cache file updated');

    } catch (err) {
        console.error('Error fetching traffic data:', err);
    }
}