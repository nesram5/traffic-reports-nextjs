import { IYearGroup, IMonthGroup, IDayGroup } from '@/lib/types';
import { CompTrafficData } from '@/server-modules/handlerDB/schema';
import fs from 'fs';
import path from 'path';

export async function fetchTrafficDataFromDB() {
    try {
        const trafficData = await CompTrafficData.find().sort({ 'data.deviceId': 1 });

        // Structure to hold transformed data
        const yearData: IYearGroup[] = [];

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
                const year = timestamp.getFullYear().toString();

                // Convert numeric month, day, and hour to string formats
                const monthStr = monthNames[month]; // Convert month number to string
                const dayStr = day.toString().padStart(2, '0'); // Ensure day has two digits

                // Convert hour to 12-hour format with a.m./p.m.
                const period = hour >= 12 ? 'p.m.' : 'a.m.';
                const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
                const hourStr = `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;

                let yearGroup = yearData.find(y => y.year === year);
                if (!yearGroup) {
                    yearGroup = { year: year, monthGroups: [] };
                    yearData.push(yearGroup);
                }

                // Check if the month group already exists
                let monthGroup = yearGroup.monthGroups.find(m => m.month === monthStr);
                if (!monthGroup) {
                    monthGroup = { month: monthStr, dayGroups: [] };
                    yearGroup.monthGroups.push(monthGroup);
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
        const cacheFile = path.join(process.cwd(), 'cache/trafficDataCache.json');
        fs.writeFileSync(cacheFile, JSON.stringify(yearData, null, 2));
        //console.log('Traffic data cache file updated');

    } catch (err) {
        console.error('Error fetching traffic data:', err);
    }
}

export function getTrafficData() {
    const data = fs.readFileSync(path.join(process.cwd(), 'cache/trafficDataCache.json'), 'utf-8');
    return JSON.parse(data);
}