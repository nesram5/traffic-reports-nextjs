import path from 'path';
import fs from 'fs/promises'; 


export function extractUsdValue() {
    (async () => {
        const usdFile = path.join(process.cwd(), 'data/usd_bcv.json');
        const apiUrl = 'https://pydolarve.org/api/v1/dollar?page=bcv';
        const data = await fs.readFile(usdFile, 'utf8');
        const passedData: { usdValue: string, date: string } = JSON.parse(data);
    
        const date = new Date().toLocaleDateString('es-VE', { year: 'numeric', month: '2-digit', day: '2-digit' });
        
        if (date === passedData.date) {
            return;
        }
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

            await fs.writeFile(usdFile, JSON.stringify({ usdValue, date }));
            
        } catch (error) {
            console.error('Error fetching usdValue or saving data:', error);
        }
    })();
    
}