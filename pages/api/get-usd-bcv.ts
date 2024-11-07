import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises'; 
const usdFile = path.join(process.cwd(), 'data/usd_bcv.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data: string = await fs.readFile(usdFile, 'utf8');
      const usdValue = JSON.parse(data);
      return res.status(200).json(usdValue);
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