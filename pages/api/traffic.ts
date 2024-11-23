import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const cacheFile = path.join(process.cwd(), 'cache/trafficDataCache.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(cacheFile, 'utf8');
      const trafficData = JSON.parse(data);
      return res.status(200).json(trafficData);
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

export const config = {
  api: {
    responseLimit: false,
  },
}