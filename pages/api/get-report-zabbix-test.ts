import { NextApiRequest, NextApiResponse } from 'next';
import { getReportZabbix } from '@/modules/zabbix-report/main';
import { restoreToinit } from '@/modules/zabbix-report/get';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const resultMessage = await getReportZabbix(0,true);
      restoreToinit();
      res.status(200).json({ message: resultMessage });
    } catch (error) {
      console.error('Error during Zabbix scan:', error);
      res.status(500).json({ error: 'Error during Zabbix scan.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}