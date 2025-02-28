import fs from 'fs';

// Avoid disabling TLS certificate validation in production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function fetchAndSaveTrafficData() {
    try {
        const response = await fetch('https://10.3.0.194/api/traffic');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
        console.log('Traffic data saved to data.json');
    } catch (error) {
        console.error('Error fetching traffic data:', error);
    }
}

// Define the original and new interfaces
interface OriginalJsonData {
    year: string;
    monthGroups: {
        month: string;
        dayGroups: {
            day: string;
            groupItems: {
                hour: string;
                items: {
                    first: string;
                    second: string;
                }[];
            }[];
        }[];
    }[];
}

type ReportData = {
    name: string;
    mbps: string;
};

interface NewJsonData {
    date: string;
    values: ReportData[];
}

// Function to convert Spanish month names to numbers
const monthToNum = (month: string): number => {
    const months: { [key: string]: number } = {
        enero: 1,
        febrero: 2,
        marzo: 3,
        abril: 4,
        mayo: 5,
        junio: 6,
        julio: 7,
        agosto: 8,
        septiembre: 9,
        octubre: 10,
        noviembre: 11,
        diciembre: 12,
    };
    return months[month.toLowerCase()] || 0;
};

// Function to convert time from "hh:mm a.m./p.m." to 24-hour format
const convertTimeTo24Hour = (time: string): string => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    if (modifier === "p.m." && hours !== "12") {
        hours = String(Number(hours) + 12);
    }
    if (modifier === "a.m." && hours === "12") {
        hours = "00";
    }
    return `${hours}:${minutes}:00`;
};

// Read the JSON file
const readJsonFile = (filePath: string): OriginalJsonData[] => {
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
};

function extractData(trafficData: string): ReportData[] {
  const result: ReportData[] = [];
  const lines = trafficData.split('\n');

  for (const line of lines) {
      if (line.startsWith('📌 *')) {
          const parts = line.split('```');
          if (parts.length === 3) {
              const namePart = parts[0];
              const valuePart = parts[1];

              const nameStart = namePart.indexOf('*') + 1;
              const nameEnd = namePart.lastIndexOf('*');
              const name = namePart.substring(nameStart, nameEnd).trim();

              const value = valuePart.trim().replace(' Mbps', '');

              result.push({ name: name, mbps: value });
          }
      }
      if (line.startsWith('▪️ *')) { // Adapted to '▪️ *'
        const parts = line.split('```');
        if (parts.length === 3) {
            const namePart = parts[0];
            const valuePart = parts[1];

            const nameStart = namePart.indexOf('*') + 1;
            const nameEnd = namePart.lastIndexOf('*');
            const name = namePart.substring(nameStart, nameEnd).trim();

            const value = valuePart.trim().replace(' Mbps', '');

            result.push({ name: name, mbps: value });
        }
    }
  }

  return result;
}

function replaceString(inputString: string): string {
    // Define the replacement mappings
    const replacements: { [key: string]: string } = {
        'Torre Ejecutiva (OLT-1-2-3-4)': 'Torre Ejecutiva (OLT-1-2-3-4-5)',
        'Cagua(OLT-1-2-3-4-5-6-7-8)': 'Cagua (OLT-1-2-3-4-5-6-7-8)',
        'Los Parques - NETCOM (OLT-6-7-8-13 + OLT ZTE CARD 1-2-3-4)': 'Los Parques - NETCOM (OLT-6-7-8 + OLT ZTE CARD 1-2-3-4)',
        'Los Parques - INYC  (OLT 4-9-10-11-12 + OLT ZTE CARD 12-13)': 'Los Parques - INYC  (OLT 10-11-12 + OLT ZTE CARD 12-13)',
        'BNG 2': 'DCO BNG',
        'Shangri LA (OLT ZTE CARD 1-2-3)': 'Shangri-LA (OLT ZTE CARD 1-2-3)',
        'Mirador(OLT-1-2)': 'Mirador (OLT-1-2)',
        'Mango Shopping(OLT-1-2)': 'Mango Shopping (OLT-1-2)',
        'Dayco - NetUno (23 Gbps)': 'Dayco - NetUno (30 Gbps)',
        'Caribe - NetUno (8 Gbps)': 'Caribe - NetUno (11 Gbps)',
        'Caribe - NetUno (10 Gbps)': 'Caribe - NetUno (11 Gbps)',
        'San Joaquín(OLT-1-2-3)': 'San Joaquín (OLT-1-2-3)',
        'La Sorpresa(OLT-1-2-3)': 'La Sorpresa (OLT-1-2-3)',
        'La Morita(OLT-5)': 'La Morita (OLT-5)',
    };

    // Check if the input string exists in the replacements object
    if (inputString in replacements) {
        return replacements[inputString]; // Return the replacement
    }

    // If no replacement is found, return the original string
    return inputString;
}

function removeColons(inputString: string): string {
    // Use the `replace` method with a global regex to remove all colons
    return inputString.replace(/:/g, '');
}


function removeDots(inputString: string): string {
    // Use the `replace` method with a global regex to remove all dots
    return inputString.replace(/\./g, '');
}


// Transform the data to the new structure
const transformData = (data: OriginalJsonData[]): NewJsonData[] => {
    const report: NewJsonData[] = [];
    data.forEach((entry) => {
        const year = entry.year;
        entry.monthGroups.forEach((monthGroup) => {
            const month = monthToNum(monthGroup.month);
            monthGroup.dayGroups.forEach((dayGroup) => {
                const day = dayGroup.day.padStart(2, '0'); // Ensure day is two digits
                dayGroup.groupItems.forEach((groupItem) => {
                    const time24Hour = convertTimeTo24Hour(groupItem.hour);
                    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${day} ${time24Hour}`;
                    for (const item of groupItem.items){

                        const values = extractData(item.first);

                        for (let value of values) {
                            value.mbps = removeDots(value.mbps);
                            value.name = removeColons(value.name);
                            value.name = replaceString(value.name);
                        }
                        report.push({
                            date: formattedDate,
                            values: values,
                        });
                    };
                  
                });
            });
        });
    });
    return report;
};

// Main function
export const migration = async () => {
    await fetchAndSaveTrafficData();
    const filePath = 'data.json'; // Path to your JSON file
    const originalData = readJsonFile(filePath);
    const transformedData: NewJsonData[] = transformData(originalData);
    return transformedData;
};
