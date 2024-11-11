import { NextApiRequest, NextApiResponse } from 'next';
import { getReportSnmp } from '@/modules/snmp-report/main';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const resultMessage = await getReportSnmp();
      res.status(200).json({ message: resultMessage });
    } catch (error) {
      console.error('Error during SNMP scan:', error);
      res.status(500).json({ error: 'Error during SNMP scan.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
