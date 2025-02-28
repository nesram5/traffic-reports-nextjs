import { NextApiRequest, NextApiResponse } from 'next';
import ReportManager from '@/server-modules/report-manager/';
import { dbHost, dbName, dbPassword, dbUsername, token, apiUrl } from '@/config/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const reportManager = new ReportManager( 
        dbUsername, 
        dbPassword, 
        dbHost, 
        dbName, 
        token, 
        apiUrl
      );
      const resultMessage = await reportManager.getMessage();
      
      res.status(200).json(resultMessage);
    } catch (error) {
      console.error('Error during Zabbix scan:', error);
      res.status(500).json({ error: 'Error during Zabbix scan.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
