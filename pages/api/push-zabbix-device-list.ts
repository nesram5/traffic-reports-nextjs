import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Define the old and new file names
  const date = new Date().toISOString().replace(/[:.]/g, '');
  const newFileName = path.join(process.cwd(), `data/zabbix_list_devices(${date}).json`);
  const oldFileName = path.join(process.cwd(), 'data/zabbix_list_devices.json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!req.body) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const jsonData: string = JSON.stringify(req.body, null, 2);

  try {
    // Rename the old file with the current date
    await fs.promises.rename(oldFileName, newFileName);
  } catch (err) {
    console.error('Error renaming file:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  try {
    // Write the JSON string to a new file
    await fs.promises.writeFile(oldFileName, jsonData);
  } catch (err) {
    console.error('Error writing file:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.status(200).json({ message: 'File updated successfully' });
}

