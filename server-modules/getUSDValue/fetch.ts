import path from 'path';
import fs from 'fs';


export async function extractUsdValue() {
    const usdFile = path.join(process.cwd(), 'data/usd_bcv.json');
    const apiUrl = 'https://pydolarve.org/api/v1/dollar?page=bcv';

    try {
        // Fetch the data from the API
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        // Extract the price value from the usd object
        if (!data.monitors.usd || !data.monitors.usd.price) {
            throw new Error('USD price not found in the response');
        }

        const usdValue = data.monitors.usd.price;

        fs.writeFile(usdFile, JSON.stringify({ usdValue }), (err) => {
            if (err) {
                console.error('Error writing file', err);
            } else {
                console.log('usdValue File written successfully');
            }
        });
    } catch (error) {
        console.error('Error fetching usdValue or saving data:', error);
    }
}