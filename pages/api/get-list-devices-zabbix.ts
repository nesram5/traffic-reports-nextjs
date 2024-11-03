import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises'; 
const zabbixFile = path.join(process.cwd(), 'data/zabbix_list_devices.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data: string = await fs.readFile(zabbixFile, 'utf8');
      const deviceList = JSON.parse(data);
      return res.status(200).json(deviceList);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        return res.status(500).json({ message: 'Error parsing cache file', error: error.message });
      }
      return res.status(500).json({ message: 'Error reading cache file', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}