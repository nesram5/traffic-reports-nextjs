import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Define the old and new file names
  const testFile = path.join(process.cwd(), `data/test-zabbix_list_devices.json`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!req.body) {
    return res.status(400).json({ error: 'Bad Request' });
  }

  const jsonData: string = JSON.stringify(req.body, null, 2);


  try {
    // Write the JSON string to a new file
    await fs.promises.writeFile(testFile, jsonData);
  } catch (err) {
    console.error('Error writing file:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.status(200).json({ message: 'File updated successfully' });
}

