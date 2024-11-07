import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
const zabbixFile = path.join(process.cwd(), 'data/zabbix_list_devices.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Define the old and new file names
  const date = Date();
const newFileName = path.join(process.cwd(), `data/zabbix_list_devices${date}.json`);
const oldFileName = path.join(process.cwd(), 'data/zabbix_list_devices.json');

  if (req.method === 'POST') {
    const { zabbix_list_devices } = req.body;

    fs.rename(oldFileName, newFileName, (err) => {
      if (err) {
          console.error('Error renaming file:', err);
      } else {
          console.log('File renamed successfully');
      };

      const jsonData = JSON.stringify(zabbix_list_devices);

      // Write the JSON string to a file
      fs.writeFile(zabbixFile, jsonData, (err) => {
          if (err) {
              console.error('Error writing file', err);
          } else {
              console.log('File written successfully');
          };
        });
      });
  }
}
